'use strict';
const {task, src, series, dest} = require('gulp');
const merge = require('merge-stream');
const del = require('del');
const {rollup} = require( 'rollup' );
const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');
const {readFileSync, writeFileSync, writeFile} = require('fs');
const vulcanize = require('gulp-vulcanize');
const swPrecache = require('sw-precache');
const browserSync = require('browser-sync').create();
const injectTemplate = require('gulp-inject-html-template');
const _if = require('gulp-if');

task('css', () => {
	const postcss = require('gulp-postcss');
	const sourcemaps = require('gulp-sourcemaps');
	const autoprefixer = require('autoprefixer');
});

task('build', series('css'));

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
      baseDir: [baseDir, '.tmp', 'bower_components'],
      index: 'index.html'
    }
  });

  if (config.env === 'dist') {
    browserSync.watch(['src/index.html', 'src/**/*.html'])
      .on('change', series('copy', 'vulcanize', reload()));
    browserSync.watch('src/**/*.js')
      .on('change', series('rollup', 'vulcanize', reload()));
    // browserSync.watch('**/*.{png,jpg}')
    //   .on('change', series('images', reload()));
  } else {
    browserSync.watch('src/**/*.html')
      .on('change', series('build', reload()));
    browserSync.watch('src/**/*.js')
      .on('change', series('copy:scripts', 'inject', 'rollup', reload()));
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
  let glob = `[${config.env}]`;
  if (config.env === 'dev') {
    glob = ['dev', '.tmp'];
  }
   del(glob).then(cb());
 });

task('env', () => {
  return env('dev', 'src', '**/*', '{*,**/*}');
});

task('env:dist', cb => {
	let comps = '{webcomponentsjs,custom-elements,web-animations-js,firebase,svg-iconset,pouchdb,time-picker}';
  return env('dist', 'dev', null, comps);
});

task('images:resize', () => {
  // return src([`${config.source}/sources/**/*.{jpg,png}`])
  //   .pipe(lwip.resize(256))
  //   .pipe(dest('.tmp/sources'));
});

task('images:copy', () => {
  return src(['.tmp/sources/**/*.{jpg,png}'])
    .pipe(dest(`${config.destination}/sources`));
});

// task('images', series('images:resize'));

// task('icons', () => {
//   return src(`${config.source}/sources/**/*.svg`)
//     .pipe(dest(`.tmp/sources`));
// });
//
// task('icons:copy', () => {
//   return src(`.tmp/sources/**/*.svg`)
//     .pipe(dest(`${config.destination}/sources`));
// });

task('copy:app', () => {
  return src([
    `${config.source}/index.html`,
    `${config.source}/service-worker.js`,
    `src/manifest.json`
  ])
    .pipe(dest(config.destination));
});

task('copy:styles', () => {
  return src([
    `${config.source}/styles/**/*.css`
  ])
    .pipe(dest(`${config.destination}/styles`));
});

task('copy:elements', cb => {
  if (config.elements === null) {
    return cb();
  }
  return src([`${config.source}/elements/${config.elements}.html`])
    .pipe(dest(`${config.destination}/elements`));
});

task('copy:views', () => {
  return src(`${config.source}/scripts/views/*.html`)
    .pipe(dest(`${config.destination}/scripts/views`));
});

task('copy:bower', cb => {
  if (config.env !== 'dist') {
    return src(`bower_components/${config.bowerComponents}/**/*.{html,js}`)
      .pipe(dest(`${config.destination}/bower_components`));
  } else {
		return src(`bower_components/firebase/**/*.{html,js}`)
      .pipe(dest(`${config.destination}/bower_components/firebase`));
  }
  return cb();
});

task('copy:scripts', () => {
  return src(`${config.source}/scripts/**/*.{js,html}`)
    .pipe(dest('.tmp/scripts/'));
});

task('copy:sources', () => {
	return src(['src/sources/profiles.json']).pipe(dest('.tmp/sources'));
});

task('copy', series('copy:app', 'copy:styles', 'copy:elements',
  'copy:views', 'copy:bower', 'copy:scripts', 'copy:sources'));

task('rollup:app', () => {
  // used to track the cache for subsequent bundles
  let cache;

  return rollup({
    entry: '.tmp/scripts/reeflight-app.js',
    // Use the previous bundle as starting point.
    cache: cache
  }).then(bundle => {
    // Cache our bundle for later use (optional)
    cache = bundle;

    bundle.write({
      format: 'cjs',
      plugins: [json(), babel()],
      dest: `${config.destination}/scripts/reeflight-app.js`
    });
  });
});

task('rollup', series('rollup:app'));

task('vulcanize:prepare', cb => {
  let index = readFileSync('dev/index.html');
  // let file = readFileSync('dev/elements/app-imports.html');
  // let app = readFileSync('dev/elements/reeflight-app.html');
  index = index.toString();
  // file = file.toString();
  // app = app.toString();
  index = index.replace(/reeflight-app>/g, 'reeflight-app is-vulcanized>');
  // file += app;
  writeFileSync('dev/index.html', index);
  cb();
  // writeFile('dev/elements/reeflight-app.html', file, cb());
});

task('vulcanize:run', () => {
  return src('dev/index.html')
    .pipe(vulcanize({
        inlineScripts: true,
        inlineCss: true,
				stripComments: true,
				addedImports: [
					'src/elements/icons.html'
				],
        excludes: [
					'bower_components/svg-icon/svg-icon.html',
					'bower_components/svg-iconset/svg-iconset.html',
					'bower_components/firebase/firebase.js',
					'bower_components/firebase/firebase-app.js',
					'bower_components/firebase/firebase-auth.js',
					'bower_components/firebase/firebase-database.js'
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
			'elements/icons.html',
      'dist/**.html',
      'dist/manifest.json',
      'dist/elements/*.{html,js}',
      'dist/elements/**/*.{html,js}',
      `bower_components/**/{custom-elements.min,webcomponents-lite}.js`,
			'bower_components/**/{svg-icon,svg-iconset,time-picker}.html',
      'dist/bower_components/svg-iconset/svg-iconset.html',
			'!bower_components/firebase/firebase.js',
			'!bower_components/firebase/firebase-app.js',
			'!bower_components/firebase/firebase-auth.js',
			'!bower_components/firebase/firebase-database.js',
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

task('inject', () => {
  return src(['.tmp/scripts/**/*.js'])
    .pipe(injectTemplate()).pipe(dest('.tmp/scripts'));
});
// Main Tasks
task('sources', series('images:copy'));

task('default', series('clean', 'copy', 'inject', 'rollup'));

task('build-dev', series('env', 'default'));


task('serve', series('env', 'default', 'browser-sync'));

task('serve:dist', series('build', 'browser-sync'));
