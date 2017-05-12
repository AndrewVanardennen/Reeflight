module.exports = {
  staticFileGlobs: [
    'dist/bundled/*.{html,js}',
		'dist/bundled/bower_components/**/*',
		'dist/bundled/node_modules/**/*.{html,js}',
    'dist/bundled/sources/**/*'
  ],
	stripPrefix: 'dist/bundled',

  skipWaiting: true,
  handleFetch: true,
  runtimeCaching: [{
    urlPattern: /\//,
    handler: 'fastest'
  }]
};
