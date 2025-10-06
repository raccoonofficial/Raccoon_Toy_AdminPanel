import React from 'react';

// Sample data for the chart
const SAMPLE_DATA = [
  { month: 'Jan', sales: 12000 },
  { month: 'Feb', sales: 19000 },
  { month: 'Mar', sales: 15000 },
  { month: 'Apr', sales: 22000 },
  { month: 'May', sales: 18000 },
  { month: 'Jun', sales: 25000 },
];

const SalesChart = ({ data, forceSample = false }) => {
  // Use sample data if forceSample is true or if no data is provided
  const chartData = forceSample || !data || data.length === 0 ? SAMPLE_DATA : data;

  // Calculate max value for scaling
  const maxSales = Math.max(...chartData.map(item => item.sales));
  
  // Round up to nearest 5000 for nice tick marks
  const maxYValue = Math.ceil(maxSales / 5000) * 5000;
  
  // Generate Y-axis ticks (0, 5k, 10k, 15k, ...)
  const yTicks = [];
  for (let i = 0; i <= maxYValue; i += 5000) {
    yTicks.push(i);
  }

  // Format number to k format (e.g., 5000 -> 5k)
  const formatValue = (value) => {
    if (value === 0) return '0';
    return `${value / 1000}k`;
  };

  // Calculate bar height as percentage of max value
  const getBarHeight = (sales) => {
    return (sales / maxYValue) * 100;
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Sales Chart</h2>
      
      <div style={{ 
        display: 'flex', 
        height: '300px', 
        position: 'relative',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '4px'
      }}>
        {/* Y-axis */}
        <div style={{ 
          width: '50px', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingRight: '10px',
          borderRight: '2px solid #ddd'
        }}>
          {yTicks.reverse().map((tick, index) => (
            <div 
              key={index} 
              style={{ 
                fontSize: '12px', 
                color: '#666',
                textAlign: 'right'
              }}
            >
              {formatValue(tick)}
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div style={{ 
          flex: 1, 
          height: '100%', 
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          paddingLeft: '20px',
          borderBottom: '2px solid #ddd'
        }}>
          {chartData.map((item, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                maxWidth: '80px'
              }}
            >
              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  height: `${getBarHeight(item.sales)}%`,
                  backgroundColor: '#4CAF50',
                  borderRadius: '4px 4px 0 0',
                  marginBottom: '5px',
                  transition: 'height 0.3s ease',
                  position: 'relative'
                }}
                title={`${item.month}: $${item.sales.toLocaleString()}`}
              >
                {/* Value label on top of bar */}
                <div style={{
                  position: 'absolute',
                  top: '-25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '11px',
                  color: '#333',
                  whiteSpace: 'nowrap'
                }}>
                  {formatValue(item.sales)}
                </div>
              </div>
              
              {/* X-axis label */}
              <div style={{
                fontSize: '12px',
                color: '#666',
                marginTop: '5px'
              }}>
                {item.month}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      {forceSample && (
        <div style={{
          marginTop: '10px',
          fontSize: '12px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          * Showing sample data
        </div>
      )}
    </div>
  );
};

export default SalesChart;
