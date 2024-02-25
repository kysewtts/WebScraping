const express = require('express');

const infoController = require('../controllers/info');

const router = express.Router();

router.get('/initialData/:id', infoController.getInitialData);

router.get('/:id/:semester', infoController.fetchSemMarks);

module.exports = router;
