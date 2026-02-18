import { SocialLink } from '@/types';
import { APP_CONFIG } from '@/constants';

interface FileSystemExplorerProps {
  socialLinks: SocialLink[];
}

export const FileSystemExplorer: React.FC<FileSystemExplorerProps> = ({ 
  socialLinks 
}) => {
  return (
    <div>
      <div className="win95-group-box">
        <span className="win95-group-box-label">Explorer - {APP_CONFIG.explorerPath}</span>
        <div className="win95-well p-[8px]">
          <div className="flex flex-wrap gap-[16px] justify-start">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="win95-desktop-icon"
                  aria-label={`Open ${social.name}`}
                >
                  <IconComponent size={32} className="text-black" />
                  <span className="win95-icon-label text-black">{social.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
