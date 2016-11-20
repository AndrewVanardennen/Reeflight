'use strict';
const { task, src, series, dest } = require('gulp');
const lwip = require('gulp-lwip');
const vulcanize = require('gulp-vulcanize');
const browserSync = require('browser-sync').create();

const reload = () => {
  return browserSync.reload;
}
const browserSyncInit = (baseDir, env='dev') => {
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

  if (env === 'dist') {
    browserSync.watch(['src/public/index.html', 'src/public/**/*.html'])
      .on('change', series('vulcanize', reload()));
    browserSync.watch('**/*.{png,jpg}')
      .on('change', series('images', reload()));
  } else {
    browserSync.watch('**/*.html').on('change', reload());
    browserSync.watch('**/*.{png,jpg}').on('change', reload());
  }
}

task('images', () => {
  return src('src/public/sources/**/*.{jpg,png}')
    .pipe(lwip.resize(256))
    .pipe(dest('dist/public/sources'));
});

task('vulcanize', () => {
  return src('src/public/index.html')
    .pipe(vulcanize({
        excludes: [],
        stripExcludes: false,
        inlineScripts: true,
        inlineCss: true
    }))
    .pipe(dest('dist/public'));
});

task('browser-sync:dist', () => {
  return browserSyncInit('./dist/public', 'dist');
});

task('browser-sync', () => {
  return browserSyncInit('./src/public');
});

// Main Tasks
task('default', series('images', 'vulcanize'))

task('serve', series('browser-sync'));

task('serve:dist', series('default', 'browser-sync:dist'))
