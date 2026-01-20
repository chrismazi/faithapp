// Calm & Human Design System for Faith App
// A design language that feels warm, clear, and spiritually inviting

export const Colors = {
  // Primary - Sage Green (calm, growth, nature)
  primary: '#5C7A5C',

  // Secondary - Warm Cream
  secondary: '#F5F1E8',

  // Accent - Warm Terracotta (human, earthy)
  accent: '#C4856A',

  // Backgrounds
  background: '#FDFCFA',
  surface: '#FFFFFF',

  // Text
  text: '#2D3436',
  textSecondary: '#7A8085',

  // Semantic
  error: '#D64545',
  success: '#4CAF50',
  streak: '#C4856A',

  // Borders
  border: '#E8E5E0',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
};

export const Shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
};
