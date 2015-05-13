'use strict';

import polyfill from 'babel/polyfill';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import Promise from 'bluebird';
import { Repo } from './models.js';
import lbl from 'n-readlines';

var readdir = Promise.promisify(fs.readdir);

var indent_length = 4;

export var readRepo = Promise.coroutine(function* (dir, name, gulp_cb) {
  let repo_dir = path.join(dir, name);
  let files = yield readdir(repo_dir);
  let indents = [];
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let liner = new lbl(path.join(repo_dir, file));
    let line;
    while (line = liner.next()) {
      line = line.toString('ascii');
      let spaces = 0;
      for (let i = 0; i < line.length; i++) {
        let char = line[i];
        if (char == ' ') spaces++;
        else break;
      }
      let indent = spaces / indent_length;
      /*if (indent % 1) {
        console.log(indent + ': ' + line);
      }*/
      // dont count 0 indent and dont include indents that are fractions
      if (indent != 0 && !(indent % 1)) indents.push(indent);
    }
  }

  console.log('------------');
  console.log(`Repo: ${name}`);
  console.log(`Lines with indents: ${indents.length}`);
  let max_indent = indents.reduce(function(a, b) {
    return (a > b) ? a : b;
  });
  let sum_indent = indents.reduce(function(a, b) { return a + b; });
  let avg_indent = sum_indent / indents.length;
  console.log(`Max Indent: ${max_indent}`);
  console.log(`Avg Indent: ${avg_indent}`);
  console.log(`Sum Indent: ${sum_indent}`);

  let indent_data = {
    max_indent: max_indent,
    sum_indent: sum_indent,
    avg_indent: avg_indent.toFixed(4)
  };
  return yield Repo.update({ name: name }, { $set: indent_data }).exec();
  //let repo = yield Repo.findOne({ name: name }).exec();
  //console.log(repo);

  //if (typeof gulp_cb === 'undefined') return;
  //return gulp_cb();
  //return Promise.resolve();
});

export var read = Promise.coroutine(function* (dir, gulp_cb) {
  let repos = yield readdir(dir);
  for (let i = 0; i < repos.length; i++) {
    let repo = repos[i];
    yield readRepo(dir, repo);
  }
  return gulp_cb();
});