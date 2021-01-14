const mongoose = require('mongoose')
const Schema = mongoose.Schema

var MemberSchema = new Schema({
    game_type:          { type: String, default: ''},                   // w5x36 и т.д.
    game_id:            { type: Number, default: 0 },
    id:                 { type: Number, default: 0 },
    address:            { type: String, default: '' },
    numbers:            { type: Array, default: [] },
    winNumbers:         { type: Array, default: [] },
    matchNumbers:       { type: Number, default: 0 },
    prize:              { type: Number, default: 0 },
    payout:             { type: Number, default: 0 },
    created:            { type: Date, default: Date.now }
})

module.exports = mongoose.model('Member', MemberSchema)