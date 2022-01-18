const express = require('express');
const {
    Op
} = require("sequelize");
const router = express.Router();

/**
 * @returns Get all unpaid jobs for a user
 */
router.get('/unpaid', async (req, res) => {
    const {
        Job,
        Contract,
        Profile
    } = req.app.get('models');
    const {
        id
    } = req.profile;
    const jobs = await Job.findAll({
        where: {
            paid: {
                [Op.or]: [null, false]
            }
        },
        include: [{
            model: Contract,
            where: {
                [Op.or]: [{
                        ContractorId: id,
                        status: 'in_progress'
                    },
                    {
                        ClientId: id,
                        status: 'in_progress'
                    }
                ],
            },
            include: [{
                model: Profile,
                as: 'Client'
            }, {
                model: Profile,
                as: 'Contractor'
            }]
        }]
    });
    res.json(jobs);
});

/**
 * @returns Pay for a job
 */
router.post('/:job_id/pay', async (req, res) => {
    const profile = req.profile;
    if (profile.type !== 'client') return res.status(400).send('the payment must be done by a client');

    const {
        Job,
        Profile,
        Contract
    } = req.app.get('models');
    const job = await Job.findOne({
        where: {
            id: req.params.job_id
        },
        include: [{
            model: Contract,
        }]
    });

    if (job.paid) return res.status(400).send('job already paid')
    if (profile.balance < job.price) return res.status(400).send('not enouth balance');

    const contractor = await Profile.findOne({
        where: {
            id: job.Contract.ContractorId
        }
    })

    await profile.update({
        balance: contractor.balance - job.price
    });
    await contractor.update({
        balance: contractor.balance + job.price
    });
    await job.update({
        paid: true,
        paymentDate: new Date()
    });
    await job.Contract.update({
        status: 'terminated'
    });

    res.status(200).end();
});

module.exports = router;