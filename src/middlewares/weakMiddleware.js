const { connectDB, disconnectDB, getData } = require('../controllers/dbController');
const Weak = require('../models/weakModel');

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
        res.status(500).send('Failed to get weak data');
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

        // syllable 데이터와 word 데이터에서 가져오기
        const result = [];

        // syllable1 데이터 랜덤하게 10개 가져오기
        console.log("syllable1 데이터 랜덤하게 10개 가져와서 result에 넣기")
        var datas = await getData("syllable", 1, 30);
        for (const data of datas) {
            if (data.phonemes.includes(phoneme)) {
                data["type"] = "syllable";
                result.push(data)
                if (result.length >= 5) {
                    break;
                }
            }
        }

        // result가 5개가 다 안찼으면 syllable2 데이터 가져오기
        if (result.length != 5) {
            datas = await getData("syllable", 2, 30);
            for (const data of datas) {
                if (data.phonemes.includes(phoneme)) {
                    data["type"] = "syllable";
                    result.push(data);
                    if (result.length >= 5) {
                        break;
                    }
                }
            }
        }

        // word1 데이터 랜덤하게 10개 가져오기
        console.log("word1 데이터 랜덤하게 가져와서 result에 넣기")
        datas = await getData("word", 1, 20);
        for (const data of datas) {
            if (data.phonemes.includes(phoneme)) {
                data["type"] = "word";
                result.push(data)
                if (result.length == 10) {
                    break;
                }
            }
        }

        res.locals.weakData = result;

        next();

    } catch (err) {
        console.error('Error saving scores:', err);
        res.status(500).send('Failed to get weak data');
    } finally {
        await disconnectDB();
    }
};

exports.saveWeakTraining = async (req, res, next) => {

}