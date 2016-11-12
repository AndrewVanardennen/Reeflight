module.exports = {
  staticFileGlobs: [
    '**.html',
    '**/*.html',
    'images/**.*'
  ],

  skipWaiting: true,
  handleFetch: true,
  runtimeCaching: [{
    urlPattern: /\//,
    handler: 'fastest'
  }]
};
