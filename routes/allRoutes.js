const express = require('express');
const router = express.Router();

const statusRouter = require('./statusRoute');

router.use('/api',statusRouter);

router.get('/', (req, res) => {
    res.redirect('/api');
});

module.exports = router;