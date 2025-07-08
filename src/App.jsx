import { useState } from 'react';
import SocialSecurityStrategyPage from './SocialSecurityStrategyPage.jsx';
import TspStrategyPage from './TspStrategyPage.jsx';
import ResultsSummaryPage from './ResultsSummaryPage.jsx';

export default function App() {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({});

  if (page === 1) {
    return (
      <div>
        <h1>Federal Benefits Calculator</h1>
        <p>Basic Info Page Coming Soon</p>
        <button onClick={() => setPage(2)}>Go to SS Strategy</button>
      </div>
    );
  }

  if (page === 2) {
    return <SocialSecurityStrategyPage formData={formData} setPage={setPage} />;
  }

  if (page === 3) {
    return <TspStrategyPage formData={formData} setPage={setPage} />;
  }

  if (page === 4) {
    return <ResultsSummaryPage formData={formData} />;
  }

  return null;
}
