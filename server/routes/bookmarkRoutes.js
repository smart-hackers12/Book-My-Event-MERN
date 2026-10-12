const express = require('express');
const router = express.Router();
const { toggleBookmark, getBookmarks } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/auth'); // Updated to point to auth.js

router.route('/').post(protect, toggleBookmark).get(protect, getBookmarks);

module.exports = router;