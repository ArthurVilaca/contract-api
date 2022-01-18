const express = require('express');
const {
    Op,
    fn,
    col,
    literal
} = require("sequelize");
const router = express.Router();
const {
    profileFormatter
} = require('../helper/formatter');

/**
 * @returns Returns the profession that earned the most money
 */
router.get('/best-profession', async (req, res) => {
    const {
        Job,
        Contract,
        Profile
    } = req.app.get('models');

    const where = {
        paid: true
    };

    if (req.query.start && req.query.end) {
        where.paymentDate = {
            [Op.between]: [req.query.start, req.query.end]
        }
    }

    const bestProfession = await Job.findAll({
        attributes: [
            [fn('sum', col('price')), 'total']
        ],
        include: [{
            model: Contract,
            include: [{
                model: Profile,
                as: 'Contractor'
            }]
        }],
        where,
        group: ['Contract.ContractorId'],
        order: literal('total DESC'),
        limit: 1
    });

    if (!bestProfession.length) return res.status(400).send('no best profession');
    res.json(profileFormatter(bestProfession[0].Contract.Contractor, bestProfession[0].dataValues.total))
});

/**
 * @returns Returns the clients the paid the most for jobs in the query time period
 */
router.get('/best-clients', async (req, res) => {
    const {
        Job,
        Contract,
        Profile
    } = req.app.get('models');

    const where = {
        paid: true
    };

    if (req.query.start && req.query.end) {
        where.paymentDate = {
            [Op.between]: [req.query.start, req.query.end]
        }
    }

    const bestClients = await Job.findAll({
        attributes: [
            [fn('sum', col('price')), 'total']
        ],
        include: [{
            model: Contract,
            include: [{
                model: Profile,
                as: 'Client'
            }]
        }],
        where,
        group: ['Contract.ClientId'],
        order: literal('total DESC'),
        limit: req.query.limit || 2
    });

    if (!bestClients.length) return res.status(400).send('no best client');
    res.json(bestClients.map((best) => profileFormatter(best.Contract.Client, best.dataValues.total)))
});

module.exports = router;