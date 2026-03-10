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
    if (!userId) {
        return res.status(400).send('User id is required');
    }

    const usersFromFile = JSON.parse(fs.readFileSync('./tmp/users.json', 'utf8'));
    const updatedUsers = usersFromFile.filter(user => user.id !== userId);

    let jsonString = JSON.stringify(updatedUsers, null, 4);
    fs.writeFileSync('./tmp/users.json', jsonString);

    return res.json(updatedUsers);

});

//gameSettings
router.post('/save-game-settings', (req, res) => {
    const newSettings = req.body;

    // Сохраняем в файл
    fs.writeFileSync('./tmp/gameSettings.json', JSON.stringify(newSettings, null, 4));

    res.json(newSettings);
});

// === ПОЛУЧЕНИЕ НАСТРОЕК ИГРЫ ===
router.get('/game-settings/:id', (req, res) => {
    const { id } = req.params;
    const raw = fs.readFileSync('./tmp/gameSettings.json', 'utf8');

    try {
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
            return res.json(data.find((item) => item.id === id) || null);
        }
        return res.json(data?.id === id ? data : null);
    } catch (e) {
        res.status(500).send('Ошибка чтения файла настроек игры');
    }
});

// === УДАЛЕНИЕ НАСТРОЕК ИГРЫ ===
router.delete('/game-settings/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send('ID не указан');
    }

    const raw = fs.readFileSync('./tmp/gameSettings.json', 'utf8');
    let settingsList = [];

    try {
        settingsList = JSON.parse(raw);
        if (!Array.isArray(settingsList)) {
            settingsList = [settingsList];
        }
    } catch (e) {
        return res.status(500).send('Ошибка чтения файла');
    }

    const updatedList = settingsList.filter(s => s.id !== id);

    fs.writeFileSync('./tmp/gameSettings.json', JSON.stringify(updatedList, null, 4));

    res.json({ success: true, message: `Настройки игры ${id} удалены` });
});

module.exports = router;
