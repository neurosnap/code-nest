'use strict';

import polyfill from 'babel/polyfill';
import fs from 'fs';
import path from 'path';
import walk from 'walk';
import Promise from 'bluebird';
import { js_beautify } from 'js-beautify';

import { Repo } from './models';

module.exports = Promise.coroutine(function* format(src, dist, gulp_cb) {
  try {
    fs.statSync(src);
  } catch(err) { throw err; }

  try {
    fs.mkdirSync(dist);
  } catch (e) {}

  let github_list = fs.readdirSync(src);
  let repos = yield Repo.find().exec();

  let filters = ['.git'];
  let walker = walk.walk(src, {
    followLinks: false,
    filters: filters
  });

  walker.on('file', function (root, file_stat, next) {
    let fname = file_stat.name;
    if (path.extname(fname) != '.js' || fname.indexOf('.min.js') != -1) {
      next();
      return;
    }

    let sdir = root.split(path.sep);

    let new_dir;
    for (let i = 0; i < sdir.length; i++) {
      if (github_list.indexOf(sdir[i]) !== -1) {
        new_dir = sdir[i];
        break;
      }
    }

    // determine if repo has already been beautified
    let found = false;
    for (let i = 0; i < repos.length; i++) {
      let repo = repos[i];
      if (repo.name == new_dir && repo.sum_indent) {
        found = true;
        break;
      }
    }
    if (found) {
      console.log(`Already have data for [${new_dir}], skipping ...`);
      next();
      return;
    }

    let new_output_dir = path.join(dist, new_dir);
    try {
      fs.mkdirSync(new_output_dir);
    } catch (e) {}

    fs.readFile(path.resolve(root, fname), 'utf-8', function (err, data) {
      if (err) throw err;

      let beauty = js_beautify(data, { indent_size: 4 });

      let new_file = path.join(new_output_dir, fname);
      try {
        fs.statSync(new_file)
        let parse = path.parse(new_file);
        new_file = path.join(parse.dir, parse.name + new Date().getTime().toString() + parse.ext);
      } catch (e) {}
      //console.log(new_file);
      fs.writeFile(new_file, beauty, function(err) {
        if (err) throw err;
        console.log(new_file + ' saved');
      });
      next();
    });
  }).on('end', function() {
    console.log('All done');
    gulp_cb();
  });
});