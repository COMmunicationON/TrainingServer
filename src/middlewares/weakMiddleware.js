const { connectDB, disconnectDB, getDatas } = require('../controllers/dbController');
const Weak = require('../models/weakModel');
const { updatePhonemesScore, saveWrong } = require('./scoresMiddleware');
const Score = require('../models/scoreModel');

exports.findWeak = async (req, res, next) => {
    // if (!req.query.phoneme) {
    //     return res.status(400).json({ error: 'Phoneme data is required.' });
    // }

    //const phoneme = req.query.phoneme;

    // 사용자 세션에 있는 사용자 정보 사용
    const user_id = "123456789012345678901234";

    // 가장 취약한 발음 찾기
    try {
        await connectDB();
        let weak = await Weak.findOne({ user_id: user_id });

        // 사용자의 weak 정보가 없는 경우
        if (!weak) {
            res.status(400).send('사용자의 음운 훈련 정보가 없습니다.');
        }

        const phonemes = weak.phonemes;
        var weakPhoneme = 'ㄱ';
        var average = 101;

        Object.entries(phonemes).forEach(([key, value]) => {
            if (average > (value.sum / value.count)) {
                average = value.sum / value.count;
                weakPhoneme = key;
            }
        });

        res.locals.phoneme = weakPhoneme;
        res.locals.score = average;

        console.log(`취약 발음 : ${weakPhoneme}, 점수 : ${average}`);

        next();
    } catch (err) {
        // throw로 바꾸기??
        console.error('Error saving scores:', err);
        return res.status(500).send('Failed to get weak data');
    } finally {
        await disconnectDB();
    };
}

exports.weakTraining = async (req, res, next) => {
    // 훈련 진행하려는 phoneme을 지정하지 않은 경우
    if (!res.locals.phoneme) {
        return res.status(400).json({ error: 'Phoneme data is required.' });
    }
    //const phoneme = req.query.phoneme;
    const phoneme = res.locals.phoneme;

    try {
        await connectDB();
        const result = [];
        const dataTypes = ["syllable", "word", "sentence"];
        const levels = [1, 2, 3];
        let cnt = 0;
        let targetCount;
        let count = 0;

        // syllable 데이터 랜덤하게 3개 가져오기
        await connectDB();

        for (const type of dataTypes) {
            for (const level of levels) {
                if (type == "word" && level == 1) {
                    targetCount = 2;
                } else {
                    targetCount = 1;
                }
                while (cnt < targetCount) {
                    const datas = await getDatas(type, level, 10);
                    for (const data of datas) {
                        //console.log(data);
                        if (!result.some(item => item.data_id === data.data_id) && data.phonemes.includes(phoneme)) {
                            data["type"] = type;
                            data["level"] = level;
                            result.push(data);
                            cnt++;
                            if (cnt >= targetCount) break;
                        }
                    }
                    count++;
                    if (count > 5) break
                }
            }
        }

        // 필요한 데이터가 부족할 경우
        if (result.length < 10) {
            console.warn(`Expected ${targetCount} data, but got ${result.length}`);
            res.locals.less = true;
        } else {
            res.locals.less = false;
        }

        res.locals.weakData = result;

        next();

    } catch (err) {
        console.error('Error getting weak datas:', err);
        return res.status(500).send('Failed to get weak data');
    } finally {
        await disconnectDB();
    }
};

exports.saveWeakTraining = async (req, res, next) => {
    // user_id와 type은 실제로 세션에 있는 정보 사용
    const user_id = "123456789012345678901234";
    const results = req.body;

    try {
        await connectDB();

        // 사용자 점수 있는지 확인
        // Score 객체를 새로 만드는 것보다 findOneAndUpdate() 메소드 사용하는 것이 좋음
        let score = await Score.findOne({ user_id: user_id });
        if (!score) {
            score = new Score({
                user_id: new mongoose.Types.ObjectId(user_id),
                syllable_score: [],
                word_score: [],
                sentence_score: [],
                count: {},
                sum: {}
            });
        }


        for (const result of results) {
            // 음운 정보 저장
            await updatePhonemesScore(user_id, result.each, result.eachAccuracy);

            // 오답 저장
            if (result.pronunciationScore < 60) {
                saveWrong(user_id, result.text, result.type, result.level);
            }
        }
        next();
    } catch (err) {
        console.error('Error saving weak training data', err);
        return res.status(400).json({ error: 'Failed saving weak training data' })
    } finally {
        await disconnectDB();
    }
}
