'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var jscs = require('gulp-jscs');
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
  var cn = require('./dist/get.js');
  cn.getPopularRepos(compileUrl('stars'), 1, cb);
  gulp.on('stop', disconnect);
});

gulp.task('forks', function (cb) {
  connect();
  var get = require('./dist/get.js');
  get.popularRepos(compileUrl('forks'), 1, cb);
  gulp.on('stop', disconnect);
});

gulp.task('download', function(cb) {
  connect();
  var git = require('./dist/git.js');
  git.clone(cb);
  gulp.on('stop', disconnect);
});

gulp.task('format', function(cb) {
  return gulp.src(['./repos/**/*.js', '!*.min.js'])
    .pipe(jscs({ fix: true, preset: 'airbnb' }))
    .pipe(gulp.dest('./repos_jscs'));
});

function connect() {
  mongoose.connect(config.db);
}

function disconnect() {
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