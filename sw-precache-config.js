module.exports = {
  staticFileGlobs: [
    '**.html',
    '**/*.{html,js}',
		'!bower_components/firebase/*',
    'sources/**.*'
  ],

  skipWaiting: true,
  handleFetch: true,
  runtimeCaching: [{
    urlPattern: /\//,
    handler: 'fastest'
  }]
};
