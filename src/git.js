'use strict';

import polyfill from 'babel/polyfill';
import util from 'util';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import Promise from 'bluebird';
import { get } from 'needle';

import { Repo } from './models';
import { MAX_SIZE } from './constants';

var execAsync = Promise.promisify(exec);
var getAsync = Promise.promisify(get);
var mkdirAsync = Promise.promisify(fs.mkdir);

export var clone = Promise.coroutine(function* (repo_dir, gulp_cb) {
  let repos = yield Repo.find().exec();
  if (!repos.length) {
    console.log('No repos found in mongodb, exiting');
    return;
  }

  console.log(`Starting to download ${repos.length} github repos ... this may take awhile`);

  try {
    yield mkdirAsync(repo_dir, 484);
  } catch (e) {
    console.log('Repo folder already exists, skipping ...');
  }

  for (let i = 0; i < repos.length; i++) {
    let repo = repos[i];
    if (repo.size > MAX_SIZE) {
      console.log(`${repo.name} is too large, skipping ...`);
      continue;
    }
    try {
      console.log(`Cloning ${repo.git_url} ...`);
      let out = yield execAsync(`git clone ${repo.git_url}`, { cwd: repo_dir });
      console.log(out[1]);
    } catch (e) {
      console.log(`Folder already exists, skipping: ${e} ...`);
    }
  }

  if (typeof gulp_cb === 'undefined') return;
  return gulp_cb();
});