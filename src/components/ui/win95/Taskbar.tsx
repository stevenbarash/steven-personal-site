import { APP_CONFIG, WINDOWS_95_STYLES } from '@/constants';

interface TaskbarProps {
  activeProgram?: string;
  status?: string;
}

export const Taskbar: React.FC<TaskbarProps> = ({ 
  activeProgram = APP_CONFIG.activeProgram,
  status = APP_CONFIG.status
}) => {
  return (
    <div className="win95-taskbar fixed bottom-0 left-0 w-full">
      <div className="flex items-center justify-between px-2 py-1">
        <button className="win95-button px-3 py-1 flex items-center space-x-2">
          <img src="/images/win95.png" alt="Windows 95" className="w-4 h-4" />
          <span className="font-mono font-bold text-black text-sm">Start</span>
        </button>
        <div className="flex items-center space-x-2">
          <div 
            className="bg-white border-2 border-black px-2 py-1 font-mono text-xs text-black" 
            style={{
              boxShadow: WINDOWS_95_STYLES.contentShadow
            }}
          >
            {activeProgram}
          </div>
          <div 
            className="bg-green-400 border-2 border-black px-2 py-1 font-mono text-xs text-black font-bold" 
            style={{
              boxShadow: WINDOWS_95_STYLES.contentShadow
            }}
          >
            {status}
          </div>
        </div>
      </div>
    </div>
  );
}; 