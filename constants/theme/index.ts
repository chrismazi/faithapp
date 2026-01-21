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
  md: 12,
  lg: 20,
  xl: 28,
  xxl: 40,
};

export const Typography = {
  h1: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
};

export const Shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
};
