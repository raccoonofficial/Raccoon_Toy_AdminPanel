import React, { useMemo, useState, useEffect } from 'react';
import './Finance.css';

/**
 * Finance Page
 *
 * Fixes:
 * - Money Tracker editor now strictly fits inside the cell (min-width:0, max-width:100%, block).
 * - Cells are overflow:hidden to prevent any spillover.
 * - Editor styling is identical across Money Tracker and Cost Counter.
 */

const BASE_CURRENCY = 'BDT';
const FX_RATES = { USD: 110 };
const SALES_PROFIT_FACTOR_DEFAULT = 0.54;

/* Money Tracker sources + buckets */
const TRACKER_SOURCE_ROWS = [
  { key: 'bkash',     label: 'Bkash' },
  { key: 'cash',      label: 'Cash' },
  { key: 'card',      label: 'Card' },
  { key: 'steedfast', label: 'Steed Fast' },
  { key: 'moveon',    label: 'Moveon' }
];

/* Demo transactions */
const initialTransactions = [
  { member:'Badhon',  source:'cash',      bucket:'main',  currency:'BDT', amount:16000 },
  { member:'Badhon',  source:'card',      bucket:'main',  currency:'BDT', amount:200 },
  { member:'Badhon',  source:'steedfast', bucket:'main',  currency:'BDT', amount:0 },
  { member:'Badhon',  source:'bkash',     bucket:'main',  currency:'BDT', amount:0 },
  { member:'Badhon',  source:'moveon',    bucket:'main',  currency:'BDT', amount:0 },

  { member:'Mahin',   source:'steedfast', bucket:'main',  currency:'BDT', amount:250 },
  { member:'Mahin',   source:'cash',      bucket:'main',  currency:'BDT', amount:250 },
  { member:'Mahin',   source:'bkash',     bucket:'sales', currency:'BDT', amount:0 },
  { member:'Mahin',   source:'card',      bucket:'main',  currency:'USD', amount:20 },
  { member:'Mahin',   source:'moveon',    bucket:'main',  currency:'BDT', amount:60 },

  { member:'Samir',   source:'steedfast', bucket:'main',  currency:'BDT', amount:250 },
  { member:'Samir',   source:'cash',      bucket:'main',  currency:'BDT', amount:250 },
  { member:'Samir',   source:'bkash',     bucket:'sales', currency:'BDT', amount:0 },
  { member:'Samir',   source:'card',      bucket:'main',  currency:'USD', amount:20 },
  { member:'Samir',   source:'moveon',    bucket:'main',  currency:'BDT', amount:60 },

  { member:'Shamim',  source:'steedfast', bucket:'main',  currency:'BDT', amount:250 },
  { member:'Shamim',  source:'cash',      bucket:'main',  currency:'BDT', amount:250 },
  { member:'Shamim',  source:'bkash',     bucket:'sales', currency:'BDT', amount:0 },
  { member:'Shamim',  source:'card',      bucket:'main',  currency:'USD', amount:20 },
  { member:'Shamim',  source:'moveon',    bucket:'main',  currency:'BDT', amount:60 },
];

/* Cost Counter categories */
const initialCostCategories = [
  {
    key: 'marketing',
    label: 'Marketing',
    rows: [
      { item: 'Domain+Hosting', amount: 5300 },
      { item: 'Boost',          amount: 10000 }
    ]
  },
  {
    key: 'product',
    label: 'Product',
    rows: [
      { item: '1st Order',       amount: 10870 },
      { item: '1st Delivery',    amount: 9005 },
      { item: '1st Steed Fast',  amount: 210 },
      { item: '2nd Delivery',    amount: 785 },
      { item: '2nd Steed Fast',  amount: 80 }
    ]
  },
  {
    key: 'packaging',
    label: 'Packaging',
    rows: [
      { item: 'Card',    amount: 2400 },
      { item: 'Sticker', amount: 2300 },
      { item: 'Packet',  amount: 1500 }
    ]
  },
  {
    key: 'studio',
    label: 'Studio',
    rows: [
      { item: 'Light + others', amount: 2500 },
      { item: 'Extra',          amount: 1500 },
      { item: 'Small Light',    amount: 480 }
    ]
  },
  {
    key: 'others',
    label: 'Others',
    rows: [
      { item: '', amount: 30 }
    ]
  }
];

