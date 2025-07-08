import { useState } from 'react';

export default function SocialSecurityStrategyPage({ formData, setFormData, setPage }) {
  const [ssData, setSSData] = useState({
    claimAge: formData.claimAge || '62',
    estimatedMonthlySS: formData.estimatedMonthlySS || '',
    wepApplied: formData.wepApplied || false,
    srsEligible: formData.srsEligible || true,

    // Spousal Strategy
    spouseName: formData.spouseName || '',
    spouseDob: formData.spouseDob || '',
    spouseClaimAge: formData.spouseClaimAge || '62',
    useSpousalMaxDelay: formData.useSpousalMaxDelay || false,

    // Dependents
    hasDependents: formData.hasDependents || false,
    numberOfDependents: formData.numberOfDependents || '',
    dependentsAges: formData.dependentsAges || [],

    // Disability
    receivingSsdi: formData.receivingSsdi || false,
    medicalRetirement: formData.medicalRetirement || false,

    // Tax Impact
    futureTaxBracket: formData.futureTaxBracket || 22
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

  const handleArrayChange = (index, e) => {
    const newAges = [...ssData.dependentsAges];
    newAges[index] = e.target.value;
    setSSData((prev) => ({ ...prev, dependentsAges: newAges }));
    setFormData((prev) => ({ ...prev, dependentsAges: newAges }));
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
  const spouseAge = calculateAgeFromDob(formData.spouseDob);

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
        {/* Your Social Security Estimate */}
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
          <div className="mt-4 text-sm text-gray-600">
            <a href="https://www.ssa.gov/OACT/quickcalc/index.html " target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
              Get an estimate from SSA Quick Calculator →
            </a>
          </div>
        </section>

        {/* Spousal Benefit Strategy */}
        {(formData.maritalStatus === 'married' || formData.maritalStatus === 'divorced') && (
          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Spousal Benefit Strategy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Spouse Full Name</label>
                <input
                  name="spouseName"
                  value={ssData.spouseName}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Spouse DOB</label>
                <input
                  type="date"
                  name="spouseDob"
                  value={ssData.spouseDob}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Spouse Claiming Age</label>
                <select
                  name="spouseClaimAge"
                  value={ssData.spouseClaimAge}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                >
                  <option value="62">62</option>
                  <option value="67">67 (FRA)</option>
                  <option value="70">70</option>
                </select>
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name="useSpousalMaxDelay"
                  checked={ssData.useSpousalMaxDelay}
                  onChange={handleChange}
                  id="useSpousalMaxDelay"
                  className="h-5 w-5 text-blue-600"
                />
                <label htmlFor="useSpousalMaxDelay" className="ml-2 block text-sm font-medium">
                  Use spousal benefit now and delay my own until 70
                </label>
              </div>
              {ssData.useSpousalMaxDelay && (
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
                  <p><strong>Note:</strong> If one passes first, the surviving spouse can receive the higher of the two benefits.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Earnings Test */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Earnings Test</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="workWhileCollectingSS"
                checked={formData.workWhileCollectingSS}
                onChange={handleChange}
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

        {/* Dependent Benefits */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Children / Dependents</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="hasDependents"
                checked={ssData.hasDependents}
                onChange={(e) => handleChange({ target: { name: 'hasDependents', value: e.target.checked, type: 'checkbox' } })}
                id="hasDependents"
                className="h-5 w-5 text-blue-600"
              />
              <label htmlFor="hasDependents" className="ml-2 block text-sm font-medium">
                Do you have any dependents under 18 or in school?
              </label>
            </div>
            {ssData.hasDependents && (
              <>
                <div>
                  <label className="block text-sm font-medium">Number of Dependents</label>
                  <input
                    type="number"
                    name="numberOfDependents"
                    value={ssData.numberOfDependents}
                    onChange={handleChange}
                    placeholder="1"
                    className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Dependent Ages</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {[...Array(parseInt(ssData.numberOfDependents) || 0)].map((_, i) => (
                      <input
                        key={i}
                        type="number"
                        name={`dependentAge${i}`}
                        value={ssData.dependentsAges[i] || ''}
                        onChange={(e) => handleArrayChange(i, e)}
                        placeholder="Age"
                        className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
                  <p><strong>Note:</strong> Children under 18 may be eligible for up to 50% of your SS benefit. Stops at 18 unless they're still in school (until 19), or disabled.</p>
                  <a href="https://www.ssa.gov/benefits/retired/types.html#tabpanel=tab1" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                    Learn more on SSA.gov →
                  </a>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Disability Considerations */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Disability Considerations</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="receivingSsdi"
                checked={ssData.receivingSsdi}
                onChange={handleChange}
                id="receivingSsdi"
                className="h-5 w-5 text-blue-600"
              />
              <label htmlFor="receivingSsdi" className="ml-2 block text-sm font-medium">
                Are you currently receiving SSDI?
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="medicalRetirement"
                checked={ssData.medicalRetirement}
                onChange={handleChange}
                id="medicalRetirement"
                className="h-5 w-5 text-blue-600"
              />
              <label htmlFor="medicalRetirement" className="ml-2 block text-sm font-medium">
                Are you considering medical retirement?
              </label>
            </div>
            {ssData.receivingSsdi && (
              <div className="text-sm text-gray-600 bg-red-50 p-3 rounded border border-red-200">
                <p><strong>Important:</strong> SSDI is NOT reduced by WEP or GPO. However, once you stop working and begin drawing regular SS, WEP/GPO will apply.</p>
              </div>
            )}
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

        {/* Tax Impact */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Tax Impact Analysis</h2>
          <p className="mb-4 text-sm text-gray-600">Compare projected taxes paid over time between account types.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Current Tax Bracket (%)</label>
              <input
                type="number"
                name="estimatedTaxBracket"
                value={formData.estimatedTaxBracket || 22}
                onChange={handleChange}
                placeholder="22"
                className="mt-1 block w-full border-gray-300 rounded shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Future Tax Bracket (%)</label>
              <input
                type="number"
                name="futureTaxBracket"
                value={formData.futureTaxBracket || 22}
                onChange={handleChange}
                placeholder="22"
                className="mt-1 block w-full border-gray-300 rounded shadow-sm"
              />
            </div>
          </div>
        </section>

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
