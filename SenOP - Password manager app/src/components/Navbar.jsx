import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-rose-700 text-white shadow-md h-20">
      <div className="container mx-auto flex justify-between items-center px-6 h-full">
        {/* Logo */}
        <div className="text-2xl md:text-3xl font-bold flex items-center">
          <span className="text-sky-300">{'<'}</span>
          <span>Sen</span>
          <span className="text-sky-300">{'OP />'}</span>
        </div>

        {/* GitHub Button */}
        <a
          href="https://github.com/SUSHANK001-ops" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-rose-800 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          <img
            className="invert w-16"
            src="/icons/Github.png"
            alt="GitHub Icon"
          />
          <span className="text-sm font-medium">GitHub</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
