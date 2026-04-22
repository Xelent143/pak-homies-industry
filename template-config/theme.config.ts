/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THEME & STYLING CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Customize the visual appearance of your website.
 * Supports both light and dark modes.
 * 
 * After making changes, run: pnpm apply-template
 */

export const THEME_CONFIG = {
  // ═════════════════════════════════════════════════════════════════════════════
  // COLOR PALETTE
  // ═════════════════════════════════════════════════════════════════════════════
  
  colors: {
    // Primary brand color - Pak Homies Blue (#3E41B6)
    primary: {
      50: "#f0f0ff",
      100: "#e6e6ff",
      200: "#d1d1ff",
      300: "#b8b9ff",
      400: "#8589ff",
      500: "#3e41b6",  // Main primary color - Pak Homies Blue
      600: "#3838a3",
      700: "#302e8a",
      800: "#272570",
      900: "#1f1a56",
      950: "#17143a",
    },

    // Secondary color - Pak Homies Red (#FE3136)
    secondary: {
      50: "#fff5f5",
      100: "#ffebeb",
      200: "#ffd7d8",
      300: "#ffc2c4",
      400: "#ff8a8d",
      500: "#fe3136",  // Main secondary color - Pak Homies Red
      600: "#e52b30",
      700: "#cc2529",
      800: "#b31f23",
      900: "#8a171a",
      950: "#5c0f12",
    },

    // Neutral colors - backgrounds, text, borders
    neutral: {
      50: "#fafafa",   // Page background
      100: "#f8f8f8",  // Card backgrounds
      200: "#e0e0e0",  // Borders
      300: "#d4d4d4",
      400: "#a3a3a3",  // Muted text
      500: "#737373",
      600: "#525252",  // Body text
      700: "#404040",
      800: "#1a1a1a",  // Headings
      900: "#171717",
      950: "#0a0a0a",
    },

    // Semantic colors - success, warning, error, info
    semantic: {
      success: {
        light: "#dcfce7",
        DEFAULT: "#10b981",
        dark: "#047857",
      },
      warning: {
        light: "#fef9c3",
        DEFAULT: "#f59e0b",
        dark: "#d97706",
      },
      error: {
        light: "#fee2e2",
        DEFAULT: "#fe3136",
        dark: "#b91c1c",
      },
      info: {
        light: "#e0f2fe",
        DEFAULT: "#3e41b6",
        dark: "#0369a1",
      },
    },

    // Accent colors - for special highlights
    accent: {
      orange: "#f97316",
      pink: "#ec4899",
      teal: "#14b8a6",
      cyan: "#06b6d4",
    },
  },
  
  // ═════════════════════════════════════════════════════════════════════════════
  // DARK MODE COLORS
  // ═════════════════════════════════════════════════════════════════════════════
  
  darkMode: {
    // Override specific colors for dark mode
    background: "#0a0a0a",
    surface: "#171717",
    surfaceElevated: "#262626",
    text: "#fafafa",
    textMuted: "#a3a3a3",
    border: "#404040",
  },
  
  // ═════════════════════════════════════════════════════════════════════════════
  // TYPOGRAPHY
  // ═════════════════════════════════════════════════════════════════════════════
  
  typography: {
    // Font family - Bricolage Grotesque for display, Inter for body
    // Both loaded via Google Fonts
    fontFamily: {
      sans: [
        'Inter',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'sans-serif',
      ],
      display: [
        'Bricolage Grotesque',
        'system-ui',
        '-apple-system',
        'sans-serif',
      ],
      serif: [
        'Georgia',
        'Cambria',
        'Times New Roman',
        'serif',
      ],
      mono: [
        'JetBrains Mono',
        'Fira Code',
        'Monaco',
        'Consolas',
        'monospace',
      ],
    },
    
    // Base font sizes
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },
    
    // Font weights
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    // Line heights
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // ═════════════════════════════════════════════════════════════════════════════
  // SPACING & LAYOUT
  // ═════════════════════════════════════════════════════════════════════════════
  
  layout: {
    // Container max widths
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    
    // Border radius scale
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      DEFAULT: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
    
    // Shadow scale
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    },
  },
  
  // ═════════════════════════════════════════════════════════════════════════════
  // ANIMATION SETTINGS
  // ═════════════════════════════════════════════════════════════════════════════
  
  animation: {
    // Enable/disable animations
    enabled: true,
    
    // Reduce motion for accessibility
    respectPrefersReducedMotion: true,
    
    // Default durations
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
    },
    
    // Default easing
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  
  // ═════════════════════════════════════════════════════════════════════════════
  // COMPONENT-SPECIFIC STYLING
  // ═════════════════════════════════════════════════════════════════════════════
  
  components: {
    // Button styling
    button: {
      borderRadius: '0.5rem', // lg
      fontWeight: 500,
      // Primary button uses primary-500
      // Secondary button uses secondary-500
    },
    
    // Card styling
    card: {
      borderRadius: '1rem', // 2xl
      shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      padding: '1.5rem',
    },
    
    // Input styling
    input: {
      borderRadius: '0.5rem',
      borderWidth: '1px',
    },
    
    // Navigation styling
    navbar: {
      height: '4rem',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropBlur: true,
    },
  },
  
  // ═════════════════════════════════════════════════════════════════════════════
  // FEATURE TOGGLES
  // ═════════════════════════════════════════════════════════════════════════════
  
  features: {
    // Enable dark mode toggle
    darkMode: true,
    
    // Default theme (light/dark/system)
    defaultTheme: 'light',
    
    // Enable smooth scrolling
    smoothScroll: true,
    
    // Enable animations
    animations: true,
    
    // Enable blur effects (disable for better performance)
    glassmorphism: true,
  },
  
} as const;

// Type export for TypeScript support
export type ThemeConfig = typeof THEME_CONFIG;

/**
 * Generate CSS custom properties from theme config
 * This is used by the apply-template script to generate CSS variables
 */
export function generateCSSVariables(theme: ThemeConfig): string {
  const cssVars: string[] = [];
  
  // Primary colors
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    cssVars.push(`  --primary-${key}: ${value};`);
  });
  
  // Secondary colors
  Object.entries(theme.colors.secondary).forEach(([key, value]) => {
    cssVars.push(`  --secondary-${key}: ${value};`);
  });
  
  // Neutral colors
  Object.entries(theme.colors.neutral).forEach(([key, value]) => {
    cssVars.push(`  --neutral-${key}: ${value};`);
  });
  
  // Semantic colors
  Object.entries(theme.colors.semantic).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (subKey === 'DEFAULT') {
          cssVars.push(`  --${key}: ${subValue};`);
        } else {
          cssVars.push(`  --${key}-${subKey}: ${subValue};`);
        }
      });
    }
  });
  
  // Border radius
  Object.entries(theme.layout.borderRadius).forEach(([key, value]) => {
    cssVars.push(`  --radius-${key}: ${value};`);
  });
  
  return `:root {\n${cssVars.join('\n')}\n}`;
}

export default THEME_CONFIG;
