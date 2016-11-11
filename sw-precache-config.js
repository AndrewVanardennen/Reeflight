module.exports = {
  staticFileGlobs: [
    'public/**.html',
    'public/**/*.html',
    'public/images/**.*'
  ],
  
  skipWaiting: true,
  handleFetch: true,
  runtimeCaching: [{
    urlPattern: /\//,
    handler: 'fastest'
  }]
};
