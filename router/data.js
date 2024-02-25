const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    resultte=[];
    res.render('index',{data:resultte});
});

module.exports = router;
