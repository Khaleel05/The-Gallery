const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

// Get content-based recommendations using genres and cast
router.get('/content-based', recommendationController.getContentBasedRecommendations);

module.exports = router;