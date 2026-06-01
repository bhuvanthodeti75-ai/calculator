import React, { useState, useEffect } from 'react';
import { 
  Copy, Check, RotateCcw, Share2, 
  Shuffle, AlertCircle, RefreshCw 
} from 'lucide-react';
import { saveCalculation } from '../utils/bookmarks';

// --- HELPER FOR COPY/SHARE ---
function ActionRow({ onReset, onCopy, onShare, resultText }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    onShare();
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
      <button onClick={handleCopy} className="btn btn-primary" style={{ flex: 1, minWidth: '120px' }}>
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'Copied!' : 'Copy Result'}
      </button>
      <button onClick={handleShare} className="btn btn-secondary" style={{ flex: 1, minWidth: '120px' }}>
        {shared ? <Check size={16} /> : <Share2 size={16} />}
        {shared ? 'Link Copied!' : 'Share'}
      </button>
      {onReset && (
        <button onClick={onReset} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <RotateCcw size={16} />
          Reset
        </button>
      )}
    </div>
  );
}

// === 1. BASIC CALCULATOR ===
export function BasicCalculator() {
  const [display, setDisplay] = useState('');
  const [history, setHistory] = useState('');

  const handleKeyClick = (val) => {
    if (val === 'C') {
      setDisplay('');
      setHistory('');
    } else if (val === 'DEL') {
      setDisplay(display.slice(0, -1));
    } else if (val === '=') {
      try {
        // Safe evaluation
        const cleanExpr = display.replace(/x/g, '*');
        if (/^[0-9+\-*/.\s]+$/.test(cleanExpr)) {
          const res = new Function(`return ${cleanExpr}`)();
          setHistory(display + ' =');
          setDisplay(String(res));
          saveCalculation('basic-calculator', 'Basic Calculator', { expr: display }, { result: res });
        } else {
          setDisplay('Error');
        }
      } catch {
        setDisplay('Error');
      }
    } else {
      // Prevent multiple operators in sequence
      const ops = ['+', '-', 'x', '/', '.'];
      if (ops.includes(val) && ops.includes(display[display.length - 1])) {
        return;
      }
      setDisplay(display + val);
    }
  };

  const keys = [
    'C', 'DEL', '/', 'x',
    '7', '8', '9', '-',
    '4', '5', '6', '+',
    '1', '2', '3', '=',
    '0', '.'
  ];

  return (
    <div className="card" style={{ maxWidth: '360px', margin: '0 auto', width: '100%' }}>
      <div className="calc-display">
        <div className="calc-display-history">{history}</div>
        <div>{display || '0'}</div>
      </div>
      <div className="calc-keypad">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => handleKeyClick(k)}
            className={`calc-key ${
              k === '=' ? 'calc-key-eq' : 
              k === 'C' || k === 'DEL' ? 'calc-key-clear' :
              ['/', 'x', '-', '+'].includes(k) ? 'calc-key-op' : ''
            }`}
            style={{ 
              gridColumn: k === '=' ? 'span 1' : 'span 1',
              height: '3.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

// === 2. SCIENTIFIC CALCULATOR ===
export function ScientificCalculator() {
  const [display, setDisplay] = useState('');
  const [history, setHistory] = useState('');
  const [isRad, setIsRad] = useState(true);

  const handleKeyClick = (val) => {
    if (val === 'C') {
      setDisplay('');
      setHistory('');
    } else if (val === 'DEL') {
      setDisplay(display.slice(0, -1));
    } else if (val === 'Rad' || val === 'Deg') {
      setIsRad(val === 'Rad');
    } else if (val === '=') {
      try {
        let expr = display
          .replace(/π/g, 'Math.PI')
          .replace(/e/g, 'Math.E')
          .replace(/\^/g, '**');

        // Adjust trig functions for Deg mode
        if (!isRad) {
          expr = expr
            .replace(/sin\(/g, 'Math.sin(Math.PI/180*')
            .replace(/cos\(/g, 'Math.cos(Math.PI/180*')
            .replace(/tan\(/g, 'Math.tan(Math.PI/180*');
        } else {
          expr = expr
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(');
        }

        expr = expr
          .replace(/log\(/g, 'Math.log10(')
          .replace(/ln\(/g, 'Math.log(')
          .replace(/sqrt\(/g, 'Math.sqrt(');

        // Safety Regex check
        if (/^[0-9+\-*/().\sMathPIEsinctalgqrt**]+$/.test(expr)) {
          const res = new Function(`return ${expr}`)();
          setHistory(display + ' =');
          setDisplay(Number(res).toFixed(6).replace(/\.?0+$/, '')); // trim trailing zeros
          saveCalculation('scientific-calculator', 'Scientific Calculator', { expr: display }, { result: res });
        } else {
          setDisplay('Error');
        }
      } catch {
        setDisplay('Error');
      }
    } else {
      setDisplay(display + val);
    }
  };

  const keys = [
    isRad ? 'Deg' : 'Rad', '(', ')', 'DEL', 'C',
    'sin(', 'cos(', 'tan(', '^', '/',
    'log(', 'ln(', 'sqrt(', 'π', 'x',
    '7', '8', '9', '-', '+',
    '4', '5', '6', 'e', '=',
    '1', '2', '3', '0', '.'
  ];

  return (
    <div className="card" style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
      <div className="calc-display" style={{ minHeight: '5.5rem' }}>
        <div className="calc-display-history">
          {history} <span className="badge" style={{ fontSize: '0.65rem', marginLeft: '0.5rem' }}>{isRad ? 'Rad' : 'Deg'}</span>
        </div>
        <div>{display || '0'}</div>
      </div>
      <div className="calc-keypad calc-keypad-scientific">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => handleKeyClick(k)}
            className={`calc-key ${
              k === '=' ? 'calc-key-eq' : 
              k === 'C' || k === 'DEL' ? 'calc-key-clear' :
              ['/', 'x', '-', '+', '^'].includes(k) ? 'calc-key-op' : 
              ['sin(', 'cos(', 'tan(', 'log(', 'ln(', 'sqrt(', 'Rad', 'Deg'].includes(k) ? 'badge-accent' : ''
            }`}
            style={{ 
              height: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              padding: '0.25rem'
            }}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

// === 3. UNIT CONVERTER ===
export function UnitConverter() {
  const categories = {
    Length: {
      m: 1, cm: 0.01, mm: 0.001, km: 1000,
      in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344
    },
    Weight: {
      g: 1, kg: 1000, mg: 0.001, lb: 453.59237, oz: 28.34952
    },
    Area: {
      sq_m: 1, sq_cm: 0.0001, sq_km: 1000000, 
      sq_ft: 0.092903, acre: 4046.856, hectare: 10000
    },
    Volume: {
      liter: 1, ml: 0.001, cubic_m: 1000,
      gallon: 3.78541, cup: 0.236588, fl_oz: 0.0295735
    }
  };

  const [category, setCategory] = useState('Length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('cm');
  const [fromVal, setFromVal] = useState('1');
  const [toVal, setToVal] = useState('100');

  useEffect(() => {
    const units = Object.keys(categories[category]);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  }, [category]);

  const handleConvert = (val, direction = 'forward') => {
    const activeCat = categories[category];
    const numeric = parseFloat(val);
    if (isNaN(numeric)) {
      if (direction === 'forward') {
        setToVal('');
      } else {
        setFromVal('');
      }
      return;
    }

    if (direction === 'forward') {
      setFromVal(val);
      const valInBase = numeric * activeCat[fromUnit];
      const result = valInBase / activeCat[toUnit];
      setToVal(result.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      setToVal(val);
      const valInBase = numeric * activeCat[toUnit];
      const result = valInBase / activeCat[fromUnit];
      setFromVal(result.toFixed(6).replace(/\.?0+$/, ''));
    }
  };

  useEffect(() => {
    handleConvert(fromVal, 'forward');
  }, [fromUnit, toUnit]);

  return (
    <div className="card" style={{ width: '100%' }}>
      <div className="form-group">
        <label className="form-label">Measurement Type</label>
        <select 
          className="form-select" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
        >
          {Object.keys(categories).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <div className="form-group">
            <label className="form-label">From</label>
            <select className="form-select" value={fromUnit} onChange={e => setFromUnit(e.target.value)}>
              {Object.keys(categories[category]).map(unit => (
                <option key={unit} value={unit}>{unit.toUpperCase()}</option>
              ))}
            </select>
            <input 
              type="number" 
              className="form-input" 
              value={fromVal} 
              onChange={e => handleConvert(e.target.value, 'forward')}
              style={{ marginTop: '0.5rem' }} 
            />
          </div>
        </div>

        <div style={{ padding: '1.5rem 0.5rem 0 0.5rem', display: 'flex', justifyContent: 'center' }}>
          <RefreshCw size={20} className="badge-accent" style={{ transform: 'rotate(90deg)' }} />
        </div>

        <div style={{ flex: 1, minWidth: '150px' }}>
          <div className="form-group">
            <label className="form-label">To</label>
            <select className="form-select" value={toUnit} onChange={e => setToUnit(e.target.value)}>
              {Object.keys(categories[category]).map(unit => (
                <option key={unit} value={unit}>{unit.toUpperCase()}</option>
              ))}
            </select>
            <input 
              type="number" 
              className="form-input" 
              value={toVal} 
              onChange={e => handleConvert(e.target.value, 'backward')}
              style={{ marginTop: '0.5rem' }} 
            />
          </div>
        </div>
      </div>

      <ActionRow 
        onCopy={() => navigator.clipboard.writeText(`${fromVal} ${fromUnit} = ${toVal} ${toUnit}`)} 
        onShare={() => {
          navigator.clipboard.writeText(window.location.href);
        }}
        resultText={`${fromVal} ${fromUnit} = ${toVal} ${toUnit}`}
      />
    </div>
  );
}

// === 4. CURRENCY CONVERTER ===
export function CurrencyConverter() {
  const rates = {
    USD: 1.0,
    EUR: 0.92,
    INR: 83.5,
    GBP: 0.79,
    CAD: 1.36,
    AUD: 1.50,
    JPY: 156.4
  };

  const [fromCur, setFromCur] = useState('USD');
  const [toCur, setToCur] = useState('EUR');
  const [fromVal, setFromVal] = useState('100');
  const [toVal, setToVal] = useState('92');

  const convert = (val, direction = 'forward') => {
    const numeric = parseFloat(val);
    if (isNaN(numeric)) {
      if (direction === 'forward') setToVal('');
      else setFromVal('');
      return;
    }

    if (direction === 'forward') {
      setFromVal(val);
      const usdVal = numeric / rates[fromCur];
      const result = usdVal * rates[toCur];
      setToVal(result.toFixed(2));
    } else {
      setToVal(val);
      const usdVal = numeric / rates[toCur];
      const result = usdVal * rates[fromCur];
      setFromVal(result.toFixed(2));
    }
  };

  useEffect(() => {
    convert(fromVal, 'forward');
  }, [fromCur, toCur]);

  return (
    <div className="card">
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <div className="form-group">
            <label className="form-label">Source Currency</label>
            <select className="form-select" value={fromCur} onChange={e => setFromCur(e.target.value)}>
              {Object.keys(rates).map(cur => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
            <input 
              type="number" 
              className="form-input" 
              value={fromVal} 
              onChange={e => convert(e.target.value, 'forward')}
              style={{ marginTop: '0.5rem' }} 
            />
          </div>
        </div>

        <div style={{ padding: '1.5rem 0.5rem 0 0.5rem', display: 'flex', justifyContent: 'center' }}>
          <RefreshCw size={20} className="badge-accent" style={{ transform: 'rotate(90deg)' }} />
        </div>

        <div style={{ flex: 1, minWidth: '150px' }}>
          <div className="form-group">
            <label className="form-label">Converted Currency</label>
            <select className="form-select" value={toCur} onChange={e => setToCur(e.target.value)}>
              {Object.keys(rates).map(cur => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
            <input 
              type="number" 
              className="form-input" 
              value={toVal} 
              onChange={e => convert(e.target.value, 'backward')}
              style={{ marginTop: '0.5rem' }} 
            />
          </div>
        </div>
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>
        * Offline reference exchange rates applied.
      </p>

      <ActionRow 
        onCopy={() => navigator.clipboard.writeText(`${fromVal} ${fromCur} = ${toVal} ${toCur}`)} 
        onShare={() => navigator.clipboard.writeText(window.location.href)}
        resultText={`${fromVal} ${fromCur} = ${toVal} ${toCur}`}
      />
    </div>
  );
}

// === 5. PASSWORD GENERATOR ===
export function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (!charset) {
      setPassword('Select at least one checkbox');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * charset.length);
      result += charset[idx];
    }
    setPassword(result);
    saveCalculation('password-generator', 'Password Generator', { length }, { result });
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const getStrength = () => {
    if (password.length <= 1) return { text: 'None', color: 'var(--text-muted)', pct: 0 };
    let checkedCount = 0;
    if (includeLower) checkedCount++;
    if (includeUpper) checkedCount++;
    if (includeNumbers) checkedCount++;
    if (includeSymbols) checkedCount++;

    const score = length * checkedCount;

    if (score < 24) return { text: 'Weak', color: 'var(--error)', pct: 25 };
    if (score < 36) return { text: 'Medium', color: 'var(--warning)', pct: 50 };
    if (score < 48) return { text: 'Strong', color: 'var(--success)', pct: 75 };
    return { text: 'Ultimate Secure', color: 'var(--accent)', pct: 100 };
  };

  const strength = getStrength();

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <div className="form-group" style={{ position: 'relative' }}>
        <label className="form-label">Generated Password</label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input 
            type="text" 
            readOnly 
            className="form-input" 
            value={password} 
            style={{ 
              fontFamily: 'monospace', 
              fontSize: '1.25rem', 
              letterSpacing: '0.05em',
              paddingRight: '3rem',
              backgroundColor: 'var(--bg-tertiary)'
            }} 
          />
          <button 
            onClick={handleCopy} 
            className="btn btn-primary"
            style={{ height: '2.5rem', width: '2.5rem', padding: 0 }}
            title="Copy Password"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Password Strength Indicator */}
      <div style={{ margin: '1rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Security Level:</span>
          <span style={{ fontWeight: 600, color: strength.color }}>{strength.text}</span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${strength.pct}%`, height: '100%', backgroundColor: strength.color, transition: 'all 300ms' }}></div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Password Length: {length}</label>
        <input 
          type="range" 
          min="8" 
          max="32" 
          value={length} 
          onChange={(e) => setLength(parseInt(e.target.value))} 
          style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={includeUpper} onChange={e => setIncludeUpper(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
          Uppercase Letters
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={includeLower} onChange={e => setIncludeLower(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
          Lowercase Letters
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={includeNumbers} onChange={e => setIncludeNumbers(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
          Numbers (0-9)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={includeSymbols} onChange={e => setIncludeSymbols(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
          Special Symbols
        </label>
      </div>

      <button onClick={generatePassword} className="btn btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }}>
        <Shuffle size={16} />
        Regenerate Password
      </button>
    </div>
  );
}

// === 6. BMI CALCULATOR (WITH VISUAL METER) ===
export function BmiCalculator() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [result, setResult] = useState(null);

  const calculateBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h || w <= 0 || h <= 0) return;

    const score = w / Math.pow(h / 100, 2);
    let category = 'Normal Weight';
    let color = 'var(--success)';
    let position = 50; // percentage along the visual meter

    if (score < 18.5) {
      category = 'Underweight';
      color = '#F59E0B'; // yellow
      position = Math.min(90, Math.max(10, (score / 18.5) * 25));
    } else if (score >= 18.5 && score < 25) {
      category = 'Normal Weight';
      color = 'var(--success)'; // green
      position = 25 + ((score - 18.5) / 6.5) * 25;
    } else if (score >= 25 && score < 30) {
      category = 'Overweight';
      color = '#F97316'; // orange
      position = 50 + ((score - 25) / 5) * 25;
    } else {
      category = 'Obese';
      color = 'var(--error)'; // red
      position = 75 + Math.min(20, ((score - 30) / 15) * 25);
    }

    setResult({ score: score.toFixed(1), category, color, position });
    saveCalculation('bmi-calculator', 'BMI Calculator', { weight, height }, { score, category });
  };

  useEffect(() => {
    calculateBmi();
  }, [weight, height]);

  return (
    <div className="card">
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Weight (kg)</label>
          <input 
            type="number" 
            className="form-input" 
            value={weight} 
            onChange={(e) => setWeight(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Height (cm)</label>
          <input 
            type="number" 
            className="form-input" 
            value={height} 
            onChange={(e) => setHeight(e.target.value)} 
          />
        </div>
      </div>

      {result && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>YOUR BODY MASS INDEX (BMI)</div>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: result.color, fontFamily: 'var(--font-title)', lineHeight: '1.2' }}>
            {result.score}
          </div>
          <span className="badge" style={{ backgroundColor: `${result.color}15`, color: result.color, fontSize: '0.9rem', padding: '0.25rem 0.75rem', fontWeight: 600 }}>
            {result.category}
          </span>

          {/* Visual Gauge */}
          <div style={{ marginTop: '1.5rem', position: 'relative', height: '40px' }}>
            {/* Color segments bar */}
            <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', width: '100%' }}>
              <div style={{ flex: 1, backgroundColor: '#FBBF24' }} title="Underweight (< 18.5)"></div>
              <div style={{ flex: 1, backgroundColor: '#34D399' }} title="Normal (18.5 - 25)"></div>
              <div style={{ flex: 1, backgroundColor: '#FB923C' }} title="Overweight (25 - 30)"></div>
              <div style={{ flex: 1, backgroundColor: '#F87171' }} title="Obese (30+)"></div>
            </div>
            {/* Needle pointer */}
            <div style={{ 
              position: 'absolute', 
              left: `${result.position}%`, 
              top: '6px', 
              transform: 'translateX(-50%)',
              transition: 'left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '10px solid var(--text-primary)' }}></div>
              <div style={{ width: '4px', height: '14px', backgroundColor: 'var(--text-primary)', borderRadius: '2px' }}></div>
            </div>
            {/* Gauge markings */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1.25rem', padding: '0 0.25rem' }}>
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
          </div>

          <ActionRow 
            onCopy={() => navigator.clipboard.writeText(`My BMI is ${result.score} (${result.category})`)} 
            onShare={() => navigator.clipboard.writeText(window.location.href)}
            resultText={`BMI: ${result.score}`}
          />
        </div>
      )}
    </div>
  );
}

// === 7. EMI CALCULATOR ===
export function EmiCalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(15);
  const [result, setResult] = useState(null);

  const calculateEmi = () => {
    const p = parseFloat(amount);
    const rAnnual = parseFloat(rate);
    const tYears = parseFloat(tenure);

    if (p <= 0 || rAnnual <= 0 || tYears <= 0) return;

    const rMonthly = (rAnnual / 12) / 100;
    const nMonths = tYears * 12;

    const emi = p * rMonthly * Math.pow(1 + rMonthly, nMonths) / (Math.pow(1 + rMonthly, nMonths) - 1);
    const totalPayment = emi * nMonths;
    const totalInterest = totalPayment - p;

    const principalPct = (p / totalPayment) * 100;
    const interestPct = (totalInterest / totalPayment) * 100;

    // SVG Pie segments path calculators
    // For radius 50, circumference is 314.16
    const circ = 314.16;
    const interestStrokeOffset = circ - (interestPct / 100) * circ;

    setResult({
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      principalPct: principalPct.toFixed(1),
      interestPct: interestPct.toFixed(1),
      interestStrokeOffset
    });

    saveCalculation('emi-calculator', 'EMI Calculator', { amount, rate, tenure }, { emi, totalInterest, totalPayment });
  };

  useEffect(() => {
    calculateEmi();
  }, [amount, rate, tenure]);

  return (
    <div className="card">
      <div className="grid-3">
        <div className="form-group">
          <label className="form-label">Loan Amount ($)</label>
          <input type="number" className="form-input" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Interest Rate (% annual)</label>
          <input type="number" className="form-input" value={rate} onChange={e => setRate(e.target.value)} step="0.1" />
        </div>
        <div className="form-group">
          <label className="form-label">Tenure (Years)</label>
          <input type="number" className="form-input" value={tenure} onChange={e => setTenure(e.target.value)} />
        </div>
      </div>

      {result && (
        <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around' }}>
          
          {/* Numbers Side */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>MONTHLY EMI</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-title)' }}>
                ${Number(result.emi).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></span>
                  Principal Loan Amount:
                </span>
                <span style={{ fontWeight: 600 }}>${Number(amount).toLocaleString()} ({result.principalPct}%)</span>
              </div>
              <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--warning)' }}></span>
                  Total Interest Payable:
                </span>
                <span style={{ fontWeight: 600 }}>${Number(result.totalInterest).toLocaleString()} ({result.interestPct}%)</span>
              </div>
              <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--border-color)', margin: '0.25rem 0' }}></div>
              <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontWeight: 600 }}>
                <span>Total Payment:</span>
                <span>${Number(result.totalPayment).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* SVG Pie Chart Side */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="140" height="140" viewBox="0 0 120 120">
              {/* Principal Gray background base */}
              <circle cx="60" cy="60" r="50" fill="transparent" stroke="var(--accent)" strokeWidth="16" />
              {/* Interest Overlay */}
              <circle 
                cx="60" 
                cy="60" 
                r="50" 
                fill="transparent" 
                stroke="var(--warning)" 
                strokeWidth="16" 
                strokeDasharray="314.16"
                strokeDashoffset={result.interestStrokeOffset}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 300ms ease' }}
              />
            </svg>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 500 }}>
              Payment Breakdown
            </span>
          </div>
        </div>
      )}

      {result && (
        <ActionRow 
          onCopy={() => navigator.clipboard.writeText(`EMI: $${result.emi}/month, Total Interest: $${result.totalInterest}, Total Payment: $${result.totalPayment}`)}
          onShare={() => navigator.clipboard.writeText(window.location.href)}
          resultText={`EMI: $${result.emi}`}
        />
      )}
    </div>
  );
}

// === 8. SIP CALCULATOR ===
export function SipCalculator() {
  const [monthly, setMonthly] = useState(500);
  const [returns, setReturns] = useState(12);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState(null);

  const calculateSip = () => {
    const p = parseFloat(monthly);
    const rAnnual = parseFloat(returns);
    const t = parseFloat(years);

    if (p <= 0 || rAnnual <= 0 || t <= 0) return;

    const rMonthly = (rAnnual / 12) / 100;
    const nMonths = t * 12;

    const maturity = p * ((Math.pow(1 + rMonthly, nMonths) - 1) / rMonthly) * (1 + rMonthly);
    const totalInvested = p * nMonths;
    const wealthGained = maturity - totalInvested;

    const investedPct = (totalInvested / maturity) * 100;
    const gainedPct = (wealthGained / maturity) * 100;

    // Radius 50 circle path (circumference = 314.16)
    const circ = 314.16;
    const gainStrokeOffset = circ - (gainedPct / 100) * circ;

    setResult({
      totalInvested: totalInvested.toFixed(2),
      wealthGained: wealthGained.toFixed(2),
      maturity: maturity.toFixed(2),
      investedPct: investedPct.toFixed(1),
      gainedPct: gainedPct.toFixed(1),
      gainStrokeOffset
    });

    saveCalculation('sip-calculator', 'SIP Calculator', { monthly, returns, years }, { maturity, totalInvested, wealthGained });
  };

  useEffect(() => {
    calculateSip();
  }, [monthly, returns, years]);

  return (
    <div className="card">
      <div className="grid-3">
        <div className="form-group">
          <label className="form-label">Monthly Investment ($)</label>
          <input type="number" className="form-input" value={monthly} onChange={e => setMonthly(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Expected Return Rate (% p.a.)</label>
          <input type="number" className="form-input" value={returns} onChange={e => setReturns(e.target.value)} step="0.5" />
        </div>
        <div className="form-group">
          <label className="form-label">Tenure (Years)</label>
          <input type="number" className="form-input" value={years} onChange={e => setYears(e.target.value)} />
        </div>
      </div>

      {result && (
        <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around' }}>
          
          {/* Numbers Side */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>FUTURE ESTIMATED MATURITY</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-title)' }}>
                ${Number(result.maturity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></span>
                  Invested Capital:
                </span>
                <span style={{ fontWeight: 600 }}>${Number(result.totalInvested).toLocaleString()} ({result.investedPct}%)</span>
              </div>
              <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
                  Wealth Growth:
                </span>
                <span style={{ fontWeight: 600 }}>${Number(result.wealthGained).toLocaleString()} ({result.gainedPct}%)</span>
              </div>
              <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--border-color)', margin: '0.25rem 0' }}></div>
              <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontWeight: 600 }}>
                <span>Total Accumulated:</span>
                <span>${Number(result.maturity).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* SVG Pie Chart Side */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="140" height="140" viewBox="0 0 120 120">
              {/* Invested base circle */}
              <circle cx="60" cy="60" r="50" fill="transparent" stroke="var(--accent)" strokeWidth="16" />
              {/* Gain Overlay */}
              <circle 
                cx="60" 
                cy="60" 
                r="50" 
                fill="transparent" 
                stroke="var(--success)" 
                strokeWidth="16" 
                strokeDasharray="314.16"
                strokeDashoffset={result.gainStrokeOffset}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 300ms ease' }}
              />
            </svg>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 500 }}>
              Growth Breakdown
            </span>
          </div>
        </div>
      )}

      {result && (
        <ActionRow 
          onCopy={() => navigator.clipboard.writeText(`SIP Invested: $${result.totalInvested}, Maturity: $${result.maturity}, Profit: $${result.wealthGained}`)}
          onShare={() => navigator.clipboard.writeText(window.location.href)}
          resultText={`Maturity: $${result.maturity}`}
        />
      )}
    </div>
  );
}
