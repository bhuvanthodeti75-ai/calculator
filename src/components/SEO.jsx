import React from 'react';
import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../config/siteConfig';

export default function SEO({ 
  title, 
  description, 
  canonical, 
  type = 'website', 
  schema = null,
  image = `${siteConfig.baseUrl}/og-image.jpg` // Default OG image
}) {
  const siteName = siteConfig.projectName;
  // Build meta title using config formula if provided, otherwise fallback
  const fullTitle = siteConfig.metaTitleFormula
    ? siteConfig.metaTitleFormula.replace('%s', title).replace('%s', siteName)
    : `${title} - ${siteName}`;

  // Build meta description using config formula if provided
  const metaDesc = siteConfig.metaDescriptionFormula
    ? siteConfig.metaDescriptionFormula.replace('%s', title).replace('%s', description)
    : description;

  return (
    <Helmet>
      {/* Basic HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:site_name" content={siteName} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