/* Helpers */
const toBase = (currency, amount) =>
  currency === BASE_CURRENCY ? amount : (FX_RATES[currency] || 1) * amount;

function formatMoney(v) {
  return `${Number(v || 0).toLocaleString()} TK`;
}

function aggregate(list){
  const pivot = {};
  const memberBucketTotals = {};
  const bucketTotals = {};
  for (const t of list){
    const { member, source, bucket, currency, amount } = t;
    pivot[member] ??= {};
    pivot[member][source] ??= {};
    pivot[member][source][bucket] ??= {};
    pivot[member][source][bucket][currency] =
      (pivot[member][source][bucket][currency] || 0) + amount;

    memberBucketTotals[member] ??= {};
    memberBucketTotals[member][bucket] ??= {};
    memberBucketTotals[member][bucket][currency] =
      (memberBucketTotals[member][bucket][currency] || 0) + amount;

    bucketTotals[bucket] ??= {};
    bucketTotals[bucket][currency] =
      (bucketTotals[bucket][currency] || 0) + amount;
  }
  return { pivot, memberBucketTotals, bucketTotals };
}

/* Inline editable value component (simple, consistent) */
function EditableValue({ value, onChange, type='number', disabled=false, format=(v)=>v }) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  useEffect(() => {
    if (!editing) setTemp(value);
  }, [value, editing]);

  const commit = () => {
    if (disabled) return setEditing(false);
    const val = type === 'number' ? Number(temp) : String(temp ?? '');
    if (type === 'number') {
      if (!Number.isNaN(val)) onChange(val);
    } else {
      onChange(val);
    }
    setEditing(false);
  };
  const onKeyDown = (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') {
      setTemp(value);
      setEditing(false);
    }
  };

  if (disabled) {
    return <span>{format(value)}</span>;
  }

  return editing ? (
    <input
      type={type === 'number' ? 'number' : 'text'}
      step={type === 'number' ? 'any' : undefined}
      className={`editable-input ${type === 'number' ? 'number' : 'text'}`}
      value={type === 'number' ? (temp ?? 0) : (temp ?? '')}
      onChange={e=>setTemp(type === 'number' ? e.target.value : e.target.value)}
      onBlur={commit}
      onKeyDown={onKeyDown}
      autoFocus
      title={`Previous: ${format(value)}`}
      placeholder={type === 'number' ? String(value ?? 0) : String(value ?? '')}
    />
  ) : (
    <span className="editable-value" onClick={()=>setEditing(true)} title="Click to edit">
      {format(value)}
    </span>
  );
}

