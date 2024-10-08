// // src/pages/photos.js
// import React, { useState } from "react";
// import MenuBar from "../components/menubar";
// import { motion, AnimatePresence } from 'framer-motion';
// import Image from 'next/image';
//   // Importing the filesystem module to read the photos directory
//   const fs = require('fs');
//   const path = require('path');

//   // Path to the photos directory
//   const photosDirectory = path.join(process.cwd(), "public", "images");
//   // Read all file names in the photos directory
//   const filenames = fs.readdirSync(photosDirectory);

//   // Filter out non-image files and get the paths for each photo
//   const photos = filenames.filter(filename => /\.(jpg|jpeg|png|gif)$/i.test(filename)).map((filename) => ({
//     src: `/images/${filename}`,
//     alt: filename,
//     width: '100%', // Width is now set to be 100% of the container
//     height: 'auto', // Height automatically adjusts to maintain the aspect ratio
//   }));

//   // Check if there are no images and retur empty array if true
//   if (!photos.length) {
//         photos: [],
//       },
//     };
//   }

//   return {
//     props: {
//       photos,
//     },
//   };
// };

// // PhotoGallery component to display the photos
// const PhotoGallery = ({ photos }) => {
//   // State to handle the visibility and the current photo for the preview
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [currentPhoto, setCurrentPhoto] = useState(null);

//   // Function to open the preview with the selected photo
//   const openPreview = (photo) => {
//     setCurrentPhoto(photo);
//     setPreviewVisible(true);
//   };

//   // Function to close the preview
//   const closePreview = () => {
//     setPreviewVisible(false);
//   };

//   // Variants for the animation of the preview modal
//   const backdropVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1 }
//   };

//   const imageVariants = {
//     hidden: { scale: 0 },
//     visible: { scale: 1 }
//   };

//   // Check if there are no images and render a message if true
//   // Check if there are no images and render a message if true
//       </>
//     );
//   }

//       </>
//     );
//   }
//       <div className="grid grid-cols-3 gap-4">
//         {photos.map((photo) => (
//           <div
//             key={photo.alt}
//             className="hover:shadow-lg transition-shadow duration-300"
//             onClick={() => openPreview(photo)}
//             style={{ cursor: 'pointer', position: 'relative' }}
//           >
//       <div className="grid grid-cols-3 gap-4">
//         {photos.map((photo) => (
//           <div
//             key={photo.alt}
//             className="hover:shadow-lg transition-shadow duration-300"
//             onClick={() => openPreview(photo)}
//             className="hover:shadow-lg transition-shadow duration-300"
//             onClick={() => openPreview(photo)}
//             style={{ cursor: 'pointer', position: 'relative' }}
//             onClick={() => openPreview(photo)}
//             {/* Using Next.js Image component for optimized images */}
//             <Image src={photo.src} alt={photo.alt} layout="fill" objectFit="cover" />