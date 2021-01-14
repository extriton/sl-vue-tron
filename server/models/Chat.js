const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Схема хранения сообщений чата
var ChatSchema = new Schema({
    address:            { type: String, default: '' },
    username:           { type: String, default: '' },
    message:            { type: String, default: '' },
    visible:            { type: Boolean, default: true },
    created:            { type: Date, default: Date.now },
})

module.exports = mongoose.model('Chat', ChatSchema)