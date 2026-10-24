import { Win95Icon } from './Win95Icon';

interface WindowTitleBarProps {
  title: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  isMaximized?: boolean;
  showMaximize?: boolean;
  onTitleBarPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onTitleBarPointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onTitleBarPointerEnd?: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export const WindowTitleBar: React.FC<WindowTitleBarProps> = ({
  title,
  onMinimize,
  onMaximize,
  onClose,
  isMaximized = false,
  showMaximize = true,
  onTitleBarPointerDown,
  onTitleBarPointerMove,
  onTitleBarPointerEnd,
}) => {
  return (
    <div className="win95-title-bar" onDoubleClick={showMaximize ? onMaximize : undefined}>
      <div
        className={`relative flex items-center gap-[4px] flex-1 min-w-0 ${onTitleBarPointerDown ? 'cursor-move' : 'cursor-default'}`}
        style={{
          // Coarse-pointer menu hit areas extend upward into the visible title.
          zIndex: 'calc(var(--win95-layer-menu) + 1)',
          touchAction: onTitleBarPointerDown ? 'none' : undefined,
        }}
        onPointerDown={onTitleBarPointerDown}
        onPointerMove={onTitleBarPointerMove}
        onPointerUp={onTitleBarPointerEnd}
        onPointerCancel={onTitleBarPointerEnd}
        onLostPointerCapture={onTitleBarPointerEnd}
      >
        <Win95Icon name="computer" size={16} />
        <span>{title}</span>
      </div>
      <div
        className="win95-title-controls"
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <button
          className="win95-title-btn"
          onClick={onMinimize}
          aria-label="Minimize window"
        >
          <span className="win95-title-btn-face">
            <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
              <rect x="0" y="5" width="6" height="2" fill="black" />
            </svg>
          </span>
        </button>
        {showMaximize && (
          <button
            className="win95-title-btn"
            onClick={onMaximize}
            aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
          >
            <span className="win95-title-btn-face">
              {isMaximized ? (
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <rect x="2" y="0" width="7" height="7" fill="black" />
                  <rect x="3" y="2" width="5" height="4" fill="#c0c0c0" />
                  <rect x="0" y="2" width="7" height="7" fill="black" />
                  <rect x="1" y="4" width="5" height="4" fill="#c0c0c0" />
                </svg>
              ) : (
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <rect x="0" y="0" width="9" height="9" fill="black" />
                  <rect x="1" y="2" width="7" height="6" fill="#c0c0c0" />
                </svg>
              )}
            </span>
          </button>
        )}
        <button
          className="win95-title-btn"
          onClick={onClose}
          aria-label="Close window"
        >
          <span className="win95-title-btn-face">
            <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
              <line x1="0" y1="0" x2="8" y2="7" stroke="black" strokeWidth="1.5" />
              <line x1="8" y1="0" x2="0" y2="7" stroke="black" strokeWidth="1.5" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};
