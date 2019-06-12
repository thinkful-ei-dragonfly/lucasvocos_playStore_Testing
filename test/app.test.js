const app = require('../app');
const expect = require('chai').expect;
const request = require('supertest');


describe('TEST playstore', () => {
  it('GET "/" should return greeting', () => {
    request(app)
      .get('/')
      .expect(200, 'Please navigate to /apps to see a list of apps. You can even search by genre and/or sort by Rating or App');
  })
  it('GET /apps should return array', () => {
    request(app)
      .get('/apps')
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
      })
  })
  it('GET /apps?sort={invalid} should return an error and message', () => {
    request(app)
      .get('/apps')
      .query({sort: "Category"})
      .expect(400, "Can only sort by Rating or App");
  })
  it('GET /apps?sort=Rating should return a sorted array by Rating', () => {
    request(app)
      .get('/apps')
      .query({sort: "Rating"})
      .expect(200)
      .then(res => {
        const item1 = res.body[0],
        item2 = res.body[1]
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        expect(item1.Rating > item2.Rating).to.be.true;
      })
  })
  it('GET /apps?sort=App should return a sorted array by App', () => {
    request(app)
      .get('/apps')
      .query({sort: "App"})
      .expect(200)
      .then(res => {
        const item1 = res.body[0],
        item2 = res.body[1]
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        expect(item1.App < item2.App).to.be.true;
      })
  })
  it('GET /apps?genres={invalid} should return an error and message', () => {
    request(app)
      .get('/apps')
      .query({genres: "Invalid"})
      .expect(400, 'not included')
  })
  it('GET /apps?genres=Action should return a sorted array of "Action" Apps', () => {
    request(app)
      .get('/apps')
      .query({genres: "Action"})
      .expect(200)
      .then(res => {
        let firstApp = res.body[0];
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        expect(firstApp).to.deep.include({"Genres":"Action"});
      })
  })
  it('GET /apps?genres=Puzzle should return a sorted array of "Puzzle" Apps', () => {
    request(app)
      .get('/apps')
      .query({genres: "Puzzle"})
      .expect(200)
      .then(res => {
        let firstApp = res.body[0],
          secondApp = res.body[1];
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(2);
        expect(firstApp).to.deep.include({"Genres":"Puzzle"});
        expect(secondApp).to.deep.include({"Genres":"Puzzle"});
      })
  })
})
