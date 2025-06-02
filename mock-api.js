const express = require('express');
const fs = require('fs');
const users = require('./tmp/users');
const router = express.Router();


router.get('/users', (req, res) => {
    res.json(users);
});

router.post('/addUser', (req, res) => {
    const newUser = req.body;
    const updatedUsers = [...users, newUser ]

    var jsonString = JSON.stringify(updatedUsers, null, 4);
    fs.writeFileSync('./tmp/users.json', jsonString);

    console.log('updatedUsers: ', updatedUsers);
    console.log('req.body: ', req.body);
    console.log('newUser: ', newUser);
    res.json(updatedUsers);
});

module.exports = router;