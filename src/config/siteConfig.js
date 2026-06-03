// src/config/siteConfig.js

/**
 * Central configuration for CalculatorVerse branding and SEO formulas.
 */
export const siteConfig = {
  // Project identity
  projectName: "CalculatorVerse",
  tagline: "The Universe of Smart Calculators",
  brandPersonality: [
    "Professional",
    "Trustworthy",
    "Fast",
    "Accurate",
    "Educational",
  ],

  // Meta title formula – placeholder %s will be replaced with calculator name
  // Example: "Age Calculator - Calculate Your Exact Age Online | CalculatorVerse"
  metaTitleFormula: "%s - %s | CalculatorVerse",

  // Meta description formula – placeholder %s for calculator name
  // Example: "Use CalculatorVerse's free Age Calculator to find your exact age in years, months, and days instantly."
  metaDescriptionFormula: "Use CalculatorVerse's free %s to %s.",

  // Additional static URLs (could be used for sitemaps, robots, etc.)
  baseUrl: "https://www.calculatorverse.in",
};
