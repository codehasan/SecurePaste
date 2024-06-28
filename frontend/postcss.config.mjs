/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-preset-env': {
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'not dead'],
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
      },
    },
    tailwindcss: {},
    autoprefixer: {},
    cssnano: {
      preset: 'default',
    },
  },
};

export default config;
