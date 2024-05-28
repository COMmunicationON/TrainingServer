// 음절을 음운으로 분리해서 반환
charToUnicode = function (kor) {
    const first = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ',
        'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
        'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const second = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ',
        'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ',
        'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
    const third = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ',
        'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
        'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ',
        'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

    const ga = 44032;
    let uni = kor.charCodeAt(0)

    uni = uni - ga;

    let fn = parseInt(uni / 588);
    let sn = parseInt((uni - (fn * 588)) / 28);
    let tn = parseInt(uni % 28);

    return {
        f: first[fn] != 'ㅇ' ? first[fn] : null,
        s: second[sn],
        t: third[tn] != '' ? third[tn] : null
    };
}

// input:list, phonemes(array) / output:
// findPhonemes = (list, type, phonemes) => {
//     let finds = list.filter(type);
//     if (finds.length != 0) {

//     }
// };

// 데이터를 음절로 분리
function dataToPhonemes(type, data) {
    let Phonemes = [];  // 처리된 음소들을 저장할 배열
    let lastPhoneme = null; // 마지막으로 추가된 음소를 추적하는 변수

    Array.from(data).forEach(syllable => {
        if (syllable.trim().length == 0) return;    // 공백 음절은 제외
        if (charToUnicode(syllable) == false) return;   // 특수 문자는 제외

        let phonemes = charToUnicode(syllable); // 음소를 추출하는 함수

        // 초성이 'ㅇ'인 경우 제외
        if (phonemes.f && (phonemes.f != 'ㅇ')) {
            // 초성이 전 음운과 같은 경우 제외
            if (phonemes.f != lastPhoneme) {
                Phonemes.push(phonemes.f);
                //lastPhoneme = phonemes.f;
            }
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
        lastPhoneme = phonemes.t;
    })
    return Phonemes;

}

function dataToSyllables(type, data) {
    let syllables = [];
    // 한글 음절, 자음, 모음을 포함하는 정규식
    const isKoreanCharacter = char => /[\u3131-\u314E\u314F-\u3163\uAC00-\uD7A3]/.test(char);
    Array.from(data).forEach(syllable => {
        if (isKoreanCharacter(syllable)) {
            syllables.push(syllable);
        }
    })

    return syllables;

    // switch (type) {
    //     case "syllable":
    //         syllables.push(data);
    //         break;
    //     case "word":
    //         Array.from(data).forEach(syllable => {
    //             if (syllable != ' ') {
    //                 syllables.push(syllable);
    //             }
    //         });
    //         break;
    //     case "sentence":
    //         data.split(' ').forEach(word => {
    //             Array.from(word).forEach(syllable => {
    //                 syllables.push(syllable);
    //             });
    //         });
    //         break;
    //     default:
    //         console.log("Unkown type");
    // }
}

module.exports = { charToUnicode, dataToPhonemes, dataToSyllables };