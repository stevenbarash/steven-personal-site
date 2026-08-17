import type { ImgHTMLAttributes } from 'react';
import type { Win95IconName } from '@/types';

const ICON_SOURCES: Record<Win95IconName, { 16: string; 32: string }> = {
  computer: {
    16: '/images/win95-icons/Computer_16x16_4.png',
    32: '/images/win95-icons/Computer_32x32_4.png',
  },
  user: {
    16: '/images/win95-icons/User_16x16_4.png',
    32: '/images/win95-icons/User_32x32_4.png',
  },
  folder: {
    16: '/images/win95-icons/Folder_16x16_4.png',
    32: '/images/win95-icons/Folder_32x32_4.png',
  },
  folderOpen: {
    16: '/images/win95-icons/FolderOpen_16x16_4.png',
    32: '/images/win95-icons/FolderOpen_32x32_4.png',
  },
  explorer: {
    16: '/images/win95-icons/WindowsExplorer_16x16_4.png',
    32: '/images/win95-icons/WindowsExplorer_32x32_4.png',
  },
  camera: {
    16: '/images/win95-icons/Camera_16x16_4.png',
    32: '/images/win95-icons/Camera_32x32_4.png',
  },
  msDos: {
    16: '/images/win95-icons/MsDos_16x16_32.png',
    32: '/images/win95-icons/MsDos_32x32_32.png',
  },
  notepad: {
    16: '/images/win95-icons/Notepad_16x16_4.png',
    32: '/images/win95-icons/Notepad_32x32_4.png',
  },
  help: {
    16: '/images/win95-icons/HelpBook_16x16_4.png',
    32: '/images/win95-icons/HelpBook_32x32_4.png',
  },
  powerOff: {
    16: '/images/win95-icons/PowerOff_16x16_4.png',
    32: '/images/win95-icons/PowerOff_32x32_4.png',
  },
  globe: {
    16: '/images/win95-icons/Globe_16x16_4.png',
    32: '/images/win95-icons/Globe_32x32_4.png',
  },
  network: {
    16: '/images/win95-icons/Network_16x16_4.png',
    32: '/images/win95-icons/Network_32x32_4.png',
  },
  mail: {
    16: '/images/win95-icons/Mail_16x16_4.png',
    32: '/images/win95-icons/Mail_32x32_4.png',
  },
  url: {
    16: '/images/win95-icons/Url102_16x16_4.png',
    32: '/images/win95-icons/Url102_32x32_4.png',
  },
  mediaPlayer: {
    16: '/images/win95-icons/Mplayer10_16x16_4.png',
    32: '/images/win95-icons/Mplayer10_32x32_4.png',
  },
};

interface Win95IconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> {
  name: Win95IconName;
  size?: 16 | 32;
}

export const Win95Icon: React.FC<Win95IconProps> = ({
  name,
  size = 32,
  className = '',
  alt = '',
  ...props
}) => (
  <img
    {...props}
    src={ICON_SOURCES[name][size]}
    alt={alt}
    width={size}
    height={size}
    draggable={false}
    className={`win95-raster-icon ${className}`.trim()}
  />
);
