const { charToUnicode } = require('./dataTransController');

function wordProcess(Words) {
    var words_list = [];
    var phoneme_list = [];

    Words.forEach(word => {

        const { Word, AccuracyScore, Phonemes } = word;
        var index = 0;

        console.log(Word);
        console.log(AccuracyScore);
        console.log(Phonemes);

        // word 단어 분석해서 음소 분리하기
        Array.from(Word).forEach(syllable => {
            let phonemes = charToUnicode(syllable);

            // 첫 음소가 'ㅇ'인 경우 제외
            if (!phonemes.f) {
                if (Phonemes[index]) {
                    Phonemes[index].Phoneme = phonemes.s;
                    //console.log(phonemes.s);
                    index++;
                }
                if (Phonemes[index]) {
                    Phonemes[index].Phoneme = phonemes.t;
                    //console.log(phonemes.t);
                    index++;
                }
                /*
                Phonemes[index++].Phoneme = phonemes.s;
                console.log(phonemes.s)
                Phonemes[index++].Phoneme = phonemes.t;
                console.log(phonemes.t)
                */
            }
            else {
                if (Phonemes[index]) {
                    Phonemes[index].Phoneme = phonemes.f;
                    //console.log(phonemes.f);
                    index++;
                }
                if (Phonemes[index]) {
                    Phonemes[index].Phoneme = phonemes.s;
                    //console.log(phonemes.s);
                    index++;
                }
                if (Phonemes[index] && phonemes.t) {
                    Phonemes[index].Phoneme = phonemes.t;
                    //console.log(phonemes.t);
                    index++;
                }
                /*
                Phonemes[index++].Phoneme = phonemes.f;
                console.log(phonemes.f)
                Phonemes[index++].Phoneme = phonemes.s;
                console.log(phonemes.s)
                Phonemes[index++].Phoneme = phonemes.t;
                console.log(phonemes.t)
                */
            }
        });

        console.log(Phonemes);

        const filteredPhonemes = Phonemes.map(item => ({
            Phonemes: item.Phoneme,
            AccuracyScore: item.AccuracyScore
        }));

        Phonemes.forEach(item => {
            const existingIndex = phoneme_list.findIndex(phoneme => phoneme.Phoneme == item.Phoneme);
            if (existingIndex !== -1) {
                if (item.AccuracyScore > phoneme_list[existingIndex].AccuracyScore) {
                    phoneme_list[existingIndex] = item;
                }
            } else {
                phoneme_list.push(item);
            }
        })

        words_list.push({ Word: Word, AccuracyScore: AccuracyScore, Phonemes: filteredPhonemes })
    });

    return [words_list, phoneme_list];
}

function dataToPhonemes(type, data) {
    let Phonemes = [];  // 처리된 음소들을 저장할 배열
    let lastPhoneme = null; // 마지막으로 추가된 음소를 추적하는 변수

    Array.from(data).forEach(syllable => {
        // 공백 음절은 제외
        if (syllable.trim().length == 0) return;

        let phonemes = charToUnicode(syllable); // 음소를 추출하는 함수

        // 초성이 'ㅇ'인 경우 제외
        // 초성이 전 음운과 같은 경우 제외
        if (phonemes.f && (phonemes.f != 'ㅇ')) {
            if (phonemes.f != lastPhoneme) {
                Phonemes.push(phonemes.f);
                lastPhoneme = phonemes.f;
            }
        }
        // 중성 저장
        if (phonemes.s) {
            Phonemes.push(phonemes.s);
            lastPhoneme = phonemes.s;
        }

        // 종성 저장
        if (phonemes.t) {
            Phonemes.push(phonemes.t);
            lastPhoneme = phonemes.t;
        }
    })
    return Phonemes;

}

function dataToSyllables(type, data) {
    let syllables = [];
    switch (type) {
        case "syllable":
            syllables.push(data);
            break;
        case "word":
            Array.from(data).forEach(syllable => {
                if (syllable != ' ') {
                    syllables.push(syllable);
                }
            });
            break;
        case "sentence":
            data.split(' ').forEach(word => {
                Array.from(word).forEach(syllable => {
                    syllables.push(syllable);
                });
            });
            break;
        default:
            console.log("Unkown type");
    }
    return syllables;
}

module.exports = { wordProcess, dataToPhonemes, dataToSyllables };