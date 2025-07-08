export default function ResultsSummaryPage({ formData }) {
  const federalPension = () => {
    const basePay = parseFloat(formData.basePay) || 0;
    const yearsOfService = parseFloat(formData.yearsOfService) || 0;
    const system = formData.currentRetirementSystem;

    let multiplier = 1.0;
    if (system === 'fers') {
      multiplier = 0.01;
    } else if (system === 'csrs') {
      multiplier = 0.015;
    }

    const pension = basePay * yearsOfService * multiplier;
    return Math.round(pension / 12);
  };

  const socialSecurity = () => {
    const baseSS = parseFloat(formData.estimatedMonthlySS) || 0;
    const claimAge = parseInt(formData.claimAge) || 62;

    let factor = 1;
    switch (claimAge) {
      case 62: factor = 0.7; break;
      case 67: factor = 1.0; break;
      case 70: factor = 1.24; break;
    }

    if (formData.wepApplied) factor *= 0.85;

    return Math.round(baseSS * factor);
  };

  const tspGrowth = () => {
    const initialBalance = parseFloat(formData.portfolioBalance) || 100000;
    const annualReturn = parseFloat(formData.expectedReturn) || 7;
    const yearsToRetire = parseInt(formData.retireAge) - parseInt(formData.currentAge || 45);
    return Math.round(initialBalance * Math.pow(1 + annualReturn / 100, yearsToRetire));
  };

  const formatMoney = (value) => `$${Math.round(value).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <h1 className="text-4xl font-bold mb-6">Your Federal Benefits Summary</h1>

      <div className="bg-white shadow-md rounded p-6 space-y-6 max-w-3xl mx-auto">
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Federal Pension Estimate</h2>
          <p className="mb-2"><strong>Base Pay:</strong> {formatMoney(formData.basePay)}</p>
          <p className="mb-2"><strong>Years of Service:</strong> {formData.yearsOfService}</p>
          <p className="mb-2"><strong>Estimated Monthly Pension:</strong> {formatMoney(federalPension())}</p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Social Security Strategy</h2>
          <p className="mb-2"><strong>Claiming Age:</strong> {formData.claimAge}</p>
          <p className="mb-2"><strong>Estimated SS Benefit:</strong> {formatMoney(socialSecurity())}</p>
          <p className="mb-2"><strong>WEP Applied:</strong> {formData.wepApplied ? 'Yes' : 'No'}</p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">TSP Growth Simulation</h2>
          <p className="mb-2"><strong>Current Balance:</strong> {formatMoney(formData.portfolioBalance)}</p>
          <p className="mb-2"><strong>Expected Return:</strong> {formData.expectedReturn}%</p>
          <p className="mb-2"><strong>Projected at Retirement:</strong> {formatMoney(tspGrowth())}</p>
          <p className="mb-2"><strong>Tax Bracket Now:</strong> {formData.estimatedTaxBracket}%</p>
        </section>

        {/* TSP Enhancement Interests */}
        {formData.tspInterestAreas.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">TSP Enhancement Areas</h2>
            <ul className="list-disc ml-5">
              {formData.tspInterestAreas.includes('accumulation') && <li>Accumulation & Growth</li>}
              {formData.tspInterestAreas.includes('lifetime-income') && <li>Guaranteed Lifetime Income</li>}
              {formData.tspInterestAreas.includes('legacy') && <li>Legacy Planning</li>}
              {formData.tspInterestAreas.includes('ltc') && <li>Long-Term Care Riders</li>}
              {formData.tspInterestAreas.includes('other') && <li>Other</li>}
            </ul>
          </section>
        )}

        {/* Spousal Strategy */}
        {(formData.maritalStatus === 'married' || formData.maritalStatus === 'divorced') && formData.spouseMarriageLength === 'yes' && (
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Spousal Benefit Strategy</h2>
            <p className="mb-2"><strong>Spouse Name:</strong> {formData.spouseName}</p>
            <p className="mb-2"><strong>Spouse DOB:</strong> {formData.spouseDob}</p>
            <p className="mb-2"><strong>Eligible for Spousal SS:</strong> Yes</p>
          </section>
        )}

        {/* Earnings Test */}
        {formData.workWhileCollectingSS && (
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Earnings Test</h2>
            <p><strong>Working after SS start:</strong> Yes</p>
            <p><strong>Expected Annual Income:</strong> {formatMoney(formData.expectedEarnings)}</p>
          </section>
        )}

        {/* Submit Button */}
        <div className="mt-8 flex justify-between gap-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Download as PDF
          </button>
          <button
            type="button"
            onClick={() => alert('This will send the form data via EmailJS')}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Send Summary to Client
          </button>
        </div>
      </div>
    </div>
  );
}
