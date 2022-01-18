const express = require('express');
const request = require('supertest');

const {
    getProfile
} = require('../../src/middleware/getProfile');
const {
    sequelize
} = require('../../src/model')

describe('getProfile middleware', function () {
    const app = express();
    app.set('sequelize', sequelize);
    app.set('models', sequelize.models);
    app.use('/', getProfile, (_req, res) => res.status(200).end())

    describe('request handler calling', function () {
        it('responds with 200 for a valid profile_id', (done) => {
            request(app)
                .get('/contracts')
                .set('profile_id', '7')
                .expect(200, done)
        });

        it('responds with 401 for a valid profile_id', (done) => {
            request(app)
                .get('/contracts')
                .set('profile_id', 'x')
                .expect(401, done)
        });
    });
});