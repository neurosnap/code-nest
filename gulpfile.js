'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var process = require('process');
var mongoose = require('mongoose');

var config = require('./config.js');

mongoose.connection.on('error', console.log);

gulp.task('default', function() {
  babeljs();
});

gulp.task('babel', function() {
  babeljs();
});

gulp.task('popular', function (cb) {
  connect();
  var cn = require('./dist/index.js');
  cn.getPopularRepos(compileUrl('stars'), 1, cb);
  gulp.on('stop', clean_exit);
});

gulp.task('forks', function (cb) {
  connect();
  var cn = require('./dist/index.js');
  cn.getPopularRepos(compileUrl('forks'), 1, cb);
  gulp.on('stop', clean_exit);
});

function connect() {
  var options = {};
  mongoose.connect(config.db, options);
};

function clean_exit() {
  mongoose.disconnect();
  process.exit(0);
}

function compileUrl(sort) {
  return config.github.url + '/search/repositories?access_token=' + config.github.key +
    '&sort=' + sort + '&q=language:javascript&page=';
}

function babeljs(src, dist) {
  if (typeof src === 'undefined') src = './src/**/*.js';
  if (typeof dist === 'undefined') dist = './dist';

  gutil.log('Generating ES6 -> ES5 files');

  return gulp.src(src)
    .pipe(babel({ stage: 0 }))
    .pipe(gulp.dest(dist));
}