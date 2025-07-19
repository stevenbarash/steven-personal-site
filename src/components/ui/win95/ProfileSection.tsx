import { ProfileData } from '@/types';
import { WINDOWS_95_STYLES } from '@/constants';
import Image from 'next/image';

interface ProfileSectionProps {
  profile: ProfileData;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ profile }) => {
  return (
    <div className="win95-content p-4">
      <div className="flex items-center space-x-4">
        <div 
          className="w-24 h-24 border-2 border-black bg-white p-1 relative" 
          style={{
            boxShadow: WINDOWS_95_STYLES.contentShadow
          }}
        >
          <Image 
            src={profile.imageUrl} 
            alt={profile.name} 
            fill
            sizes="96px"
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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