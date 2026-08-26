import { pinnedHttpsTransport, validatePublicHttpsUrl, withDeadline } from './public-host-verifier.js';

const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_MAX_HOPS = 5;

const cancelBodyWithoutWaiting = (body, reason) => {
  if (!body) return;
  try {
    void body.cancel(reason).catch(() => {});
  } catch {
    // Cancellation is best-effort and must never delay reachability results.
  }
};

export async function probeEvidenceUrl(initialUrl, options = {}) {
  const {
    lookupImpl,
    allowedHosts = new Set([new URL(initialUrl).hostname.toLowerCase()]),
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxHops = DEFAULT_MAX_HOPS,
  } = options;
  const transportImpl = options.transportImpl ?? options.fetchImpl ?? pinnedHttpsTransport;

  const probeMethod = async (method) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(new Error(`timeout after ${timeoutMs}ms`)), timeoutMs);
    let currentUrl = initialUrl;
    let validatedDestination;
    try {
      for (let hop = 0; ; hop += 1) {
        validatedDestination ??= await withDeadline(
          validatePublicHttpsUrl(currentUrl, 'evidence destination', { lookupImpl, allowedHosts }),
          timeoutMs,
          'resolving DNS',
          controller.signal,
        );
        const response = await transportImpl(currentUrl, {
          method,
          redirect: 'manual',
          signal: controller.signal,
        }, validatedDestination);
        const isRedirect = response.status >= 300 && response.status < 400;
        if (!isRedirect) {
          cancelBodyWithoutWaiting(response.body, 'evidence probe complete');
          return { initialUrl, finalUrl: currentUrl, status: response.status, method, hops: hop };
        }
        cancelBodyWithoutWaiting(response.body, 'evidence redirect body not needed');
        const location = response.headers.get('location');
        if (!location) throw new Error(`redirect from ${currentUrl} is missing Location`);
        if (hop >= maxHops) throw new Error(`redirect chain exceeds ${maxHops} hop(s)`);
        const redirectUrl = new URL(location, currentUrl).href;
        try {
          validatedDestination = await withDeadline(
            validatePublicHttpsUrl(redirectUrl, 'evidence redirect destination', { lookupImpl, allowedHosts }),
            timeoutMs,
            'resolving DNS',
            controller.signal,
          );
        } catch (error) {
          throw new Error(`unsafe redirect to ${redirectUrl}: ${error instanceof Error ? error.message : String(error)}`);
        }
        currentUrl = redirectUrl;
      }
    } catch (error) {
      if (controller.signal.aborted) {
        if (error instanceof Error && /timed out after .* while /i.test(error.message)) throw error;
        throw new Error(`timed out after ${timeoutMs}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  };

  const head = await probeMethod('HEAD');
  return head.status === 405 ? probeMethod('GET') : head;
}
