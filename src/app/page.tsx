import Image from "next/image";
import { Linkedin, Github, Instagram, TwitterX, Square, X, Dash } from 'react-bootstrap-icons';

interface FileSystemItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  content: string;
  link: string;
}

interface FileSystem {
  [key: string]: FileSystemItem;
}

const fileSystem: FileSystem = {
  "LinkedIn": {
    icon: Linkedin,
    content: "Connect with me professionally",
    link: "https://www.linkedin.com/in/stevenbarash"
  },
  "GitHub": {
    icon: Github,
    content: "Check out my code projects",
    link: "https://github.com/stevenbarash"
  },
  "Instagram": {
    icon: Instagram,
    content: "View my photography work",
    link: "https://www.instagram.com/steven.photography"
  },
  "Twitter": {
    icon: TwitterX,
    content: "Follow my thoughts and updates",
    link: "https://www.x.com/steven_barash"
  }
};

export default function Home() {
  return (
    <>
      <main className="bg-[#008080] min-h-screen p-4" style={{ 
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 20 0 L 0 0 0 20" fill="none" stroke="%23000000" stroke-width="0.5" opacity="0.1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grid)"/%3E%3C/svg%3E")'
      }}>
        <div className="container mx-auto">
          {/* Main Window */}
          <div className="max-w-6xl mx-auto">
            {/* Window Title Bar */}
            <div className="win95-title-bar text-white px-2 py-1 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-white border border-black flex items-center justify-center" style={{
                  boxShadow: 'inset 1px 1px 0px 0px rgba(0,0,0,0.5)'
                }}>
                  <div className="w-2 h-2 bg-[#000080]"></div>
                </div>
                <span className="font-mono font-bold text-sm">STEVEN.EXE - Personal Site</span>
              </div>
              <div className="flex space-x-1">
                <button className="win95-button w-6 h-6 flex items-center justify-center">
                  <Dash size={12} className="text-black" />
                </button>
                <button className="win95-button w-6 h-6 flex items-center justify-center">
                  <Square size={12} className="text-black" />
                </button>
                <button className="win95-button w-6 h-6 flex items-center justify-center">
                  <X size={12} className="text-black" />
                </button>
              </div>
            </div>
            
            {/* Window Content */}
            <div className="win95-window">
              {/* Menu Bar */}
              <div className="win95-menu-bar px-2 py-1 flex items-center space-x-4">
                <div className="win95-menu-item font-mono text-sm font-bold text-black px-2 py-1 cursor-pointer">
                  File
                </div>
                <div className="win95-menu-item font-mono text-sm font-bold text-black px-2 py-1 cursor-pointer">
                  Edit
                </div>
                <div className="win95-menu-item font-mono text-sm font-bold text-black px-2 py-1 cursor-pointer">
                  View
                </div>
                <div className="win95-menu-item font-mono text-sm font-bold text-black px-2 py-1 cursor-pointer">
                  Help
                </div>
              </div>
              
              {/* Main Content Area */}
              <div className="p-4 space-y-4">
                {/* Profile Section */}
                <div className="win95-content p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 border-2 border-black bg-white p-1" style={{
                      boxShadow: 'inset 1px 1px 0px 0px rgba(255,255,255,1), 1px 1px 0px 0px rgba(0,0,0,1)'
                    }}>
                      <img src="/images/me.jpg" alt="Steven Barash" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-2xl font-mono font-bold text-black mb-2">STEVEN BARASH</h1>
                      <p className="font-mono text-sm text-black mb-1">Sr. Solutions Engineer at <a href="https://www.descope.com" target="_blank" rel="noopener noreferrer" className="font-bold underline">DESCOPE</a></p>
                      <p className="font-mono text-sm text-black">Photographer • Brooklyn, NYC 🗽</p>
                    </div>
                  </div>
                </div>
                
                {/* File System Explorer */}
                <div className="win95-content">
                  {/* Tab Headers */}
                  <div className="bg-[#c0c0c0] border-b-2 border-black flex" style={{
                    boxShadow: 'inset 1px 1px 0px 0px rgba(255,255,255,1)'
                  }}>
                    <div className="win95-tab-active px-4 py-2 font-mono font-bold text-sm text-black">
                      FILE SYSTEM
                    </div>
                    {/* <div className="win95-tab px-4 py-2 font-mono font-bold text-sm text-black">
                      TERMINAL
                    </div>
                    <div className="win95-tab px-4 py-2 font-mono font-bold text-sm text-black">
                      ABOUT
                    </div> */}
                  </div>
                  
                  {/* Tab Content */}
                  <div className="p-4">
                    {/* File System View */}
                    <div className="space-y-4">
                      <div className="font-mono font-bold text-black border-b border-black pb-2">
                        EXPLORER - C:\STEVEN\
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(fileSystem).map(([name, data], index) => {
                          const IconComponent = data.icon;
                          return (
                            <a
                              key={index}
                              href={data.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="win95-icon p-3 cursor-pointer"
                            >
                              <div className="flex flex-col items-center space-y-2">
                                <IconComponent size={32} className="text-black" />
                                <span className="text-xs font-mono font-bold text-black text-center">{name}</span>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terminal Section */}
                <div className="win95-terminal p-4">
                  <div className="font-mono text-green-400 text-sm space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">C:\STEVEN\{'>'}</span>
                      <span className="text-white">whoami</span>
                    </div>
                    <div className="text-green-400 ml-4">steven</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">C:\STEVEN\{'>'}</span>
                      <span className="text-white">pwd</span>
                    </div>
                    <div className="text-green-400 ml-4">/home/steven</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">C:\STEVEN\{'>'}</span>
                      <span className="text-white">cat about.txt</span>
                    </div>
                    <div className="text-green-400 ml-4">Sr. Solutions Engineer at Descope. Photography, tech, and languages (the human spoken kind) enthusiast. Brooklyn-based.</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">C:\STEVEN\{'>'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Windows 95 Taskbar */}
      <div className="win95-taskbar fixed bottom-0 left-0 w-full">
                  <div className="flex items-center justify-between px-2 py-1">
            <button className="win95-button px-3 py-1 flex items-center space-x-2">
            <img src="/images/win95.png" alt="Windows 95" className="w-4 h-4" />
            <span className="font-mono font-bold text-black text-sm">Start</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="bg-white border-2 border-black px-2 py-1 font-mono text-xs text-black" style={{
              boxShadow: 'inset 1px 1px 0px 0px rgba(255,255,255,1), 1px 1px 0px 0px rgba(0,0,0,1)'
            }}>
              STEVEN.EXE
            </div>
            <div className="bg-green-400 border-2 border-black px-2 py-1 font-mono text-xs text-black font-bold" style={{
              boxShadow: 'inset 1px 1px 0px 0px rgba(255,255,255,1), 1px 1px 0px 0px rgba(0,0,0,1)'
            }}>
              ONLINE
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 