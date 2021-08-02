const { Router } = require('express');
const { getStockState,
    getTheNextTasks,
    addSupply,
    pickOrder,
    completeTask } = require('../controllers');

const router = Router();

router.get('/stock', getStockState);
router.get('/next-tasks', getTheNextTasks);
router.post('/supply', addSupply);
router.post('/order', pickOrder);
router.post('task/:id/complete', completeTask);

module.exports = router;
