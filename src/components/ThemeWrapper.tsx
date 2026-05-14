import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { themes, defaultTheme } from '../lib/themes';

export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const projectTheme = useAppStore((state) => state.projectTheme);
  
  useEffect(() => {
    const theme = themes[projectTheme] || defaultTheme;
    const root = document.documentElement;
    
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--surface', theme.surface);
    root.style.setProperty('--text', theme.text);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--glow', theme.glow);
    root.style.setProperty('--font-sans', theme.fontSans);
    root.style.setProperty('--font-mono', theme.fontMono);
    
  }, [projectTheme]);

  return <div className="contents">{children}</div>;
};
