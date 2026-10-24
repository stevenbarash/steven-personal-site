import { expect, test, type Locator, type Page } from '@playwright/test';

test.use({ viewport: { width: 1200, height: 900 }, hasTouch: true });

async function openWindow(page: Page) {
  await page.goto('/desktop?app=help');
  const frame = page.getByTestId('application-window');
  const handle = frame.locator('.win95-title-bar > div').first();
  await expect(frame).toHaveAttribute('aria-label', 'HELP - Using This Site application window');
  await expect(handle).toHaveCSS('touch-action', 'none');
  return { frame, handle };
}

async function handlePoint(handle: Locator) {
  const box = await handle.boundingBox();
  expect(box).not.toBeNull();
  const point = { x: box!.x + 60, y: box!.y + box!.height / 2 };
  await expect.poll(() => handle.evaluate((element, { x, y }) => {
    const target = document.elementFromPoint(x, y);
    return target === element || element.contains(target);
  }, point), { message: 'the visible title must own input above expanded coarse-pointer menu targets' }).toBe(true);
  return point;
}

async function expectPosition(frame: Locator, x: number, y: number) {
  await expect.poll(async () => {
    const box = await frame.boundingBox();
    return box && { x: Math.round(box.x), y: Math.round(box.y) };
  }).toEqual({ x: Math.round(x), y: Math.round(y) });
}

test('mouse and real touch drags move identically and clamp to desktop and taskbar bounds', async ({ page, context }) => {
  const session = await context.newCDPSession(page);
  const positions = [];
  for (const pointer of ['mouse', 'touch']) {
    const { frame, handle } = await openWindow(page);
    const initial = (await frame.boundingBox())!;
    const start = await handlePoint(handle);
    if (pointer === 'mouse') {
      await page.mouse.move(start.x, start.y);
      await page.mouse.down();
    } else {
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...start, id: 0 }] });
    }

    const maxX = 1200 - initial.width;
    const maxY = Math.max(0, 900 - 40 - initial.height);
    const destinations = [
      { point: { x: start.x + 80, y: start.y + 48 }, x: Math.min(maxX, initial.x + 80), y: Math.min(maxY, initial.y + 48) },
      { point: { x: 1198, y: 898 }, x: maxX, y: maxY },
      { point: { x: 1, y: 1 }, x: 0, y: 0 },
    ];
    for (const { point, x, y } of destinations) {
      if (pointer === 'mouse') {
        await page.mouse.move(point.x, point.y, { steps: 5 });
      } else {
        await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...point, id: 0 }] });
      }
      await expectPosition(frame, x, y);
      const box = (await frame.boundingBox())!;
      positions.push({ x: box.x, y: box.y });
    }
    if (pointer === 'mouse') {
      await page.mouse.up();
    } else {
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    }
    await page.mouse.move(600, 450);
    await expectPosition(frame, 0, 0);
  }
  expect(positions.slice(0, 3)).toEqual(positions.slice(3));
});

for (const interruption of ['cancel', 'lost capture', 'blur', 'maximize', 'mobile viewport']) {
  test(`touch drag stops after ${interruption} and the next drag works`, async ({ page, context }) => {
    const { frame, handle } = await openWindow(page);
    const session = await context.newCDPSession(page);
    const initial = (await frame.boundingBox())!;
    const start = await handlePoint(handle);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...start, id: 0 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x + 40, y: start.y + 20, id: 0 }] });
    await expect.poll(async () => (await frame.boundingBox())!.x).toBe(initial.x + 40);

    if (interruption === 'cancel') {
      await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
      // A new contact outside the handle must not continue the cancelled drag.
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 1100, y: 700, id: 1 }] });
    } else if (interruption === 'lost capture') {
      await handle.evaluate((element) => {
        element.addEventListener('pointermove', (event) => {
          element.releasePointerCapture((event as PointerEvent).pointerId);
        }, { once: true });
      });
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x + 45, y: start.y + 20, id: 0 }] });
      await expect.poll(async () => (await frame.boundingBox())!.x).toBe(initial.x + 45);
    } else if (interruption === 'blur') {
      await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    } else if (interruption === 'maximize') {
      await page.getByRole('button', { name: 'Maximize window', exact: true }).click();
      await expect(frame).toHaveClass(/win95-window-frame--maximized/);
      await page.getByRole('button', { name: 'Restore window', exact: true }).click();
      await expect(frame).toHaveClass(/win95-window-frame--floating/);
    } else {
      await page.setViewportSize({ width: 390, height: 844 });
      await expect(handle).toHaveCSS('touch-action', 'auto');
      await page.setViewportSize({ width: 1200, height: 900 });
      await expect(handle).toHaveCSS('touch-action', 'none');
    }

    const stopped = (await frame.boundingBox())!;
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: start.x + 100, y: start.y + 60, id: interruption === 'cancel' ? 1 : 0 }],
    });
    await expectPosition(frame, stopped.x, stopped.y);
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });

    const next = await handlePoint(handle);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...next, id: 2 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: next.x + 30, y: next.y + 20, id: 2 }] });
    await expect.poll(async () => (await frame.boundingBox())!.x).toBe(stopped.x + 30);
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  });
}

