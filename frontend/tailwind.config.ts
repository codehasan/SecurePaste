import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#0d6efd',
          'primary-content': '#ffffff',
          secondary: '#6610f2',
          'secondary-content': '#ffffff',
          accent: '#24b744',
          'accent-content': '#ffffff',
          neutral: '#000000',
          'neutral-content': '#ffffff',
          'base-100': '#f8f8fa',
          'base-200': '#e5e7eb',
          'base-300': '#e5e7eb',
          'base-content': '#000000',
          info: '#0dcaf0',
          'info-content': '#000111',
          success: '#198754',
          'success-content': '#ffffff',
          warning: '#ffc107',
          'warning-content': '#000000',
          error: '#dc3545',
          'error-content': '#ffffff',
        },
      },
    ],
    logs: false,
  },
};
export default config;
