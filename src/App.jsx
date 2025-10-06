import React, { useState } from 'react';
import SalesChart from './components/SalesChart';

function App() {
  const [useSampleData, setUseSampleData] = useState(true);

  const customData = [
    { month: 'Q1', sales: 30000 },
    { month: 'Q2', sales: 35000 },
    { month: 'Q3', sales: 28000 },
    { month: 'Q4', sales: 42000 },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Admin Panel - Sales Dashboard</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="checkbox"
            checked={useSampleData}
            onChange={(e) => setUseSampleData(e.target.checked)}
          />
          {' '}Use Sample Data
        </label>
      </div>

      <SalesChart 
        data={useSampleData ? null : customData} 
        forceSample={useSampleData}
      />

      {!useSampleData && (
        <div style={{ marginTop: '20px' }}>
          <h3>Custom Data (Quarterly)</h3>
          <SalesChart data={customData} forceSample={false} />
        </div>
      )}
    </div>
  );
}

export default App;
