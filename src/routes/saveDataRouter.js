const express = require('express');
const dbController = require('../controllers/dbController');
const Data = require('../models/dataModel');

var router = express.Router();

// 임시 저장소
//const myModule = require('../models/users');

router.post('/', async (req, res) => {
    const { type, data, level } = req.body;

    if (!type || !data || !level) {
        return res.status(400).json({ error: 'Type, Data, Level is required' });
    }

    try {
        // 데이터베이스 연결
        const db = await dbController.connectDatabase();

        // 데이터 중복 확인
        var collectionName = type + `${level}`;
        console.log(collectionName);
        var existingData = await db.collection(collectionName).findOne({ data: data });

        if (existingData) {
            dbController.closeDatabase();
            return res.status(409).json({ error: 'Same Data already exists' })
        }

        const newData = new Data({
            data
        })
        console.log(newData);

        // 데이터를 MongoDB에 삽입
        await dbController.saveData(db, newData, collectionName);

        // MongoDB 연결 해제
        dbController.closeDatabase();

        return res.status(201).json({ message: 'Data created successfully' })
    } catch (err) {
        console.error('Error:', err);
        // MongoDB 연결 해제
        dbController.closeDatabase();
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;