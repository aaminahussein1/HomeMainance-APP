import express from 'express';
const router = express.Router();


import {
  createReview,
  getReviewsByService,
  getReviewsByProvider,
  deleteReview
} from '../controllers/reviews.js'; 


router.post('/', createReview); 


router.get('/service/:serviceId', getReviewsByService);


router.get('/provider/:providerId', getReviewsByProvider);


router.delete('/:id', deleteReview);

export default router;