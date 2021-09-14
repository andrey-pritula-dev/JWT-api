const mongoose = require("mongoose");
const {Types} = require("mongoose");

const userSchema = new mongoose.Schema({
    id: Types.ObjectId,
    token: String,
    start: Date,
    end: Date
});

module.exports = mongoose.model("userSessions", userSchema);
