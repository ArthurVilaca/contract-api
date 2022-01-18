const express = require('express');
const {
    Op
} = require("sequelize");
const router = express.Router();

/**
 * @returns Deposits money into the the the balance of a client
 */
router.post('/deposit/:userId', async (req, res) => {
    const {
        Job,
        Contract,
        Profile
    } = req.app.get('models');

    const profile = await Profile.findOne({
        where: {
            id: req.params.userId
        }
    })
    if (!profile || profile.type != 'client') return res.status(400).send('invalid user id');

    const total = await Job.sum('price', {
        where: {
            paid: {
                [Op.or]: [null, false]
            }
        },
        include: [{
            model: Contract,
            where: {
                ClientId: req.params.userId,
                status: {
                    [Op.ne]: 'terminated'
                }
            }
        }]
    })

    if (!req.body.amount || req.body.amount > total * 0.25) return res.status(400).send('can\'t deposit more than 25% his total of jobs to pay.');
    await profile.update({
        balance: profile.balance + req.body.amount
    });

    res.status(200).end();
});

module.exports = router;