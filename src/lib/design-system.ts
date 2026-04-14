// SoundStyle - Apple HIG Color System
// Following Apple's design language for premium, cohesive feel

export const colors = {
  // System Colors (Apple-inspired)
  system: {
    blue: '#007AFF',
    green: '#34C759',
    indigo: '#5856D6',
    orange: '#FF9500',
    pink: '#FF2D55',
    purple: '#AF52DE',
    red: '#FF3B30',
    teal: '#5AC8FA',
    yellow: '#FFCC00',
  },
  
  // Semantic Colors
  semantic: {
    spotify: '#1DB954',
    spotifyHover: '#1ed760',
    accent: '#0A84FF', // Apple Blue
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
  },
  
  // Dark Mode Colors (primary mode)
  dark: {
    background: {
      primary: '#000000',
      secondary: '#1C1C1E',
      tertiary: '#2C2C2E',
      elevated: '#1C1C1E',
      grouped: '#1C1C1E',
    },
    label: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.6)',
      tertiary: 'rgba(255, 255, 255, 0.3)',
      quaternary: 'rgba(255, 255, 255, 0.18)',
    },
    separator: 'rgba(255, 255, 255, 0.1)',
    fill: {
      primary: 'rgba(255, 255, 255, 0.1)',
      secondary: 'rgba(255, 255, 255, 0.05)',
      tertiary: 'rgba(255, 255, 255, 0.02)',
    },
  },
  
  // Gradients (Apple-style)
  gradients: {
    spotify: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
    blue: 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
    purple: 'linear-gradient(135deg, #BF5AF2 0%, #8944AB 100%)',
    warm: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    cool: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    hero: 'linear-gradient(180deg, rgba(29, 185, 84, 0.15) 0%, transparent 100%)',
  },
};

// Apple HIG Typography Scale
export const typography = {
  // Large Titles
  largeTitle: {
    fontSize: '34px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '41px',
  },
  // Title 1
  title1: {
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '34px',
  },
  // Title 2
  title2: {
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '28px',
  },
  // Title 3
  title3: {
    fontSize: '20px',
    fontWeight: '600',
    letterSpacing: '-0.01em',
    lineHeight: '25px',
  },
  // Headline
  headline: {
    fontSize: '17px',
    fontWeight: '600',
    letterSpacing: '-0.01em',
    lineHeight: '22px',
  },
  // Body
  body: {
    fontSize: '17px',
    fontWeight: '400',
    letterSpacing: '-0.01em',
    lineHeight: '22px',
  },
  // Callout
  callout: {
    fontSize: '16px',
    fontWeight: '400',
    letterSpacing: '0',
    lineHeight: '21px',
  },
  // Subheadline
  subheadline: {
    fontSize: '15px',
    fontWeight: '400',
    letterSpacing: '0',
    lineHeight: '20px',
  },
  // Footnote
  footnote: {
    fontSize: '13px',
    fontWeight: '400',
    letterSpacing: '0',
    lineHeight: '18px',
  },
  // Caption 1
  caption1: {
    fontSize: '12px',
    fontWeight: '400',
    letterSpacing: '0',
    lineHeight: '16px',
  },
  // Caption 2
  caption2: {
    fontSize: '11px',
    fontWeight: '400',
    letterSpacing: '0.01em',
    lineHeight: '13px',
  },
};

// Apple HIG Spacing (8pt grid)
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
};

// Apple HIG Border Radius
export const borderRadius = {
  small: '8px',
  medium: '12px',
  large: '16px',
  xlarge: '20px',
  xxlarge: '24px',
  pill: '100px',
  circle: '50%',
};

// Apple HIG Shadows
export const shadows = {
  small: '0 1px 3px rgba(0, 0, 0, 0.3)',
  medium: '0 4px 12px rgba(0, 0, 0, 0.4)',
  large: '0 8px 24px rgba(0, 0, 0, 0.5)',
  glow: '0 0 20px rgba(29, 185, 84, 0.3)',
};

// Apple HIG Transitions
export const transitions = {
  fast: '150ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  normal: '250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  slow: '400ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  spring: '500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};

// Apple HIG Blur Effects
export const blur = {
  light: 'blur(20px)',
  medium: 'blur(40px)',
  heavy: 'blur(100px)',
  background: 'saturate(180%) blur(20px)',
};
