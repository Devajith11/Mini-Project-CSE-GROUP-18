import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Auth = ({ isRegister, isAdmin }) => {

  // ── STATE ──
  const [formData, setFormData] = useState({
    keamAppNumber: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ── SUBMIT HANDLER ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let endpoint = '';
      let payload = {};

      if (isAdmin) {
        endpoint = '/auth/admin/login';
        payload = {
          username: formData.username,
          password: formData.password
        };
      } else {
        endpoint = isRegister ? '/auth/register' : '/auth/login';
        payload = {
          keamAppNumber: formData.keamAppNumber,
          password: formData.password
        };
      }

      const res = await api.post(endpoint, payload);

      // Save token
      localStorage.setItem('token', res.data.token);

      if (isAdmin) {
        localStorage.setItem('admin', JSON.stringify(res.data.admin));
        navigate('/admin/dashboard');
      } else {
        localStorage.setItem('user', JSON.stringify(res.data.student));
        if (isRegister) {
          navigate('/apply');
        } else {
          navigate('/dashboard');
        }
      }

    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to server. Please make sure backend is running.');
      } else {
        setError(err.response.data?.message || 'Authentication failed.');
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
            <div className={`size-16 rounded-2xl flex items-center justify-center mb-4 ${
              isAdmin ? 'bg-gray-800 text-white' : 'bg-blue-100 text-blue-700'
            }`}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                {isAdmin ? 'admin_panel_settings' : isRegister ? 'person_add' : 'lock'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-gray-800 text-center">
              {isAdmin ? 'Admin Portal' : isRegister ? 'Create Account' : 'Student Login'}
            </h2>
            <p className="text-sm text-gray-500 mt-2 text-center">
              {isAdmin
                ? 'Access the institution administration desk'
                : 'GEC Wayanad Admission Management System'}
            </p>
          </div>

          {/* ── ERROR MESSAGE ── */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 flex items-start gap-3">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
              {error}
            </div>
          )}

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* KEAM Number or Username */}
            {!isAdmin ? (
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
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Admin Username
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    style={{ fontSize: '20px' }}>account_circle</span>
                  <input
                    type="text"
                    placeholder="Institution username"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  style={{ fontSize: '20px' }}>key</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 text-white ${
                isAdmin
                  ? 'bg-gray-800 hover:bg-black'
                  : 'bg-blue-700 hover:bg-blue-800'
              }`}
            >
              {loading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isAdmin ? 'Authenticate' : isRegister ? 'Register' : 'Login'}
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    arrow_forward
                  </span>
                </>
              )}
            </button>

          </form>

          {/* ── FOOTER TOGGLE ── */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            {!isAdmin ? (
              <p className="text-sm text-gray-500">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => navigate(isRegister ? '/login' : '/register')}
                  className="text-blue-700 font-bold hover:underline"
                >
                  {isRegister ? 'Sign In' : 'Create One'}
                </button>
              </p>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-blue-700 font-bold hover:underline"
              >
                Back to Student Portal
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;