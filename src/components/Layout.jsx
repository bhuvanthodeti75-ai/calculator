import React, { useState, useEffect, useRef } from 'react';
import { useRouter, Link } from '../utils/router';
import { calculatorsRegistry } from '../data/registry';
import { getBookmarks, toggleBookmark } from '../utils/bookmarks';
import { 
  Search, Sun, Moon, Bookmark, History, 
  Menu, X, Calculator, Star, Trash2, ExternalLink
} from 'lucide-react';

export default function Layout({ children, bookmarks, setBookmarks, theme, setTheme, recents }) {
  const { path, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showBookmarksDropdown, setShowBookmarksDropdown] = useState(false);
  
  const searchRef = useRef(null);
  const bookmarksRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
      if (bookmarksRef.current && !bookmarksRef.current.contains(event.target)) {
        setShowBookmarksDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Search logic
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
    }).slice(0, 8); // limit results
    setSearchResults(matches);
  }, [searchQuery]);

  const handleSearchSelect = (slug) => {
    navigate(`/${slug}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  const handleRemoveBookmark = (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleBookmark(slug);
    setBookmarks(updated);
  };

  const categories = [
    'Daily Use',
    'Finance',
    'Student',
    'Health',
    'Cricket',
    'Tech',
    'Statistics'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* STICKY HEADER */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        backgroundColor: 'var(--bg-secondary)', 
        borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(8px)',
        transition: 'background-color var(--transition-normal)'
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          height: '4.5rem',
          gap: '1.5rem'
        }}>
          
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'var(--accent)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              width: '2.5rem',
              height: '2.5rem'
            }}>
              <Calculator size={20} />
            </div>
            <span style={{ 
              fontFamily: 'var(--font-title)', 
              fontSize: '1.25rem', 
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)'
            }}>
              CalcNest
            </span>
          </Link>

          {/* GLOBAL SEARCH BAR */}
          <div ref={searchRef} style={{ flex: 1, maxWidth: '480px', position: 'relative' }} className="header-search">
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search 50+ calculators (e.g., EMI, Age, BMI)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                style={{ 
                  paddingLeft: '2.5rem',
                  borderRadius: 'var(--radius-lg)',
                  height: '2.5rem'
                }}
              />
              <Search size={18} style={{ 
                position: 'absolute', 
                left: '0.875rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{
                  position: 'absolute',
                  right: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="card" style={{ 
                position: 'absolute',
                top: 'calc(100% + 0.5rem)',
                left: 0,
                right: 0,
                padding: '0.5rem',
                maxHeight: '320px',
                overflowY: 'auto',
                zIndex: 100,
                boxShadow: 'var(--shadow-lg)'
              }}>
                {searchResults.map(calc => (
                  <div 
                    key={calc.id} 
                    onClick={() => handleSearchSelect(calc.slug)}
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
            
            {showSearchDropdown && searchQuery && searchResults.length === 0 && (
              <div className="card" style={{ 
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
          </div>

          {/* Desktop Navigation */}
          <nav style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="nav-desktop">
            
            {/* Categories Menu */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/category/finance" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Finance</Link>
              <Link to="/category/health" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Health</Link>
              <Link to="/category/student" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Student</Link>
            </div>

            {/* vertical divider */}
            <div style={{ width: '1px', height: '1.25rem', backgroundColor: 'var(--border-color)' }}></div>

            {/* Bookmarks Dropdown */}
            <div ref={bookmarksRef} style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowBookmarksDropdown(!showBookmarksDropdown)}
                className="btn-icon" 
                title="Bookmarked Calculators"
                style={{ position: 'relative' }}
              >
                <Bookmark size={20} />
                {bookmarks.length > 0 && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '2px', 
                    right: '2px', 
                    backgroundColor: 'var(--accent)', 
                    color: '#FFFFFF', 
                    borderRadius: '50%', 
                    width: '14px', 
                    height: '14px', 
                    fontSize: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {bookmarks.length}
                  </span>
                )}
              </button>

              {showBookmarksDropdown && (
                <div className="card animate-fade-in" style={{ 
                  position: 'absolute', 
                  right: 0, 
                  top: 'calc(100% + 0.5rem)', 
                  width: '280px', 
                  padding: '0.75rem', 
                  zIndex: 100,
                  boxShadow: 'var(--shadow-xl)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                    <Star size={16} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Saved Calculators</span>
                  </div>
                  {bookmarks.length === 0 ? (
                    <div style={{ padding: '1rem 0.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      Bookmarked calculators will appear here. Click the bookmark ribbon on any page!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxHeight: '240px', overflowY: 'auto' }}>
                      {bookmarks.map(slug => {
                        const calc = calculatorsRegistry[slug];
                        if (!calc) return null;
                        return (
                          <Link 
                            key={slug} 
                            to={`/${slug}`}
                            onClick={() => setShowBookmarksDropdown(false)}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              padding: '0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.825rem',
                              transition: 'background-color var(--transition-fast)'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <span>{calc.name}</span>
                            <button 
                              onClick={(e) => handleRemoveBookmark(e, slug)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                              onMouseEnter={e => e.currentTarget.style.color = 'var(--error)'}
                              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                              <Trash2 size={14} />
                            </button>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
              className="btn-icon" 
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </nav>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="btn-icon" 
            style={{ display: 'block' }}
            className="menu-mobile-trigger"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* CSS workaround for responsive display */}
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 768px) {
            .nav-desktop { display: flex !important; }
            .menu-mobile-trigger { display: none !important; }
          }
        `}} />
      </header>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderBottom: '1px solid var(--border-color)', 
          padding: '1rem 1.5rem',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          zIndex: 40,
          position: 'fixed',
          top: '4.5rem',
          left: 0,
          right: 0,
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Categories</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {categories.map(cat => (
                <Link 
                  key={cat} 
                  to={`/category/${cat.toLowerCase().replace(' ', '-')}`} 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', textAlign: 'center' }}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Theme Mode</span>
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem' }}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
      )}

      {/* TOP AD BANNER */}
      <div className="container">
        <div className="adsense-placeholder ads-top-banner" title="AdSense Top Banner Area"></div>
      </div>

      {/* MAIN VIEW CONTENT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      {/* FOOTER AD BANNER */}
      <div className="container">
        <div className="adsense-placeholder ads-footer-banner" title="AdSense Footer Banner Area"></div>
      </div>

      {/* CLEAN FOOTER */}
      <footer style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderTop: '1px solid var(--border-color)', 
        padding: '3rem 0 1.5rem 0',
        transition: 'background-color var(--transition-normal)'
      }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '2.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid var(--border-color)'
          }}>
            
            {/* Brand column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: 'var(--accent)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  width: '2rem',
                  height: '2rem'
                }}>
                  <Calculator size={16} />
                </div>
                <span style={{ fontFamily: 'var(--font-title)', fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  CalcNest
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                A premium, startup-grade calculator platform delivering highly accurate mathematical solutions, financial projections, and educational tools.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Calculators</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
                <li><Link to="/emi-calculator" style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>EMI Calculator</Link></li>
                <li><Link to="/age-calculator" style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Age Calculator</Link></li>
                <li><Link to="/bmi-calculator" style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>BMI Calculator</Link></li>
                <li><Link to="/sip-calculator" style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>SIP Calculator</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Categories</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
                <li><Link to="/category/finance" style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Financial Calculators</Link></li>
                <li><Link to="/category/daily-use" style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Daily Utilities</Link></li>
                <li><Link to="/category/health" style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Health & Fitness</Link></li>
                <li><Link to="/category/student" style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Student Utilities</Link></li>
              </ul>
            </div>

            {/* Legals */}
            <div>
              <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Platform</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
                <li><Link to="/sitemap" style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Sitemap Index</Link></li>
                <li style={{ color: 'var(--text-secondary)', cursor: 'default' }}>Privacy Policy</li>
                <li style={{ color: 'var(--text-secondary)', cursor: 'default' }}>Terms of Service</li>
                <li style={{ color: 'var(--text-secondary)', cursor: 'default' }}>Disclaimer</li>
              </ul>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '1rem',
            paddingTop: '1.5rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            <span>© {new Date().getFullYear()} CalcNest Inc. All rights reserved.</span>
            <span>All equations and formulas are verified against academic standards.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
