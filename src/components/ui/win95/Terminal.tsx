import { TerminalCommand } from '@/types';
import { APP_CONFIG } from '@/constants';

interface TerminalProps {
  commands: TerminalCommand[];
}

export const Terminal: React.FC<TerminalProps> = ({ commands }) => {
  return (
    <div className="win95-terminal p-4">
      <div className="font-mono text-green-400 text-sm space-y-1">
        {commands.map((cmd, index) => (
          <div key={index}>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">{APP_CONFIG.terminalPrompt}</span>
              <span className="text-white">{cmd.command}</span>
            </div>
            <div className="text-green-400 ml-4">{cmd.output}</div>
          </div>
        ))}
        <div className="flex items-center space-x-2">
          <span className="text-green-400">{APP_CONFIG.terminalPrompt}</span>
        </div>
      </div>
    </div>
  );
}; 