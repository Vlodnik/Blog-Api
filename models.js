'use strict';

const mongoose = require('mongoose');
const uuid = require('uuid');

const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  },
  created: {type: Date, default: Date.now}
});

blogPostSchema.virtual('authorString').get(function() {
  return `${ this.author.firstName } ${ this.author.lastName }`.trim()
});

blogPostSchema.methods.serialize = function() {
  return {
    id: this.id,
    title: this.title,
    content: this.content,
    author: this.authorString,
    created: this.created
  };
}

const Blogpost = mongoose.model('Blogpost', blogPostSchema);

module.exports = { Blogpost };

