const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weakSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    phonemes: [{
        phonemes: { type: String, required: true, unique: true },
        score: { type: Number, required: true, min: 0 },
        count: { type: Number, required: true, min: 0, default: 0 },
        createAt: { type: Date, default: Date.now }
    }],
});

const Weak = mongoose.model('Weak', weakSchema)

module.exports = Weak;