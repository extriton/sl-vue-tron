const mongoose = require('mongoose')
const Schema = mongoose.Schema

var IpstatSchema = new Schema({
    year:               { type: Number, default: 2019 },
    month:              { type: Number, default: 1 },
    date:               { type: Number, default: 1 },
    newUsers:           { type: Number, default: 0 },
    visits:             { type: Number, default: 0 },
})

module.exports = mongoose.model('Ipstat', IpstatSchema)