import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Steven Barash - Personal Site',
    short_name: 'Steven Barash',
    description: 'Personal website of Steven Barash, Sr. Solutions Engineer at ID.me and photographer',
    start_url: '/',
    display: 'standalone',
    background_color: '#008080',
    theme_color: '#008080',
    icons: [
      {
        src: '/images/sb-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/images/me.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/images/me.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  }
} 