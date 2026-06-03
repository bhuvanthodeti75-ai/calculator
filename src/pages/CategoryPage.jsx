import React, { useEffect } from 'react';
import { useRouter, Link } from '../utils/router';
import { calculatorsRegistry } from '../data/registry';
import { 
  DollarSign, Activity, BookOpen, Trophy, 
  Sparkles, Binary, Percent, ChevronRight 
} from 'lucide-react';
import SEO from '../components/SEO';

const categoryMeta = {
  'finance': {
    name: 'Finance',
    icon: <DollarSign size={28} />,
    desc: 'Plan, budget, and forecast. Calculate loan EMIs, interest compounds, systematically track mutual fund growth, evaluate ROI, and price products effectively.',
    metaTitle: 'Financial Calculators - EMI, Loans, Growth - CalcNest',
    metaDesc: 'Plan your budget and mutual fund returns. Free tools for loan EMI calculations, simple/compound interest, fixed deposits, RD returns, and ROI forecasts.'
  },
  'student': {
    name: 'Student',
    icon: <BookOpen size={28} />,
    desc: 'Track and plan academic grades. Calculate CGPA, semester weighted SGPA, attendance buffers, required test scores, and GPA percentages.',
    metaTitle: 'Academic & Grade Calculators - GPA, SGPA, CGPA - CalcNest',
    metaDesc: 'Free academic grade calculators. Compute CGPA, SGPA, letter grades, required exam targets, and attendance requirements.'
  },
  'health': {
    name: 'Health',
    icon: <Activity size={28} />,
    desc: 'Measure fitness metrics. Calculate Body Mass Index (BMI), BMR resting calorie needs, daily TDEE energy margins, protein ratios, and ideal weights.',
    metaTitle: 'Health & Metabolic Calculators - BMI, Calorie, BMR - CalcNest',
    metaDesc: 'Track your health and daily energy guidelines. Calculate BMI ranges, resting metabolism (BMR), active calories (TDEE), and protein intake.'
  },
  'cricket': {
    name: 'Cricket',
    icon: <Trophy size={28} />,
    desc: 'Check cricket tournament stats. Evaluate Run Rates, Net Run Rate (NRR) lists, batsman batting strike rates, required run speeds, and economy rates.',
    metaTitle: 'Cricket Statistics Calculators - NRR, Strike Rate, Econ - CalcNest',
    metaDesc: 'Find match statistics instantly. Calculate Net Run Rate (NRR) ratios, run rates, Required Run Rates (RRR), batting strike rates, and economies.'
  },
  'daily-use': {
    name: 'Daily Use',
    icon: <Sparkles size={28} />,
    desc: 'Fast, daily-helper calculators. Get chronological age milestones, percentage increases, shopping discounts, goods tax components, and unit scales.',
    metaTitle: 'Daily Utilities & Helpers - Age, Percent, GST - CalcNest',
    metaDesc: 'Solve everyday calculations instantly. Calculate exact age spans, percentage equations, sales discounts, GST components, and unit meters.'
  },
  'tech': {
    name: 'Tech',
    icon: <Binary size={28} />,
    desc: 'Utilities for coding and hardware. Calculate binary arithmetic, convert bits to decimals, calculate data storage file sizes, and generate passwords.',
    metaTitle: 'Tech & Binary Converters - Binary, Password, Files - CalcNest',
    metaDesc: 'Free tools for programmers. Perform binary calculations, binary/decimal transformations, file size conversions, and password generation.'
  },
  'statistics': {
    name: 'Statistics',
    icon: <Percent size={28} />,
    desc: 'Analyze numerical datasets. Compute mean/median/mode descriptive summaries, sample and population standard deviations, and variances.',
    metaTitle: 'Statistics & Data Calculators - SD, Variance, Mean - CalcNest',
    metaDesc: 'Free statistics calculations. Find mean, median, mode averages, sample/population standard deviations, and variance spreads.'
  }
};

export default function CategoryPage({ categorySlug }) {
  const key = categorySlug.toLowerCase();
  const meta = categoryMeta[key] || {
    name: 'Calculators',
    icon: <Sparkles size={28} />,
    desc: 'Access our verified, premium calculator tools.',
    metaTitle: 'Online Calculators List - CalcNest',
    metaDesc: 'Explore CalcNest\'s complete library of free financial, health, student, cricket, and technical converters.'
  };

  // Filter registry
  const categoryCalcs = Object.values(calculatorsRegistry).filter(calc => {
    // Map database category names to URL slugs
    const mapped = calc.category.toLowerCase().replace(' ', '-');
    return mapped === key;
  });

  const otherCategories = Object.keys(categoryMeta).filter(k => k !== key);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <SEO 
        title={meta.metaTitle}
        description={meta.metaDesc}
      />
      
      {/* Category Hero Header */}
      <div className="card animate-fade-in" style={{ 
        background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)',
        padding: '2.5rem 2rem',
        marginBottom: '2.5rem',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'var(--accent)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          width: '4rem',
          height: '4rem'
        }}>
          {meta.icon}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)', fontWeight: 800, fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>
            {meta.name} Calculators
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '800px' }}>
            {meta.desc}
          </p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="layout-grid">
        
        {/* Left Column: List of Calculators in Grid */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Available {meta.name} Tools ({categoryCalcs.length})
          </h2>
          
          <div className="grid-2">
            {categoryCalcs.map(calc => (
              <Link 
                key={calc.id} 
                to={`/${calc.slug}`}
                className="card card-hover"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.75rem',
                  cursor: 'pointer',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{calc.name}</h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.375rem', lineHeight: '1.5' }}>
                    {calc.description}
                  </p>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem', 
                  fontSize: '0.825rem', 
                  color: 'var(--accent)', 
                  fontWeight: 600,
                  marginTop: '0.5rem'
                }}>
                  Open Calculator
                  <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>

          {/* AdSense In-Content below category grid */}
          <div className="adsense-placeholder ads-in-content" title="AdSense Category Page banner slot"></div>
        </div>

        {/* Right Column: Other Categories Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Other Categories
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {otherCategories.map(k => (
                <Link 
                  key={k} 
                  to={`/category/${k}`}
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
                  <span style={{ textTransform: 'capitalize' }}>{k.replace('-', ' ')}</span>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar Banner */}
          <div className="adsense-placeholder ads-sidebar" title="AdSense Sidebar Banner Area"></div>
        </div>

      </div>
    </div>
  );
}
