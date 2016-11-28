'use strict';
const { task, src, series, dest } = require('gulp');
const lwip = require('gulp-lwip');
const { rollup } = require( 'rollup' );
const babel = require('rollup-plugin-babel');
const { writeFileSync } = require('fs');
const vulcanize = require('gulp-vulcanize');
const swPrecache = require('sw-precache');
const browserSync = require('browser-sync').create();
const reload = () => {
  return browserSync.reload;
}
const browserSyncInit = baseDir => {
  browserSync.init({
    port: 5000,
    ui: {
      port: 5001
    },
    server: {
      baseDir: baseDir,
      index: 'index.html'
    }
  });

  if (config.env === 'dist') {
    browserSync.watch(['src/index.html', 'src/**/*.html'])
      .on('change', series('copy', 'vulcanize', reload()));
    browserSync.watch('**/*.{png,jpg}')
      .on('change', series('images', reload()));
  } else {
    browserSync.watch('src/**/*.html').on('change', series('copy:elements', reload()));
    browserSync.watch('src/**/*.js').on('change', series('rollup', reload()));
    browserSync.watch('src/**/*.{png,jpg}').on('change', reload());
  }
}

let config = {};
let lazyResources = ['paper-menu-button', 'paper-icon-button', 'iron-iconset-svg'];

const env = (env, source, elements, bowerComponents, destination=null) => {
  return new Promise((resolve, reject) => {
    try {
      config = {
        env: env,
        source: source,
        elements: elements,
        bowerComponents: bowerComponents,
        destination: destination || env
      }
    } catch (error) {
      reject(error);
    }
    resolve();
  });
}

task('env', () => {
  return env('dev', 'src', '*', '**');
});

task('env:dist', cb => {
  return env('dist', 'dev', '{reeflight-header,reeflight-footer,home-view,icons}',
    '{webcomponentsjs,custom-elements,polymer,firebase,iron-meta,neon-animation,iron-dropdown,paper-styles,iron-icon,paper-behaviors,iron-behaviors,iron-resizable-behavior,iron-overlay-behavior,iron-flex-layout,web-animations-js,paper-ripple,iron-a11y-keys-behavior,iron-fit-behavior}');
});

task('images', () => {
  return src(`${config.source}/sources/**/*.{jpg,png}`)
    .pipe(lwip.resize(256))
    .pipe(dest(`${config.destination}/sources`));
});

task('icons', () => {
  return src(`${config.source}/sources/**/*.svg`)
    .pipe(dest(`${config.destination}/sources`));
});

task('copy:app', () => {
  return src([
    `${config.source}/index.html`,
    `${config.source}/service-worker.js`,
    `${config.source}/manifest.json`,
  ])
    .pipe(dest(config.destination));
});

task('copy:elements', () => {
  return src(`${config.source}/elements/${config.elements}.html`)
    .pipe(dest(`${config.destination}/elements`));
});

task('copy:bower', () => {
  return src(`bower_components/${config.bowerComponents}/**/*.{html,js}`)
    .pipe(dest(`${config.destination}/bower_components`));
});

task('copy', series('copy:app', 'copy:elements', 'copy:bower'));

task('rollup:app', () => {
  // used to track the cache for subsequent bundles
  var cache;

  return rollup({
    entry: 'src/scripts/reeflight-app.js',
    // Use the previous bundle as starting point.
    cache: cache
  }).then(bundle => {
    // Cache our bundle for later use (optional)
    cache = bundle;

    bundle.write({
      format: 'cjs',
      plugins: [ babel() ],
      dest: 'dev/scripts/reeflight-app.js'
    });
  });
});

task('rollup', series('rollup:app'));

task('vulcanize', () => {
  return src('dev/index.html')
    .pipe(vulcanize({
        inlineScripts: true,
        inlineCss: true
    }))
    .pipe(dest(config.destination));
});

task('browser-sync', () => {
  return browserSyncInit(config.destination);
});

task('precache', () => {
  return swPrecache.write(__dirname + '/dist/service-worker.js', {
    staticFileGlobs: [
      'dist/**.html',
      'dist/**/*.{html,js}',
      'dist/sources/**.*'
    ],
    stripPrefix: 'dist',

    skipWaiting: true,
    handleFetch: true,
    runtimeCaching: [{
      urlPattern: /\//,
      handler: 'cacheFirst'
    }]
  });
});
// Main Tasks
task('default', series('rollup', 'images', 'icons', 'copy'))

task('build-dev', series('env', 'default'));

task('build', series('build-dev', 'env:dist', 'default', 'vulcanize', 'precache'))

task('serve', series('env', 'default', 'browser-sync'));

task('serve:dist', series('build', 'browser-sync'))
