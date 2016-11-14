module.exports = {
  staticFileGlobs: [
    '**.html',
    '**/*.{html,js}',
    'sources/**.*'
  ],

  skipWaiting: true,
  handleFetch: true,
  runtimeCaching: [{
    urlPattern: /\//,
    handler: 'fastest'
  }]
};
