const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe.only('GET /playstore', () => {

  it('should return an array of apps', () => {
    return supertest(app)
      .get('/playstore')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        const playstoreList = res.body[0];
        expect(playstoreList).to.include.all.keys(
          'App', 'Content Rating', 'Genres', 'Category', 'Android Ver', 'Current Ver', 'Installs', 'Last Updated', 'Price', 'Rating', 'Reviews', 'Size', 'Type'
        );
      });
  })

  it('should be 400 if sort is incorrect', () => {
    return supertest(app)
      .get('/playstore')
      .query({ sort: 'MISTAKE' })
      .expect(400, 'Sort must be one of app or rating');
  });

  it('should sort by rating', () => {
    return supertest(app)
      .get('/playstore')
      .query({ sort: 'Rating' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;

        let i = 0;
        // iterate once less than the length of the array
        // because we're comparing 2 items in the array at a time
        while (i < res.body.length - 1) {
          // compare book at `i` with next book at `i + 1`
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          // if the next book is less than the book at i,
          if (appAtIPlus1.Rating < appAtI.Rating) {
            // the apps were not sorted correctly
            sorted = false;
            break; // exit the loop
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
});