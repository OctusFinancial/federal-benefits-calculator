import { useState } from 'react';

export default function TspStrategyPage({ formData, setFormData, setPage }) {
  const [tspData, setTspData] = useState({
    portfolioBalance: formData.portfolioBalance || '',
    expectedReturn: formData.expectedReturn || 7,
    retireAge: formData.retireAge || 62,
    estimatedTaxBracket: formData.estimatedTaxBracket || 22,
    tspInterestAccumulation: formData.tspInterestAreas.includes('accumulation'),
    tspInterestLifetime: formData.tspInterestAreas.includes('lifetime-income'),
    tspInterestLegacy: formData.tspInterestAreas.includes('legacy'),
    tspInterestLTC: formData.tspInterestAreas.includes('ltc'),
    tspInterestOther: formData.tspInterestAreas.includes('other')
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setTspData((prev) => ({
      ...prev,
      [name]: newValue
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: newValue
    }));
  };

  const calculateTspGrowth = () => {
    const initialBalance = parseFloat(tspData.portfolioBalance) || 100000;
    const annualReturn = parseFloat(tspData.expectedReturn) || 7;
    const yearsToRetire = parseInt(tspData.retireAge) - parseInt(formData.currentAge || 45);
    return Math.round(initialBalance * Math.pow(1 + annualReturn / 100, yearsToRetire));
  };

  const projectedBalance = calculateTspGrowth();

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <h1 className="text-4xl font-bold mb-6">TSP Strategy Tool</h1>

      <form className="bg-white shadow-md rounded p-6 space-y-6 max-w-3xl mx-auto">
        {/* Current Portfolio Balance */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Your Thrift Savings Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Current Portfolio Balance</label>
              <input
                type="number"
                name="portfolioBalance"
                value={tspData.portfolioBalance}
                onChange={handleChange}
                placeholder="$100,000"
                className="mt-1 block w-full border-gray-300 rounded shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Expected Return (%)</label>
              <input
                type="number"
                name="expectedReturn"
                value={tspData.expectedReturn}
                onChange={handleChange}
                placeholder="7"
                className="mt-1 block w-full border-gray-300 rounded shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Retire Age</label>
              <input
                type="number"
                name="retireAge"
                value={tspData.retireAge}
                onChange={handleChange}
                placeholder="62"
                className="mt-1 block w-full border-gray-300 rounded shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Estimated Tax Bracket Now</label>
              <input
                type="number"
                name="estimatedTaxBracket"
                value={tspData.estimatedTaxBracket}
                onChange={handleChange}
                placeholder="22"
                className="mt-1 block w-full border-gray-300 rounded shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Enhancement Interests */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">TSP Enhancement Interests</h2>
          <p className="mb-4 text-sm text-gray-600">Choose the strategies you'd like to explore:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="tspInterestAccumulation"
                checked={tspData.tspInterestAccumulation}
                onChange={handleChange}
                id="tspInterestAccumulation"
                className="h-5 w-5 text-blue-600"
              />
              <span className="ml-2 block text-sm font-medium">Accumulation & Growth</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="tspInterestLifetime"
                checked={tspData.tspInterestLifetime}
                onChange={handleChange}
                id="tspInterestLifetime"
                className="h-5 w-5 text-blue-600"
              />
              <span className="ml-2 block text-sm font-medium">Guaranteed Lifetime Income</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="tspInterestLegacy"
                checked={tspData.tspInterestLegacy}
                onChange={handleChange}
                id="tspInterestLegacy"
                className="h-5 w-5 text-blue-600"
              />
              <span className="ml-2 block text-sm font-medium">Legacy Planning</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="tspInterestLTC"
                checked={tspData.tspInterestLTC}
                onChange={handleChange}
                id="tspInterestLTC"
                className="h-5 w-5 text-blue-600"
              />
              <span className="ml-2 block text-sm font-medium">Long-Term Care Options</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="tspInterestOther"
                checked={tspData.tspInterestOther}
                onChange={handleChange}
                id="tspInterestOther"
                className="h-5 w-5 text-blue-600"
              />
              <span className="ml-2 block text-sm font-medium">Other</span>
            </label>
          </div>
        </section>

        {/* Summary */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 bg-blue-50 p-2 rounded">Projected TSP Balance at Retirement</h2>
          <p className="mb-4 text-sm text-gray-600">Based on your inputs, here's what your TSP balance could look like:</p>
          <div className="bg-green-50 p-4 rounded shadow">
            <p className="text-lg font-medium">Projected TSP Balance at Retirement:</p>
            <p className="text-xl font-bold">${projectedBalance.toLocaleString()}</p>
          </div>
        </section>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => setPage(2)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            ← Go Back
          </button>
          <button
            type="button"
            onClick={() => setPage(4)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Continue to Results →
          </button>
        </div>
      </form>
    </div>
  );
}
