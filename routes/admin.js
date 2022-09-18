var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.sendStatus(404);
    res.end();
});

router.get('/:filename', (req, res) => {
    res.sendStatus(404);
    res.end();
});

module.exports = router;