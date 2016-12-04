'use strict';
const {task, src, series, dest} = require('gulp');
const del = require('del');
const lwip = require('gulp-lwip');
const {rollup} = require( 'rollup' );
const babel = require('rollup-plugin-babel');
const {readFileSync, writeFileSync, writeFile} = require('fs');
const vulcanize = require('gulp-vulcanize');
const swPrecache = require('sw-precache');
const browserSync = require('browser-sync').create();
const reload = () => {
  return browserSync.reload;
};
const browserSyncInit = baseDir => {
  browserSync.init({
    port: 5000,
    ui: {
      port: 5001
    },
    server: {
      baseDir: [baseDir, '.tmp'],
      index: 'index.html'
    }
  });

  if (config.env === 'dist') {
    browserSync.watch(['src/index.html', 'src/**/*.html'])
      .on('change', series('copy', 'vulcanize', reload()));
    browserSync.watch('src/**/*.js')
      .on('change', series('rollup', 'vulcanize', reload()));
    browserSync.watch('**/*.{png,jpg}')
      .on('change', series('images', reload()));
  } else {
    browserSync.watch('src/**/*.html')
      .on('change', series('copy:elements', reload()));
    browserSync.watch('src/**/*.js')
      .on('change', series('rollup', reload()));
    browserSync.watch('src/**/*.{png,jpg}').on('change', reload());
  }
};

let config = {};

const env = (env, source, elements, bowerComponents, destination=null) => {
  return new Promise((resolve, reject) => {
    try {
      config = {
        env: env,
        source: source,
        elements: elements,
        bowerComponents: bowerComponents,
        destination: env
      };
    } catch (error) {
      reject(error);
    }
    resolve();
  });
};

task('clean', cb => {
  let glob = config.env;
  if (config.env === 'dev') {
    glob = ['dev', '.tmp'];
  }
   del([glob]).then(cb());
 });

task('env', () => {
  return env('dev', 'src', '**/*', '**');
});

task('env:dist', cb => {
  return env('dist', 'dev', 'reef-slider', '{webcomponentsjs,custom-elements,polymer,firebase,iron-meta,neon-animation,iron-dropdown,paper-styles,iron-icon,iron-range-behavior,paper-progress,iron-behaviors,iron-resizable-behavior,iron-overlay-behavior,iron-flex-layout,web-animations-js,paper-ripple,iron-a11y-keys-behavior,iron-fit-behavior}');
});

task('images:resize', () => {
  return src([`${config.source}/sources/**/*.{jpg,png}`])
    .pipe(lwip.resize(256))
    .pipe(dest('.tmp/sources'));
});

task('images:copy', () => {
  return src(['.tmp/sources/**/*.{jpg,png}'])
    .pipe(dest(`${config.destination}/sources`));
});

task('images', series('images:resize'));

task('icons', () => {
  return src(`${config.source}/sources/**/*.svg`)
    .pipe(dest(`.tmp/sources`));
});

task('icons:copy', () => {
  return src(`.tmp/sources/**/*.svg`)
    .pipe(dest(`${config.destination}/sources`));
});

task('copy:app', () => {
  return src([
    `${config.source}/index.html`,
    `${config.source}/service-worker.js`,
    `src/manifest.json`
  ])
    .pipe(dest(config.destination));
});

task('copy:elements', () => {
  return src([`${config.source}/elements/${config.elements}.html`])
    .pipe(dest(`${config.destination}/elements`));
});

task('copy:views', () => {
  return src(`${config.source}/elements/views/*.html`)
    .pipe(dest(`${config.destination}/elements/views`));
});

task('copy:bower', () => {
  return src(`bower_components/${config.bowerComponents}/**/*.{html,js}`)
    .pipe(dest(`${config.destination}/bower_components`));
});

task('copy', series('copy:app', 'copy:elements',
  'copy:views', 'copy:bower'));

task('rollup:app', () => {
  // used to track the cache for subsequent bundles
  let cache;

  return rollup({
    entry: 'src/scripts/reeflight-app.js',
    // Use the previous bundle as starting point.
    cache: cache
  }).then(bundle => {
    // Cache our bundle for later use (optional)
    cache = bundle;

    bundle.write({
      format: 'cjs',
      plugins: [babel()],
      dest: `${config.destination}/scripts/reeflight-app.js`
    });
  });
});

task('rollup', series('rollup:app'));

task('vulcanize:prepare', cb => {
  let index = readFileSync('dev/index.html');
  let file = readFileSync('dev/elements/app-imports.html');
  let app = readFileSync('dev/elements/reeflight-app.html');
  index = index.toString();
  file = file.toString();
  app = app.toString();
  index = index.replace(/reeflight-app>/g, 'reeflight-app is-vulcanized>');
  file += app;
  writeFileSync('dev/index.html', index);
  writeFile('dev/elements/reeflight-app.html', file, cb());
});

task('vulcanize:run', () => {
  return src('dev/index.html')
    .pipe(vulcanize({
        inlineScripts: true,
        inlineCss: true,
        excludes: [
          'dev/elements/reef-view.html',
          'bower_components/webcomponentsjs/webcomponents.js',
          'bower_components/polymer/polymer.html',
          'bower_components/polymer/src/legacy/polymer-fn.html',
          'bower_components/paper-progress/paper-progress.html'
        ]
    }))
    .pipe(dest(config.destination));
});

task('vulcanize', series('vulcanize:prepare', 'vulcanize:run'));

task('browser-sync', () => {
  return browserSyncInit(config.destination);
});

task('precache', () => {
  return swPrecache.write(__dirname + '/dist/service-worker.js', {
    staticFileGlobs: [
      'dist/**.html',
      'dist/manifest.json',
      'dist/elements/*.{html,js}',
      'dist/elements/**/*.{html,js}',
      'dist/bower_components/{polymer,firebase,paper-progress}/*.{html,js}',
      'dist/bower_components/paper-styles/*.html',
      'dist/bower_components/iron-range-behavior/*.html',
      'dist/bower_components/iron-flex-layout/*.html',
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
task('sources', series('images:copy', 'icons:copy'));

task('default', series('clean', 'images', 'icons', 'copy', 'rollup'));

task('build-dev', series('env', 'default'));

task('build', series('build-dev', 'env:dist', 'default', 'sources',
  'vulcanize', 'precache'));

task('serve', series('env', 'default', 'browser-sync'));

task('serve:dist', series('build', 'browser-sync'));
