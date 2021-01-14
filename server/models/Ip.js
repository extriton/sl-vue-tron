const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Схема хранения информации о посещениий сайта
var IpSchema = new Schema({
    ip:             { type: String, default: '', unique: true },
    country:        { type: String, default: '' },
    cnt:            { type: Number, default: 0 },
    lastRollTime:   { type: Date, default: 0 },
    created:        { type: Date, default: Date.now },
    updated:        { type: Date, default: 0 }
})

module.exports = mongoose.model('Ip', IpSchema)