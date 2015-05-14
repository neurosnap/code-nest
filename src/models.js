'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var RepoSchema = new Schema({
  name: { type: String, default: '', trim: true },
  html_url: { type: String, default: '', trim: true },
  git_url: { type: String, default: '', trim: true },
  ssh_url: { type: String, default: '', trim: true },
  size: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  stargazers_count: { type: Number, default: 0 },
  max_indent: { type: Number, default: 0 },
  avg_indent: { type: Number, default: 0.0 },
  sum_indent: { type: Number, default: 0 },
  num_files: { type: Number, default: 0 }
});

module.exports = {
  Repo: mongoose.model('Repo', RepoSchema)
};