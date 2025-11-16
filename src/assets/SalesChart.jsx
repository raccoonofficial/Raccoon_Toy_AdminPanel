import React, { useMemo } from 'react';

const SAMPLE_MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const SAMPLE_VALUES = [5000, 12000, 19000, 16000, 20000, 17000, 9500, 13000, 12000, 13000, 4000, 14000];

function SalesChart({
  title = 'Sales',
  months = [],
  values = [],
  yMax,
  tickStep,
  desiredTickCount = 6,
  height = 260,
  barColorFrom = '#fb923c', // Light Orange
  barColorTo = '#f97316',   // Main Orange
  trackColor = 'rgba(249, 115, 22, 0.1)',
  forceSample = false,
}) {
  // Sanitize incoming data
  const safeMonths = Array.isArray(months) ? months : [];
  const safeValues = Array.isArray(values) ? values : [];
  const numericValues = safeValues.map(v => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : 0;
  });

  const lengthsMatch = safeMonths.length === numericValues.length && safeMonths.length > 0;
  const allZero = numericValues.length > 0 && numericValues.every(v => v === 0);

  const useFallback = forceSample || !lengthsMatch || allZero;
  const finalMonths = useFallback ? SAMPLE_MONTHS : safeMonths;
  const finalValues = useFallback ? SAMPLE_VALUES : numericValues;

  const rawMax = Math.max(...finalValues, 1);

  // Axis max logic (simplified)
  const computedMax = useMemo(() => {
    if (yMax && yMax > 0) return yMax;
    const expanded = rawMax * 1.05;
    return Math.ceil(expanded / 5000) * 5000;
  }, [rawMax, yMax]);

  // Tick step logic
  const effectiveTick = useMemo(() => {
    if (tickStep && tickStep > 0) return tickStep;
    return Math.max(Math.ceil(computedMax / desiredTickCount / 5000) * 5000, 5000);
  }, [computedMax, tickStep, desiredTickCount]);

  // Build ticks
  const ticks = useMemo(() => {
    const arr = [];
    for (let v = 0; v <= computedMax; v += effectiveTick) arr.push(v);
    if (arr[arr.length - 1] !== computedMax) arr.push(computedMax);
    return arr;
  }, [computedMax, effectiveTick]);

  const formatTick = (n) => (n === 0 ? '0' : `${n / 1000}k`);

  return (
    <div
      className="sales-chart-card"
      style={{
        '--chart-height': `${height}px`,
        '--bar-color-from': barColorFrom,
        '--bar-color-to': barColorTo,
        '--track-color': trackColor
      }}
    >
      <div className="chart-header">
        <h3>{title}</h3>
        <select aria-label="Timescale selector" defaultValue="Month">
          <option>Month</option>
          <option>Year</option>
        </select>
      </div>

      <div className="chart-divider" />

      <div className="chart-shell">
        {/* Y Axis */}
        <div className="chart-y-axis" aria-hidden="true">
          {ticks.map(t => {
            const pct = (t / computedMax) * 100;
            return (
              <div key={t} className="chart-y-tick" style={{ bottom: `${pct}%` }}>
                <span>{formatTick(t)}</span>
              </div>
            );
          })}
        </div>

        {/* Plot */}
        <div
          className="chart-plot"
          role="img"
          aria-label={`${title} bar chart 0 to ${computedMax}${useFallback ? ' sample data' : ''}`}
        >
          <div className="chart-baseline" />
          <div className="chart-bars-row">
            {finalMonths.map((label, i) => {
              const val = finalValues[i] ?? 0;
              const hPct = Math.min(100, (val / computedMax) * 100);
              return (
                <div className="chart-bar-group" key={label}>
                  <div className="chart-bar-track">
                    <div
                      className="chart-bar-fill"
                      style={{
                        height: `${hPct}%`,
                        animationDelay: `${i * 55}ms`
                      }}
                      title={`${label}: ${val.toLocaleString()}`}
                      aria-label={`${label} ${val}`}
                    />
                  </div>
                  <span className="chart-bar-label">{label}</span>
                </div>
                
              );
            })}
            
          </div>
          
        </div>
      </div>

     
    </div>
  );
}

export default SalesChart;