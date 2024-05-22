const express = require('express');
const router = express.Router();
const { saveScores } = require('../middlewares/scoresMiddleware')
const { saveWeakTraining } = require('../middlewares/weakMiddleware');

router.post('/saveScores', saveScores, (req, res) => {
    // 성공 응답 보내기
    const { savedScores } = res.locals;
    res.status(201).json({ message: 'Score added succesfully', savedScores: savedScores })
});

router.post('/saveWeaks', saveWeakTraining, (req, res) => {

})

module.exports = router;