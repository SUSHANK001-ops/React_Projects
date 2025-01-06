import React from 'react';
import { useState } from 'react';
import { Instagram, Facebook, Youtube, MessageCircle , Heart, Code } from 'lucide-react';

const Footer = () => {
  const [showCode, setShowCode] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const socialLinks = [
    {
      icon: <Instagram size={18} />,
      href: "https://www.instagram.com/sushank_00001/?hl=en",
      label: "Instagram",
      hoverColor: "hover:text-pink-500",
      animation: "hover:rotate-12"
    },
    {
      icon: <Facebook size={18} />,
      href: "https://www.facebook.com/SUSHANK0001?_rdc=1&_rdr#",
      label: "Facebook",
      hoverColor: "hover:text-blue-600",
      animation: "hover:-rotate-12"
    },
    {
      icon: <Youtube size={18} />,
      href: "https://www.youtube.com/@Sushank8848",
      label: "YouTube",
      hoverColor: "hover:text-red-600",
      animation: "hover:rotate-12"
    },
    {
      icon: <MessageCircle size={18} />,
      href: "https://wa.me/9706766449",
      label: "WhatsApp",
      hoverColor: "hover:text-green-500",
      animation: "hover:-rotate-12"
    }
  ];

  return (
    <footer className="bg-blue-500 text-gray-300  bottom-0 w-full">
      <div className="border-t border-gray-800 bg-black/50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            {/* Logo and Description */}
            <div className="flex flex-col items-center sm:items-start">
              <h2 className="text-xl font-bold">
                <span className="">
                  &lt;
                  <span className='text-white'>Sen</span>
                  <span className='text-'>OP/ &gt; </span>
                 
                </span>
              </h2>
              <div className="text-xs text-white flex items-center gap-1">
                Created with 
                <div 
                  className="relative inline-flex items-center mx-1"
                  onMouseEnter={() => setShowHeart(true)}
                  onMouseLeave={() => setShowHeart(false)}
                >
                  {showHeart ? (
                    <span className="animate-fadeIn ">love</span>
                  ) : (
                    <Heart 
                      size={25} 
                      className="text-red-700 animate-bounce" 
                    />
                  )}
                </div>
                by Sushank.Code
               
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-col items-center sm:items-end gap-2">
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transform transition-all duration-300 ${social.hoverColor} ${social.animation} hover:scale-110`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              <p className="text-xs text-white">
                &copy; {new Date().getFullYear()} Sushank Lamichhane. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;