const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../app');

const should = chai.should();

chai.use(chaiHttp);

// it would be worth coming back to add tests for corner cases

describe('Blog-API', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should return json on GET', function() {
    return chai.request(app)
      .get('/posts')
      .then(function(res) {
        res.should.be.json;
        res.body.should.be.a('array');
        res.should.have.status(200)
      });
  });
  
  let testPostId;

  it('should add an item on POST', function() { 
    const newPost = {
      title: 'Test', 
      content: 'Test', 
      author: {
        firstName: 'Cher',
        lastName: 'Cher'
      }
    };

    const expected = {
      title: 'Test',
      content: 'Test',
      author: 'Cher Cher'
    }

    return chai.request(app)
      .post('/posts')
      .send(newPost)
      .then(function(res) {
        res.should.be.json;
        res.body.should.include.keys('title', 'content', 'author', 'created');
        res.body.created.should.not.be.null;
        res.body.should.deep.equal(Object.assign(expected, {created: res.body.created, id: res.body.id}));
        res.should.have.status(201);
        // set testPostId equal to our new posts id so we can 
        // modify and delete the same post with our PUT and
        // DELETE tests, thus preserving the state of our db
        testPostId = res.body.id;
      });
  });

  it('should update items on PUT', function() {
    const updateData = {
      id: testPostId,
      title: 'foo', 
      content: 'bar', 
      author: {
        firstName: 'my',
        lastName: 'test'
      }
    };

    const expected = {
      id: testPostId,
      title: 'foo',
      content: 'bar',
      author: 'my test'
    }

    return chai.request(app)
      .put(`/posts/${ testPostId }`)
      .send(updateData)
      .then(function(res) {
        res.should.have.status(200);
        res.body.should.deep.equal(Object.assign(expected, {created: res.body.created}));
      });
  });

  it('should delete items on DELETE', function() {
    return chai.request(app)
      .delete(`/posts/${ testPostId }`)
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});