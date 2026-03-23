import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white/80 py-8 px-4 mt-auto">
      <div className="flex flex-col items-center text-center gap-4 max-w-lg mx-auto">

        {/* Logo */}
        <div className="relative size-16 flex items-center justify-center p-2 bg-white/5 rounded-2xl border border-white/10 shadow-lg group">
          <img
            src={`${import.meta.env.BASE_URL}logo-transparent.png`}
            alt="GECW Official Logo"
            className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
          />
        </div>


        {/* College Name */}
        <div>
          <h4 className="text-white text-base font-bold mb-1">
            Government Engineering College Wayanad
          </h4>
          <p className="text-sm text-white/60">Mananthavady, Wayanad, Kerala - 670644</p>
          <p className="text-sm text-white/60 mt-1">
            Affiliated to APJ Abdul Kalam Technological University
          </p>
        </div>

        <div className="w-full h-px bg-white/10 my-2"></div>

        {/* Contact Info */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>call</span>
            <span>04935 271 261</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span>
            <span>principal@gecwyd.ac.in</span>
          </div>
        </div>

        <p className="text-xs text-white/40 mt-4">
          © 2026 GEC Wayanad. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;