const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Схема хранения сообщений чата
var NewsSchema = new Schema({
    id:                 { type: String, default: '', unique: true },
    innerLink:          { type: String, default: '' },
    searchKeyWords:     { type: Array, default: [] },
    feedDate:           { type: Number, default: 0 },
    icon:               { type: String, default: '' },
    source:             { type: String, default: '' },
    sourceLink:         { type: String, default: '' },
    title:              { type: String, default: '' },
    description:        { type: String, default: '' },
    link:               { type: String, default: '' },
    imgURL:             { type: String, default: '' },
})

module.exports = mongoose.model('News', NewsSchema)