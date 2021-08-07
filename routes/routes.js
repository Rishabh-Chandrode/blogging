const express = require('express');


const router = express.Router();



router.get('/test', (req, res) => {
    res.send('user test routing!')
});



module.exports = router;