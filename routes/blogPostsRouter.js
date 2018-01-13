'use strict';

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
  const requiredProps = ['firstName', 'lastName'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing required field '${ field }' in request body`;
      console.log(message);
      return res.status(400).send(message);
    }
  }
  for (let i = 0; i < requiredProps.length; i++) {
    const prop = requiredProps[i];
    if (!(prop in req.body.author)) {
      const message = `Missing required author property '${ prop }' in request body`;
      console.log(message);
      return res.status(400).send(message);
    }
  }
  Blogpost
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    })
    .then(post => res.status(201).json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.delete('/:id', (req, res) => {
  Blogpost
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).json({message: `Post ${ req.params.id } deleted`}))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.put('/:id', (req, res) => {
  if (req.params.id !== req.body.id) {
    const message = `Request path id '${ req.params.id }' and request body id '${ req.body.id }' must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blogpost '${ req.params.id }'`);
  const updateFields = ['title', 'content', 'author']
  const updateData = {};
  for (let i = 0; i < updateFields.length; i++) {
    const field = updateFields[i];
    if (updateFields[i] in req.body) {
      updateData[field] = req.body[field];
    }
  }
  Blogpost
    .findByIdAndUpdate(req.params.id, updateData, {new: true})
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' })
    });
});

module.exports = router;