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
        purpose: 'maskable',
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
    shortcuts: [],
    related_applications: [
      {
        platform: 'webapp',
        url: 'https://stevenbarash.com',
      },
    ],
    prefer_related_applications: false,
  }
} 