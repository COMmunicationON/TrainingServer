const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wrongSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    wrongs: [{
        type: { type: String, required: true },
        level: { type: Number, required: true },
        data_id: { type: Schema.Types.ObjectId, required: true }
    }]
}, { collection: "wrong" });

const Wrong = mongoose.model('Wrong', wrongSchema)

module.exports = Wrong;