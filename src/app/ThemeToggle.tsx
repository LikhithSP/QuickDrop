"use client";

import { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only run once after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Determine the current mode based on the classList rather than localStorage
    // This ensures it matches what the user is seeing (which is set by the theme.js script)
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Update DOM and save preference
    if (newMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-card-bg border border-card-border shadow-md hover:scale-105 transition-all duration-200"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <FaSun className="text-amber-500 w-5 h-5" />
      ) : (
        <FaMoon className="text-indigo-600 w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;