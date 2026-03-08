import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DocumentUpload = () => {
  const navigate = useNavigate();

  // ── STATE ──
  const [uploading, setUploading] = useState(null);
  const [files, setFiles] = useState({
    allotmentMemo: null,
    sslcCertificate: null,
    transferCertificate: null,
    physicalFitness: null,
    incomeCertificate: null
  });
  const [uploadStatus, setUploadStatus] = useState({
    allotmentMemo: 'pending',
    sslcCertificate: 'pending',
    transferCertificate: 'pending',
    physicalFitness: 'pending',
    incomeCertificate: 'pending'
  });

  // ── DOCUMENT LIST CONFIG ──
  const docList = [
    {
      id: 'allotmentMemo',
      name: 'KEAM Allotment Memo',
      description: 'Latest allotment memo issued by CEE',
      icon: 'description'
    },
    {
      id: 'sslcCertificate',
      name: 'SSLC / 10th Certificate',
      description: 'For proof of age and date of birth',
      icon: 'school'
    },
    {
      id: 'transferCertificate',
      name: 'Transfer Certificate (TC)',
      description: 'Issued from the last institution attended',
      icon: 'move_item'
    },
    {
      id: 'physicalFitness',
      name: 'Physical Fitness Certificate',
      description: 'In the format prescribed in the prospectus',
      icon: 'favorite'
    },
    {
      id: 'incomeCertificate',
      name: 'Income Certificate',
      description: 'For fee concession (if applicable)',
      icon: 'payments'
    }
  ];

  // ── UPLOAD HANDLER ──
  const handleFileChange = async (id, e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setUploading(id);

    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('name', docList.find(d => d.id === id).name);

    try {
      await api.post('/student/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFiles(prev => ({ ...prev, [id]: selectedFile }));
      setUploadStatus(prev => ({ ...prev, [id]: 'success' }));
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed. Try again.');
      setUploadStatus(prev => ({ ...prev, [id]: 'error' }));
    } finally {
      setUploading(null);
    }
  };

  // ── REMOVE FILE ──
  const handleRemove = (id) => {
    setFiles(prev => ({ ...prev, [id]: null }));
    setUploadStatus(prev => ({ ...prev, [id]: 'pending' }));
  };

  // ── FINISH HANDLER ──
  const handleFinish = () => {
    const allUploaded = Object.values(uploadStatus).every(s => s === 'success');
    if (allUploaded) {
      alert('All documents uploaded! Your application is complete.');
      navigate('/dashboard');
    } else {
      alert('Please upload all required documents before finishing.');
    }
  };

  // Count uploaded
  const uploadedCount = Object.values(uploadStatus).filter(s => s === 'success').length;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">

        {/* ── HEADER ── */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Document Upload Center
          </h1>
          <p className="text-gray-500 mt-2">
            Upload digital copies of your certificates (PDF/JPG, Max 2MB)
          </p>

          {/* Progress bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
              <span>Progress</span>
              <span>{uploadedCount} / {docList.length} uploaded</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${(uploadedCount / docList.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── DOCUMENT CARDS ── */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {docList.map((doc, idx) => {
            const status = uploadStatus[doc.id];
            const file = files[doc.id];

            return (
              <div
                key={doc.id}
                className={`bg-white p-6 rounded-2xl shadow-sm border-2 transition-all flex flex-col md:flex-row items-center gap-6 ${
                  status === 'success'
                    ? 'border-green-400'
                    : status === 'error'
                    ? 'border-red-300'
                    : 'border-gray-100 hover:border-blue-300'
                }`}
              >
                {/* Icon */}
                <div className={`size-14 rounded-xl flex items-center justify-center shrink-0 ${
                  status === 'success'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-blue-50 text-blue-600'
                }`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>
                    {status === 'success' ? 'check_circle' : doc.icon}
                  </span>
                </div>

                {/* Label */}
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-base font-bold text-gray-800">{doc.name}</h3>
                  <p className="text-sm text-gray-500">{doc.description}</p>
                  {status === 'success' && file && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      ✓ {file.name}
                    </p>
                  )}
                  {status === 'error' && (
                    <p className="text-xs text-red-500 font-medium mt-1">
                      Upload failed. Please try again.
                    </p>
                  )}
                </div>

                {/* Action */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  {status === 'success' ? (
                    <button
                      onClick={() => handleRemove(doc.id)}
                      className="w-full md:w-auto px-5 py-2.5 rounded-xl border-2 border-red-200 text-red-500 text-sm font-bold hover:bg-red-50 transition-all"
                    >
                      Remove
                    </button>
                  ) : (
                    <label className="w-full md:w-auto cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(doc.id, e)}
                      />
                      <div className={`px-6 py-2.5 rounded-xl text-sm font-bold text-center transition-all text-white ${
                        uploading === doc.id
                          ? 'bg-blue-400 cursor-wait'
                          : 'bg-blue-700 hover:bg-blue-800'
                      }`}>
                        {uploading === doc.id ? (
                          <div className="flex items-center gap-2 justify-center">
                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Uploading...
                          </div>
                        ) : (
                          'Select File'
                        )}
                      </div>
                    </label>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* ── GUIDELINES BOX ── */}
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex gap-4 mb-10">
          <span className="material-symbols-outlined text-amber-600 shrink-0">info</span>
          <div>
            <h4 className="text-amber-800 font-bold text-sm">Upload Guidelines</h4>
            <ul className="text-xs text-amber-700 mt-1 space-y-1 list-disc list-inside">
              <li>Supported formats: PDF, JPEG, PNG</li>
              <li>Ensure all text is clearly legible</li>
              <li>Maximum file size per document is 2MB</li>
            </ul>
          </div>
        </div>

        {/* ── FOOTER BUTTONS ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-12">
          <button
            onClick={() => navigate('/apply')}
            className="text-gray-500 font-bold hover:text-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">west</span>
            Back to Application
          </button>

          <button
            onClick={handleFinish}
            className="w-full sm:w-auto bg-green-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-xl flex items-center justify-center gap-3"
          >
            Complete Application
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default DocumentUpload;