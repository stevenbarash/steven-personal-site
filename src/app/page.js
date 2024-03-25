// pages/index.js
import Head from "next/head";
import Image from "next/image";
import MenuBar from "../components/menubar";
import { Linkedin, Github, Instagram, Threads } from 'react-bootstrap-icons';
const socialMediaButtons = [
  {
    Icon: Linkedin,
    linkUrl: "https://www.linkedin.com/in/stevenbarash",
  },
  
  {
    Icon: Github,
    linkUrl: "https://github.com/stevenbarash",
  },
  {
    Icon: Instagram,
    linkUrl: "https://www.instagram.com/steven.photography",
  },
  {
    Icon: Threads,
    linkUrl: "https://www.threads.net/stevenbarash",
  },
];
// LandingPage component using Tailwind CSS
export default function Home() {
  return (
    <>
    <MenuBar/>
      <Head>
        <title>Steven&apos;s Homepage</title>
      </Head>
      <section className="bg-white h-screen flex items-center justify-center">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="text-center">
              <figure className="inline-block">
                <Image
                  className="rounded-full w-32 h-32"
                  src="/images/me.jpg"
                  alt="me"
                  width="150"
                  height="150"
                />
              </figure>
              <h1 className="text-black text-4xl font-bold">
                Hey! I&apos;m Steven
              </h1>
              <h2 className="text-black text-2xl">
                I&apos;m a Sr. Solutions Engineer at{" "}
                <a href="https://www.id.me" className="text-blue-500">
                  ID.me
                </a>{" "}
                and photographer based in Brooklyn, NYC 🗽
              </h2>
              <p className="text-white">Follow me here:</p>
              <div className="flex justify-center space-x-4">
                {socialMediaButtons.map((button, index) => (
                  <a
                    key={index}
                    className="bg-black-800 text-black rounded p-2"
                    href={button.linkUrl}
                  >
                    <button.Icon size={28} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
