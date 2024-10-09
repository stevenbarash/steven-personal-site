import Head from "next/head";
import Image from "next/image";
import MenuBar from "../components/menubar";
import { Linkedin, Github, Instagram, Threads } from 'react-bootstrap-icons';

const socialMediaButtons = [
  { Icon: Linkedin, linkUrl: "https://www.linkedin.com/in/stevenbarash" },
  { Icon: Github, linkUrl: "https://github.com/stevenbarash" },
  { Icon: Instagram, linkUrl: "https://www.instagram.com/steven.photography" },
  { Icon: Threads, linkUrl: "https://www.threads.net/stevenbarash" },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Steven Barash - Sr. Solutions Engineer & Photographer</title>
        <meta name="description" content="Steven Barash - Sr. Solutions Engineer at ID.me and photographer based in Brooklyn, NYC" />
      </Head>
      {/* <MenuBar /> */}
      <main className="bg-background min-h-screen flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Image
              className="rounded-full w-48 h-48 mx-auto mb-8 shadow-lg"
              src="/images/me.jpg"
              alt="Steven Barash"
              width={192}
              height={192}
            />
            <h1 className="text-primary text-4xl font-bold mb-4">
              Hey! I&apos;m Steven
            </h1>
            <h2 className="text-text text-xl mb-6">
              Sr. Solutions Engineer at{" "}
              <a href="https://www.id.me" className="text-primary hover:text-secondary underline transition-colors duration-300">
                ID.me
              </a>{" "}
              and photographer based in Brooklyn, NYC 🗽
            </h2>
            <p className="text-text mb-4">Follow me here:</p>
            <div className="flex justify-center space-x-4">
              {socialMediaButtons.map((button, index) => (
                <a
                  key={index}
                  className="bg-primary hover:bg-secondary rounded-full p-3 transition-colors duration-300"
                  href={button.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button.Icon size={24} style={{ color: '#F5F5F5' }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
