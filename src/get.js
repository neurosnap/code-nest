'use strict';

import polyfill from 'babel/polyfill';
import Promise from 'bluebird';
import { get } from 'needle';
var getAsync = Promise.promisify(get);

import { Repo } from './models';
import { MAX_SIZE } from './constants';

var blacklist = ['dataanalysis', 'engine'];

export var popularRepos = Promise.coroutine(function* (url, num_pages, gulp_cb) {
  for (let i = 1; i <= num_pages; i++) {
    let url_page = url + i;
    let res;
    try {
      console.log(`Grabbing: ${url_page}`);
      res = yield getAsync(url_page);
    } catch (e) {
      console.log(e);
      continue;
    }
    let body = res[0].body;

    if (!body.hasOwnProperty('items')) continue;

    for (let i = 0; i < body.items.length; i++) {
      let data = body.items[i];
      let repo_exists = yield Repo.find({ name: data.name }).exec();
      if (repo_exists.length > 0) {
        console.log(`Repo [${data.name}] already exists, skipping`);
        continue;
      }

      if (data.size > MAX_SIZE) {
        console.log(`Repo [${data.name}] too large, skipping`);
        continue;
      }

      if (blacklist.indexOf(data.name) >= 0) {
        console.log(`Repo [${data.name}] blacklisted, skipping`);
      }

      let repo = new Repo({
        name: data.name,
        html_url: data.html_url,
        git_url: data.git_url,
        ssh_url: data.ssh_url,
        size: data.size,
        stargazers_count: data.stargazers_count,
        forks: data.forks,
      });

      let result;
      try {
        result = yield repo.save();
      } catch (e) {
        console.log(e);
        continue;
      }
      console.log(result);
    }
  }

  if (typeof gulp_cb === 'undefined') return;
  return gulp_cb();
});