test('additional touch contacts do not take over an active drag', async ({ page, context }) => {
  const { frame, handle } = await openWindow(page);
  const session = await context.newCDPSession(page);
  const initial = (await frame.boundingBox())!;
  const start = await handlePoint(handle);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...start, id: 0 }] });
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ ...start, id: 0 }, { x: start.x + 150, y: start.y, id: 1 }],
  });
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ ...start, id: 0 }, { x: start.x + 200, y: start.y + 30, id: 1 }],
  });
  await expectPosition(frame, initial.x, initial.y);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: start.x + 40, y: start.y, id: 0 }, { x: start.x + 200, y: start.y + 30, id: 1 }],
  });
  await expectPosition(frame, initial.x + 40, initial.y);
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
});

test('title controls remain clickable and double-click still maximizes and restores', async ({ page, context }) => {
  const { frame, handle } = await openWindow(page);
  const initial = (await frame.boundingBox())!;
  const maximize = page.getByRole('button', { name: 'Maximize window', exact: true });
  const button = (await maximize.boundingBox())!;
  const session = await context.newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart', touchPoints: [{ x: button.x + button.width / 2, y: button.y + button.height / 2, id: 0 }],
  });
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove', touchPoints: [{ x: button.x + button.width / 2 - 100, y: button.y + button.height / 2, id: 0 }],
  });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expectPosition(frame, initial.x, initial.y);
  await maximize.tap();
  await expect(frame).toHaveClass(/win95-window-frame--maximized/);
  await expect(handle).toHaveCSS('touch-action', 'auto');
  await page.getByRole('button', { name: 'Restore window', exact: true }).tap();
  await expectPosition(frame, initial.x, initial.y);
  await handle.dblclick();
  await expect(frame).toHaveClass(/win95-window-frame--maximized/);
  await handle.dblclick();
  await expect(frame).toHaveClass(/win95-window-frame--floating/);
  await page.getByRole('button', { name: 'Minimize window', exact: true }).tap();
  await expect(frame).not.toBeVisible();
  await page.locator('.win95-task-btn').tap();
  await expect(frame).toBeVisible();
  await page.getByRole('button', { name: 'Close window', exact: true }).tap();
  await expect(page.getByText('HELP - Using This Site', { exact: true })).not.toBeVisible();
  await expect(frame).toHaveAttribute('aria-label', 'STEVEN.EXE - Personal Site application window');
  await expect(page).toHaveURL('/desktop');
});

test('mobile windows remain pinned when the title is touched and moved', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/desktop?app=help');
  const frame = page.getByTestId('application-window');
  const handle = frame.locator('.win95-title-bar > div').first();
  await expect(handle).toHaveCSS('touch-action', 'auto');
  const initial = (await frame.boundingBox())!;
  const start = await handlePoint(handle);
  const session = await context.newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...start, id: 0 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x + 80, y: start.y + 100, id: 0 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expectPosition(frame, initial.x, initial.y);
  expect((await frame.boundingBox())!.width).toBe(initial.width);
});
