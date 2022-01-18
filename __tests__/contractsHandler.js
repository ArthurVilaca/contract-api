const request = require('supertest');

const app = require('../src/app');

// created an example of a test with supertest

describe('GET /contracts', () => {
    it('responds with 3 contracts of a profile', (done) => {
        request(app)
            .get('/contracts')
            .set('profile_id', '7')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body.length).toBe(3)
                done();
            })
            .catch(err => done(err));
    });

    it('responds with 2 contracts of a profile', (done) => {
        request(app)
            .get('/contracts')
            .set('profile_id', '8')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body.length).toBe(2)
                done();
            })
            .catch(err => done(err));
    });
});

describe('GET /contracts/:id', () => {
    it('responds with the contract', (done) => {
        request(app)
            .get('/contracts/7')
            .set('profile_id', '7')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body.terms).toBe('bla bla bla')
                done();
            })
            .catch(err => done(err));
    });
});