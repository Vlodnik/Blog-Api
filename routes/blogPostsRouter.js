const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Blogpost } = require('../models');

// mongoose.Promise = global.Promise; // UNCOMMENT IF NECESSARY??????????

router.get('/', (req, res) => {
  console.log(Date.now())
  Blogpost
    .find()
    .then(Blogposts => res.json(
      Blogposts.map(post => post.serialize())
    ))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' })
    });
});

router.get('/:id', (req, res) => {
  Blogpost
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
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