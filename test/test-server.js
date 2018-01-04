const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../app');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog-API', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should return json on GET', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        res.should.be.json;
        res.body.should.be.a('array');
        res.should.have.status(200)
      });
  });
  
  it('should add an item on POST', function() { 
    const newPost = {title: 'Test', content: 'Test', author: 'Cher'};

    return chai.request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res) {
        res.should.be.json;
        res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate');
        res.body.id.should.not.be.null;
        res.body.publishDate.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate}));
        res.should.have.status(201);
      });
  });

  it('should update items on PUT', function() {
    const updateData = {title: 'foo', content: 'bar', author: 'me', publishDate: '1-1-2018'};

    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        updateData.id = res.body[0].id;

        return chai.request(app)
          .put(`/blog-posts/${ updateData.id }`)
          .send(updateData)
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });

  it('should delete items on DELETE', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${ res.body[0].id }`)
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});