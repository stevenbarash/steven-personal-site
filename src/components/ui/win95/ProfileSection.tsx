import { ProfileData } from '@/types';
import Image from 'next/image';
import { profileContent } from '@/content/profile';

interface ProfileSectionProps {
  profile: ProfileData;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ profile }) => {
  return (
    <div className="win95-well p-[8px]">
      <div className="flex items-start gap-[12px]">
        <div className="w-[80px] h-[80px] shrink-0 relative win95-sunken p-[2px]">
          <Image 
            src={profile.imageUrl} 
            alt={profile.name} 
            fill
            sizes="80px"
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-[16px] font-bold text-black leading-tight">
            {profile.name}
          </h1>
          <p className="win95-metadata text-black mt-[2px]">
            {profile.title} at{' '}
            <a 
              href={profile.companyUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="win95-link font-bold"
            >
              {profile.company}
            </a>
          </p>
          <p className="win95-metadata text-black mt-[2px]">
            {profile.location}
          </p>
        </div>
      </div>
      <section className="win95-group-box" aria-labelledby="profile-background-heading">
        <h2 id="profile-background-heading" className="win95-group-box-label">Identity &amp; developer platforms</h2>
        <div className="win95-well p-[8px]">
          <p className="win95-reading-copy">{profile.description}</p>
          <p className="win95-reading-copy mt-[8px]">{profileContent.protocols}</p>
        </div>
      </section>
      <section className="win95-group-box" aria-labelledby="profile-interests-heading">
        <h2 id="profile-interests-heading" className="win95-group-box-label">What I’m interested in</h2>
        <div className="win95-well p-[8px]">
          <p className="win95-reading-copy">{profileContent.interests}</p>
          <p className="win95-reading-copy mt-[8px]">{profileContent.prototyping}</p>
        </div>
      </section>
      <section className="win95-group-box" aria-labelledby="profile-personal-heading">
        <h2 id="profile-personal-heading" className="win95-group-box-label">Outside of work</h2>
        <div className="win95-well p-[8px]">
          <p className="win95-reading-copy">{profileContent.personal}</p>
          <p className="win95-reading-copy mt-[8px]">{profileContent.languages}</p>
        </div>
      </section>
    </div>
  );
};
