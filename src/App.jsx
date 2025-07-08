import { useState } from 'react';
import SocialSecurityStrategyPage from './SocialSecurityStrategyPage';
import TspStrategyPage from './TspStrategyPage';
import ResultsSummaryPage from './ResultsSummaryPage';

export default function App() {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    maritalStatus: '',
    basePay: '',
    currentRetirementSystem: '',
    yearsOfService: '',
    survivorBenefit: '',
    spouseName: '',
    spouseDob: '',
    priorMilitaryService: 'no',
    priorMilitaryYears: '',
    priorMilitaryBuyback: 'no',
    vaDisability: false,
    vaDisabilityRating: '',
    vaPermanentTotal: false,
    accruedAnnualLeave: '',
    accruedSickLeave: '',
    courtOrder: false,
    specialSupplement: true,
    socialSecurityAnnuity: '',
    claimAge: '62',
    wepApplied: false,
    tspInterestAreas: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue
    }));
  };

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
                <input name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium">Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium">Marital Status</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded shadow-sm">
                  <option value="">Select</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Current Base Pay</label>
                <input name="basePay" value={formData.basePay} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium">Current Retirement System</label>
                <select name="currentRetirementSystem" value={formData.currentRetirementSystem} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded shadow-sm">
                  <option value="">Select</option>
                  <option value="csrs">CSRS</option>
                  <option value="fers">FERS</option>
                  <option value="active-duty-military">Active Duty Military Service</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Credible Years of Service</label>
                <input name="yearsOfService" value={formData.yearsOfService} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium">Special Supplement Eligible?</label>
                <input type="checkbox" name="specialSupplement" checked={formData.specialSupplement} onChange={handleChange} className="mt-2 h-5 w-5" />
              </div>
              <div>
                <label className="block text-sm font-medium">Survivor Benefit Selection</label>
                <select name="survivorBenefit" value={formData.survivorBenefit} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded shadow-sm">
                  <option value="">None</option>
                  <option value="min">Minimum (5%) - 25% payout</option>
                  <option value="max">Maximum (10%) - 50% payout</option>
                </select>
              </div>
            </div>
          </section>

          {/* Spouse Info */}
          {(formData.maritalStatus === 'married' || formData.maritalStatus === 'divorced') && (
            <section>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Spouse Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Spouse Full Name</label>
                  <input name="spouseName" value={formData.spouseName} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Spouse DOB</label>
                  <input type="date" name="spouseDob" value={formData.spouseDob} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
                </div>
              </div>
            </section>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={() => setPage(2)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Continue to Social Security Strategy →
          </button>
        </form>
      </div>
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
