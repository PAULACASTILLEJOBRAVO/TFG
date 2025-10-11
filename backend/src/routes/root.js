const express = require('express');
const router = express.Router();
const path = require('path');

// Serve a simple welcome message at the root route
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;