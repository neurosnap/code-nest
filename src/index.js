'use strict';

import polyfill from 'babel/polyfill';
import _ from 'lodash';
import Promise from 'bluebird';
import { get } from 'needle';
var getAsync = Promise.promisify(get);

import { github } from '../config.js';

// Required to handle an array of promises
// https://github.com/petkaantonov/bluebird/blob/master/API.md#promisecoroutineaddyieldhandlerfunction-handler---void
Promise.coroutine.addYieldHandler(function(yielded_value) {
  if (Array.isArray(yielded_value)) return Promise.all(yielded_value);
});

export var getPopularRepos = Promise.coroutine(function* () {
  let url = `https://api.github.com/search/repositories?sort=stars&q=language:javascript&access_token=${github.key}&page=`;
  let max_page = 10;

  for (let i = 1; i <= max_page; i++) {
    let url_page = url + i;
    //console.log(url_page);
    let repo = yield getAsync(url_page);
    let repos = repo[0].body;
    _.each(repos, function(data) {
      console.log(data);
      let store = {
        name: data.name,
        git_url: data.git_url,
        ssh_url: data.ssh_url,
        size: data.size,
        stargazers_count: data.stargazers_count,
        forks: data.forks,
      };
      console.log(store);
    });
  }
});

export var getPopularForkedRepos = Promise.coroutine(function* () {

});