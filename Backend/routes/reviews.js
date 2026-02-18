import express from 'express';
const router = express.Router();

import {
  createReview,
  getAllReviews,
  getReviewsByService,
  getReviewsByProvider,
  deleteReview
} from '../Controllers/reviews.js'; 

router.post('/', createReview); 
router.get('/', getAllReviews);
router.get('/service/:serviceId', getReviewsByService);
router.get('/provider/:providerId', getReviewsByProvider);
router.delete('/:id', deleteReview);

export default router;