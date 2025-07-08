import { useState } from 'react';

export default function SocialSecurityStrategyPage({ formData, setFormData, setPage }) {
  const [ssData, setSSData] = useState({
    claimAge: formData.claimAge || '62',
    estimatedMonthlySS: formData.estimatedMonthlySS || '',
    wepApplied: formData.wepApplied || false,
    srsEligible: formData.srsEligible || true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setSSData((prev) => ({
      ...prev,
      [name]: newValue
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: newValue
    }));
  };

  const calculateAgeFromDob = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const userAge = calculateAgeFromDob(formData.dob);
  const futureYears = Array.from({ length: 40 }, (_, i) => userAge + i);

  const getMonthlyPayout = (claimAge, baseSS, wep, gpo) => {
    let factor = 1;

    switch (claimAge) {
      case '62': factor = 0.7; break;
      case '67': factor = 1.0; break;
      case '70': factor = 1.24; break;
      default: factor = 1.0;
    }

    if (wep) factor *= 0.85;
    if (gpo) factor *= 0.66;

    return Math.round(baseSS * factor);
  };

  const calculateCumulativeByAge = (claimAge, baseSS, wep, gpo) => {
    const monthly = getMonthlyPayout(claimAge, baseSS, wep, gpo);
    const startYear = parseInt(claimAge);
    const cumulative = [];

    for (let i = 0; i <= 40; i++) {
      const age = userAge + i;
      const months = age >= startYear ? (age - startYear) * 12 : 0;
      cumulative.push(monthly * months);
    }

    return cumulative;
  };

  const data62 = calculateCumulativeByAge('62', ssData.estimatedMonthlySS, ssData.wepApplied, false);
  const data67 = calculateCumulativeByAge('67', ssData.estimatedMonthlySS, ssData.wepApplied, false);
  const data70 = calculateCumulativeByAge('70', ssData.estimatedMonthlySS, ssData.wepApplied, false);

  const formatMoney = (value) => `$${Math.round(value).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <h1 className="text-4xl font-bold mb-6">Social Security Strategy Tool</h1>

      <form className="bg-white shadow-md rounded p-6 space-y-6 max-w-3xl mx-auto">
        {/* Estimated SS Benefit */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Your Social Security Estimate</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Estimated Monthly Benefit at Age 62 or Current Age</label>
              <input
                type="number"
                name="estimatedMonthlySS"
                value={ssData.estimatedMonthlySS}
                onChange={handleChange}
                placeholder="$1,500"
                className="mt-1 block w-full border-gray-300 rounded shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">When do you plan to claim?</label>
              <select
                name="claimAge"
                value={ssData.claimAge}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded shadow-sm"
              >
                <option value="62">62</option>
                <option value="67">67 (Full Retirement Age)</option>
                <option value="70">70</option>
              </select>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="wepApplied"
                checked={ssData.wepApplied}
                onChange={handleChange}
                id="wepApplied"
                className="h-5 w-5 text-blue-600"
              />
              <label htmlFor="wepApplied" className="ml-2 block text-sm font-medium">
                Apply Windfall Elimination Provision (WEP)?
              </label>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="srsEligible"
                checked={ssData.srsEligible}
                onChange={handleChange}
                id="srsEligible"
                className="h-5 w-5 text-blue-600"
              />
              <label htmlFor="srsEligible" className="ml-2 block text-sm font-medium">
                Eligible for Special Retirement Supplement (SRS)?
              </label>
            </div>
          </div>
        </section>

        {/* Strategy Table */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Claiming Strategy Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Claiming Age</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Monthly Benefit</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Total by Age 85</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Break-Even Age</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap">62</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatMoney(getMonthlyPayout('62', ssData.estimatedMonthlySS, ssData.wepApplied, false))}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatMoney(data62[23])}</td>
                  <td className="px-4 py-2 whitespace-nowrap">~80</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap">67</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatMoney(getMonthlyPayout('67', ssData.estimatedMonthlySS, ssData.wepApplied, false))}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatMoney(data67[18])}</td>
                  <td className="px-4 py-2 whitespace-nowrap">~83</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap">70</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatMoney(getMonthlyPayout('70', ssData.estimatedMonthlySS, ssData.wepApplied, false))}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatMoney(data70[15])}</td>
                  <td className="px-4 py-2 whitespace-nowrap">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Cumulative Chart */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Projected Cumulative Benefits</h2>
          <p className="mb-4 text-sm text-gray-600">See how benefits grow over time based on claiming age.</p>
          <div className="mt-6 h-64 flex justify-center relative overflow-x-auto">
            <svg width="100%" height="100%" viewBox="0 0 800 240" className="overflow-visible">
              {/* X Axis */}
              <line x1="50" y1="200" x2="780" y2="200" stroke="#ccc" strokeWidth="1" />
              {futureYears.map((year, i) => (
                <text key={i} x={50 + i * 16} y="215" fontSize="10" textAnchor="middle" fill="#555">
                  {year}
                </text>
              ))}

              {/* Y Axis */}
              <line x1="50" y1="200" x2="50" y2="20" stroke="#ccc" strokeWidth="1" />

              {/* Lines */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                points={data62.map((d, i) => `${50 + i * 16},${200 - d / 200}`).join(' ')}
              />
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                points={data67.map((d, i) => `${50 + i * 16},${200 - d / 200}`).join(' ')}
              />
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                points={data70.map((d, i) => `${50 + i * 16},${200 - d / 200}`).join(' ')}
              />

              {/* Dots */}
              {data62.map((d, i) => (
                <circle key={`dot62-${i}`} cx={50 + i * 16} cy={200 - d / 200} r="2.5" fill="#3b82f6" />
              ))}
              {data67.map((d, i) => (
                <circle key={`dot67-${i}`} cx={50 + i * 16} cy={200 - d / 200} r="2.5" fill="#10b981" />
              ))}
              {data70.map((d, i) => (
                <circle key={`dot70-${i}`} cx={50 + i * 16} cy={200 - d / 200} r="2.5" fill="#f59e0b" />
              ))}

              {/* Legend */}
              <g transform="translate(600, 10)">
                <rect x="0" y="0" width="10" height="10" fill="#3b82f6" />
                <text x="15" y="10" fontSize="12" fill="#333">Claim at 62</text>
                <rect x="0" y="15" width="10" height="10" fill="#10b981" />
                <text x="15" y="25" fontSize="12" fill="#333">Claim at FRA</text>
                <rect x="0" y="30" width="10" height="10" fill="#f59e0b" />
                <text x="15" y="40" fontSize="12" fill="#333">Claim at 70</text>
              </g>
            </svg>
          </div>
        </section>

        {/* Earnings Test */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Earnings Test</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="workWhileCollectingSS"
                checked={formData.workWhileCollectingSS}
                onChange={(e) => handleChange({ target: { name: e.target.name, value: e.target.checked, type: 'checkbox' }}}
                id="workWhileCollectingSS"
                className="h-5 w-5 text-blue-600"
              />
              <label htmlFor="workWhileCollectingSS" className="ml-2 block text-sm font-medium">
                Will you continue working after you start collecting SS?
              </label>
            </div>
            {formData.workWhileCollectingSS && (
              <div className="pl-4 space-y-4 mt-2">
                <div>
                  <label className="block text-sm font-medium">Expected Annual Income</label>
                  <input
                    type="number"
                    name="expectedEarnings"
                    value={formData.expectedEarnings || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                  />
                </div>
                <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-200">
                  <p><strong>Earnings Test:</strong> In 2024, if you earn more than $21,240/year before FRA, you lose $1 of SS for every $2 earned above limit.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Spousal Strategy */}
        {(formData.maritalStatus === 'married' || formData.maritalStatus === 'divorced') && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Spousal Benefit Strategy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Was your marriage 10+ years long?</label>
                <select
                  name="spouseMarriageLength"
                  value={formData.spouseMarriageLength || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              {formData.spouseMarriageLength === 'yes' && (
                <div className="text-sm text-gray-600 bg-green-50 p-3 rounded border border-green-200">
                  <p>You qualify for spousal benefits even after divorce, as long as you were married 10+ years and are not remarried before 60.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => setPage(1)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            ← Go Back
          </button>
          <button
            type="button"
            onClick={() => setPage(3)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Continue to TSP Strategy →
          </button>
        </div>
      </form>
    </div>
  );
}
