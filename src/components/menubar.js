import React from "react";
import Image from "next/image";

const MenuBar = () => {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="block">
              <Image
                src="/images/sb-logo.svg"
                className="logo"
                alt="Logo"
                width={24}
                height={24}
              />
            </a>

            {/* <div className="hidden md:block"> */}
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="/"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </a>
                <a
                  href="/blog"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Blog
                </a>
                <a
                  href="/photos"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Photos
                </a>
              </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;
