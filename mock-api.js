const express = require('express');
const fs = require('fs');
// const users = require('./tmp/users');
const router = express.Router();


router.get('/users', (req, res) => {
    const usersFromFile = JSON.parse(fs.readFileSync('./tmp/users.json', 'utf8'));
    res.json(usersFromFile);
});

router.post('/addUser', (req, res) => {
    const newUser = req.body;
    const usersFromFile = JSON.parse(fs.readFileSync('./tmp/users.json', 'utf8'));
    const existedUser = usersFromFile.find(user => user.id === newUser.id)
    // console.log('existedUser: ', existedUser);
    const updatedUsers = existedUser ? usersFromFile : [...usersFromFile, newUser];

    var jsonString = JSON.stringify(updatedUsers, null, 4);
    fs.writeFileSync('./tmp/users.json', jsonString);

    // console.log('updatedUsers: ', updatedUsers);
    res.json(updatedUsers);
});

module.exports = router;