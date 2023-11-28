   // src/i18n/i18n.js
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';

   i18n
     .use(initReactI18next) // Passes i18n down to react-i18next
     .init({
       resources: {}, // Resources will be added here
       lng: 'en', // Default language
       fallbackLng: 'en', // Use 'en' if the current language translations are not available
       interpolation: {
         escapeValue: false, // React already safes from XSS
       },
     });

   export default i18n;