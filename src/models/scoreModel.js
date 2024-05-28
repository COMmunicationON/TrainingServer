const mongoose = require("mongoose");
const Schema = mongoose.Schema

const scoreSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
    syllable_score: [{
        level: { type: Number, required: true },
        accuracy_score: { type: Number, required: true, default: 0 },
        fluency_score: { type: Number, required: true, default: 0 },
        completeness_score: { type: Number, required: true, default: 0 },
        pron_score: { type: Number, required: true, default: 0 },
        createdAT: { type: Date, default: Date.now },
    }],
    word_score: [{
        level: { type: Number, required: true },
        accuracy_score: { type: Number, required: true, default: 0 },
        fluency_score: { type: Number, required: true, default: 0 },
        completeness_score: { type: Number, required: true, default: 0 },
        pron_score: { type: Number, required: true, default: 0 },
        createdAT: { type: Date, default: Date.now },
    }],
    sentence_score: [{
        level: { type: Number, required: true },
        accuracy_score: { type: Number, required: true, default: 0 },
        fluency_score: { type: Number, required: true, default: 0 },
        completeness_score: { type: Number, required: true, default: 0 },
        pron_score: { type: Number, required: true, default: 0 },
        createdAT: { type: Date, default: Date.now },
    }],
    count: {
        syllable: { type: Number, required: true, default: 0 },
        word: { type: Number, required: true, default: 0 },
        sentence: { type: Number, required: true, default: 0 },
    },
    sum: {
        syllable: { type: Number, required: true, default: 0 },
        word: { type: Number, required: true, default: 0 },
        sentence: { type: Number, required: true, default: 0 },
    },
}, { collection: 'score' });

module.exports = mongoose.model('Score', scoreSchema);