const Score = require('../models/scoreModel');
const mongoose = require('mongoose');
const { connectDB, disconnectDB, createModel } = require('../controllers/dbController');
const Weak = require('../models/weakModel');
const Wrong = require('../models/wrongModel');

async function saveScores(req, res, next) {
    // user_id와 type은 실제로 세션에 있는 정보 사용
    const user_id = "123456789012345678901234";
    const results = req.body;


    // const type = req.body.type;
    // const level = req.body.level;

    // 클라이언트에서 전송한 데이터
    //const results = req.body.results;

    try {
        await connectDB();

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

        const savedScores = [];

        let accuracyTotal = 0;
        let fluencyTotal = 0;
        let completenessTotal = 0;
        let pronTotal = 0;
        let level;
        let type;

        for (const result of results) {
            accuracyTotal += result.accuracyScore;
            fluencyTotal += result.fluencyScore;
            completenessTotal += result.completenessScore;
            pronTotal += result.pronunciationScore;
            level = result.level;
            type = result.type;

            if (result.type == "syllable" || result.type === "word") {
                // 음운 점수 업데이트
                await updatePhonemesScore(user_id, result.each, result.eachAccuracy);
            }

            // 점수가 60점 아래인 경우 오답노트에 추가
            if (result.pronunciationScore < 60) {
                await saveWrong(user_id, result.text, result.type, result.level);
            }

            //console.log(result);
            // for (const nbest of result.NBest) {
            //     const pronunAssess = nbest.PronunciationAssessment;

            //     accuracyTotal += pronunAssess.AccuracyScore;
            //     fluencyTotal += pronunAssess.FluencyScore;
            //     completenessTotal += pronunAssess.CompletenessScore;
            //     pronTotal += pronunAssess.PronScore;

            //     // 음운 점수 업데이트
            //     for (const word of nbest.Words) {
            //         await saveWeak(user_id, word);
            //     }

            //     // Pronun 점수가 60점 아래인 경우 오답노트에 추가
            //     if (nbest.PronunciationAssessment.PronScore < 60) {
            //         await saveWrong(user_id, result.text, type, level);
            //     }
            // }
        }

        // 결과의 평균 계산

        const newScore = {
            level: level,
            accuracy_score: accuracyTotal / 10,
            fluency_score: fluencyTotal / 10,
            completeness_score: completenessTotal / 10,
            pron_score: pronTotal / 10,
            createdAT: Date.now()
        };

        switch (type) {
            case 'syllable':
                score.syllable_score.push(newScore);
                break;
            case 'word':
                score.word_score.push(newScore);
                break;
            case 'sentence':
                score.sentence_score.push(newScore);
                break;
        }
        savedScores.push(newScore)

        // count 값 증가
        score.count[type] += 10;

        // sum 값 수정
        score.sum[type] += pronTotal / 10;

        await score.save();

        res.locals.savedScores = savedScores;  // 결과를 다음 미들웨어로 전달

        next();  // 다음 미들웨어로 이동
    } catch (err) {
        console.error('Error saving scores:', err);
        res.status(500).send('Failed to save score');
    } finally {
        await disconnectDB();
    }
}

// const dataSchema = new Schema({
//     data: { type: String, required: true },
//     phonemes: [String],
// });


