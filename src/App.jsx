import React, { useState, useEffect } from 'react';
import { RouterProvider, useRouter, Link } from './utils/router';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import CalculatorPage from './pages/CalculatorPage';
import SitemapPage from './pages/SitemapPage';
import { getBookmarks, getRecents, addRecent } from './utils/bookmarks';
import { calculatorsRegistry } from './data/registry';

function AppContent() {
  const { path } = useRouter();
  
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('calcnest_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('calcnest_theme', theme);
  }, [theme]);

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState([]);
  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  // Recents State
  const [recents, setRecents] = useState([]);
  useEffect(() => {
    setRecents(getRecents());
  }, []);

  const addRecentItem = (slug) => {
    const updated = addRecent(slug);
    setRecents(updated);
  };

  // Route Resolver
  let view = null;
  if (path === '/') {
    view = <Home bookmarks={bookmarks} recents={recents} />;
  } else if (path.startsWith('/category/')) {
    const categorySlug = path.substring('/category/'.length);
    view = <CategoryPage categorySlug={categorySlug} />;
  } else if (path === '/sitemap') {
    view = <SitemapPage />;
  } else {
    const slug = path.substring(1); // strip leading slash
    if (calculatorsRegistry[slug]) {
      view = (
        <CalculatorPage 
          slug={slug} 
          setBookmarks={setBookmarks} 
          addRecentItem={addRecentItem} 
        />
      );
    } else {
      view = (
        <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-title)' }}>
            404 - Page Not Found
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            The calculator or page you are requesting could not be located.
          </p>
          <Link to="/" className="btn btn-primary">Return to Homepage</Link>
        </div>
      );
    }
  }

  return (
    <Layout 
      bookmarks={bookmarks} 
      setBookmarks={setBookmarks}
      theme={theme}
      setTheme={setTheme}
      recents={recents}
    >
      {view}
    </Layout>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
