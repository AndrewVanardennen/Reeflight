'use strict';
const { task, src, series, dest } = require('gulp');
const lwip = require('gulp-lwip');

task('images', () => {
  return src('src/public/sources/**/*.{jpg,png}')
    .pipe(lwip.resize(256))
    .pipe(dest('dist/public/sources'));
});

task('default', series('images'))
