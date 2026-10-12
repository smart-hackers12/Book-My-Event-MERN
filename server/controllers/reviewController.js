const Review = require('../models/Review');

// Add or update a review
exports.addReview = async (req, res) => {
    try {
        const { eventId, rating, comment } = req.body;
        const userId = req.user.id;

        let review = await Review.findOne({ user: userId, event: eventId });

        if (review) {
            review.rating = rating;
            review.comment = comment;
            await review.save();
            return res.status(200).json({ message: 'Review updated successfully', review });
        }

        review = await Review.create({
            user: userId,
            event: eventId,
            rating,
            comment
        });

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get reviews for a specific event
exports.getEventReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ event: req.params.eventId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        // Calculate average rating
        const avgRating = reviews.length > 0
            ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
            : 0;

        res.status(200).json({ reviews, avgRating, totalReviews: reviews.length });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};