const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('../models');

BlogPosts.create(`How great are socks?`, `Super great indeed! Socks 
  are the best ever!`, `Vlodnik`, `9-21-2017`);
BlogPosts.create(`Which boardgame is the best?`, `Who knows! There
  are so many good ones! Pandemic Legacy is good?`, `Vlodnik`)

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/', (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) { 
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing required field '${ field }' in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.body.publishDate) {
    const {title, content, author, publishDate} = req.body;
    const post = BlogPosts.create(title, content, author, publishDate);
    res.status(201).json(post);
  } else {
    const {title, content, author} = req.body;
    const post = BlogPosts.create(title, content, author);
    res.status(201).json(post);
  }
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post '${ req.params.id }'`);
  res.status(204).end();
});

router.put('/:id', (req, res) => {
  const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing required field '${ field }' in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${ req.params.id }) and request body id (${ req.body.id }) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post '${ req.params.id }'`);
  const updatedPost = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
});

module.exports = router;