const express = require('express');
const router = express.Router();

const {
  createReview,
  getReviewsByService,
  getReviewsByProvider,
  deleteReview
} = require('../controllers/reviews');

router.post('/', createReview); // CREATE
router.get('/service/:serviceId', getReviewsByService);
router.get('/provider/:providerId', getReviewsByProvider);
router.delete('/:id', deleteReview);

module.exports = router;
