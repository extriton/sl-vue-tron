const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Схема хранения игр
var GameSchema = new Schema({
    type:               { type: String, default: ''},                   // w5x36 и т.д.
    id:                 { type: Number, default: 0 },
    membersCounter:     { type: Number, default: 0 },
    winNumbers:         { type: Array, default: [] },
    totalFund:          { type: Number, default: 0 },
    funds:              { type: Array, default: [] },
    winners:            { type: Array, default: [] },
    status:             { type: Number, default: 0 },                   // Game status: 0 - created/ready, 1 - draw, 2 - closed
    created:            { type: Date, default: Date.now }
})

module.exports = mongoose.model('Game', GameSchema)