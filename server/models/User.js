const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Схема хранения информации о посещениий сайта
var UserSchema = new Schema({
    address:            { type: String, default: '', unique: true },
    username:           { type: String, default: '' },
    isAdmin:            { type: Boolean, default: false },
    ips:                { type: Array, default: [] },
    chatBlocked:        { type: Boolean, default: false },
    referrer:           { type: String, default: '' },
    referalCount:       { type: Number, default: 0 },
    referalAmount:      { type: Number, default: 0 },           // (Gwei)
    freeAmount:         { type: Number, default: 0 },           // (Gwei)
    totalAmount:        { type: Number, default: 0 },           // (Gwei)
    lastRollTime:       { type: Date, default: 0 },
    status:             { type: Number, default: 0 },
    created:            { type: Date, default: Date.now },
})

module.exports = mongoose.model('User', UserSchema)