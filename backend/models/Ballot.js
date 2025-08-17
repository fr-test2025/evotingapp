const mongoose = require('mongoose');

const ballotSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    option1: { type: String },
    option2: { type: String },
    option3: { type: String },

});

module.exports = mongoose.model('Ballot', ballotSchema);