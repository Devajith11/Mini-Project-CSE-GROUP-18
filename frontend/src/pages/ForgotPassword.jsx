import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    keamAppNumber: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        keamAppNumber: formData.keamAppNumber,
        newPassword: formData.newPassword
      };

      const res = await api.post('/auth/reset-password', payload);
      setSuccess(res.data.message || 'Password reset successfully!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to server. Please make sure backend is running.');
      } else {
        setError(err.response.data?.message || 'Password reset failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-10">

          {/* ── HEADER ── */}
          <div className="flex flex-col items-center mb-8">
            <div className="size-16 rounded-2xl flex items-center justify-center mb-4 bg-blue-100 text-blue-700">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                lock_reset
              </span>
            </div>
            <h2 className="text-2xl font-black text-gray-800 text-center">
              Reset Password
            </h2>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Enter your KEAM App Number to reset your password
            </p>
          </div>

          {/* ── ERROR/SUCCESS MESSAGES ── */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 flex items-start gap-3">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-xl text-sm font-medium mb-6 flex items-start gap-3">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
              {success}
            </div>
          )}

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* KEAM Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                KEAM App Number
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  style={{ fontSize: '20px' }}>badge</span>
                <input
                  type="text"
                  placeholder="Enter your 7-digit App No."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                  value={formData.keamAppNumber}
                  onChange={(e) => setFormData({ ...formData, keamAppNumber: e.target.value })}
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                New Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  style={{ fontSize: '20px' }}>key</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
              </div>
            </div>
            
            {/* Confirm New Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  style={{ fontSize: '20px' }}>lock</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success !== ''}
              className="w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 text-white bg-blue-700 hover:bg-blue-800"
            >
              {loading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Reset Password
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    arrow_forward
                  </span>
                </>
              )}
            </button>

          </form>

          {/* ── FOOTER TOGGLE ── */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Back to{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-700 font-bold hover:underline"
              >
                Login
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
