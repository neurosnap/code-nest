'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');

gulp.task('default', function() {
  babeljs();
});

gulp.task('babel', function() {
  babeljs();
});

gulp.task('popular', function() {
  var cn = require('./dist/index.js');
  cn.getPopularRepos();
});

function babeljs(src, dist) {
  if (typeof src === 'undefined') src = './src/**/*.js';
  if (typeof dist === 'undefined') dist = './dist';

  gutil.log('Generating ES6 -> ES5 files');

  return gulp.src(src)
    .pipe(babel({ stage: 0 }))
    .pipe(gulp.dest(dist));
}