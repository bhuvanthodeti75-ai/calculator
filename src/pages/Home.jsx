import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../utils/router';
import { calculatorsRegistry } from '../data/registry';
import { 
  DollarSign, Activity, BookOpen, Trophy, 
  Sparkles, Binary, Percent, Search, ArrowRight,
  TrendingUp, Award, Clock, HelpCircle, Star
} from 'lucide-react';
import SEO from '../components/SEO';

export default function Home({ bookmarks, recents }) {
  const { navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [faqOpen, setFaqOpen] = useState({});

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase().trim();
    const matches = Object.values(calculatorsRegistry).filter(calc => {
      const nameMatch = (calc.name || '').toLowerCase().includes(query);
      const categoryMatch = (calc.category || '').toLowerCase().includes(query);
      const descriptionMatch = (calc.description || '').toLowerCase().includes(query);
      return nameMatch || categoryMatch || descriptionMatch;
    }).slice(0, 5);
    setSearchResults(matches);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      navigate(`/${searchResults[0].slug}`);
    }
  };

  const toggleFaq = (idx) => {
    setFaqOpen(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const categories = [
    { name: 'Finance', icon: <DollarSign size={24} />, count: 15, slug: 'finance', desc: 'EMI, SIP, Loans, Interests, FD, RD, Salary and Business Break-Even calculators.' },
    { name: 'Student', icon: <BookOpen size={24} />, count: 7, slug: 'student', desc: 'CGPA, SGPA, attendance checklists, GPA estimators, and letter grades compilers.' },
    { name: 'Health', icon: <Activity size={24} />, count: 8, slug: 'health', desc: 'BMI gauges, BMR, TDEE energy levels, protein values, and body fat estimators.' },
    { name: 'Cricket', icon: <Trophy size={24} />, count: 5, slug: 'cricket', desc: 'Run rates, Net Run Rates (NRR), batting strike rates, and bowling economies.' },
    { name: 'Daily Use', icon: <Sparkles size={24} />, count: 10, slug: 'daily-use', desc: 'Ages, discounts, percentage change trackers, GST taxes, and conversion metrics.' },
    { name: 'Tech', icon: <Binary size={24} />, count: 5, slug: 'tech', desc: 'Binary math solvers, binary/decimal conversions, and secure password keys.' },
    { name: 'Statistics', icon: <Percent size={24} />, count: 2, slug: 'statistics', desc: 'Mean, Median, Mode averages, sample/population standard deviations and variances.' }
  ];

  // Specific calculator selections
  const trendingCalcs = ['age-calculator', 'percentage-calculator', 'emi-calculator', 'bmi-calculator', 'scientific-calculator'];
  const mostUsedCalcs = ['sip-calculator', 'discount-calculator', 'gst-calculator', 'cgpa-calculator', 'unit-converter'];
  const recentlyAddedCalcs = ['mean-median-mode', 'standard-deviation', 'password-generator', 'binary-calculator', 'required-run-rate-calculator'];

  const homeFaqs = [
    { q: 'Are the mathematical calculations on CalcNest accurate?', a: 'Yes! Every calculator on CalcNest has been built using standard, industry-accepted mathematical formulas. Our financial projections (EMI, SIP, interest rates) and fitness estimates (BMI, BMR, TDEE) align precisely with commercial banking policies and established clinical guidelines respectively.' },
    { q: 'Is CalcNest free to use?', a: 'Absolutely. CalcNest is a 100% free web resource. There are no registration forms, no paywalls, and no subscription fees. We support our hosting and development costs through non-intrusive web advertising.' },
    { q: 'Does CalcNest save my calculation history online?', a: 'No. To ensure absolute data privacy, CalcNest does not upload or store any of your inputs, variables, or results on our servers. Any bookmark saves or recent activity entries are kept entirely inside your own browser using local Web Storage (localStorage).' },
    { q: 'Can I use CalcNest on my mobile phone?', a: 'Yes. CalcNest is fully responsive and built from the ground up to offer a seamless, desktop-quality experience on mobile web browsers, tablets, and computers alike.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem' }} className="animate-fade-in">
      <SEO 
        title="CalcNest - Instant Verified Calculators | Free Online Calculator Directory"
        description="CalcNest is a premium online calculator directory featuring 50+ free calculators for finance, health, coding, academic grades, and sports. Find the perfect calculator for your needs."
      />
      
      {/* 1. HERO SECTION */}
      <section style={{ 
        background: 'radial-gradient(100% 100% at 50% 0%, var(--bg-tertiary) 0%, var(--bg-primary) 100%)',
        padding: 'clamp(3rem, 8vw, 5rem) 1.5rem clamp(2rem, 5vw, 4rem) 1.5rem',
        borderBottom: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <h1 style={{ 
            fontFamily: 'var(--font-title)', 
            fontSize: 'clamp(2rem, 8vw, 3.25rem)', 
            fontWeight: 800, 
            lineHeight: '1.1',
            letterSpacing: '-0.025em',
            color: 'var(--text-primary)'
          }}>
            Instant, Verified <span style={{ color: 'var(--accent)' }}>Calculators</span> for Every Need.
          </h1>
          
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Skip the manual math. Get precise, instant answers with our free online calculators for finance, health, coding, academic grades, and sports calculations. Find the perfect calculator today.
          </p>

          {/* Huge Hero Search */}
          <form onSubmit={handleSearchSubmit} style={{ 
            position: 'relative', 
            maxWidth: '560px', 
            width: '100%', 
            margin: '1rem auto 0 auto' 
          }}>
            <input
              type="text"
              placeholder="Search for a calculator..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                height: '3.5rem',
                paddingLeft: '3rem',
                paddingRight: '6.5rem',
                fontSize: '1rem',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            <Search size={20} style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <button type="submit" className="btn btn-primary" style={{
              position: 'absolute',
              right: '0.5rem',
              top: '0.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius-lg)'
            }}>
              Search
            </button>

            {/* Search Dropdown Results */}
            {searchQuery && searchResults.length > 0 && (
              <div className="card animate-fade-in" style={{ 
                position: 'absolute',
                top: 'calc(100% + 0.5rem)',
                left: 0,
                right: 0,
                padding: '0.5rem',
                maxHeight: '320px',
                overflowY: 'auto',
                zIndex: 100,
                boxShadow: 'var(--shadow-lg)',
                textAlign: 'left'
              }}>
                {searchResults.map(calc => (
                  <div 
                    key={calc.id} 
                    onClick={() => navigate(`/${calc.slug}`)}
                    style={{ 
                      padding: '0.75rem 1rem', 
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background-color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{calc.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{calc.description}</div>
                    </div>
                    <span className="badge" style={{ fontSize: '0.7rem' }}>{calc.category}</span>
                  </div>
                ))}
              </div>
            )}
            {searchQuery && searchResults.length === 0 && (
              <div className="card animate-fade-in" style={{ 
                position: 'absolute',
                top: 'calc(100% + 0.5rem)',
                left: 0,
                right: 0,
                padding: '1.5rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                zIndex: 100
              }}>
                No calculators found for "{searchQuery}"
              </div>
            )}
          </form>

          {/* Quick Shortcuts */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            alignItems: 'center',
            marginTop: '0.5rem'
          }}>
            <span style={{ fontWeight: 600 }}>Popular:</span>
            {['emi-calculator', 'age-calculator', 'bmi-calculator', 'percentage-calculator', 'sip-calculator'].map(slug => {
              const name = calculatorsRegistry[slug]?.name || slug;
              return (
                <Link 
                  key={slug} 
                  to={`/${slug}`} 
                  className="badge badge-accent"
                  style={{ cursor: 'pointer', textDecoration: 'none', transition: 'transform var(--transition-fast)' }}
                >
                  {name}
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. RECENT & BOOKMARKS USER SECTION (Conditional) */}
      {(bookmarks.length > 0 || recents.length > 0) && (
        <section className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              
              {/* Saved Board */}
              {bookmarks.length > 0 && (
                <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Star size={18} fill="var(--accent)" stroke="var(--accent)" />
                    <h3 style={{ fontSize: '1.125rem' }}>Your Bookmarked Calculators</h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {bookmarks.map(slug => (
                      <Link key={slug} to={`/${slug}`} className="btn btn-secondary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.825rem' }}>
                        {calculatorsRegistry[slug]?.name || slug}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* History Board */}
              {recents.length > 0 && (
                <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Clock size={18} style={{ color: 'var(--success)' }} />
                    <h3 style={{ fontSize: '1.125rem' }}>Recently Viewed</h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {recents.map(slug => (
                      <Link key={slug} to={`/${slug}`} className="btn btn-secondary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.825rem' }}>
                        {calculatorsRegistry[slug]?.name || slug}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* 3. CATEGORIES SECTION */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800 }}>Explore Calculators by Category</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Access calculator tools calibrated specifically for your daily activities.</p>
        </div>

        <div className="grid-3">
          {categories.map((cat, idx) => (
            <Link 
              key={cat.slug} 
              to={`/category/${cat.slug}`}
              className="card card-hover"
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent)',
                  borderRadius: 'var(--radius-md)',
                  width: '3.25rem',
                  height: '3.25rem'
                }}>
                  {cat.icon}
                </div>
                <span className="badge badge-success">{cat.count} Calculators</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {cat.name} Calculators
                  <ArrowRight size={16} className="arrow-icon" style={{ opacity: 0.3, transition: 'all 200ms' }} />
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.5' }}>
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. THREE-COLUMN LEADERBOARD LISTS */}
      <section className="container" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '4rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2.5rem' 
        }}>
          
          {/* Trending */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <TrendingUp size={20} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Trending Calculators</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {trendingCalcs.map(slug => {
                const c = calculatorsRegistry[slug];
                if (!c) return null;
                return (
                  <Link key={slug} to={`/${slug}`} className="card card-hover" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</span>
                    <span className="badge" style={{ fontSize: '0.7rem' }}>{c.category}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Most Used */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Award size={20} style={{ color: 'var(--success)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Most Used Calculators</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {mostUsedCalcs.map(slug => {
                const c = calculatorsRegistry[slug];
                if (!c) return null;
                return (
                  <Link key={slug} to={`/${slug}`} className="card card-hover" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</span>
                    <span className="badge" style={{ fontSize: '0.7rem' }}>{c.category}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recently Added */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Clock size={20} style={{ color: 'var(--text-primary)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>New Calculators</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentlyAddedCalcs.map(slug => {
                const c = calculatorsRegistry[slug];
                if (!c) return null;
                return (
                  <Link key={slug} to={`/${slug}`} className="card card-hover" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</span>
                    <span className="badge" style={{ fontSize: '0.7rem' }}>{c.category}</span>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 5. HOMEPAGE SEO CONTENT SECTION */}
      <section className="container" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'clamp(2rem, 6vw, 4rem)' }}>
        <div className="card" style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)', backgroundColor: 'var(--bg-secondary)' }}>
          <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', marginBottom: '1.25rem', fontFamily: 'var(--font-title)' }}>
            CalcNest: The Professional Calculators Platform
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <p>
              Welcome to <strong>CalcNest</strong>, your centralized hub for fast, accurate, and completely free online mathematical calculators. Whether you are managing home finance budgets, computing semester credits, auditing tax brackets, or scaling complex data storage units, our platform delivers instant verified formulas right inside your browser window.
            </p>
            <p>
              Our mission is to replace clunky desktop templates and Excel models with a sleek, startup-grade web platform. Each of our calculators is developed with real mathematical expressions and verified against academic standards to ensure absolute accuracy. Since we run computations entirely on the client side, your privacy is protected—no variables, salaries, medical weights, or results are ever stored on a server.
            </p>
            <h3 style={{ color: 'var(--text-primary)', marginTop: '1rem', fontSize: '1.125rem' }}>Key Features of Our Suite:</h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Finance Hub</strong>: Calculate monthly loan EMIs, Systematic Investment Plan (SIP) returns, fixed deposit maturities, and business break-even ratios.</li>
              <li><strong>Health Indexes</strong>: Map daily Basal Metabolic Rates (BMR), active caloric expenditures (TDEE), Body Mass Index (BMI) gauges, and required protein intake.</li>
              <li><strong>Sports Stats</strong>: Check run rates, Net Run Rates (NRR), bowling economies, and batsmanship strike rates.</li>
              <li><strong>Tech Tools</strong>: Convert bytes and decimal/binary notation, and generate highly randomized secure security passwords.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. PLATFORM FAQ SECTION */}
      <section className="container" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'clamp(2rem, 6vw, 4rem)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800 }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Find quick answers about how CalcNest processes your calculations.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '800px', margin: '0 auto' }}>
          {homeFaqs.map((faq, idx) => {
            const isOpen = faqOpen[idx];
            return (
              <div 
                key={idx} 
                className="card" 
                style={{ padding: '1rem 1.5rem', cursor: 'pointer' }}
                onClick={() => toggleFaq(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, fontSize: '1rem' }}>
                  <span>{faq.q}</span>
                  {isOpen ? <Star size={16} fill="var(--accent)" stroke="var(--accent)" /> : <HelpCircle size={16} style={{ color: 'var(--text-muted)' }} />}
                </div>
                {isOpen && (
                  <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .card-hover:hover .arrow-icon { opacity: 1 !important; transform: translateX(4px); }
      `}} />
    </div>
  );
}
