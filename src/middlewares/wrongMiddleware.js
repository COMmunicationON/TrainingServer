const { connectDB, disconnectDB, getOneData, createModel } = require('../controllers/dbController');
const Wrong = require('../models/wrongModel');

exports.wrongTraining = async (req, res, next) => {
    // 사용자 세션에 있는 사용자 정보 사용
    const user_id = "123456789012345678901234";

    // 사용자 오답 정보 찾기
    try {
        await connectDB();
        let user_wrong = await Wrong.findOne({ user_id: user_id });

        // 사용자의 오답 정보가 없는 경우
        if (!user_wrong) {
            res.status(400).send('사용자의 오답 정보가 없습니다.');
        }

        const wrongs = user_wrong.wrongs;

        // wrong에 담긴 객체로 훈련 데이터 가져오기
        //res.locals.wrongs = suffleArray(wrongs);
        const results = [];
        for (const wrong of wrongs) {
            let id = wrong.data_id;
            let result = await getOneData(wrong.type, wrong.level, wrong.data_id);
            // 결과 객체에 type과 level 정보 추가
            result["type"] = wrong.type;
            result["level"] = wrong.level;
            results.push(result);
        }

        res.locals.wrongs = suffleArray(results);

        next();

    } catch (err) {
        console.error('Error getting wrong raining data : ', err);
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

exports.saveWrongTraing = async (req, res, next) => {
    const user_id = "123456789012345678901234";
    const results = req.body;

    try {
        await connectDB();
        // 해당 유저의 phonemes 정보가 저장되어 있는지 확인
        let wrong = await Wrong.findOne({ user_id: user_id });
        // 유저 정보가 없으면 종료
        if (!wrong) {
            return res.status(400).json({ error: '사용자 오답 정보가 없습니다.' });
        }
        for (const result of results) {
            if (result.pronunciationScore >= 60) {
                let model = createModel(result.type, result.level);
                let data = await model.findOne({ data: result.text });
                await Wrong.updateOne(
                    { user_id: user_id },
                    { $pull: { wrongs: { data_id: data._id } } }
                )

                // let wrong = await Wrong.findOne({ user_id: user_id });
                // wrong.wrongs = wrong.wrongs.filter(item => item.data_id != data._id);
                // await wrong.save();
            }
        }
        next();
    } catch (err) {
        console.error('Error delete wrong data:', err);
        return res.status(400).send({ error: 'Error removing the wrong item' });
    } finally {
        await disconnectDB();
    }
}