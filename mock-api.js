const express = require('express');
const users = require('./users');
const router = express.Router();

router.get('/users', (req, res) => {
    res.json(users);
});

router.post('/addUser', (req, res) => {
    const jsonData = JSON.stringify(res.body);
    console.log('jsonData: ', jsonData)
    res.send(res.body);
});

module.exports = router;