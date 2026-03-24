import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { BASE_URL } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ── STATE ──
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [docFeedback, setDocFeedback] = useState('');

  // ── FETCH ALL STUDENTS ──
  // Calls: GET /api/admin/students (Midhun P M's API)
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/students');
      setStudents(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch students. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ── VERIFY DOCUMENT ──
  // Calls: POST /api/admin/verify (Midhun P M's API)
  const handleVerifyDoc = async (studentId, documentId, status) => {
    try {
      await api.post('/admin/verify', {
        studentId,
        documentId,
        status,
        adminFeedback: docFeedback
      });
      // Update local state immediately
      setStudents(prev => prev.map(s => {
        if (s._id === studentId) {
          const updatedDocs = s.documents.map(d =>
            d._id === documentId ? { ...d, status, adminFeedback: docFeedback } : d
          );
          return { ...s, documents: updatedDocs };
        }
        return s;
      }));
      // Update modal if open
      if (selectedStudent?._id === studentId) {
        setSelectedStudent(prev => ({
          ...prev,
          documents: prev.documents.map(d =>
            d._id === documentId ? { ...d, status, adminFeedback: docFeedback } : d
          )
        }));
      }
      setDocFeedback('');
      alert(`Document ${status} successfully!`);
    } catch (err) {
      alert('Failed to verify document. Try again.');
    }
  };

  // ── UPDATE STUDENT STATUS ──
  // Calls: POST /api/admin/update-status (Midhun P M's API)
  const handleUpdateStatus = async (studentId, status) => {
    try {
      await api.post('/admin/update-status', { studentId, status });
      fetchStudents();
      setSelectedStudent(null);
      alert(`Status updated to ${status}!`);
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  // ── SEND REMARKS TO STUDENT ──
  // Calls: POST /api/admin/update-remarks (Midhun P M's API)
  // Student sees this in their StudentDashboard (Devajith's page)
  const handleSendRemarks = async () => {
    try {
      await api.post('/admin/update-remarks', {
        studentId: selectedStudent._id,
        adminRemarks: remarks
      });
      alert('Feedback sent to student successfully!');
      setRemarks('');
      fetchStudents();
    } catch (err) {
      alert('Failed to send feedback.');
    }
  };

  // ── LOGOUT ──
  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  // ── STATS ──
  const stats = [
    { label: 'Total Applications', value: students.length,                                          icon: 'groups',        color: 'blue' },
    { label: 'Verified',           value: students.filter(s => s.status === 'Verified').length,     icon: 'check_circle',  color: 'green' },
    { label: 'Submitted',          value: students.filter(s => s.status === 'Submitted').length,    icon: 'pending',       color: 'amber' },
    { label: 'Admitted',           value: students.filter(s => s.status === 'Admitted').length,     icon: 'school',        color: 'purple' }
  ];

  const statColors = {
    blue:   'bg-blue-100 text-blue-700',
    green:  'bg-green-100 text-green-700',
    amber:  'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700'
  };

  // ── STATUS BADGE STYLE ──
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Verified':        return 'bg-green-100 text-green-700';
      case 'Admitted':        return 'bg-blue-100 text-blue-700';
      case 'Action Required': return 'bg-amber-100 text-amber-700';
      case 'Rejected':        return 'bg-red-100 text-red-700';
      default:                return 'bg-gray-100 text-gray-600';
    }
  };

  // ── BRANCH SEAT SUMMARY ──
  const branchSummary = ['CSE', 'ECE', 'EEE', 'ME', 'CE'].map(b => ({
    name: b,
    filled: students.filter(s => s.branch === b && s.status === 'Admitted').length,
    capacity: 60
  }));

  // ── FILTERED STUDENTS ──
  const filteredStudents = students.filter(s =>
    filter === 'All' || s.branch === filter
  );

  // ── LOADING ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="size-12 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-700">dashboard</span>
              Admission Desk Dashboard
            </h1>
            <p className="text-sm text-gray-500">Government Engineering College Wayanad</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchStudents}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ── STATS GRID ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`size-10 rounded-xl flex items-center justify-center ${statColors[stat.color]}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{stat.icon}</span>
                </div>
                <span className="text-3xl font-black text-gray-800">{stat.value}</span>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── BRANCH SEAT TRACKER ── */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            Branch Seat Filling
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
            {branchSummary.map((b, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-blue-700">{b.name}</span>
                  <span className="text-gray-400">{b.filled}/{b.capacity}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-700 rounded-full transition-all"
                    style={{ width: `${(b.filled / b.capacity) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── STUDENTS TABLE ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">

          {/* Filter Bar */}
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="font-bold text-gray-800">Student Applications</h3>
            <div className="flex items-center gap-2 overflow-x-auto">
              {['All', 'CSE', 'ECE', 'EEE', 'ME', 'CE'].map(b => (
                <button
                  key={b}
                  onClick={() => setFilter(b)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    filter === b
                      ? 'bg-blue-700 text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {error ? (
            <div className="p-8 text-center text-red-500 font-medium">{error}</div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-gray-400 font-medium">
              No students found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-widest font-black text-gray-400 border-b border-gray-100">
                    <th className="px-6 py-4">App Number</th>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Branch</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Documents</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-bold text-gray-400">
                          #{student.keamAppNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-800">
                            {student.personalDetails?.name || 'Incomplete'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(student.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-black uppercase border border-blue-100">
                          {student.branch || 'None'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-gray-600">
                          {student.category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-gray-600">
                          {student.documents?.length || 0} files
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(student.status)}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setSelectedDocIndex(0);
                            setRemarks(student.adminRemarks || '');
                          }}
                          className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition-all"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ── REVIEW MODAL ── */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedStudent(null)}
          />

          {/* Modal Box */}
          <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">

            {/* Modal Header */}
            <div className="px-6 py-4 bg-blue-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <h2 className="font-bold">
                    {selectedStudent.personalDetails?.name || 'Student'}
                  </h2>
                  <p className="text-xs opacity-70">
                    App ID: {selectedStudent.keamAppNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="size-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">

              {/* ── LEFT SIDEBAR ── */}
              <div className="w-full lg:w-1/3 overflow-y-auto p-6 bg-gray-50 border-r border-gray-100">

                {/* Branch & Category */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
                    <p className="text-xs font-black text-blue-700 uppercase mb-1">Branch</p>
                    <p className="text-xl font-black text-blue-700">
                      {selectedStudent.branch || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-gray-200">
                    <p className="text-xs font-black text-gray-400 uppercase mb-1">Category</p>
                    <p className="text-xl font-black text-gray-800">
                      {selectedStudent.category || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="bg-blue-700 p-5 rounded-2xl text-white mb-6">
                  <p className="text-xs font-black uppercase opacity-70 mb-3">Academic Merit</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs opacity-60 uppercase">KEAM Rank</p>
                      <p className="text-2xl font-black">
                        {selectedStudent.academicDetails?.keamRank || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs opacity-60 uppercase">Plus Two</p>
                      <p className="text-2xl font-black">
                        {selectedStudent.academicDetails?.plusTwoMarks || 'N/A'}%
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
                    <div>
                      <p className="text-xs opacity-60 uppercase">Roll No</p>
                      <p className="text-sm font-bold">
                        {selectedStudent.academicDetails?.keamRollNo || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs opacity-60 uppercase">School Name</p>
                      <p className="text-sm font-bold truncate" title={selectedStudent.academicDetails?.schoolName}>
                        {selectedStudent.academicDetails?.schoolName || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-3 mb-6">
                  <p className="text-xs font-bold text-gray-500 uppercase">Personal Details</p>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
                    <span className="material-symbols-outlined text-blue-700">call</span>
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="text-sm font-bold">{selectedStudent.personalDetails?.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
                    <span className="material-symbols-outlined text-blue-700">mail</span>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm font-bold truncate max-w-[150px]" title={selectedStudent.personalDetails?.email}>
                        {selectedStudent.personalDetails?.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
                    <span className="material-symbols-outlined text-blue-700">cake</span>
                    <div>
                      <p className="text-xs text-gray-400">Date of Birth</p>
                      <p className="text-sm font-bold">
                        {selectedStudent.personalDetails?.dob ? new Date(selectedStudent.personalDetails.dob).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-gray-100">
                    <span className="material-symbols-outlined text-blue-700 mt-0.5">home</span>
                    <div>
                      <p className="text-xs text-gray-400">Address</p>
                      <p className="text-sm font-bold">{selectedStudent.personalDetails?.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Guardian Info */}
                <div className="space-y-3 mb-6">
                  <p className="text-xs font-bold text-gray-500 uppercase">Guardian Details</p>
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Name</p>
                        <p className="text-sm font-bold">{selectedStudent.guardianDetails?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Relation</p>
                        <p className="text-sm font-bold">{selectedStudent.guardianDetails?.relation || 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="text-sm font-bold">{selectedStudent.guardianDetails?.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── SEND MESSAGE TO STUDENT ── */}
                {/* This message appears in StudentDashboard.jsx (Devajith's page) */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3">
                    Message to Student
                  </p>
                  <textarea
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                    placeholder="e.g. Please re-upload your TC clearly."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                  <button
                    onClick={handleSendRemarks}
                    className="mt-2 w-full py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700 hover:text-white transition-all"
                  >
                    Send Message
                  </button>
                </div>

                {/* ── STATUS BUTTONS ── */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleUpdateStatus(selectedStudent._id, 'Verified')}
                    className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>verified_user</span>
                    Verify Application
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleUpdateStatus(selectedStudent._id, 'Action Required')}
                      className="py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all text-xs"
                    >
                      Action Required
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedStudent._id, 'Admitted')}
                      className="py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-xs"
                    >
                      Final Admit
                    </button>
                  </div>
                </div>

              </div>

              {/* ── RIGHT SIDE — DOCUMENT VIEWER ── */}
              <div className="flex-grow flex flex-col overflow-hidden">

                {/* Document Tabs */}
                <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">
                    Documents
                  </span>
                  {selectedStudent.documents?.map((doc, idx) => (
                    <button
                      key={doc._id}
                      onClick={() => setSelectedDocIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black border transition-all whitespace-nowrap ${
                        selectedDocIndex === idx
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'text-gray-400 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      {doc.name}
                      {doc.status === 'Verified' && (
                        <span className="ml-1 text-green-500">●</span>
                      )}
                      {doc.status === 'Rejected' && (
                        <span className="ml-1 text-red-500">●</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Document Preview */}
                <div className="flex-grow overflow-y-auto p-6 bg-gray-100 flex flex-col items-center">
                  {selectedStudent.documents?.length > 0 ? (
                    <>
                      {/* File preview */}
                      <div className="w-full max-w-xl bg-white shadow-xl rounded-xl p-2 min-h-[400px] flex items-center justify-center border border-gray-200 mb-4 overflow-hidden">
                        {selectedStudent.documents[selectedDocIndex]?.url.toLowerCase().endsWith('.pdf') ? (
                          <iframe
                            src={`${BASE_URL}${selectedStudent.documents[selectedDocIndex].url}`}
                            width="100%"
                            height="400px"
                            title="PDF Preview"
                            className="rounded"
                          />
                        ) : (
                          <img
                            src={`${BASE_URL}${selectedStudent.documents[selectedDocIndex]?.url}`}
                            alt="Document"
                            className="max-w-full h-auto rounded"
                          />
                        )}
                      </div>

                      {/* Document feedback */}
                      <div className="w-full max-w-xl space-y-3 pb-8">
                        <textarea
                          className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Add feedback for this document (optional)..."
                          value={docFeedback}
                          onChange={(e) => setDocFeedback(e.target.value)}
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleVerifyDoc(
                              selectedStudent._id,
                              selectedStudent.documents[selectedDocIndex]._id,
                              'Verified'
                            )}
                            className="flex-grow py-3 bg-green-600 text-white rounded-xl font-bold text-xs hover:bg-green-700 transition-all"
                          >
                            ✓ Approve Document
                          </button>
                          <button
                            onClick={() => handleVerifyDoc(
                              selectedStudent._id,
                              selectedStudent.documents[selectedDocIndex]._id,
                              'Rejected'
                            )}
                            className="flex-grow py-3 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-all"
                          >
                            ✗ Reject Document
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <span className="material-symbols-outlined text-6xl mb-4">folder_open</span>
                      <p className="font-medium">No documents uploaded yet</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;