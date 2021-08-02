const { Router } = require("express");
const stock = require('./stock');
const router = Router();

router.use('/', stock);

module.exports = router;

