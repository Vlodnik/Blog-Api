const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('../models');

BlogPosts.create(`How great are socks?`, `Super great indeed! Socks
  are the best ever!`, `Vlodnik`, `9-21-2017`);
BlogPosts.create(`Which boardgame is the best?`, `Who knows! There
  are so many good ones! Pandemic Legacy is good?`, `Vlodnik`)



module.exports = router;