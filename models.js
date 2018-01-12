// // This module provides volatile storage, using a `BlogPost`
// // model. We haven't learned about databases yet, so for now
// // we're using in-memory storage. This means each time the app stops, our storage
// // gets erased.

// // Don't worry too much about how BlogPost is implemented.
// // Our concern in this example is with how the API layer
// // is implemented, and getting it to use an existing model.


// function StorageException(message) {
//    this.message = message;
//    this.name = "StorageException";
// }

// const BlogPosts = {
//   create: function(title, content, author, publishDate) {
//     const post = {
//       id: uuid.v4(),
//       title: title,
//       content: content,
//       author: author,
//       publishDate: publishDate || Date.now()
//     };
//     this.posts.push(post);
//     return post;
//   },
//   get: function(id=null) {
//     // if id passed in, retrieve single post,
//     // otherwise send all posts.
//     if (id !== null) {
//       return this.posts.find(post => post.id === id);
//     }
//     // return posts sorted (descending) by
//     // publish date
//     return this.posts.sort(function(a, b) {
//       return b.publishDate - a.publishDate
//     });
//   },
//   delete: function(id) {
//     const postIndex = this.posts.findIndex(
//       post => post.id === id);
//     if (postIndex > -1) {
//       this.posts.splice(postIndex, 1);
//     }
//   },
//   update: function(updatedPost) {
//     const {id} = updatedPost;
//     const postIndex = this.posts.findIndex(
//       post => post.id === updatedPost.id);
//     if (postIndex === -1) {
//       throw new StorageException(
//         `Can't update item \`${id}\` because doesn't exist.`)
//     }
//     this.posts[postIndex] = Object.assign(
//       this.posts[postIndex], updatedPost);
//     return this.posts[postIndex];
//   }
// };

// function createBlogPostsModel() {
//   const storage = Object.create(BlogPosts);
//   storage.posts = [];
//   return storage;
// }


// module.exports = {BlogPosts: createBlogPostsModel()};

'use strict';

const mongoose = require('mongoose');
const uuid = require('uuid');

const blogPostSchema = mongoose.Schema({
  id: {type: String, required: true},
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
    title: this.title,
    content: this.content,
    author: this.authorString,
    created: this.created
  };
}

const Blogpost = mongoose.model('Blogpost', blogPostSchema);

module.exports = { Blogpost };

