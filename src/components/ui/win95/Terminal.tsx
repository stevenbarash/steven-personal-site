import { TerminalCommand } from '@/types';
import { APP_CONFIG } from '@/constants';

interface TerminalProps {
  commands: TerminalCommand[];
}

export const Terminal: React.FC<TerminalProps> = ({ commands }) => {
  return (
    <div className="win95-group-box">
      <span className="win95-group-box-label">Command Prompt</span>
      <div className="win95-terminal">
        <div className="space-y-[2px]">
          <div className="h-[8px]" />
          {commands.map((cmd) => (
            <div key={cmd.command}>
              <div>
                <span className="text-[#c0c0c0]">{APP_CONFIG.terminalPrompt}</span>
                <span className="text-[#ffffff]">{cmd.command}</span>
              </div>
              <div className="text-[#c0c0c0] pl-0">{cmd.output}</div>
              <div className="h-[2px]" />
            </div>
          ))}
          <div>
            <span className="text-[#c0c0c0]">{APP_CONFIG.terminalPrompt}</span>
            <span className="inline-block w-[7px] h-[12px] bg-[#c0c0c0] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
