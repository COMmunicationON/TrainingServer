const mongoose = require('mongoose');
//const MongoClient = require('mongodb').MongoClient;
//const Data = require('../models/dataModel');
const Weak = require('../models/weakModel');
//const ObjectId = require('mongodb');
const { dataToPhonemes, dataToSyllables } = require('./dataProcess');

// MongoDB 서버 URI
const dbURI = `${process.env.DB_URL}`;
const dbName = `${process.env.DB_NAME}`;

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI + dbName, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB conncected successfully');
    } catch (err) {
        console.error('Database connection error:', err);
        //process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected succesfully');
    } catch (err) {
        console.error('Error disconnecting database:', err);
    }
};

const getData = async (type, level, num) => {
    const collectionName = `${type}${level}`;

    try {
        await connectDB();

        //const Collection = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName);
        // 이미 모델이 존재하는지 확인
        if (mongoose.models[collectionName]) {
            Collection = mongoose.models[collectionName];
        } else {
            // 새 스키마와 함께 모델 생성
            Collection = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName);
        }

        // 랜덤한 데이터 10개 가져오기
        const randomData = await Collection.aggregate([
            { $sample: { size: num } }
        ]);
        console.log(randomData);

        // 데이터 처리 (필드 추가)
        const processedData = await Promise.all(randomData.map(async item => {
            try {
                const originalData = item.data
                const syllables = dataToSyllables(type, originalData);
                const phonemes = dataToPhonemes(type, originalData);

                return {
                    data_id: item._id.toString(),
                    data: originalData,
                    syllables: syllables,
                    phonemes: phonemes
                };
            } catch (err) {
                console.error('Error processing data item:', err);
                return null;
            }
        }));

        console.log('Processed data:', processedData);
        return processedData;

    } catch (err) {
        console.error(`Error fetching random data from ${collectionName}:`, err);
    } finally {
        await disconnectDB();
    }
}

// 이미 DB에 연결되어 있음
const getOneData = async (type, level, id) => {
    const collectionName = `${type}${level}`;
    let Collection;

    try {
        // 데이터베이스 연결 확인 또는 시도
        if (!mongoose.connection.readyState) {
            await connectDB();
        }

        // 이미 모델이 있는지 확인
        if (mongoose.models[collectionName]) {
            Collection = mongoose.model(collectionName);
        } else {
            Collection = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName);
        }

        // 데이터 찾기
        let wrong = await Collection.findOne({ _id: id });
        if (!wrong) {
            console.log('No data found for the provided ID.');
            return null;
        }
        console.log('Found data:', wrong);

        // 데이터 처리 (필드 추가)
        try {
            const originalData = wrong.data;
            const syllables = dataToSyllables(type, originalData);
            const phonemes = dataToPhonemes(type, originalData);

            const processedData = {
                data_id: wrong._id.toString(),
                data: originalData,
                syllables: syllables,
                phonemes: phonemes
            };

            console.log('Processed data:', processedData);
            return processedData;
        } catch (err) {
            console.error('Error processing the data item:', err);
            return null;
        }

    } catch (err) {
        console.error(`Error fetching random data from ${collectionName}:`, err);
    }
}

module.exports = { connectDB, disconnectDB, getData, getOneData };