const express = require('express');
const dbController = require('../controllers/dbController');

var router = express.Router();

// 임시 저장소
//const myModule = require('../models/users');

router.post('/', async (req, res) => {
    const { type, data, level } = req.body;


    if (!type || !data || !level) {
        return res.status(400).json({ error: 'Type, Data, Level is required' });
    }

    try {
        dbController.saveData(data, type, level);
        return res.status(201).json({ message: 'Data created successfully' })
    } catch (err) {
        console.error('Error:', err);
        // MongoDB 연결 해제
        //dbController.closeDatabase();
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;