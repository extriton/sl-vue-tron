const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('../config/server/config-server')


// Mongoose
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(config.dbURL, config.dbOptions)
  .then(() =>  {
    console.log('MongoDB: connection succesful')
    fixCollections()
  })
  .catch((err) => console.error('MongoDB: ' + err))

// Routes
// const game = require('./routes/game')

// App
const app = express()
app.use(logger('dev'))
// app.use(cors({credentials: true}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({'extended':'false'}))

// app.use(express.static(path.join(__dirname, '../dist')))
// app.use('/api/game', game)
// app.use('/*', express.static(path.join(__dirname, '../dist')))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.statusCode = 404
  next(err)
});

// Restful api error handler
app.use(function(err, req, res, next) {
  console.log(err)

  if (req.app.get('env') !== 'development') {
      delete err.stack
  }

    res.status(err.statusCode || 500).json(err)
});

// Fix colections fields (TEMPORARY!!!)
async function fixCollections () {

  const axios = require('axios')
  const Ip = require('./models/Ip.js')
  const News = require('./models/News.js')


  const ipGeoUrl = 'https://api.sypexgeo.net/json/'

  // Fix IP field "country"
  const IPs = await Ip.find()
  IPs.forEach(async (elem) => {
    if (!elem.country) {
      const ipGeo = await axios.get(ipGeoUrl + elem.ip)
      if (ipGeo && ipGeo.data && ipGeo.data.country && ipGeo.data.city) {
        elem.country = ipGeo.data.country.name_en + ', ' + ipGeo.data.city.name_en
        elem.save()
      }
    }
  })

  // Fix News field "innerLink"
  const news = await News.find()
  news.forEach(async (elem) => {
    // if (elem.innerLink) {
      elem.innerLink = getInnerLink(elem.link)
      if (!elem.innerLink) elem.innerLink = elem.id
      elem.save()
    // }
  })

}

function getInnerLink (link) {
  let SPos, QPos, res

  QPos = link.indexOf('/?')
  if (QPos === -1) {
    QPos = link.indexOf('?')
  }
  if (QPos === -1) {
    res = link
  } else {
    res = link.substr(0, QPos)
  }
  
  SPos = res.lastIndexOf('/')
  if (SPos === res.length - 1) {
    res = res.substr(0, res.length - 1)
    SPos = res.lastIndexOf('/')
  }

  res = res.substr(SPos + 1)
  return res
}

module.exports = app;