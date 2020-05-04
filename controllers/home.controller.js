const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /:
 *      get:
 *          summary: Get view starting page.
 */
router.get("/", (req, res) => {
    res.render('index', {
        title: 'Home page',
        isHome: true
    });
});

module.exports = router;
