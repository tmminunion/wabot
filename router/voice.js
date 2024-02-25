const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
    resultte=[];
    res.render('index',{data:resultte});
});

module.exports = router;
