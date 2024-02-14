const MongoClient = require('mongodb').MongoClient;

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
function closeDatabase() {
    if (client) {
        // 클라이언트가 존재하면 연결 종료
        client.close();
        console.log('MongoDB 연결이 종료되었습니다.');
    } else {
        console.warn('MongoDB에 연결되어 있지 않습니다.');
    }
}

// 데이터 삽입
async function saveData(db, data, collectionName) {
    var collection = db.collection(collectionName);

    // 단일 문서 삽입
    try {
        const result = await collection.insertOne(data);
        console.log('Data inserted successfully');
        return result;
    } catch (err) {
        console.error('Failed to insert data:', err);
        throw err;
    }
}

module.exports = { connectDatabase, closeDatabase, saveData };