/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '375px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
    },
    fontFamily: {
      'atyp-display': ['var(--font-atyp-display)'],
      'atyp-text': ['var(--font-atyp-text)'],
      'monument-extended': ['var(--font-monument-extended)'],
    },
    extend: {
      margin: {
        'header-displacement': 'var(--header-displacement)',
      },
      padding: {
        'header-displacement': 'var(--header-displacement)',
      },
      colors: {
        session: {
          green: 'var(--session-green)',
          black: 'var(--session-black)',
          white: 'var(--session-white)',
          text: 'var(--session-text)',
        },
        destructive: '#FF4D4D',
        text: {
          primary: 'var(--session-text)',
          gradient: 'session-text-gradient',
        },
        background: {
          DEFAULT: 'var(--session-background)',
          module: 'var(--session-module-gradient)',
        },
        gray: {
          lightest: 'var(--session-gray-lightest)',
          lighter: 'var(--session-gray-lighter)',
          light: 'var(--session-gray-light)',
          DEFAULT: 'var(--session-gray-DEFAULT)',
          dark: 'var(--session-gray-dark)',
        },
        green: {
          DEFAULT: '#31F196',
          50: '#DDFDEE',
          100: '#CAFBE4',
          200: '#A4F9D0',
          300: '#7DF6BD',
          400: '#57F4A9',
          500: 'var(--session-green)',
          600: '#0FDB7A',
          700: '#0BA65D',
          800: '#087240',
          900: '#043D22',
          950: '#022314',
        },
        black: 'var(--session-black)',
      },
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))',
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))',
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))',
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))',
      },
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))',
      },
    },
    keyframes: {
      'accordion-down': {
        from: { height: '0' },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: '0' },
      },
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
    },
  },
  variants: {
    extend: {
      animation: ['hover'],
      backgroundColor: ['selection'],
      blur: ['hover'],
      borderWidth: ['first'],
      borderRadius: ['last'],
      display: ['group-hover', 'hover'],
      filter: ['hover'],
      transitionDuration: ['group-hover'],
    },
  },
  plugins: [require('tailwindcss-selection-variant')],
};
