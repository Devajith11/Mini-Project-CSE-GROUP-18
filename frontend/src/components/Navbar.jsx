import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
      <div className="flex items-center p-4 justify-between max-w-7xl mx-auto w-full">

        {/* ── LOGO ── */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="size-10 flex items-center justify-center">
            <img
              src="/logo-transparent.png"
              alt="GECW Logo"
              className="w-full h-full object-contain overflow-hidden rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold leading-tight">GEC Wayanad</h1>
            <span className="text-xs text-white/80">Govt. Engineering College</span>
          </div>
        </Link>

        {/* ── RIGHT SIDE ── */}
        <div className="flex items-center gap-4">

          {/* Helpdesk link (hidden on mobile) */}
          <Link
            to="/chat"
            className="hidden sm:flex items-center gap-1 text-sm font-medium hover:text-white/80 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chat_bubble</span>
            Helpdesk
          </Link>

          {/* ── HAMBURGER MENU ── */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center rounded-full size-10 hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-white" style={{ fontSize: '28px' }}>
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <nav className="py-2">

                  <Link to="/" onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                    <span className="material-symbols-outlined text-blue-700" style={{ fontSize: '20px' }}>home</span>
                    Home
                  </Link>

                  <Link to="/chat" onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors sm:hidden">
                    <span className="material-symbols-outlined text-blue-700" style={{ fontSize: '20px' }}>chat_bubble</span>
                    Helpdesk
                  </Link>

                  <div className="h-px bg-gray-100 my-1 mx-3"></div>

                  <Link to="/login" onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                    <span className="material-symbols-outlined text-blue-700" style={{ fontSize: '20px' }}>login</span>
                    Student Login
                  </Link>

                  <Link to="/register" onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-green-600 hover:bg-green-50 transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>how_to_reg</span>
                    Register
                  </Link>

                  <Link to="/admin/login" onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:bg-blue-50 transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shield_person</span>
                    Admin Login
                  </Link>

                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;