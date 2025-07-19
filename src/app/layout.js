import { Inter, Merriweather } from "next/font/google";
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const merriweather = Merriweather({ subsets: ["latin"], variable: '--font-merriweather', weight: ['300', '400', '700', '900'] });

export const metadata = {
  title: "Steven Barash - Sr. Solutions Engineer & Photographer",
  description: "Personal website of Steven Barash, Sr. Solutions Engineer at ID.me and photographer based in Brooklyn, NYC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <ThemeProvider attribute="class">
        <body className="font-sans dark:bg-background-dark dark:text-text-dark">
          {children}
          <Analytics />
        </body>
      </ThemeProvider>
    </html>
  );
}