const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

// Get content-based recommendations using genres and cast
router.get('/favourites', recommendationController.getContentBasedRecommendations);

module.exports = router;