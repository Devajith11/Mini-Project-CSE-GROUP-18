import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO SECTION ── */}
      <div className="px-4 py-3 max-w-7xl mx-auto w-full">
        <div
          className="relative bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-lg min-h-[300px] sm:min-h-[400px]"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(20,75,184,0.2) 0%, rgba(17,22,33,0.9) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBjDav1HBxKVAOGTQpsvOooXo0c6X11JYC_YwwpzPVsHbnW5chV3bC1BUsP-m-czach7Ih6LFnvGjmdMnfWozzOCYOJulcgCKGfJVuF8UKixNK2iuQJcXRCdOmflFSJh_oz34yMQF7bS3tzSK46K2aFupprYc-ILMCDF8I78w6MZy77T7RYU4NG77Tx8bfIyA3FebTQBpnSBuck1CnM7T4o6NMgTiRatHrRs7tXNS-j-B9_R44FuMljpyr9uRyImFp_ZjMhKQ18PZg")',
          }}
        >
          <div className="flex flex-col p-6 sm:p-10 pb-8">
            {/* Badge */}
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white mb-4">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>campaign</span>
              Admission Open 2026-27
            </span>

            {/* Title */}
            <h2 className="text-white text-3xl sm:text-5xl font-bold leading-tight max-w-2xl">
              Welcome to Online Admission Portal
            </h2>

            {/* Subtitle */}
            <p className="text-white/80 text-base sm:text-lg mt-2 max-w-xl">
              Secure your future at Government Engineering College Wayanad.
              Streamlined digital admission process for KEAM allotted students.
            </p>
          </div>
        </div>
      </div>

      {/* ── ACTION CARDS ── */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <div className="pt-8 pb-4">
          <h3 className="text-gray-800 text-xl font-bold">Select Action</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">

          {/* Card 1 — Apply Online */}
          <Link to="/register"
            className="flex flex-col gap-4 rounded-xl border-2 border-green-500 bg-white p-6 items-center shadow-sm hover:shadow-xl transition-all group text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>how_to_reg</span>
            </div>
            <div>
              <h2 className="text-gray-800 text-lg font-bold">Apply Online</h2>
              <p className="text-gray-500 text-sm">New applicants start registration here</p>
            </div>
          </Link>

          {/* Card 2 — Student Login */}
          <Link to="/login"
            className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 items-center shadow-sm hover:shadow-xl transition-all group text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>school</span>
            </div>
            <div>
              <h2 className="text-gray-800 text-lg font-bold">Student Login</h2>
              <p className="text-gray-500 text-sm">Access your admission dashboard</p>
            </div>
          </Link>

          {/* Card 3 — Admin Login */}
          <Link to="/admin/login"
            className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 items-center shadow-sm hover:shadow-xl transition-all group text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-700 group-hover:bg-gray-800 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>admin_panel_settings</span>
            </div>
            <div>
              <h2 className="text-gray-800 text-lg font-bold">Admin Login</h2>
              <p className="text-gray-500 text-sm">Staff and faculty verification portal</p>
            </div>
          </Link>

        </div>

        {/* ── IMPORTANT INFO LINKS ── */}
        <div className="pt-4 pb-2">
          <h3 className="text-gray-800 text-xl font-bold">Important Information</h3>
        </div>

        <div className="flex flex-col pb-12">
          <a href="#" className="flex items-center justify-between py-5 border-b border-gray-200 hover:bg-gray-50 px-2 transition-colors">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-blue-600">fact_check</span>
              <span className="text-gray-800 font-medium">Eligibility Criteria & Guidelines</span>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </a>

          <a href="#" className="flex items-center justify-between py-5 border-b border-gray-200 hover:bg-gray-50 px-2 transition-colors">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-blue-600">payments</span>
              <span className="text-gray-800 font-medium">Fee Structure 2026-27</span>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </a>

          <a href="#" className="flex items-center justify-between py-5 border-b border-gray-200 hover:bg-gray-50 px-2 transition-colors">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-blue-600">calendar_month</span>
              <span className="text-gray-800 font-medium">Admission Schedule & Key Dates</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">New</span>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </div>
          </a>

          <a href="#" className="flex items-center justify-between py-5 hover:bg-gray-50 px-2 transition-colors">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-red-600">picture_as_pdf</span>
              <span className="text-gray-800 font-medium">College Prospectus Download</span>
            </div>
            <span className="material-symbols-outlined text-gray-400">download</span>
          </a>
        </div>
      </div>

    </div>
  );
};

export default Home;