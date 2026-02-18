import Review from '../models/Review.js';

export const createReview = async (req, res) => {
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('user', 'name');
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getReviewsByService = async (req, res) => {
    try {
        const reviews = await Review.find({ service: req.params.serviceId });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getReviewsByProvider = async (req, res) => {
    try {
        const reviews = await Review.find({ serviceProvider: req.params.providerId });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        // Translated: "Review waa la tirtiray!" -> "Review has been deleted!"
        res.status(200).json({ message: "Review has been deleted!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};