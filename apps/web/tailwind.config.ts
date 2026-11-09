import type { Config } from 'tailwindcss';

const token = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        petal: { DEFAULT: token('petal'), deep: token('petal-deep'), soft: token('petal-soft') },
        botanic: { DEFAULT: token('botanic'), soft: token('botanic-soft'), mist: token('botanic-mist') },
        cream: { DEFAULT: token('cream'), deep: token('cream-deep') },
        gold: { DEFAULT: token('gold'), deep: token('gold-deep') },
        ink: { DEFAULT: token('ink'), soft: token('ink-soft') },
        // Golden-hour palette sampled from the reference photography.
        sun: { cream: token('sun-cream'), peach: token('sun-peach'), apricot: token('sun-apricot'), honey: token('sun-honey'), rose: token('sun-rose'), umber: token('sun-umber') },
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid type scale
        'step--1': ['clamp(0.83rem, 0.8rem + 0.15vw, 0.94rem)', { lineHeight: '1.5' }],
        'step-0': ['clamp(1rem, 0.96rem + 0.2vw, 1.13rem)', { lineHeight: '1.65' }],
        'step-1': ['clamp(1.2rem, 1.12rem + 0.4vw, 1.5rem)', { lineHeight: '1.45' }],
        'step-2': ['clamp(1.44rem, 1.28rem + 0.8vw, 2rem)', { lineHeight: '1.25' }],
        'step-3': ['clamp(1.73rem, 1.45rem + 1.4vw, 2.75rem)', { lineHeight: '1.15' }],
        'step-4': ['clamp(2.07rem, 1.6rem + 2.4vw, 3.9rem)', { lineHeight: '1.05' }],
        'step-5': ['clamp(2.5rem, 1.7rem + 4vw, 5.6rem)', { lineHeight: '1' }],
        'step-6': ['clamp(3rem, 1.4rem + 8vw, 9.5rem)', { lineHeight: '0.92' }],
      },
      spacing: {
        // 8px grid helpers beyond Tailwind defaults
        18: '4.5rem',
        30: '7.5rem',
        section: 'clamp(5rem, 3rem + 8vw, 10rem)',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'power2-out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      },
      maxWidth: { content: '76rem' },
    },
  },
  plugins: [],
} satisfies Config;
