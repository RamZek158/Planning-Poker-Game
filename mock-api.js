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

    let jsonString = JSON.stringify(updatedUsers, null, 4);
    fs.writeFileSync('./tmp/users.json', jsonString);

    // console.log('updatedUsers: ', updatedUsers);
    res.json(updatedUsers);
});

router.delete('/users', (req, res) => {
    const userId = req.query.id;
    if (userId) {
        const usersFromFile = JSON.parse(fs.readFileSync('./tmp/users.json', 'utf8'));
        const updatedUsers = usersFromFile.filter(user => user.id !== userId);

        // console.log('userId: ', userId);
        let jsonString = JSON.stringify(updatedUsers, null, 4);
        fs.writeFileSync('./tmp/users.json', jsonString);

        // console.log('updatedUsers: ', updatedUsers);
        res.json(updatedUsers);
    }
    res.status(500).send('Internal Server Error');

});

//saveGameSettings

module.exports = router;