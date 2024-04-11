const MongoClient = require('mongodb').MongoClient;
const Data = require('../models/dataModel');
const Weak = require('../models/weakModel');
const ObjectId = require('mongodb');
const { dataToPhonemes, dataToSyllables } = require('../controllers/dataPrcoess');

// MongoDB 서버 URI
const url = `${process.env.DB_URL}`;

// MongoClient 생성
let client;

// 데이터베이스 이름
const dbName = 'comon';

// 데이터베이스 연결
async function connectDatabase() {
    try {
        // MongoDB 서버에 연결
        client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

        console.log('Connected to MongoDB server');
        return client.db(dbName);
    } catch (err) {
        // 오류 처리
        console.error('Error in connectDatabase:', err);
        throw err;
        // res.status(500).json({ success: false, error: 'Internal Server Error' });

    }
}

// MongoDB 연결 해제
async function closeDatabase() {
    /*
    if (client && client.topology) {
        // 클라이언트가 존재하면 연결 종료
        await client.close();
        console.log('MongoDB 연결이 종료되었습니다.');
    } else {
        console.warn('MongoDB에 연결되어 있지 않습니다.');
    }
    */
    try {
        if (client) {
            await client.close();
            console.log('MongoDB 연결이 종료되었습니다.');
        } else {
            console.warn('MongoDB에 연결되어 있지 않습니다.');
        }
    } catch (err) {
        console.warn('MongDB 연결 종료 중 오류가 발생했습니다.');
    }
}

// 데이터 삽입
async function saveData(data, type, level) {
    let db;
    try {
        // 데이터베이스 연결
        db = await dbController.connectDatabase();

        // 데이터 중복 확인
        var collectionName = type + `${level}`;
        console.log(collectionName);
        var collection = db.collection(collectionName);
        var existingData = await collection.findOne({ data: data });

        if (existingData) {
            dbController.closeDatabase();
            return res.status(409).json({ error: 'Same Data already exists' })
        }

        const newData = new Data({
            data
        })
        console.log(newData);

        const result = await collection.insertOne(data);
        console.log('Data inserted successfully');

        // MongoDB 연결 해제
        closeDatabase();

        return result;
    } catch (err) {
        // MongoDB 연결 해제
        closeDatabase();
        console.error('Failed to insert data:', err);
        throw err;
    } finally {
        if (db) {
            await
                closeDatabase();
        }
    }

}

async function findUserBy_id(_id, collectionName) {
    try {
        // 데이터베이스 연결
        const db = await connectDatabase();
        // 사용자 확인
        const collection = db.collection(collectionName);
        const exUser = await collection.findOne({ user_id: new ObjectId(_id) });
        //const exUser = await User.findById(_id);
        // MongoDB 연결 해제
        closeDatabase();
        console.log('MongoDB 연결 종료');
        return exUser;
    } catch (err) {
        return null;
    };
}

async function getData(type, level) {
    let db;
    try {
        db = await connectDatabase();
        const collectionName = type + `${level}`;
        const collection = db.collection(collectionName);
        const result = await collection.aggregate([
            { $sample: { size: 10 } },
            //{ $addFields: { type: type } },
            //{ $addFields: { level: level } },
            //{ $project: { _id: 0 } },
        ]).toArray();

        // DB에서 랜덤한 data 10개 가져오기
        console.log('Random 10 items:', result);
        closeDatabase();

        // 데이터 처리
        const processedData = await Promise.all(result.map(async item => {
            const originalData = item.data
            const syllables = dataToSyllables(type, originalData);
            const phonemes = dataToPhonemes(type, originalData);

            return {
                data_id: item._id.toString(),
                data: originalData,
                syllables: syllables,
                phonemes: phonemes
            };
        }));

        console.log('Processed dataL ', processedData);
        return processedData;
    } catch (err) {
        console.error('Error connecting DB:', err);
        closeDatabase();
        throw err;
    } finally {
        if (db) {
            await closeDatabase();
        }
    }
}

async function saveWeak(collectionName, weak) {
    let db;
    try {
        db = await dbController.connectDatabase();
        const collection = db.collection(collectionName);

        const newWeak = new Weak({

        })
    } catch (err) {

    }
}

async function saveScore() {

}

module.exports = { connectDatabase, closeDatabase, saveData, findUserBy_id, getData };