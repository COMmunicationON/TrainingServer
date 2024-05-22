const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weakSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    phonemes: {
        type: Object,
        required: true,
        default: {
            'ㄱ': { sum: 0, count: 0 }, 'ㄴ': { sum: 0, count: 0 }, 'ㄷ': { sum: 0, count: 0 }, 'ㄹ': { sum: 0, count: 0 }, 'ㅁ': { sum: 0, count: 0 },
            'ㅂ': { sum: 0, count: 0 }, 'ㅅ': { sum: 0, count: 0 }, 'ㅇ': { sum: 0, count: 0 }, 'ㅈ': { sum: 0, count: 0 }, 'ㅊ': { sum: 0, count: 0 },
            'ㅋ': { sum: 0, count: 0 }, 'ㅌ': { sum: 0, count: 0 }, 'ㅍ': { sum: 0, count: 0 }, 'ㅎ': { sum: 0, count: 0 }, 'ㄲ': { sum: 0, count: 0 },
            'ㄸ': { sum: 0, count: 0 }, 'ㅃ': { sum: 0, count: 0 }, 'ㅆ': { sum: 0, count: 0 }, 'ㅉ': { sum: 0, count: 0 }, 'ㄳ': { sum: 0, count: 0 },
            'ㄵ': { sum: 0, count: 0 }, 'ㄶ': { sum: 0, count: 0 }, 'ㄺ': { sum: 0, count: 0 }, 'ㄻ': { sum: 0, count: 0 }, 'ㄼ': { sum: 0, count: 0 },
            'ㄽ': { sum: 0, count: 0 }, 'ㄾ': { sum: 0, count: 0 }, 'ㄿ': { sum: 0, count: 0 }, 'ㅀ': { sum: 0, count: 0 }, 'ㅄ': { sum: 0, count: 0 },
            'ㅣ': { sum: 0, count: 0 }, 'ㅔ': { sum: 0, count: 0 }, 'ㅐ': { sum: 0, count: 0 }, 'ㅟ': { sum: 0, count: 0 }, 'ㅚ': { sum: 0, count: 0 },
            'ㅡ': { sum: 0, count: 0 }, 'ㅓ': { sum: 0, count: 0 }, 'ㅏ': { sum: 0, count: 0 }, 'ㅜ': { sum: 0, count: 0 }, 'ㅗ': { sum: 0, count: 0 },
            'ㅑ': { sum: 0, count: 0 }, 'ㅕ': { sum: 0, count: 0 }, 'ㅛ': { sum: 0, count: 0 }, 'ㅠ': { sum: 0, count: 0 }, 'ㅒ': { sum: 0, count: 0 },
            'ㅖ': { sum: 0, count: 0 }, 'ㅘ': { sum: 0, count: 0 }, 'ㅙ': { sum: 0, count: 0 }, 'ㅝ': { sum: 0, count: 0 }, 'ㅞ': { sum: 0, count: 0 },
            'ㅢ': { sum: 0, count: 0 },
        }
    },
}, { collection: 'weak' });

const Weak = mongoose.model('Weak', weakSchema)

module.exports = Weak;