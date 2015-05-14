'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var process = require('process');
var mongoose = require('mongoose');

var config = require('./config');

mongoose.connection.on('error', gutil.log);

gulp.task('babel', function() {
  babeljs();
});

gulp.task('popular', function (cb) {
  connect();
  var get = require('./dist/get');
  get.popularRepos(compileUrl('stars'), 2, cb);
  gulp.on('stop', disconnect);
});

gulp.task('forks', function (cb) {
  connect();
  var get = require('./dist/get');
  get.popularRepos(compileUrl('forks'), 1, cb);
  gulp.on('stop', disconnect);
});

gulp.task('download', function(cb) {
  connect();
  var git = require('./dist/git');
  git.clone(path.join(__dirname, 'repos'), cb);
  gulp.on('stop', disconnect);
});

gulp.task('format', function(cb) {
  connect();
  var beautify = require('./dist/beautify');
  beautify(
    path.join(__dirname, 'repos'),
    path.join(__dirname, 'repos_beauty'),
    cb
  );
  gulp.on('stop', disconnect);
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
      gutil.log('File results.json saved');
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

gulp.task('total', function(cb) {
  var models = require('./dist/models');
  connect();
  models.Repo.find().exec(function(err, results) {
    if (err) throw err;
    gutil.log('Total repos: ' + results.length);
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

function compileUrl(sort, lang) {
  if (typeof sort === 'undefined') sort = 'stars';
  if (typeof lang === 'undefined') lang = 'javascript';

  return config.github.url + '/search/repositories?access_token=' + config.github.key +
    '&sort=' + sort + '&q=language:' + lang + '&page=';
}

function babeljs(src, dist) {
  if (typeof src === 'undefined') src = './src/**/*.js';
  if (typeof dist === 'undefined') dist = './dist';

  gutil.log('Generating ES6 -> ES5 files');

  return gulp.src(src)
    .pipe(babel({ stage: 0 }))
    .pipe(gulp.dest(dist));
}