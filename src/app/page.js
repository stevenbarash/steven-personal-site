// pages/index.js
import Head from "next/head";
import Image from "next/image";
const socialMediaButtons = [
  {
    iconUrl:    
    "/images/linkedin.png",
    linkUrl: "https://www.linkedin.com/in/stevenbarash",
  },
  {
    iconUrl:
    "/images/x.png",
    linkUrl: "https://twitter.com/steven_barash",
  },
  {
    iconUrl:
      "/images/ig.png",
    linkUrl: "https://www.instagram.com/steven.photography",
  },
];

// LandingPage component using Tailwind CSS
export default function Home() {
  return (
    <>
      <Head>
        <title>Steven&apos;s Homepage</title>
      </Head>
      <section className="bg-gray-900 h-screen flex items-center justify-center">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="w-1/2 text-center">
              <figure className="inline-block">
                <Image
                  className="rounded-full w-32 h-32"
                  src="/images/me.png"
                  alt="me"
                  width="150"
                  height="150"
                />
              </figure>
              <h1 className="text-white text-4xl font-bold">
                Hey! I&apos;m Steven
              </h1>
              <h2 className="text-white text-2xl">
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
                    className="bg-gray-800 text-white rounded p-2"
                    href={button.linkUrl}
                  >
                    <span className="icon">
                      <Image
                        className="w-6 h-6"
                        src={button.iconUrl}
                        alt="Social Media Icon"
                        width="50"
                        height="50"
      
                      />
                    </span>
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
