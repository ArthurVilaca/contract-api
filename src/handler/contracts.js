const express = require('express');
const {
    Op
} = require("sequelize");
const router = express.Router();

/**
 * @returns contract by id
 */
router.get('/:id', async (req, res) => {
    const {
        Contract
    } = req.app.get('models');
    const {
        id
    } = req.params;
    const contract = await Contract.findOne({
        where: {
            id
        }
    });
    const itBelongsToUser = contract.ContractorId !== req.profile.id || contract.ClientId !== req.profile.id;
    if (!contract || !itBelongsToUser) return res.status(404).end();
    res.json(contract);
});

/**
 * @returns list of contracts
 */
router.get('/', async (req, res) => {
    const {
        Contract
    } = req.app.get('models');
    const {
        id
    } = req.profile;
    const contracts = await Contract.findAll({
        where: {
            [Op.or]: [{
                    ContractorId: id,
                    status: {
                        [Op.ne]: 'terminated'
                    }
                },
                {
                    ClientId: id,
                    status: {
                        [Op.ne]: 'terminated'
                    }
                }
            ],
        }
    });
    res.json(contracts);
});

module.exports = router;