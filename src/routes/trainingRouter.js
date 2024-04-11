const express = require('express');
const dbController = require('../controllers/dbController');
const { wordProcess } = require('../controllers/dataPrcoess');
var router = express.Router();


/* POST training data */
// 훈련 데이터 가져오기
router.post('/getData', async function (req, res, next) {
  const { type, level } = req.body;

  try {
    const result = await dbController.getData(type, level);
    res.status(200).json({ type: type, level: level, datas: result });
  } catch (err) {
    console.error('Error connecting DB:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* POST training result data */
// 훈련 결과
router.post('/result', async function (req, res, next) {
  // 음절/음소 단위에 대해서만 저장
  const { DisplayText, PronounciationAssessment, Words } = req.body;
  console.log("DisplayText:" + DisplayText)
  console.log("PronounciationAssessment:" + PronounciationAssessment)
  console.log("Words:" + Words)

  // user 데이터 처리
  // user id 넣어줘야 함
  //const user = dbController.findUserBy_id();
  try {
    const existWeak = await dbController.findUserBy_id('65ce8498ba0d78b6e71c17e2', 'weak');

    if (existWeak) {
      // weak 컬렉션에 해당 유저 정보가 이미 존재하는 경우
      console.log('weak 컬렉션에 해당 유저 정보가 이미 존재하는 경우')
      console.log(existWeak)


    } else {
      // 유저의 weak 정보가 한 번도 저장되지 않은 경우
      console.log('유저의 weak 정보가 한 번도 저장되지 않은 경우')

      // Words 데이터 처리
      // 음소의 점수가 일정 점수 아래일 경우 데이터베이스에 저장
      const [word_list, phoneme_list] = wordProcess(Words);
      word_list.forEach(word => {
        word.Phonemes.forEach(phoneme => {
          // 데이터베이스에 저장
        })
      })
    }
  } catch (err) {

  }


  // 전체 score 처리


  res.json();
});

module.exports = router;