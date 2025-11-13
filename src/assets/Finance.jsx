import React, { useMemo, useState, useEffect } from 'react';
import { Plus, CircleDollarSign, Receipt, Landmark, LineChart, Save, RefreshCw, Trash2 } from 'lucide-react';
import './Finance.css';

/**
 * Finance Page
 * Redesigned for the modern black, orange, and white theme.
 * - All components are wrapped in a standardized `finance-card`.
 * - Tables are redesigned for a dark theme, using borders and accent colors instead of multiple bright backgrounds.
 * - Category color-coding is preserved using colored left borders.
 * - Editable inputs and buttons are styled to match the site-wide theme.
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

/* Demo Main Money Data */
const initialMainMoney = [
    { member: 'Badhon', solidCash: 16200, loan: 0,    lastUpdate: '2025-11-13T15:39:48Z' },
    { member: 'Mahin',  solidCash: 2760,  loan: 0,    lastUpdate: '2025-11-13T15:39:48Z' },
    { member: 'Samir',  solidCash: 2330,  loan: 300,  lastUpdate: '2025-11-13T15:39:48Z' },
    { member: 'Shamim', solidCash: 2760,  loan: 130,  lastUpdate: '2025-11-13T15:39:48Z' },
];

/* Demo Investment Data */
const initialInvestments = [
    { member: 'Badhon', amount: 0 },
    { member: 'Mahin',  amount: 0 },
    { member: 'Samir',  amount: 0 },
    { member: 'Shamim', amount: 0 },
];


/* Helpers */
const toBase = (currency, amount) =>
  currency === BASE_CURRENCY ? amount : (FX_RATES[currency] || 1) * amount;

function formatMoney(v) {
  return `${Number(v || 0).toLocaleString('en-IN')} TK`;
}

function formatLastUpdate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
        return '';
    }
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        }).replace(/,/, '');
    } catch (e) {
        return 'Invalid Date';
    }
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
function EditableValue({ value, onChange, type='number', disabled=false, format=(v)=>v, className='' }) {
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
    return <span className={className}>{format(value)}</span>;
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
    <button
      type="button"
      className={`editable-button ${className}`}
      onClick={()=>setEditing(true)}
      title="Click to edit"
      tabIndex={0}
    >
      {format(value) || (type === 'text' ? '...' : '0 TK')}
    </button>
  );
}