export default function Finance() {
  /* State */
  const [tx, setTx] = useState(initialTransactions);
  const [costs, setCosts] = useState(initialCostCategories);
  const [profitOverride, setProfitOverride] = useState(null);
  const [salesProfitFactor] = useState(SALES_PROFIT_FACTOR_DEFAULT);

  /* Aggregations */
  const { pivot, memberBucketTotals, bucketTotals } = useMemo(
    ()=>aggregate(tx),
    [tx]
  );

  const members = useMemo(
    ()=> Object.keys(pivot).sort((a,b)=>a.localeCompare(b)),
    [pivot]
  );
  const filteredMembers = members; // no filter (show all)

  /* Helpers for tx manipulation */
  const setComboAmount = (member, sourceKey, bucketKey, newAmount) => {
    const amt = Math.max(0, Number(newAmount) || 0);
    setTx(prev => {
      const rest = prev.filter(t => !(t.member===member && t.source===sourceKey && t.bucket===bucketKey));
      return [...rest, { member, source: sourceKey, bucket: bucketKey, currency: BASE_CURRENCY, amount: amt }];
    });
  };

  /* Total Money logic (read-only) */
  const memberMainBase = (member) => {
    const mainObj = memberBucketTotals[member]?.main || {};
    return Object.entries(mainObj).reduce(
      (s,[cur,amt]) => s + toBase(cur, amt), 0
    );
  };

  const mainRows = [
    { label: 'Badhon',  value: memberMainBase('Badhon') },
    { label: 'Mahin',   value: memberMainBase('Mahin') },
    { label: 'Samir',   value: memberMainBase('Samir') },
    { label: 'Shamim',  value: memberMainBase('Shamim') },
  ];
  const mainTotal = mainRows.reduce((s,r)=>s + r.value,0);

  const salesTotal = Object.entries(bucketTotals.sales || {}).reduce(
    (s,[cur,amt]) => s + toBase(cur, amt), 0
  );
  const profitComputed = Math.round(salesTotal * salesProfitFactor);
  const profitTotal = profitOverride ?? profitComputed;
  const sellsRows = [
    { label: 'Basic',  value: salesTotal },
    { label: 'Profit', value: profitTotal }
  ];
  const sellsTotal = sellsRows.reduce((s,r)=>s + r.value, 0);

  /* Cost Counter dynamic rows & totals */
  const costRowCount = Math.max(...costs.map(c => c.rows.length));
  const categoryTotals = costs.map(c =>
    c.rows.reduce((s,r)=> s + (Number(r.amount)||0), 0)
  );
  const grandCost = categoryTotals.reduce((a,b)=>a+b,0);

  /* Money Tracker amounts */
  function getAmount(member, sourceKey, bucketKey){
    const obj = pivot[member]?.[sourceKey]?.[bucketKey] || {};
    return Object.entries(obj).reduce(
      (s,[cur,amt]) => s + toBase(cur, amt), 0
    );
  }

  /* Cost Counter: add a new row across all categories */
  const addCostRow = () => {
    setCosts(prev =>
      prev.map(cat => ({
        ...cat,
        rows: [...cat.rows, { item: '', amount: 0 }]
      }))
    );
  };

  return (
    <section className="finance-page">
      <h1 className="finance-title">Finance</h1>

      {/* Row: Total Money (narrow) + KPI Cards + Money Tracker */}
      <div className="finance-top-row">
        <div className="tm-card merged narrow">
          <h2 className="tm-title">Total Money</h2>
          <table className="tm-table merged narrow">
            <thead>
              <tr className="tm-group-row">
                <td colSpan={2} className="tm-section-head tm-main-head">Main</td>
                <td colSpan={2} className="tm-section-head tm-sells-head">Sales</td>
              </tr>
            </thead>
            <tbody>
              {Array.from({length: Math.max(mainRows.length, sellsRows.length)}).map((_,i)=>{
                const L = mainRows[i];
                const R = sellsRows[i];
                return (
                  <tr key={i}>
                    <td className="tm-left-label">{L?.label || ''}</td>
                    <td className="tm-left-val">{L ? formatMoney(L.value) : ''}</td>
                    <td className="tm-right-label">{R?.label || ''}</td>
                    <td className="tm-right-val">{R ? formatMoney(R.value) : ''}</td>
                  </tr>
                );
              })}
              <tr className="tm-total-row">
                <td className="tm-left-label total">Total :</td>
                <td className="tm-left-val total">{formatMoney(mainTotal)}</td>
                <td className="tm-right-label total">Total :</td>
                <td className="tm-right-val total">{formatMoney(sellsTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* KPI Info Cards */}
        <div className="info-cards">
          <div className="info-card" title="Main Total + Sales Basic">
            <div className="info-card-title">Base Total Money</div>
            <div className="info-card-value">{formatMoney(mainTotal + salesTotal)}</div>
          </div>
          <div className="info-card" title="Grand total of Cost Counter">
            <div className="info-card-title">Total Cost</div>
            <div className="info-card-value">{formatMoney(grandCost)}</div>
          </div>
          <div className="info-card" title="Profit">
            <div className="info-card-title">Total Profit</div>
            <div className="info-card-value">{formatMoney(profitTotal)}</div>
          </div>
        </div>

        <div className="finance-matrix-card slim-version inline">
          <h2 className="matrix-title small">Money Tracker</h2>
          <div className="mt-scroll">
            <table className="mt-table no-totals compact">
              <thead>
                <tr className="mt-row tier-1">
                  <th rowSpan={2} className="mt-source-col sticky-col">Source</th>
                  {filteredMembers.map(m => (
                    <th key={m} colSpan={2} className="mt-member-group">{m}</th>
                  ))}
                </tr>
                <tr className="mt-row tier-2">
                  {filteredMembers.map(m=>(
                    <React.Fragment key={'sub-'+m}>
                      <th className="mt-sub sales">Sales</th>
                      <th className="mt-sub main">Main</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRACKER_SOURCE_ROWS.map(src => (
                  <tr key={src.key} className="mt-row">
                    <td className="mt-source-label sticky-col">{src.label}</td>
                    {filteredMembers.map(m=>{
                      const salesAmt = getAmount(m, src.key, 'sales');
                      const mainAmt  = getAmount(m, src.key, 'main');
                      return (
                        <React.Fragment key={`${src.key}-${m}`}>
                          <td className="mt-cell sales">
                            <EditableValue
                              value={salesAmt}
                              onChange={(v)=>setComboAmount(m, src.key, 'sales', v)}
                              type="number"
                              format={formatMoney}
                            />
                          </td>
                          <td className="mt-cell main">
                            <EditableValue
                              value={mainAmt}
                              onChange={(v)=>setComboAmount(m, src.key, 'main', v)}
                              type="number"
                              format={formatMoney}
                            />
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cost Counter below full width */}
      <div className="cc-card full-width">
        <div className="cc-header">
          <h2 className="cc-title">Cost Counter</h2>
          <button type="button" className="cc-add-row-btn" onClick={addCostRow}>+ Add Row</button>
        </div>
        <table className="cc-table">
          <thead>
            <tr className="cc-cat-row">
              {costs.map(cat => (
                <th key={cat.key} colSpan={2} className={`cc-cat-head cat-${cat.key}`}>
                  {cat.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({length: costRowCount}).map((_,rowIdx)=>(
              <tr key={rowIdx}>
                {costs.map((cat, ci) => {
                  const entry = cat.rows[rowIdx];
                  const itemVal = entry?.item ?? '';
                  const amtVal = entry?.amount ?? 0;

                  return (
                    <React.Fragment key={cat.key + '-' + rowIdx}>
                      <td className={`cc-item-cell cat-${cat.key}`}>
                        <EditableValue
                          value={itemVal}
                          onChange={(v)=>{
                            setCosts(prev=>{
                              const copy = prev.map(c => ({...c, rows: c.rows.slice()}));
                              if (!copy[ci].rows[rowIdx]) copy[ci].rows[rowIdx] = { item:'', amount:0 };
                              copy[ci].rows[rowIdx].item = v;
                              return copy;
                            });
                          }}
                          type="text"
                          format={(v)=>String(v || '')}
                        />
                      </td>
                      <td className={`cc-amt-cell cat-${cat.key}`}>
                        <EditableValue
                          value={amtVal}
                          onChange={(v)=>{
                            setCosts(prev=>{
                              const copy = prev.map(c => ({...c, rows: c.rows.slice()}));
                              if (!copy[ci].rows[rowIdx]) copy[ci].rows[rowIdx] = { item:'', amount:0 };
                              copy[ci].rows[rowIdx].amount = Math.max(0, Number(v)||0);
                              return copy;
                            });
                          }}
                          type="number"
                          format={formatMoney}
                        />
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}
            {/* Per-category totals (locked) */}
            <tr className="cc-total-row">
              {costs.map((cat, i) => {
                const total = categoryTotals[i];
                return (
                  <React.Fragment key={cat.key + '-total'}>
                    <td className={`cc-item-cell total cat-${cat.key}`}>Total :</td>
                    <td className={`cc-amt-cell total cat-${cat.key}`}>{formatMoney(total)}</td>
                  </React.Fragment>
                );
              })}
            </tr>
            {/* Grand Total Cost Row (locked) */}
            <tr className="cc-grand-row">
              <td
                className="cc-grand-label"
                colSpan={costs.length * 2 - 1}
              >
                Total Cost :
              </td>
              <td className="cc-grand-value">{formatMoney(grandCost)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}