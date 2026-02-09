const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    const review = await Review.create({
      user: req.body.user,               // KA QAAD BODY
      service: req.body.service,
      serviceProvider: req.body.serviceProvider,
      rating: req.body.rating,
      comment: req.body.comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getReviewsByService = async (req, res, next) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.getReviewsByProvider = async (req, res, next) => {
  try {
    const reviews = await Review.find({ serviceProvider: req.params.providerId });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};
