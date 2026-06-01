import React, { useEffect } from 'react';
import { Link } from '../utils/router';
import { calculatorsRegistry } from '../data/registry';
import { Map, ChevronRight, Award } from 'lucide-react';

export default function SitemapPage() {
  
  // SEO: Update page metadata & inject Schema.org JSON-LD Structured Data
  useEffect(() => {
    document.title = 'Sitemap Directory - All Calculators - CalcNest';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'CalcNest HTML Sitemap Index. Access our complete directory of 50+ calculators for finance, health, student grades, coding converters, and cricket statistics.';

    // Inject JSON-LD Schema
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'CalcNest Sitemap Directory',
      'description': 'Complete index of all calculators on CalcNest.',
      'itemListElement': Object.values(calculatorsRegistry).map((calc, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'url': `${window.location.origin}/${calc.slug}`,
        'name': calc.name
      }))
    };

    let scriptTag = document.getElementById('json-ld-sitemap');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-sitemap';
      scriptTag.type = 'application/ld-json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.innerHTML = JSON.stringify(schema);

    return () => {
      // clean up schema on unmount
      const existing = document.getElementById('json-ld-sitemap');
      if (existing) existing.remove();
    };
  }, []);

  // Group calculators by category
  const categoriesMap = {};
  Object.values(calculatorsRegistry).forEach(calc => {
    if (!categoriesMap[calc.category]) {
      categoriesMap[calc.category] = [];
    }
    categoriesMap[calc.category].push(calc);
  });

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      
      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }} className="animate-fade-in">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'var(--accent-light)',
          color: 'var(--accent)',
          borderRadius: 'var(--radius-md)',
          width: '3rem',
          height: '3rem'
        }}>
          <Map size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)', fontWeight: 800, fontFamily: 'var(--font-title)' }}>
            Sitemap Index Directory
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Complete list of all calculator links, category pages, and converters hosted on CalcNest.
          </p>
        </div>
      </div>

      {/* Grid of Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }} className="animate-fade-in">
        {Object.entries(categoriesMap).map(([category, calcs]) => {
          const categorySlug = category.toLowerCase().replace(' ', '-');
          return (
            <div key={category} className="card">
              
              {/* Category Title */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.75rem',
                marginBottom: '1.25rem'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{category} Tools</h2>
                <Link 
                  to={`/category/${categorySlug}`}
                  style={{ 
                    fontSize: '0.825rem', 
                    color: 'var(--accent)', 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.125rem'
                  }}
                >
                  View Category Page
                  <ChevronRight size={14} />
                </Link>
              </div>

              {/* Calculators in Category */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
                gap: '1rem' 
              }}>
                {calcs.map(calc => (
                  <Link 
                    key={calc.id} 
                    to={`/${calc.slug}`}
                    style={{ 
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid transparent',
                      transition: 'all var(--transition-fast)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                      e.currentTarget.style.color = 'var(--accent)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <span>{calc.name}</span>
                    <ChevronRight size={12} style={{ opacity: 0.5 }} />
                  </Link>
                ))}
              </div>

            </div>
          );
        })}
      </div>
      
    </div>
  );
}
