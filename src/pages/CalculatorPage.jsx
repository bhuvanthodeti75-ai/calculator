import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../utils/router';
import { calculatorsRegistry } from '../data/registry';
import { isBookmarked, toggleBookmark, saveCalculation } from '../utils/bookmarks';
import { 
  Bookmark, Share2, HelpCircle, Info, ChevronDown, 
  ChevronUp, Copy, Check, RotateCcw, Star, AlertCircle
} from 'lucide-react';
import * as CustomCalcs from '../components/CustomRenderers';
import SEO from '../components/SEO';

export default function CalculatorPage({ slug, setBookmarks, addRecentItem }) {
  const { navigate } = useRouter();
  const calc = calculatorsRegistry[slug];

  if (!calc) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>404 - Calculator Not Found</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We couldn't find the calculator you were looking for.</p>
        <Link to="/" className="btn btn-primary">Go to Homepage</Link>
      </div>
    );
  }

  // Bookmarking
  const [bookmarked, setBookmarked] = useState(false);
  useEffect(() => {
    setBookmarked(isBookmarked(slug));
    addRecentItem(slug); // Log as recently viewed
  }, [slug]);

  const handleBookmarkToggle = () => {
    const updated = toggleBookmark(slug);
    setBookmarks(updated);
    setBookmarked(!bookmarked);
  };

  // Generic Form State Handling
  const [inputs, setInputs] = useState({});
  const [outputs, setOutputs] = useState({});
  const [errors, setErrors] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Initialize input fields with defaults
  useEffect(() => {
    const initialValues = {};
    const initialErrors = {};
    if (calc.fields) {
      calc.fields.forEach(field => {
        initialValues[field.id] = field.defaultValue;
        initialErrors[field.id] = '';
      });
    }
    setInputs(initialValues);
    setErrors(initialErrors);
    setOutputs({});
  }, [calc]);

  // Recalculate on inputs update
  useEffect(() => {
    if (!calc.fields || calc.fields.length === 0) return;
    
    // Check if required fields are filled and valid
    let hasErrors = false;
    const currentErrors = { ...errors };

    calc.fields.forEach(field => {
      const val = inputs[field.id];
      if (field.required && (val === undefined || val === '')) {
        currentErrors[field.id] = `${field.label} is required`;
        hasErrors = true;
      } else if (field.type === 'number') {
        const num = parseFloat(val);
        if (field.required && isNaN(num)) {
          currentErrors[field.id] = 'Must be a valid number';
          hasErrors = true;
        } else if (!isNaN(num) && field.validation) {
          if (field.validation.min !== undefined && num < field.validation.min) {
            currentErrors[field.id] = `Minimum value is ${field.validation.min}`;
            hasErrors = true;
          }
          if (field.validation.max !== undefined && num > field.validation.max) {
            currentErrors[field.id] = `Maximum value is ${field.validation.max}`;
            hasErrors = true;
          }
        } else {
          currentErrors[field.id] = '';
        }
      } else {
        currentErrors[field.id] = '';
      }
    });

    if (hasErrors) {
      setOutputs({});
      return;
    }

    // Run math calculation
    try {
      const results = calc.calculate(inputs);
      if (results.error) {
        setOutputs({ error: results.error });
      } else {
        setOutputs(results);
      }
    } catch (err) {
      console.error(err);
      setOutputs({ error: 'An unexpected math calculation error occurred.' });
    }
  }, [inputs, calc]);

  const handleInputChange = (fieldId, value) => {
    setInputs(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleReset = () => {
    const cleared = {};
    calc.fields.forEach(field => {
      cleared[field.id] = field.defaultValue;
    });
    setInputs(cleared);
    setOutputs({});
  };

  // Format Helper for Output numbers
  const formatOutput = (val, type) => {
    if (val === undefined || val === null) return '-';
    if (type === 'currency') {
      return `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (type === 'percent') {
      return `${val}%`;
    }
    if (type === 'number') {
      const num = parseFloat(val);
      return isNaN(num) ? val : num.toLocaleString();
    }
    return val;
  };

  const handleCopyOutput = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Accordion FAQ states
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Get related calculators (calculators in the same category, excluding current)
  const relatedCalcs = Object.values(calculatorsRegistry)
    .filter(c => c.category === calc.category && c.id !== calc.id)
    .slice(0, 5);

  // Determine Custom component override
  const CustomComp = calc.customRenderer ? CustomCalcs[calc.customRenderer] : null;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <SEO 
        title={calc.metaTitle || `${calc.name} - CalcNest`}
        description={calc.metaDescription || calc.description}
      />
      
      {/* HEADER META ROW */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <span className="badge badge-accent" style={{ marginBottom: '0.5rem' }}>{calc.category}</span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)', fontWeight: 800, fontFamily: 'var(--font-title)', lineHeight: '1.2' }}>{calc.name}</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '1rem', maxWidth: '800px' }}>{calc.description}</p>
        </div>
        <button 
          onClick={handleBookmarkToggle} 
          className="btn btn-secondary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Bookmark size={18} fill={bookmarked ? 'var(--accent)' : 'transparent'} stroke={bookmarked ? 'var(--accent)' : 'currentColor'} />
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>

      {/* TWO-COLUMN GRID */}
      <div className="layout-grid">
        
        {/* LEFT COLUMN: CALCULATOR INTERFACE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {CustomComp ? (
            /* Bypasses generic layout for Basic/Scientific Calculators etc. */
            <CustomComp />
          ) : (
            /* Generic Form and Output generator */
            <div className="card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Dynamically generated form fields */}
                {calc.fields && calc.fields.map(field => (
                  <div key={field.id} className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span className="form-label">{field.label}</span>
                      {field.tooltip && (
                        <div style={{ position: 'relative', cursor: 'pointer' }} className="tooltip-trigger">
                          <Info size={14} style={{ color: 'var(--text-muted)' }} />
                          {/* CSS Tooltip */}
                          <style dangerouslySetInnerHTML={{__html: `
                            .tooltip-trigger:hover .tooltip-content { display: block !important; }
                          `}} />
                          <div className="tooltip-content" style={{
                            display: 'none',
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '200px',
                            backgroundColor: 'var(--primary)',
                            color: '#fff',
                            fontSize: '0.75rem',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            zIndex: 10,
                            marginBottom: '0.25rem',
                            textAlign: 'center'
                          }}>{field.tooltip}</div>
                        </div>
                      )}
                    </div>

                    {field.type === 'select' ? (
                      <select 
                        className="form-select"
                        value={inputs[field.id] || ''}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                      >
                        {field.options && field.options.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input 
                        type={field.type === 'number' ? 'number' : field.type}
                        className={`form-input ${errors[field.id] ? 'error' : ''}`}
                        value={inputs[field.id] === undefined ? '' : inputs[field.id]}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                      />
                    )}
                    {errors[field.id] && <span className="form-error">{errors[field.id]}</span>}
                  </div>
                ))}
              </div>

              {/* Calculator Output Section */}
              {outputs.error ? (
                <div className="badge-accent" style={{ 
                  backgroundColor: 'var(--error-light)', 
                  color: 'var(--error)', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  marginTop: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }}>
                  <AlertCircle size={18} />
                  {outputs.error}
                </div>
              ) : (
                Object.keys(outputs).length > 0 && (
                  <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Calculation Results</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                      {calc.outputs.map(out => (
                        <div key={out.id} className="card" style={{ 
                          padding: '1rem', 
                          backgroundColor: 'var(--bg-tertiary)',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{out.label}</span>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-title)' }}>
                              {formatOutput(outputs[out.id], out.type)}
                            </div>
                          </div>
                          
                          {outputs[out.id] !== undefined && (
                            <button 
                              onClick={() => handleCopyOutput(out.id, formatOutput(outputs[out.id], out.type))}
                              className="btn btn-icon"
                              title="Copy value"
                            >
                              {copiedId === out.id ? <Check size={16} style={{ color: 'var(--success)' }} /> : <Copy size={16} />}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => {
                          const primaryOutput = calc.outputs[0];
                          if (primaryOutput) {
                            handleCopyOutput('all', `Result for ${calc.name}: ${formatOutput(outputs[primaryOutput.id], primaryOutput.type)}`);
                          }
                        }} 
                        className="btn btn-primary"
                        style={{ flex: 1, minWidth: '140px' }}
                      >
                        <Copy size={16} />
                        {copiedId === 'all' ? 'Copied!' : 'Copy Summary'}
                      </button>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          handleCopyOutput('share', 'shared');
                        }}
                        className="btn btn-secondary"
                        style={{ flex: 1, minWidth: '140px' }}
                      >
                        <Share2 size={16} />
                        {copiedId === 'share' ? 'Link Copied!' : 'Share Page'}
                      </button>
                      <button 
                        onClick={handleReset} 
                        className="btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <RotateCcw size={16} />
                        Reset
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* IN-CONTENT AD BANNER */}
          <div className="adsense-placeholder ads-in-content" title="AdSense In-Content ad slot"></div>

          {/* SEO DOCUMENTATION SECTION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* 1. Monospace Formula Display */}
            {calc.formula && (
              <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Info size={20} style={{ color: 'var(--accent)' }} />
                  Equation & Mathematics Formula
                </h2>
                <div style={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  padding: '1.25rem', 
                  borderRadius: 'var(--radius-md)', 
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem',
                  overflowX: 'auto',
                  border: '1px solid var(--border-color)'
                }}>
                  {calc.formula.latex || calc.formula.text}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {calc.formula.explanation}
                </p>
              </div>
            )}

            {/* 2. Step-by-Step Guide */}
            {calc.steps && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>How to use the {calc.name}</h2>
                <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {calc.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* 3. Solved Case Examples */}
            {calc.examples && (
              <div className="card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{calc.name} Practical Examples</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {calc.examples.map((ex, idx) => (
                    <div key={idx} style={{ borderBottom: idx < calc.examples.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: idx < calc.examples.length - 1 ? '1rem' : 0 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Example: {ex.input}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>{ex.calculation}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)' }}>Result = {ex.result}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Accordion FAQs */}
            {calc.faq && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>{calc.name} FAQs</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {calc.faq.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div 
                        key={idx} 
                        className="card" 
                        style={{ padding: '0.75rem 1.25rem', cursor: 'pointer', backgroundColor: isOpen ? 'var(--bg-secondary)' : 'var(--bg-secondary)' }}
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.95rem' }}>
                          <span>{faq.question}</span>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                        {isOpen && (
                          <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY AD & SIDEBAR LINKINGS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Related Calculators */}
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Related Calculators
            </h3>
            {relatedCalcs.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No other tools in this category.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {relatedCalcs.map(c => (
                  <Link 
                    key={c.id} 
                    to={`/${c.slug}`}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '0.625rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      transition: 'all var(--transition-fast)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                      e.currentTarget.style.color = 'var(--accent)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <span>{c.name}</span>
                    <ChevronDown size={14} style={{ transform: 'rotate(-90deg)', color: 'var(--text-muted)' }} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* AdSense Sticky Sidebar */}
          <div className="adsense-placeholder ads-sidebar" title="AdSense Sidebar ad slot"></div>
        </div>

      </div>
    </div>
  );
}
