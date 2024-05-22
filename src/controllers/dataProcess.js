const { charToUnicode } = require('./charProcess');

function dataToPhonemes(type, data) {
    let Phonemes = [];  // 처리된 음소들을 저장할 배열
    //let lastPhoneme = null; // 마지막으로 추가된 음소를 추적하는 변수

    Array.from(data).forEach(syllable => {
        // 공백 음절은 제외
        if (syllable.trim().length == 0) return;

        let phonemes = charToUnicode(syllable); // 음소를 추출하는 함수

        // 초성이 'ㅇ'인 경우 제외
        // 초성이 전 음운과 같은 경우 제외
        if (phonemes.f && (phonemes.f != 'ㅇ')) {
            Phonemes.push(phonemes.f);
            /*
            if (phonemes.f != lastPhoneme) {
                Phonemes.push(phonemes.f);
                lastPhoneme = phonemes.f;
            }
            */
        }
        // 중성 저장
        if (phonemes.s) {
            Phonemes.push(phonemes.s);
            //lastPhoneme = phonemes.s;
        }

        // 종성 저장
        if (phonemes.t) {
            Phonemes.push(phonemes.t);
            //lastPhoneme = phonemes.t;
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

module.exports = { dataToPhonemes, dataToSyllables };