export default function Finance() {
  /* State */
  const [tx, setTx] = useState(initialTransactions);
  const [costs, setCosts] = useState(initialCostCategories);
  const [mainMoney, setMainMoney] = useState(initialMainMoney);
  const [investments, setInvestments] = useState(initialInvestments);
  const [moneyTrackerLastUpdate, setMoneyTrackerLastUpdate] = useState(new Date().toISOString());
  const [costCounterLastUpdate, setCostCounterLastUpdate] = useState(new Date().toISOString());

  /* Aggregations */
  const { pivot, bucketTotals } = useMemo(
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

  /* Total Money logic */
    const updateMainMoney = (member, field, value) => {
        setMainMoney(prev => prev.map(m =>
            m.member === member
                ? { ...m, [field]: value, lastUpdate: new Date().toISOString() }
                : m
        ));
    };

    const solidCashTotal = mainMoney.reduce((s, r) => s + r.solidCash, 0);
    const loanTotal = mainMoney.reduce((s, r) => s + r.loan, 0);
    const expectedTotal = solidCashTotal + loanTotal;
    const mainTotal = expectedTotal; // Use Expected Total for the info card

    const salesTotal = Object.entries(bucketTotals.sales || {}).reduce(
        (s, [cur, amt]) => s + toBase(cur, amt), 0
    );

  const profitComputed = Math.round(salesTotal * SALES_PROFIT_FACTOR_DEFAULT);
  const profitTotal = profitComputed; // Simplified, remove override for now
  const sellsRows = [
    { label: 'Basic',  value: salesTotal },
    { label: 'Profit', value: profitTotal }
  ];
  const sellsTotal = sellsRows.reduce((s,r)=>s + r.value, 0);

  /* Cost Counter dynamic rows & totals */
  const costRowCount = useMemo(() => Math.max(0, ...costs.map(c => c.rows.length)), [costs]);

  const categoryTotals = useMemo(() => costs.map(c =>
      c.rows.reduce((s, r) => s + (Number(r?.amount) || 0), 0)
  ), [costs]);

  const grandCost = useMemo(() => categoryTotals.reduce((a, b) => a + b, 0), [categoryTotals]);

    /* Investment logic */
    const updateInvestment = (member, value) => {
        setInvestments(prev => prev.map(inv =>
            inv.member === member
                ? { ...inv, amount: value }
                : inv
        ));
    };
    const totalMemberInvestment = investments.reduce((s, r) => s + r.amount, 0);

    const totalCapital = mainTotal + salesTotal;

  /* Money Tracker amounts */
  function getAmount(member, sourceKey, bucketKey){
    const obj = pivot[member]?.[sourceKey]?.[bucketKey] || {};
    return Object.entries(obj).reduce(
      (s,[cur,amt]) => s + toBase(cur, amt), 0
    );
  }

  /* Cost Counter: add/delete/update a row */
  const addCostRow = () => {
    setCosts(prev =>
      prev.map(cat => ({
        ...cat,
        rows: [...cat.rows, { item: '', amount: 0 }]
      }))
    );
    setCostCounterLastUpdate(new Date().toISOString());
  };

  const deleteCostRow = (rowIndex) => {
    setCosts(prev =>
      prev.map(cat => ({
        ...cat,
        rows: cat.rows.filter((_, idx) => idx !== rowIndex)
      }))
    );
    setCostCounterLastUpdate(new Date().toISOString());
  };

  const updateCostCell = (catIndex, rowIndex, field, value) => {
      setCosts(prev => {
          const newCosts = JSON.parse(JSON.stringify(prev));
          const category = newCosts[catIndex];
          // Ensure the row exists before trying to update it
          if (!category.rows[rowIndex]) {
              category.rows[rowIndex] = { item: '', amount: 0 };
          }
          category.rows[rowIndex][field] = value;
          return newCosts;
      });
  };

  const handleMoneyTrackerAction = () => {
      // In a real app, "Save" would POST data, and "Refresh" would GET it.
      // For this demo, we just update the timestamp.
      setMoneyTrackerLastUpdate(new Date().toISOString());
  }

  const handleCostCounterAction = () => {
      setCostCounterLastUpdate(new Date().toISOString());
  }

  return (
    <section className="finance-page">
      <h1 className="finance-page-title">Finance Overview</h1>

      <div className="info-cards-grid">
          <div className="finance-card info-card" title="Main Total + Sales Basic">
            <CircleDollarSign className="info-card-icon" />
            <div className="info-card-details">
              <div className="info-card-title">Total Capital</div>
              <div className="info-card-value">{formatMoney(totalCapital)}</div>
            </div>
          </div>
          <div className="finance-card info-card" title="Grand total of Cost Counter">
            <Receipt className="info-card-icon" />
            <div className="info-card-details">
              <div className="info-card-title">Total Cost</div>
              <div className="info-card-value">{formatMoney(grandCost)}</div>
            </div>
          </div>
          <div className="finance-card info-card" title="Total Investment">
            <Landmark className="info-card-icon" />
            <div className="info-card-details">
                <div className="info-card-title">Total Investment</div>
                <div className="info-card-value">{formatMoney(63000)}</div>
            </div>
          </div>
          <div className="finance-card info-card" title="Profit">
            <LineChart className="info-card-icon" />
            <div className="info-card-details">
              <div className="info-card-title">Total Profit</div>
              <div className="info-card-value accent">{formatMoney(profitTotal)}</div>
            </div>
          </div>
        </div>

      <div className="finance-grid">
        <div className="finance-card total-money-card">
          <h2 className="finance-card-title">Total Money</h2>
          <div className="total-money-content">
            <div className="main-money-section">
                <div className="tm-section-head tm-main-head">Main</div>
                <table className="tm-table">
                    <thead>
                        <tr>
                            <th className="tm-label">Member</th>
                            <th className="tm-value">Solid Cash</th>
                            <th className="tm-value">Loan</th>
                        </tr>
                    </thead>
                    <tbody>
                    {mainMoney.map((row) => (
                        <tr key={`main-${row.member}`}>
                            <td className="tm-label">
                                {row.member}
                                <span className="tm-last-updated">({formatLastUpdate(row.lastUpdate)})</span>
                            </td>
                            <td className="tm-value">
                                <EditableValue
                                    value={row.solidCash}
                                    onChange={(v) => updateMainMoney(row.member, 'solidCash', v)}
                                    format={formatMoney}
                                />
                            </td>
                            <td className="tm-value">
                                <EditableValue
                                    value={row.loan}
                                    onChange={(v) => updateMainMoney(row.member, 'loan', v)}
                                    format={formatMoney}
                                    className={row.loan > 0 ? "loan-value" : ""}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                        <tr className="tm-total-row">
                            <td></td>
                            <td className="tm-value total main-total">
                                <span className="tm-label total">Total :</span>
                                {formatMoney(solidCashTotal)}
                            </td>
                            <td className="tm-value total main-total">
                                <span className="tm-label total">Exp Total :</span>
                                {formatMoney(expectedTotal)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className="sales-info-box">
                <div className="tm-section-head tm-sales-head">Sales</div>
                <div className="sales-info-content">
                    {sellsRows.map((row, i) => (
                        <div className="sales-info-item" key={`sales-info-${i}`}>
                            <span className="tm-label">{row.label}</span>
                            <span className="tm-value">{formatMoney(row.value)}</span>
                        </div>
                    ))}
                </div>
                <div className="sales-info-total">
                    <span className="tm-label total">Total</span>
                    <span className="tm-value total sales-total">{formatMoney(sellsTotal)}</span>
                </div>
            </div>
          </div>
        </div>

        <div className="finance-card money-tracker-card">
            <div className="finance-card-header">
              <h2 className="finance-card-title">Money Tracker</h2>
              <div className="card-header-controls">
                <span className="last-updated-text">Last updated: {formatDateTime(moneyTrackerLastUpdate)}</span>
                <button type="button" className="finance-btn" onClick={handleMoneyTrackerAction} title="Save Changes">
                    <Save size={16} /> Save
                </button>
                <button type="button" className="finance-btn secondary" onClick={handleMoneyTrackerAction} title="Refresh Data">
                    <RefreshCw size={16} /> Refresh
                </button>
              </div>
            </div>
          <div className="mt-scroll">
            <table className="mt-table">
              <thead>
                <tr className="mt-row-tier-1">
                  <th rowSpan={2} className="mt-source-col sticky-col">Source</th>
                  {filteredMembers.map(m => (
                    <th key={m} colSpan={2} className="mt-member-group">{m}</th>
                  ))}
                </tr>
                <tr className="mt-row-tier-2">
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
                            <EditableValue value={salesAmt} onChange={(v)=>setComboAmount(m, src.key, 'sales', v)} type="number" format={formatMoney}/>
                          </td>
                          <td className="mt-cell main">
                            <EditableValue value={mainAmt} onChange={(v)=>setComboAmount(m, src.key, 'main', v)} type="number" format={formatMoney}/>
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

        <div className="finance-card cost-counter-card">
            <div className="finance-card-header">
              <h2 className="finance-card-title">Cost Counter</h2>
              <div className="card-header-controls">
                 <span className="last-updated-text">Last modified: {formatDateTime(costCounterLastUpdate)}</span>
                 <button type="button" className="finance-btn secondary" onClick={handleCostCounterAction} title="Refresh Data">
                    <RefreshCw size={16} /> Refresh
                 </button>
                 <button type="button" className="finance-btn" onClick={handleCostCounterAction} title="Save Changes">
                    <Save size={16} /> Save
                 </button>
                 <button type="button" className="finance-btn" onClick={addCostRow}>
                    <Plus size={16} /> Add Row
                 </button>
              </div>
            </div>
            <div className='cc-scroll'>
                <table className="cc-table">
                  <thead>
                    <tr className="cc-cat-row">
                      {costs.map(cat => (
                        <th key={cat.key} colSpan={2} className={`cc-cat-head`}>
                          {cat.label}
                        </th>
                      ))}
                      <th className="cc-action-col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({length: costRowCount}).map((_,rowIdx)=>(
                      <tr key={rowIdx}>
                        {costs.map((cat, ci) => {
                          const entry = cat.rows[rowIdx];
                          return (
                            <React.Fragment key={cat.key + '-' + rowIdx}>
                              <td className={`cc-item-cell cat-border-${cat.key}`}>
                                <EditableValue value={entry?.item ?? ''} onChange={(v) => updateCostCell(ci, rowIdx, 'item', v)} type="text" />
                              </td>
                              <td className={`cc-amt-cell cat-border-${cat.key}`}>
                                <EditableValue value={entry?.amount ?? 0} onChange={(v) => updateCostCell(ci, rowIdx, 'amount', v)} type="number" format={formatMoney} />
                              </td>
                            </React.Fragment>
                          );
                        })}
                        <td className="cc-action-cell">
                            <button type="button" className="finance-btn delete-btn" onClick={() => deleteCostRow(rowIdx)} title="Delete Row">
                                <Trash2 size={16} />
                            </button>
                        </td>
                      </tr>
                    ))}
                    {/* Per-category totals (locked) */}
                    <tr className="cc-total-row">
                      {costs.map((cat, i) => (
                        <React.Fragment key={cat.key + '-total'}>
                          <td className="cc-item-cell total">Total</td>
                          <td className="cc-amt-cell total">{formatMoney(categoryTotals[i])}</td>
                        </React.Fragment>
                      ))}
                      <td></td>
                    </tr>
                    {/* Grand Total Cost Row (locked) */}
                    <tr className="cc-grand-row">
                      <td className="cc-grand-label" colSpan={costs.length * 2}>
                        Total Cost
                      </td>
                      <td className="cc-grand-value">{formatMoney(grandCost)}</td>
                    </tr>
                  </tbody>
                </table>
            </div>
        </div>
      <div className="finance-card investment-card">
          <h2 className="finance-card-title">Member Investment</h2>
          <table className="tm-table">
              <thead>
                  <tr>
                      <th className="tm-label">Member</th>
                      <th className="tm-value">Amount</th>
                  </tr>
              </thead>
              <tbody>
              {investments.map((row) => (
                  <tr key={`investment-${row.member}`}>
                      <td className="tm-label">{row.member}</td>
                      <td className="tm-value">
                          <EditableValue
                              value={row.amount}
                              onChange={(v) => updateInvestment(row.member, v)}
                              format={formatMoney}
                          />
                      </td>
                  </tr>
              ))}
              </tbody>
              <tfoot>
                  <tr className="tm-total-row">
                      <td className="tm-label total">Total Investment</td>
                      <td className="tm-value total main-total">{formatMoney(totalMemberInvestment)}</td>
                  </tr>
              </tfoot>
          </table>
      </div>
      </div>
    </section>
  );
}