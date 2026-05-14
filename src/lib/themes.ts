export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  fontSans: string;
  fontMono: string;
  border: string;
  glow: string;
}

export const themes: Record<string, Theme> = {
  noir: {
    id: 'noir',
    name: 'Neon Noir',
    primary: '#0891b2', // cyan-600
    secondary: '#7e22ce', // purple-700
    accent: '#06b6d4', // cyan-500
    background: '#020617', // slate-950
    surface: '#0f172a', // slate-900
    text: '#f8fafc', // slate-50
    fontSans: '"Inter", sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    border: 'rgba(6, 182, 212, 0.2)',
    glow: 'rgba(6, 182, 212, 0.5)'
  },
  scifi: {
    id: 'scifi',
    name: 'Space Opera',
    primary: '#0d9488', // teal-600
    secondary: '#1d4ed8', // blue-700
    accent: '#2dd4bf', // teal-400
    background: '#040d12',
    surface: '#0a1a1f',
    text: '#ccfbf1',
    fontSans: '"JetBrains Mono", monospace',
    fontMono: '"JetBrains Mono", monospace',
    border: 'rgba(45, 212, 191, 0.2)',
    glow: 'rgba(45, 212, 191, 0.5)'
  },
  dark_comedy: {
    id: 'dark_comedy',
    name: 'Dark Comedy',
    primary: '#db2777', // pink-600
    secondary: '#111827', // grey-900
    accent: '#f472b6', // pink-400
    background: '#000000',
    surface: '#0a0a0a',
    text: '#ffffff',
    fontSans: '"Inter", sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    border: 'rgba(244, 114, 182, 0.3)',
    glow: 'rgba(244, 114, 182, 0.6)'
  },
  horror: {
    id: 'horror',
    name: 'Eerie Horror',
    primary: '#991b1b', // red-800
    secondary: '#450a0a', // red-950
    accent: '#ef4444', // red-500
    background: '#0a0000',
    surface: '#1a0505',
    text: '#fee2e2',
    fontSans: '"Inter", sans-serif',
    fontMono: '"Inter", sans-serif',
    border: 'rgba(239, 68, 68, 0.2)',
    glow: 'rgba(239, 68, 68, 0.4)'
  },
  western: {
    id: 'western',
    name: 'Old West',
    primary: '#92400e', // amber-800
    secondary: '#451a03', // amber-950
    accent: '#f59e0b', // amber-500
    background: '#1c1917', // stone-900
    surface: '#292524', // stone-800
    text: '#fef3c7', // amber-100
    fontSans: 'serif',
    fontMono: 'monospace',
    border: 'rgba(245, 158, 11, 0.2)',
    glow: 'rgba(245, 158, 11, 0.3)'
  },
  fantasy: {
    id: 'fantasy',
    name: 'Epic Fantasy',
    primary: '#854d0e', // yellow-800 (goldish)
    secondary: '#1e3a8a', // blue-900
    accent: '#eab308', // yellow-500
    background: '#020617',
    surface: '#0f172a',
    text: '#fefce8',
    fontSans: 'serif',
    fontMono: 'serif',
    border: 'rgba(234, 179, 8, 0.2)',
    glow: 'rgba(234, 179, 8, 0.4)'
  }
};

export const defaultTheme = themes.noir;