// 발음 60점 이하인 경우 오답노트에 추가
async function saveWrong(user_id, text, type, level) {

    try {
        // 해당 유저의 phonemes 정보가 저장되어 있는지 확인
        let wrong = await Wrong.findOne({ user_id: user_id });
        // 유저 정보가 없으면 새로 생성
        if (!wrong) {
            wrong = new Wrong({
                user_id: new mongoose.Types.ObjectId(user_id),
            });
        }

        // 인자에 따라 동적으로 컬렉션 접근
        // const modelName = `${type}${level}`;
        // const collectionName = `${type}${level}`;
        let DynamicModel = createModel(type, level);

        // 해당 컬렉션에 접근하기 위한 모델 생성
        //const DynamicModel = mongoose.model(modelName, dataSchema, collectionName);
        // if (mongoose.models[collectionName]) {
        //     DynamicModel = mongoose.model(collectionName);
        // } else {
        //     DynamicModel = mongoose.model(modelName, dataSchema, collectionName);
        // }



        try {
            const result = await DynamicModel.findOne({ data: text });
            if (result) {
                // 배열에 이미 해당 요소가 있는지 확인
                const exists = wrong.wrongs.some(wrongEntry =>
                    wrongEntry.type === type && wrongEntry.level === level && wrongEntry.data_id.equals(result._id)
                );

                if (!exists) {
                    // 존재하지 않는 경우에만 추가
                    wrong.wrongs.push({ type: type, level: level, data_id: result._id });
                    await wrong.save();
                    console.log("New wrong saved:", { type, level, data_id: result._id });
                } else {
                    console.log("This wrong entry already exists and was not added again.");
                }
            } else {
                console.log("No matching document found in DynamicModel for the provided text.");
            }
        } catch (err) {
            console.error('Error querying DynamicModel:', err);
            throw err;
        }

        // 데이터 조회
        // DynamicModel.findOne({ data: text })
        //     .then(async result => {
        //         console.log(result);
        //         wrong.wrongs.push({ type: type, level: level, data_id: result._id });
        //         await wrong.save();
        //     })
        //     .catch(err => {
        //         console.error('Error saving weaks:', err);
        //         throw err;
        //     })

    } catch (err) {
        console.error('Error saving wrongs:', err);
        throw new Error('Failed to save wrongs');
    }
}

async function updatePhonemesScore(user_id, phonemeArray, accuracyArray) {
    try {
        // 해당 유저의 phonemes 정보가 저장되어 있는지 확인
        let weak = await Weak.findOne({ user_id: user_id });
        // 유저 정보가 없으면 새로 생성
        if (!weak) {
            weak = new Weak({
                user_id: new mongoose.Types.ObjectId(user_id),
            });
        }

        // 해당 키에 대한 정보 업데이트
        for (let i = 0; i < phonemeArray.length; i++) {
            const phonemeKey = phonemeArray[i];
            // 해당 키가 없는 경우 초기화
            if (!weak.phonemes[phonemeKey]) {
                weak.phonemes[phonemeKey] = { count: 0, sum: 0 };
            }
            weak.phonemes[phonemeKey].count += 1;
            weak.phonemes[phonemeKey].sum += accuracyArray[i];

            // console.log(`DB phoneme count: ${weak.phonemes[phonemeKey].count}`);
            // console.log(`DB phoneme sum: ${weak.phonemes[phonemeKey].sum}`);

            // 변경된 phonemes 필드를 명시적으로 표시
            weak.markModified(`phonemes.${phonemeKey}`);
        }
        await weak.save();
    } catch (err) {
        console.error('Error saving weaks:', err);
        throw new Error('Failed to save weaks');
    }
}

async function saveWeak(user_id, word) {
    const phonemes = word.Phonemes;
    try {
        // 해당 유저의 phonemes 정보가 저장되어 있는지 확인
        let weak = await Weak.findOne({ user_id: user_id });
        // 유저 정보가 없으면 새로 생성
        if (!weak) {
            weak = new Weak({
                user_id: new mongoose.Types.ObjectId(user_id),
            });
        }

        // 해당 키에 대한 정보 업데이트
        for (const phoneme of phonemes) {
            console.log(`phoneme : ${phoneme.Phoneme}`);
            const phonemeKey = phoneme.Phoneme;
            // 해당 키가 없는 경우 초기화
            if (!weak.phonemes[phonemeKey]) {
                weak.phonemes[phonemeKey] = { count: 0, sum: 0 };
            }
            weak.phonemes[phonemeKey].count += 1;
            weak.phonemes[phonemeKey].sum += phoneme.PronunciationAssessment.AccuracyScore;

            console.log(`DB phoneme count: ${weak.phonemes[phoneme.Phoneme].count}`);
            console.log(`DB phoneme sum: ${weak.phonemes[phoneme.Phoneme].sum}`);

            // 변경된 phonemes 필드를 명시적으로 표시
            weak.markModified(`phonemes.${phonemeKey}`);
        }

        await weak.save();

    } catch (err) {
        console.error('Error saving weaks:', err);
        throw new Error('Failed to save weaks');
    }
}

module.exports = { saveScores, updatePhonemesScore, saveWrong }