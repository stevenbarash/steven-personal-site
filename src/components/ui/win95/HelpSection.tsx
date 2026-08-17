export const HelpSection: React.FC = () => (
  <div className="space-y-[8px]">
    <div className="win95-group-box">
      <span className="win95-group-box-label">Help Topics</span>
      <div className="win95-well p-[8px]">
        <h2 className="text-[16px] font-bold mb-[8px]">Using this desktop</h2>
        <dl className="space-y-[8px] text-[11px]">
          <div>
            <dt className="font-bold">Open an application</dt>
            <dd>Double-click a desktop icon, press Enter or Space while it is selected, or choose it from Start. On touch devices, one tap opens it.</dd>
          </div>
          <div>
            <dt className="font-bold">Move between applications</dt>
            <dd>Use the desktop icons, Start menu, View menu, browser Back and Forward buttons, or the active taskbar button.</dd>
          </div>
          <div>
            <dt className="font-bold">Use menus and tabs</dt>
            <dd>Arrow keys move through menus and tabs. Enter or Space activates the selected item. Escape closes an open menu.</dd>
          </div>
          <div>
            <dt className="font-bold">Manage a window</dt>
            <dd>The title-bar buttons minimize, maximize, or close the current window. Reopen a closed window from the desktop or Start.</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
);

export const AboutSiteSection: React.FC = () => (
  <div className="space-y-[8px]">
    <div className="win95-group-box">
      <span className="win95-group-box-label">About</span>
      <div className="win95-well p-[8px]">
        <h2 className="text-[16px] font-bold mb-[8px]">About this site</h2>
        <p className="text-[11px] mb-[8px]">
          Steven&apos;s portfolio is built as a functional Windows 95 desktop, with projects, professional experience, photography, and contact links treated as applications and files.
        </p>
        <dl className="grid grid-cols-[max-content_1fr] gap-x-[12px] gap-y-[4px] text-[11px]">
          <dt className="font-bold">Interface</dt>
          <dd>Windows 95 desktop</dd>
          <dt className="font-bold">Built with</dt>
          <dd>Next.js and TypeScript</dd>
          <dt className="font-bold">Navigation</dt>
          <dd>URL-addressable application windows</dd>
          <dt className="font-bold">Source</dt>
          <dd>
            <a
              href="https://github.com/stevenbarash/steven-personal-site"
              target="_blank"
              rel="noopener noreferrer"
              className="win95-link"
            >
              View on GitHub
            </a>
          </dd>
        </dl>
      </div>
    </div>
  </div>
);
