const Bookmark = require('../models/Bookmark');

// Toggle bookmark (Save or Remove)
exports.toggleBookmark = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user.id;

        const existingBookmark = await Bookmark.findOne({ user: userId, event: eventId });

        if (existingBookmark) {
            await Bookmark.findByIdAndDelete(existingBookmark._id);
            return res.status(200).json({ message: 'Event removed from wishlist', bookmarked: false });
        }

        const newBookmark = await Bookmark.create({ user: userId, event: eventId });
        res.status(201).json({ message: 'Event added to wishlist', bookmarked: true, bookmark: newBookmark });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get user's wishlisted events
exports.getBookmarks = async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ user: req.user.id }).populate('event');
        res.status(200).json(bookmarks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};