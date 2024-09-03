import { colors, nextui } from '@nextui-org/theme';
import type { Config } from 'tailwindcss';

const theme1 = {
  colors: {
    primary: {
      '50': '#fff2f1',
      '100': '#ffe4e1',
      '200': '#ffcec8',
      '300': '#ffaba1',
      '400': '#fe7161',
      '500': '#f74f3c',
      '600': '#e4321e',
      '700': '#c02615',
      '800': '#9f2315',
      '900': '#832419',
      '950': '#480e07',
      DEFAULT: '#fe7161',
      foreground: '#fff',
    },
    secondary: {
      '50': '#f4f7ee',
      '100': '#e7eed9',
      '200': '#c6d7a6',
      '300': '#b3c98d',
      '400': '#97b467',
      '500': '#79984a',
      '600': '#5e7838',
      '700': '#495d2e',
      '800': '#3c4b29',
      '900': '#354126',
      '950': '#1a2211',
      DEFAULT: '#97b467',
      foreground: '#fff',
    },
    matter: {
      '50': '#f7f7f8',
      '100': '#eeeef0',
      '200': '#d9d9de',
      '300': '#b8b9c1',
      '400': '#91939f',
      '500': '#737584',
      '600': '#5d5e6c',
      '700': '#4c4d58',
      '800': '#41414b',
      '900': '#393941',
      '950': '#18181b',
      DEFAULT: '#18181b',
      foreground: '#fff',
    },
    foreground: {
      '50': '#ffffff',
      '100': '#efefef',
      '200': '#dcdcdc',
      '300': '#bdbdbd',
      '400': '#989898',
      '500': '#7c7c7c',
      '600': '#656565',
      '700': '#525252',
      '800': '#464646',
      '900': '#3d3d3d',
      '950': '#292929',
    },

    background: {
      '950': '#686B69',
      '900': '#5C605E',
      '800': '#515554',
      '700': '#464A49',
      '600': '#3B3E3E',
      '500': '#2F3233',
      '400': '#242628',
      '300': '#1C1D1F',
      '200': '#131416',
      '100': '#0B0C0C',
      '50': '#030303',
      DEFAULT: '#242628',
      foreground: '#fff',
    },
  },
};

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: theme1.colors,
      gap: {
        default: '1rem',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      prefix: 'nextui', // prefix for themes variables
      addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
      defaultTheme: 'dark', // default theme from the themes object
      defaultExtendTheme: 'dark', // default theme to extend on custom themes
      layout: {}, // common layout tokens (applied to all themes)
      themes: {
        light: {
          layout: {}, // light theme layout tokens
          colors: {}, // light theme colors
        },
        dark: {
          layout: {}, // dark theme layout tokens
          colors: {
            ...theme1.colors,
          }, // dark theme colors
        },
      },
    }),
  ],
};
export default config;
