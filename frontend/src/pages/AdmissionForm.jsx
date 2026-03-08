import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdmissionForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // ── ALL FORM DATA ──
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    // Step 2: Guardian
    guardianName: '',
    relation: '',
    guardianPhone: '',
    // Step 3: Academic
    keamRank: '',
    keamRollNo: '',
    plusTwoMarks: '',
    schoolName: '',
    // Step 4: Category
    category: 'General',
    branch: 'CSE',
    income: '',
    reservation: 'None'
  });

  // Step config
  const steps = [
    { id: 1, title: 'Personal',  icon: 'person' },
    { id: 2, title: 'Guardian',  icon: 'family_restroom' },
    { id: 3, title: 'Academic',  icon: 'school' },
    { id: 4, title: 'Category',  icon: 'fact_check' }
  ];

  // ── HANDLERS ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        personalDetails: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          address: formData.address,
        },
        guardianDetails: {
          name: formData.guardianName,
          relation: formData.relation,
          phone: formData.guardianPhone,
        },
        academicDetails: {
          keamRank: formData.keamRank,
          keamRollNo: formData.keamRollNo,
          plusTwoMarks: formData.plusTwoMarks,
          schoolName: formData.schoolName,
        },
        category: formData.category,
        branch: formData.branch
      };

      await api.put('/student/update', payload);
      navigate('/upload');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── INPUT COMPONENT (reusable) ──
  const Input = ({ label, name, type = 'text', placeholder }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />
    </div>
  );

  // ── RENDER EACH STEP ──
  const renderStep = () => {
    switch (step) {

      // ── STEP 1: PERSONAL ──
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" name="fullName" placeholder="As per SSLC" />
            <Input label="Email" name="email" type="email" placeholder="yourname@example.com" />
            <Input label="Date of Birth" name="dob" type="date" />
            <Input label="Mobile Number" name="phone" type="tel" placeholder="10-digit number" />
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Permanent Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                required
              />
            </div>
          </div>
        );

      // ── STEP 2: GUARDIAN ──
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Guardian Name" name="guardianName" placeholder="Full name" />
            <Input label="Relation" name="relation" placeholder="e.g. Father, Mother" />
            <Input label="Guardian Mobile" name="guardianPhone" type="tel" placeholder="10-digit number" />
          </div>
        );

      // ── STEP 3: ACADEMIC ──
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="KEAM Rank" name="keamRank" type="number" placeholder="Your KEAM rank" />
            <Input label="KEAM Roll Number" name="keamRollNo" placeholder="Roll number" />
            <Input label="Plus Two Marks (%)" name="plusTwoMarks" type="number" placeholder="e.g. 85" />
            <Input label="Previous School Name" name="schoolName" placeholder="School name" />
          </div>
        );

      // ── STEP 4: CATEGORY ──
      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="General">General</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OEC">OEC</option>
                <option value="SEBC">SEBC (OBC)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Allotted Branch</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="CSE">Computer Science & Engineering</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="EEE">Electrical & Electronics</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="CE">Civil Engineering</option>
              </select>
            </div>

            <Input label="Annual Family Income" name="income" type="number" placeholder="As per income certificate" />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Other Reservations</label>
              <select
                name="reservation"
                value={formData.reservation}
                onChange={handleChange}
                className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="None">None</option>
                <option value="PH">Physically Challenged</option>
                <option value="Ex-Servicemen">Ex-Servicemen Dependent</option>
                <option value="NCC">NCC / Sports Quota</option>
              </select>
            </div>

            {/* Info box */}
            <div className="md:col-span-2 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-xs text-blue-700 font-medium flex gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>info</span>
                Ensure all details match your uploaded certificates. Inaccurate data may lead to admission cancellation.
              </p>
            </div>

          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">

        {/* ── PROGRESS TRACKER ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
            {steps.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2 min-w-[80px]">
                  <div className={`size-12 rounded-full flex items-center justify-center transition-all ${
                    step >= s.id
                      ? 'bg-blue-700 text-white shadow-lg'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                  }`}>
                    <span className="material-symbols-outlined">
                      {step > s.id ? 'check' : s.icon}
                    </span>
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    step >= s.id ? 'text-blue-700' : 'text-gray-400'
                  }`}>{s.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full ${
                    step > s.id ? 'bg-blue-700' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-800">Admission Application Form</h1>
            <p className="text-gray-500 mt-1">Academic Year 2026-27 — GECW Admission Cell</p>
          </div>
        </div>

        {/* ── FORM CARD ── */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-12">

            {renderStep()}

            {/* ── NAVIGATION BUTTONS ── */}
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-100">

              {/* Back Button */}
              <button
                onClick={prevStep}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  step === 1
                    ? 'opacity-0 cursor-default'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                disabled={step === 1}
              >
                <span className="material-symbols-outlined">west</span>
                Back
              </button>

              {/* Next or Submit */}
              {step < 4 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg"
                >
                  Continue
                  <span className="material-symbols-outlined">east</span>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 bg-green-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg"
                >
                  {loading ? 'Saving...' : 'Submit Application'}
                  {!loading && <span className="material-symbols-outlined">check_circle</span>}
                </button>
              )}

            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Need help? Contact college office at{' '}
          <span className="font-bold text-blue-700">04935 271 261</span>
        </div>

      </div>
    </div>
  );
};

export default AdmissionForm;