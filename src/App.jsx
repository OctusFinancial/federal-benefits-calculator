import { useState } from 'react';
import SocialSecurityStrategyPage from './SocialSecurityStrategyPage';
import TspStrategyPage from './TspStrategyPage';
import ResultsSummaryPage from './ResultsSummaryPage';

export default function App() {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({});

  if (page === 1) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
        <h1 className="text-4xl font-bold mb-6">Federal Employee Benefits Calculator</h1>
        <form className="bg-white shadow-md rounded p-6 space-y-6 max-w-3xl mx-auto">
          {/* Basic Info */}
          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input name="name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input name="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium">Date of Birth</label>
                <input type="date" name="dob" value={formData.dob || ''} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium">Marital Status</label>
                <select name="maritalStatus" value={formData.maritalStatus || ''} onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})} className="mt-1 block w-full border-gray-300 rounded shadow-sm">
                  <option value="">Select</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Current Base Pay</label>
                <input name="basePay" value={formData.basePay || ''} onChange={(e) => setFormData({...formData, basePay: e.target.value})} className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium">Current Retirement System</label>
                <select name="currentRetirementSystem" value={formData.currentRetirementSystem || ''} onChange={(e) => setFormData({...formData, currentRetirementSystem: e.target.value})} className="mt-1 block w-full border-gray-300 rounded shadow-sm">
                  <option value="">Select</option>
                  <option value="csrs">CSRS</option>
                  <option value="fers">FERS</option>
                  <option value="active-duty-military">Active Duty Military Service</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPage(2)}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Continue to Social Security Strategy →
            </button>
          </form>
        </div>
      </section>
    );
  }

  if (page === 2) {
    return <SocialSecurityStrategyPage formData={formData} setFormData={setFormData} setPage={setPage} />;
  }

  if (page === 3) {
    return <TspStrategyPage formData={formData} setFormData={setFormData} setPage={setPage} />;
  }

  if (page === 4) {
    return <ResultsSummaryPage formData={formData} />;
  }

  return null;
}
