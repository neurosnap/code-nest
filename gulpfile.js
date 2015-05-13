'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var process = require('process');
var mongoose = require('mongoose');

var config = require('./config');

mongoose.connection.on('error', console.log);

gulp.task('babel', function() {
  babeljs();
});

gulp.task('default', ['babel', 'popular', 'forks', 'download', 'format', 'nest', 'save'], function() {
  console.log('Doing it all');
});

gulp.task('popular', function (cb) {
  connect();
  var get = require('./dist/get');
  get.popularRepos(compileUrl('stars'), 20, cb);
  gulp.on('stop', disconnect);
});

gulp.task('forks', function (cb) {
  connect();
  var get = require('./dist/get');
  get.popularRepos(compileUrl('forks'), 20, cb);
  gulp.on('stop', disconnect);
});

gulp.task('download', function(cb) {
  connect();
  var git = require('./dist/git');
  git.clone(cb);
  gulp.on('stop', disconnect);
});

gulp.task('format', function(cb) {
  var beautify = require('./dist/beautify');
  beautify(
    path.join(__dirname, 'repos'),
    path.join(__dirname, 'repos_beauty')
  );
});

gulp.task('nest', function(cb) {
  connect();
  var nest = require('./dist/nest-level');
  var dir = path.join(__dirname, 'repos_beauty');
  nest.read(dir, cb);
  gulp.on('stop', disconnect);
});

gulp.task('save', function() {
  var models = require('./dist/models');
  connect();
  var docs = models.Repo.find().exec(function(err, results) {
    fs.writeFile('./results.json', JSON.stringify(results, null, 2), function(err) {
      if (err) throw err;
      console.log('File results.json saved');
      disconnect();
    });
  });
})

gulp.task('clear_db', function(cb) {
  var models = require('./dist/models');
  connect();
  models.Repo.remove().exec(function(err, results) {
    if (err) throw err;
    disconnect();
  });
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