
export const Colors = {
  primary: '#7D8E7E', // Muted green
  secondary: '#C4D4C5', // Light sage
  background: '#F9F7F2', // Warm cream
  surface: '#FFFFFF',
  text: '#2D3436',
  textSecondary: '#636E72',
  accent: '#D4A373', // Sandy accent
  border: '#E0E0E0',
  success: '#55AD9B',
  error: '#FF6B6B',
  streak: '#D4A373',
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontFamily: 'Serif', // Fallback, will define custom font later
    fontWeight: '700',
    color: Colors.text,
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Serif',
    fontWeight: '600',
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    fontFamily: 'Sans-Serif',
    color: Colors.text,
  },
  caption: {
    fontSize: 14,
    fontFamily: 'Sans-Serif',
    color: Colors.textSecondary,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Shadow = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
};
