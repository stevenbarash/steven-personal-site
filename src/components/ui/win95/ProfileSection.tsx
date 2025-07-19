import { ProfileData } from '@/types';
import { WINDOWS_95_STYLES } from '@/constants';

interface ProfileSectionProps {
  profile: ProfileData;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ profile }) => {
  return (
    <div className="win95-content p-4">
      <div className="flex items-center space-x-4">
        <div 
          className="w-24 h-24 border-2 border-black bg-white p-1" 
          style={{
            boxShadow: WINDOWS_95_STYLES.contentShadow
          }}
        >
          <img 
            src={profile.imageUrl} 
            alt={profile.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-mono font-bold text-black mb-2">
            {profile.name}
          </h1>
          <p className="font-mono text-sm text-black mb-1">
            {profile.title} at{' '}
            <a 
              href={profile.companyUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold underline hover:text-blue-600 transition-colors"
            >
              {profile.company}
            </a>
          </p>
          <p className="font-mono text-sm text-black">
            {profile.location}
          </p>
        </div>
      </div>
    </div>
  );
}; 