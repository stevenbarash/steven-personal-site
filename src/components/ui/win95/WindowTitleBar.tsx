interface WindowTitleBarProps {
  title: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  isMaximized?: boolean;
  onTitleBarDragStart?: (e: React.MouseEvent) => void;
}

export const WindowTitleBar: React.FC<WindowTitleBarProps> = ({
  title,
  onMinimize,
  onMaximize,
  onClose,
  isMaximized = false,
  onTitleBarDragStart,
}) => {
  return (
    <div className="win95-title-bar" onDoubleClick={onMaximize}>
      <div
        className={`flex items-center gap-[4px] flex-1 min-w-0 ${onTitleBarDragStart ? 'cursor-move' : 'cursor-default'}`}
        onMouseDown={onTitleBarDragStart}
      >
        <img
          src="/images/me.jpg"
          alt=""
          className="w-[16px] h-[16px] object-cover"
        />
        <span>{title}</span>
      </div>
      <div
        className="flex gap-[2px]"
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <button
          className="win95-title-btn"
          onClick={onMinimize}
          aria-label="Minimize window"
        >
          <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
            <rect x="0" y="5" width="6" height="2" fill="black" />
          </svg>
        </button>
        <button
          className="win95-title-btn"
          onClick={onMaximize}
          aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
        >
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
        </button>
        <button
          className="win95-title-btn"
          onClick={onClose}
          aria-label="Close window"
        >
          <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
            <line x1="0" y1="0" x2="8" y2="7" stroke="black" strokeWidth="1.5" />
            <line x1="8" y1="0" x2="0" y2="7" stroke="black" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};
