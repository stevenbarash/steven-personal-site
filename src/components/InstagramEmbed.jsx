   // src/components/InstagramEmbed.jsx
   import React, { useEffect } from 'react';

   const InstagramEmbed = ({ url, ...props }) => {
     useEffect(() => {
       // This function will load the Instagram embed script
       const loadInstagramScript = () => {
         if (!window.instgrm) {
           const script = document.createElement('script');
           script.src = '//www.instagram.com/embed.js';
           script.async = true;
           script.defer = true;
           document.body.appendChild(script);
           script.onload = () => {
             // This will process any embeds on the page
             window.instgrm.Embeds.process();
           };
         } else {
           // If the script is already loaded, process the embeds
           window.instgrm.Embeds.process();
         }
       };

       loadInstagramScript();
     }, [url]); // The effect should depend on the URL

     return (
       <blockquote
         className="instagram-media"
         data-instgrm-permalink={url}
         data-instgrm-version="14"
         {...props}
       >
         {/* The content inside here is for fallback and will be replaced by Instagram's script */}
       </blockquote>
     );
   };

   export default InstagramEmbed;