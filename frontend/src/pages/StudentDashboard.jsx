import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── FETCH STUDENT PROFILE FROM BACKEND ──
  // Calls: GET /api/student/profile (Member 2 - Midhun's API)
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      // If no token → not logged in → redirect to login
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // API call to backend (Member 2 - Midhun P M built this)
        const res = await api.get('/student/profile');
        setStudent(res.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        // Token expired or invalid → redirect to login
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ── STATUS STEP CALCULATOR ──
  // Returns 0-3 based on how far the student is in the admission process
  const getStatusStep = () => {
    if (!student) return 0;
    if (student.status === 'Admitted') return 3;  // Final stage
    if (student.status === 'Verified') return 2;  // Documents verified
    if (student.personalDetails?.name) return 1;  // Form filled
    return 0;                                      // Just registered
  };

  // ── STATUS BADGE STYLE ──
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Admitted':        return 'bg-green-100 text-green-700 border border-green-200';
      case 'Verified':        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'Action Required': return 'bg-amber-100 text-amber-700 border border-amber-200';
      default:                return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  // ── LOGOUT ──
  // Clears localStorage and redirects to login
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // ── LOADING SPINNER ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="size-12 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800">
              Welcome, {student?.personalDetails?.name || 'Applicant'}!
            </h1>
            <p className="text-gray-500 mt-1">
              KEAM App No:{' '}
              <span className="text-blue-700 font-bold">{student?.keamAppNumber}</span>
            </p>
          </div>

          {/* Header Buttons */}
          <div className="flex items-center gap-3">
            {/* Chat button → connects to Aswitha J's Chatbot module */}
            <Link
              to="/chat"
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-blue-700">smart_toy</span>
              Support Bot
            </Link>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-red-50 text-red-500 rounded-2xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ── STATUS TRACKER CARD ── */}
        {/* Shows the student's current admission progress */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
              Current Admission Status
            </h2>
            {/* Status badge - updated by Midhun's admin API */}
            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide ${getStatusStyle(student?.status)}`}>
              {student?.status || 'Submitted'}
            </span>
          </div>

          {/* Progress Line + Steps */}
          <div className="relative flex items-center justify-between max-w-2xl mx-auto">

            {/* Background line */}
            <div className="absolute left-0 top-6 w-full h-1 bg-gray-100 z-0">
              <div
                className="h-full bg-blue-700 transition-all duration-700"
                style={{ width: `${(getStatusStep() / 3) * 100}%` }}
              />
            </div>

            {/* Step circles */}
            {[
              { step: 1, label: 'Form Filled', icon: 'edit_document' },
              { step: 2, label: 'Verified',    icon: 'verified' },
              { step: 3, label: 'Admitted',    icon: 'school' }
            ].map((s) => (
              <div key={s.step} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`size-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  getStatusStep() >= s.step
                    ? 'bg-blue-700 text-white shadow-lg shadow-blue-200'
                    : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}>
                  <span className="material-symbols-outlined">
                    {getStatusStep() >= s.step ? 'check' : s.icon}
                  </span>
                </div>
                <span className={`text-xs font-black uppercase tracking-wider ${
                  getStatusStep() >= s.step ? 'text-blue-700' : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── QUICK ACTION CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Card 1 — Admission Form */}
          {/* Navigates to AdmissionForm.jsx (Devajith's work) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="size-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>fact_check</span>
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Admission Form</h3>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              Update your personal, academic and category details to proceed.
            </p>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 text-blue-700 font-black text-xs uppercase tracking-widest hover:gap-3 transition-all"
            >
              {student?.personalDetails?.name ? 'Edit Details' : 'Start Application'}
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </Link>
          </div>

          {/* Card 2 — Document Upload */}
          {/* Navigates to DocumentUpload.jsx (Devajith's work) */}
          {/* Uploads via POST /api/student/upload (Midhun's API) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="size-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>upload_file</span>
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Document Upload</h3>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              Submit your SSLC, TC, Allotment Memo and other certificates.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 text-blue-700 font-black text-xs uppercase tracking-widest hover:gap-3 transition-all"
            >
              Manage Files
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </Link>
          </div>

          {/* Card 3 — Help Center */}
          {/* Navigates to Chatbot.jsx (Aswitha J's work) */}
          {/* Calls POST /api/chatbot/query (Aswitha's API) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="size-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>help_center</span>
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Help Center</h3>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              Get instant answers for your admission related queries.
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 text-blue-700 font-black text-xs uppercase tracking-widest hover:gap-3 transition-all"
            >
              Launch Bot
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </Link>
          </div>

        </div>

        {/* ── ADMIN FEEDBACK SECTION ── */}
        {/* Only shows if Midhun's admin sent a remark via POST /api/admin/update-remarks */}
        {student?.adminRemarks && (
          <div className="mb-8 p-6 bg-red-50 rounded-3xl border border-red-200 flex gap-4 items-start">
            <div className="size-12 bg-red-500 rounded-2xl flex items-center justify-center shrink-0 text-white">
              <span className="material-symbols-outlined">feedback</span>
            </div>
            <div>
              <h4 className="font-black text-red-600 text-sm uppercase tracking-widest mb-1">
                Admin Feedback
              </h4>
              <p className="text-red-700 text-sm font-medium leading-relaxed">
                {student.adminRemarks}
              </p>
              <p className="text-xs text-red-400 mt-2 font-bold uppercase tracking-widest">
                Please correct the mentioned issues and re-submit.
              </p>
            </div>
          </div>
        )}

        {/* ── REJECTED DOCUMENTS SECTION ── */}
        {/* Only shows if Midhun's admin rejected a document via POST /api/admin/verify */}
        {student?.documents?.some(d => d.status === 'Rejected') && (
          <div className="mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
              Rejected Documents — Please Re-upload
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.documents
                .filter(d => d.status === 'Rejected')
                .map((doc, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-2xl border border-red-200 flex items-center gap-4 shadow-sm"
                  >
                    <div className="size-10 bg-red-100 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">error</span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-gray-800">{doc.name}</h4>
                      <p className="text-xs text-red-600 font-medium mt-0.5">
                        Reason: {doc.adminFeedback || 'Incorrect or unclear document'}
                      </p>
                    </div>
                    <Link
                      to="/upload"
                      className="text-xs font-black uppercase text-blue-700 hover:underline shrink-0"
                    >
                      Re-upload
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── INFO NOTE ── */}
        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-200 flex gap-4 items-start">
          <span className="material-symbols-outlined text-blue-700 shrink-0">info</span>
          <div>
            <h4 className="font-bold text-blue-700 text-sm">Next Steps</h4>
            <p className="text-blue-600/80 text-xs mt-1 leading-relaxed">
              Once you upload all documents, the admission clerk will review your
              application. You will see the Verified status here after successful
              document verification. You may be asked to bring originals for final
              physical verification at the college.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
