const express = require('express');
const router = express.Router();
const { saveScores } = require('../middlewares/scoresMiddleware')
const { saveWeakTraining } = require('../middlewares/weakMiddleware');
const { saveWrongTraing } = require('../middlewares/wrongMiddleware');

router.post('/saveScores', saveScores, (req, res) => {
    // 성공 응답 보내기
    const { savedScores } = res.locals;
    return res.status(201).json({ message: 'Score added succesfully', savedScores: savedScores })
});

router.post('/saveWeaks', saveWeakTraining, (req, res) => {
    return res.status(201).json({ message: 'Weak training score added succesfully' })
})

router.post('/saveWrongs', saveWrongTraing, (req, res) => {
    return res.status(201).json({ message: 'Wrong training score saved succesfully' })
})

module.exports = router;