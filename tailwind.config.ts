import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: { colors: { ink: '#172033', brand: '#5b5ce2', mint: '#dff8ed' }, boxShadow: { soft: '0 18px 50px rgba(23,32,51,.08)' } } },
  plugins: []
};
export default config;
