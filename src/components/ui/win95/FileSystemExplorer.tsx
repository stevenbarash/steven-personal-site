import { SocialLink } from '@/types';
import { APP_CONFIG, WINDOWS_95_STYLES } from '@/constants';

interface FileSystemExplorerProps {
  socialLinks: SocialLink[];
}

export const FileSystemExplorer: React.FC<FileSystemExplorerProps> = ({ 
  socialLinks 
}) => {
  return (
    <div className="win95-content">
      {/* Tab Headers */}
      <div 
        className="bg-[#c0c0c0] border-b-2 border-black flex" 
        style={{
          boxShadow: WINDOWS_95_STYLES.tabShadow
        }}
      >
        <div className="win95-tab-active px-4 py-2 font-mono font-bold text-sm text-black">
          FILE SYSTEM
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="p-4">
        <div className="space-y-4">
          <div className="font-mono font-bold text-black border-b border-black pb-2">
            EXPLORER - {APP_CONFIG.explorerPath}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="win95-icon p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                  aria-label={`Open ${social.name}`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <IconComponent size={32} className="text-black" />
                    <span className="text-xs font-mono font-bold text-black text-center">
                      {social.name}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}; 