import { Review } from '../models/models.js'; // Hubi in magaca file-ka model-kaagu sax yahay

// 1. CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const review = await Review.create({
      user: req.body.user,
      service: req.body.service,
      serviceProvider: req.body.serviceProvider,
      rating: req.body.rating,
      comment: req.body.comment
    });

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 2. GET REVIEWS BY SERVICE
export const getReviewsByService = async (req, res, next) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId });
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// 3. GET REVIEWS BY PROVIDER
export const getReviewsByProvider = async (req, res, next) => {
  try {
    const reviews = await Review.find({ serviceProvider: req.params.providerId });
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// 4. DELETE REVIEW
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review-gan lama helin' });
    }
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};