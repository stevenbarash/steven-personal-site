// pages/_app.js or src/pages/_app.js
import '../app/globals.css'; // Adjust the path to your globals.css file

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;