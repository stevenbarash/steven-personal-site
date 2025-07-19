import { Dash, Square, X } from 'react-bootstrap-icons';
import { WINDOWS_95_STYLES } from '@/constants';

interface WindowTitleBarProps {
  title: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export const WindowTitleBar: React.FC<WindowTitleBarProps> = ({
  title,
  onMinimize,
  onMaximize,
  onClose
}) => {
  return (
    <div className="win95-title-bar text-white px-2 py-1 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div 
          className="w-4 h-4 bg-white border border-black flex items-center justify-center" 
          style={{
            boxShadow: WINDOWS_95_STYLES.titleBarShadow
          }}
        >
          <div className="w-2 h-2 bg-[#000080]"></div>
        </div>
        <span className="font-mono font-bold text-sm">{title}</span>
      </div>
      <div className="flex space-x-1">
        <button 
          className="win95-button w-6 h-6 flex items-center justify-center"
          onClick={onMinimize}
          aria-label="Minimize window"
        >
          <Dash size={12} className="text-black" />
        </button>
        <button 
          className="win95-button w-6 h-6 flex items-center justify-center"
          onClick={onMaximize}
          aria-label="Maximize window"
        >
          <Square size={12} className="text-black" />
        </button>
        <button 
          className="win95-button w-6 h-6 flex items-center justify-center"
          onClick={onClose}
          aria-label="Close window"
        >
          <X size={12} className="text-black" />
        </button>
      </div>
    </div>
  );
}; 