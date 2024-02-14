const mongoose = require('mongoose');

// 문장 데이터 스키마 정의
const dataSchema = new mongoose.Schema({
    data: { type: String, required: true, unique: true }
});

// 모델 생성
const Data = mongoose.model('Data', dataSchema);

// 모듈로 내보내기
module.exports = Data;