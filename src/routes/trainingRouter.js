const express = require('express');
const { connectDB, disconnectDB, getDatas } = require('../controllers/dbController');
const { findWeak, weakTraining } = require('../middlewares/weakMiddleware');
const { wrongTraining } = require('../middlewares/wrongMiddleware');
var router = express.Router();


/* POST training data */
// 훈련 데이터 가져오기
router.get('/getData', async function (req, res, next) {
  // 사용자 세션 확인
  console.log("사용자 세션 확인");
  console.log(req.session);

  if (!req.query.type || !req.query.level) {
    return res.status(400).json({ error: 'Type and level query parameters are required.' });
  }
  const { type, level } = req.query;
  try {
    await connectDB();
    const result = await getDatas(type, parseInt(level), 10);
    return res.status(200).json({ type: type, level: level, datas: result });
  } catch (err) {
    console.error('Error connecting DB:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await disconnectDB()
  }
});


// 취약 발음 음운 데이터 가져오기
router.get('/weakTraining', findWeak, weakTraining, (req, res) => {
  const { weakData, phoneme, score, less } = res.locals;
  if (less == true) {
    return res.status(202).json({ message: 'Success', weak_phoneme: phoneme, score: score, datas: weakData });
  } else {
    return res.status(201).json({ message: 'Success', weak_phoneme: phoneme, score: score, datas: weakData });
  }
});

// 오답노트 데이터 가져오기
router.get('/wrongTraining', wrongTraining, (req, res) => {
  try {
    const result = res.locals.wrongs;
    return res.status(200).json({ datas: result });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;