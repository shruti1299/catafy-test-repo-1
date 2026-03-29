'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ConfigProvider, theme as antTheme } from 'antd';

interface ThemeCtx {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeCtx>({ isDark: false, toggleTheme: () => {} });

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('catafy_theme');
    if (stored === 'dark') setIsDark(true);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('catafy_theme', next ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  }, [isDark, mounted]);

  const algorithm = isDark
    ? [antTheme.darkAlgorithm, antTheme.compactAlgorithm]
    : [antTheme.compactAlgorithm];

  if (!mounted) return null; // avoid SSR flash

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm,
          token: {
            fontSize: 14,
            borderRadius: 6,
            padding: 10,
            controlHeight: 28,
            colorPrimary: '#6366f1',
          },
          components: {
            Layout: { bodyBg: isDark ? '#0f172a' : '#f7f8fa' },
            Menu: { itemHeight: 36, itemPaddingInline: 12, fontSize: 12 },
            Table: { cellPaddingBlock: 6, cellPaddingInline: 8, fontSize: 12 },
            Card: { paddingLG: 12 },
            Button: { controlHeight: 28, fontSize: 12, paddingInline: 10 },
            Input: { controlHeight: 28, fontSize: 12, paddingInline: 8 },
            Select: { controlHeight: 28, fontSize: 12 },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
