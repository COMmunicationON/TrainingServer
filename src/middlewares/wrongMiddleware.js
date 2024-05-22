const { connectDB, disconnectDB, getOneData } = require('../controllers/dbController');
const Wrong = require('../models/wrongModel');

exports.wrongTraining = async (req, res, next) => {
    // 사용자 세션에 있는 사용자 정보 사용
    const user_id = "123456789012345678901234";

    // 사용자 오답 정보 찾기
    try {
        await connectDB();
        let wrong = await Wrong.findOne({ user_id: user_id });

        // 사용자의 오답 정보가 없는 경우
        if (!wrong) {
            res.status(400).send('사용자의 오답 정보가 없습니다.');
        }

        const wrongs = wrong.wrongs;

        // wrong에 담긴 객체로 훈련 데이터 가져오기
        //res.locals.wrongs = suffleArray(wrongs);
        const results = [];
        for (const wrong of wrongs) {
            let id = wrong.data_id;
            let result = await getOneData(wrong.type, wrong.level, wrong.data_id);
            results.push(result);
        }

        res.locals.wrongs = suffleArray(results);

        next();

    } catch (err) {
        console.errer(err);
        throw err;
    } finally {
        await disconnectDB();
    }
};

function suffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // 0부터 i까지의 임의의 인덱스 선택
        const j = Math.floor(Math.random() * (i + 1));
        // array[i]와 array[j]를 교환
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}