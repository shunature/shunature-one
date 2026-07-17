"use client";

import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button 
        className="fixed top-6 right-6 z-50 flex flex-col items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 transition-all hover:bg-white/20"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-out ${isOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'}`} />
        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-out my-0.5 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-out ${isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'}`} />
      </button>

      {/* Fullscreen Menu */}
      <div 
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <nav className="flex flex-col items-center gap-8 text-2xl font-light tracking-widest">
          <a href="#" className="hover:text-gray-400 transition-colors" onClick={() => setIsOpen(false)}>HOME</a>
          <a href="#blog" className="hover:text-gray-400 transition-colors" onClick={() => setIsOpen(false)}>BLOG</a>
          <a href="#about" className="hover:text-gray-400 transition-colors" onClick={() => setIsOpen(false)}>ABOUT</a>
          <a href="mailto:contact@ffnet.work" className="hover:text-gray-400 transition-colors" onClick={() => setIsOpen(false)}>CONTACT</a>
        </nav>
      </div>
    </>
  );
}
