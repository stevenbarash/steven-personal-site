import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Steven Barash - Senior Solutions Engineer & Professional Photographer',
    short_name: 'Steven Barash',
    description: 'Senior Solutions Engineer at Descope specializing in identity authentication. Professional photographer in Brooklyn, NYC.',
    start_url: '/',
    display: 'standalone',
    background_color: '#008080',
    theme_color: '#008080',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en-US',
    categories: ['business', 'productivity', 'photography'],
    icons: [
      {
        src: '/images/sb-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
      {
        src: '/images/me.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'any',
      },
      {
        src: '/images/me.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/images/me.jpg',
        sizes: '1280x720',
        type: 'image/jpeg',
        form_factor: 'wide',
        label: 'Steven Barash Portfolio',
      },
    ],
    shortcuts: [
      {
        name: 'About',
        short_name: 'About',
        description: 'Learn more about Steven Barash',
        url: '/about',
        icons: [{ src: '/images/sb-logo.svg', sizes: '96x96' }],
      },
      {
        name: 'Portfolio',
        short_name: 'Portfolio',
        description: 'View photography portfolio',
        url: '/portfolio',
        icons: [{ src: '/images/sb-logo.svg', sizes: '96x96' }],
      },
      {
        name: 'Contact',
        short_name: 'Contact',
        description: 'Get in touch with Steven',
        url: '/contact',
        icons: [{ src: '/images/sb-logo.svg', sizes: '96x96' }],
      },
    ],
    related_applications: [
      {
        platform: 'webapp',
        url: 'https://stevenbarash.com',
      },
    ],
    prefer_related_applications: false,
  }
} 