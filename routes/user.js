const express = require('express');

const userController = require('../controllers/userNew');

const router = express.Router();

// router.post('/url', userController.postURL);
router.post('/url', userController.fetchEntireDetail);

module.exports = router;
