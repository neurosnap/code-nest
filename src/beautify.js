'use strict';

import fs from 'fs';
import path from 'path';
import walk from 'walk';
import { js_beautify } from 'js-beautify';

export default function format(src, dist) {
  try {
    fs.statSync(src);
  } catch(err) { throw err; }

  try {
    fs.mkdirSync(dist);
  } catch (e) {}

  var github_list = fs.readdirSync(src);
  var filters = ['.git'];

  var walker = walk.walk(src, {
    followLinks: false,
    filters: filters
  });

  walker.on('file', function(root, file_stat, next) {
    var fname = file_stat.name;
    if (path.extname(fname) != '.js' || fname.indexOf('.min.js') != -1) {
      next();
      return;
    }

    var sdir = root.split(path.sep);

    var new_dir;
    for (var i = 0; i < sdir.length; i++) {
      if (github_list.indexOf(sdir[i]) !== -1) {
        new_dir = sdir[i];
        break;
      }
    }

    var new_output_dir = path.join(dist, new_dir);
    try {
      fs.mkdirSync(new_output_dir);
    } catch (e) {}

    fs.readFile(path.resolve(root, fname), 'utf-8', function (err, data) {
      if (err) throw err;

      var beauty = js_beautify(data, { indent_size: 4 });

      var new_file = path.join(new_output_dir, fname);
      try {
        if (fs.statSync(new_file).isFile()) {
          var parse = path.parse(new_file);
          new_file = path.join(parse.dir, parse.name + new Date().getTime().toString() + parse.ext);
        }
      } catch (e) {}
      //console.log(new_file);
      fs.writeFile(new_file, beauty, function(err) {
        if (err) throw err;
        console.log(new_file + ' saved');
      });
      next();
    });
  });
}