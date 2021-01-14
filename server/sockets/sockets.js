const config = require('../../config/config')
const configServer = require('../../config/server/config-server')
const gameSettings = require('../../config/server/game-settings-server')

const Game = require('../models/Game.js')
const Member = require('../models/Member.js')
const Ip = require('../models/Ip.js')
const Ipstat = require('../models/Ipstat.js')
const User = require('../models/User.js')
const Chat = require('../models/Chat.js')
const News = require('../models/News.js')

const cryptocurrency = require('../util/cryptocurrency')

let USERS_ONLINE = 0

// Export function
module.exports = io => {

    io.sockets.on('connection', socket => {

      const realSocketIP = getRealSocketIP(socket)

      if(realSocketIP !== '') addOnlineUser(realSocketIP)

      if(realSocketIP !== '') addSocketIP(realSocketIP)

      socket.on('getGameData', data => { getGameData(data, socket) })

      socket.on('getGameHistory', data => { getGameHistory(data, socket) })

      socket.on('getPlayerHistory', data => { getPlayerHistory(data, socket) })

      socket.on('getVisits', data => { getVisits(data, socket) })
      
      socket.on('getUserData', data => { getUserData(data, socket) })
      
      socket.on('saveUserName', data => { saveUserName(data, socket) })

      socket.on('newChatMessage', data => { newChatMessage(data, socket, io) })
      
      socket.on('getChatHistory', data => { getChatHistory(data, socket) })

      socket.on('getCryptoRates', data => { getCryptoRates(data, socket) })

      socket.on('getNews', data => { getNews(data, socket) })

      socket.on('getNewsItem', data => { getNewsItem(data, socket) })

      socket.on('getFreeETHData', data => { getFreeETHData(data, socket) })

      socket.on('rollFreeETH', data => { rollFreeETH(data, socket) })

      socket.on('getAdminVisitsData', data => { getAdminVisitsData(data, socket) })

      socket.on('getAdminUsersData', data => { getAdminUsersData(data, socket) })

      socket.on('changeUserFlags', data => { changeUserFlags(data, socket) })

      socket.on('getAdminIPsData', data => { getAdminIPsData(data, socket) })

      socket.on('getAdminMessagesData', data => { getAdminMessagesData(data, socket) })

      socket.on('changeMessageFlags', data => { changeMessageFlags(data, socket) })

      socket.on('disconnect', () => { 
        if(realSocketIP !== '') removeOnlineUser(realSocketIP)
       })
        
    })
}

// Return game data by game type to client socket
async function getGameData(data, socket) {

  if (!data.type) return

  // Define game settings by type
  let _game = null
  for (let i = 0; i < gameSettings.games.length; i++)
    if (gameSettings.games[i].type == data.type) {
      _game = gameSettings.games[i]
      break
    }
  
  const lastGame = await Game.findOne({ type: data.type, id: _game.currentNum })
  if (lastGame === null) return

  const fundsSize = lastGame.funds.length
  const result = {
    GameNum: lastGame.id,
    Jackpot: lastGame.funds[fundsSize - 1],
    Fund: lastGame.totalFund,
    Phase: _game.phase,
    Status: lastGame.status
  }

  socket.emit('getGameDataSuccess', result)

}

// Return game history by game type to client socket
async function getGameHistory(data, socket) {

  if (!data.type) {
    console.log(`getGameHistory: Invalid data`)
    return
  }

  try {
    data.page = parseInt(data.page)
  } catch(e) {
    data.page = 1
  }

  // Define game settings by type
  let _game = null
  for (let i = 0; i < gameSettings.games.length; i++)
    if (gameSettings.games[i].type == data.type) {
      _game = gameSettings.games[i]
      break
    }
  
  const historyCountPromise = Game.countDocuments({ type: data.type, id: { $lt: _game.currentNum } })
  const historyPromise = Game.find({ type: data.type, id: { $lt: _game.currentNum } }).sort({ id: -1 }).skip((data.page - 1) * 10).limit(10)

  const historyCount = await historyCountPromise
  const history = await historyPromise

  const result = {
    HistoryCount: 0,
    History: []
  }
  
  result.HistoryCount = historyCount
  for (let i = 0; i < history.length; i++)
    result.History.push({
      type            : history[i].type,
      id              : history[i].id,
      membersCounter  : history[i].membersCounter,
      winNumbers      : history[i].winNumbers,
      totalFund       : history[i].totalFund,
      funds           : history[i].funds,
      winners         : history[i].winners,
      status          : history[i].status
    })
  socket.emit('getGameHistorySuccess', result)
}

// Return player data by game type & player address to client socket
async function getPlayerHistory(data, socket) {

  if (!data.type) {
    console.log(`getPlayerHistory: Invalid data`)
    return
  }

  if (data.address === undefined) data.address = ''
  if (typeof data.address === 'string') data.address = data.address.toLowerCase()

  try {
    data.page = parseInt(data.page)
  } catch(e) {
    data.page = 1
  }

  const historyCountPromise = Member.countDocuments({ game_type: data.type, address: data.address })
  const historyPromise = Member.find({ game_type: data.type, address: data.address }).sort({ game_id: -1, id: 1 }).skip((data.page - 1) * 10).limit(10)
  
  const historyCount = await historyCountPromise
  const history = await historyPromise
  
  const result = {
    HistoryCount: historyCount,
    History: [],
  }

  // Copy and transform history data
  for (let i = 0; i < history.length; i++)
    result.History.push({
      game_type       : history[i].game_type,
      game_id         : history[i].game_id,
      id              : history[i].id,
      numbers         : history[i].numbers,
      winNumbers      : history[i].winNumbers,
      matchNumbers    : history[i].matchNumbers,
      prize           : history[i].prize,
      payout          : history[i].payout
    })

  // Loop tickets
  for(let i = 0; i < result.History.length; i++) {
    // Loop ticket numbers and change numeric array to array of obects
    for(let j = 0; j < result.History[i].numbers.length; j++) {
      const match = (result.History[i].winNumbers.indexOf(result.History[i].numbers[j]) === -1) ? false : true
      const tmp = {
        num: result.History[i].numbers[j],
        match: match
      }
      result.History[i].numbers[j] = tmp
    }
  }

  socket.emit('getPlayerHistorySuccess', result)
}

// Return unique users and site visits
async function getVisits(data, socket) {

  const ipsPromise = Ip.find({})
  const excludeIPsPromise = getAdminIPs()

  const ips = await ipsPromise
  const excludeIPs = await excludeIPsPromise

  const result = {
    newUsers: ips.length,
    visits:  0
  }

  ips.forEach(elem => {
    if (excludeIPs.indexOf(elem.ip) === -1) {
      result.visits += elem.cnt
    }
  })

  socket.emit('getVisitsSuccess', result)
}

// Return user data
async function getUserData(data, socket) {

  if (!data.address) return
  
  let user = await User.findOne({ address: data.address })
  if (user === null) {
    user = new User({ address: data.address })
  }

  if (!user.referrer && data.referrer && data.address != data.referrer) {
    const referrer = await User.findOne({ address: data.referrer })
    if (referrer) {
      user.referrer = referrer.address
      referrer.referalCount += 1
      referrer.save()
    } else {
      user.referrer = ''
    }
  }

  const ip = getRealSocketIP(socket)

  if (user.ips.indexOf(ip) === -1) {
    user.ips.push(ip)
  }

  if (!user.isAdmin) user.isAdmin = false
  if (!user.username) user.username = ''
  if (!user.chatBlocked) user.chatBlocked = false
  if (!user.referalCount) user.referalCount = 0
  if (!user.referalAmount) user.referalAmount = 0
  if (!user.freeAmount) user.freeAmount = 0
  if (!user.totalAmount) user.totalAmount = 0

  user.save()

  const result = {
    address: user.address,
    username: user.username,
    chatBlocked: user.chatBlocked,
    referrer: user.referrer,
    referalCount: user.referalCount,
    referalAmount: user.referalAmount,
    freeAmount: user.freeAmount,
    totalAmount: user.totalAmount
  }

  socket.emit('getUserDataSuccess', result)
  
}

// Save user name
async function saveUserName(data, socket) {

  // Check params
  if (!data.address || !data.username) return

  // Find user by address
  const user = await User.findOne({ address: data.address })
  if (!user) return

  // Check dublicate username (not admin)
  if (('' + data.username).toLowerCase() !== 'admin') {
    const userByUsername = await User.findOne({ username: data.username })
    if (userByUsername !== null) {
      socket.emit('saveUserNameError', { error: 'A user with the same name already exists.' })
      return
    }
  } else {
    data.username = 'Admin'
  }

  user.username = data.username
  user.save()

  socket.emit('saveUserNameSuccess')
}

// Store and emit new chat message
async function newChatMessage(data, socket, io) {

  // Check data
  if (!data.address || !data.message) return
  
  // Check user
  const user = await User.findOne({ address: data.address })
  if (user === null || user.chatBlocked) return

  const message = new Chat({
    address: user.address,
    username: user.username,
    message: data.message
  })

  await message.save()

  const result = {
    username: message.username || getShortAddress(message.address),
    message: message.message
  }

  io.sockets.emit('newChatMessageSuccess', result)
  
}

// Return last 30 chat messages
async function getChatHistory(data, socket) {
  
  const chatHistory = await Chat.find({ visible: true }).sort({ created: -1 }).limit(30)

  const result = {
    history: []
  }
  
  for (let i = 0; i < chatHistory.length; i++) {
    result.history.push({ 
      username: chatHistory[i].username || getShortAddress(chatHistory[i].address),
      message: chatHistory[i].message
     })
  }
  
  result.history.reverse()

  socket.emit('getChatHistorySuccess', result)
}

// Return crypto rates
async function getCryptoRates(data, socket) {
  
  socket.emit('getCryptoRatesSuccess', { rates: cryptocurrency.rates })

}

// Return News List
async function getNews(data, socket) {

  let skip, limit

  try {
    skip = parseInt(data.skip)
  } catch (e) {
    skip = 0
  }
  
  try {
    limit = parseInt(data.limit)
  } catch (e) {
    limit = 30
  }
  
  const news = await News.find().sort({ feedDate: -1 }).skip(skip).limit(limit)
  socket.emit('getNewsSuccess', { news: news })
}

// Return News Item
async function getNewsItem(data, socket) {

  if (!data.id) {
    socket.emit('getNewsItemSuccess', { newsItem: { title: 'Not found' } })
    return
  }
  
  const newsItem = await News.findOne({ innerLink: data.id })
  if (!newsItem) {
    socket.emit('getNewsItemSuccess', { newsItem: { title: 'Not found' } })
    return
  }

  socket.emit('getNewsItemSuccess', { newsItem: newsItem })
}

// Return data for Free ETH page
async function getFreeETHData(data, socket) {
  
  const result = {
    timeLeft: 0,
    prizes: []
  }
  
  /* Переделано под IP (data.address может и не нужен)  
  if (data.address) {
    const user = await User.findOne({ address: data.address })
    if (user !== null) {
      user.lastRollTime = user.lastRollTime || new Date(0)
      result.timeLeft = user.lastRollTime.getTime() + (60 * 60 * 1000) - (new Date().getTime())
      if (result.timeLeft < 0)
        result.timeLeft = 0
    }
  }
  */
  
  const realSocketIp = getRealSocketIP(socket)
  if (realSocketIp !== '') {
    const ip = await Ip.findOne({ ip: realSocketIp })
    if (ip !== null) {
      ip.lastRollTime = ip.lastRollTime || new Date(0)
      result.timeLeft = ip.lastRollTime.getTime() + (60 * 60 * 1000) - (new Date().getTime())
      if (result.timeLeft < 0)
        result.timeLeft = 0
    }
  }

  result.prizes = await getFreeETHPrizes()
  
  socket.emit('getFreeETHDataSuccess', result)
}

// Roll Free ETH
async function rollFreeETH(data, socket) {

  const request = require("request")

  // Check input params
  if (!data.address) {
    socket.emit('rollFreeETHError', { error: 'Invalid address!' })
    return
  }

  /*
  if (!data.recaptchaToken) {
    socket.emit('rollFreeETHError', { error: 'Invalid recatptcha token!' })
    return
  }

  // reCAPTCHA verify
  const verifyCaptchaOptions = {
    uri: 'https://www.google.com/recaptcha/api/siteverify',
    json: true,
    form: {
        secret: configServer.reCaptchaSecretKey,
        response: data.recaptchaToken
    }
  }

  request.post(verifyCaptchaOptions, function (err, response, body) {
    if (err) {
      socket.emit('rollFreeETHError', { error: 'Oops, something went wrong on our side!' })
      return
    }

    if (!body.success) {
      socket.emit('rollFreeETHError', { error: body["error-codes"].join(", ") })
      return
    }

    // Save data
    saveData()
  })
  */

  saveData()

  // Save user and referrer data
  async function saveData () {
    
    // Find ip by realSocketIp
    const realSocketIp = getRealSocketIP(socket)
    const ip = await Ip.findOne({ ip: realSocketIp })
    if (ip === null) {
      socket.emit('rollFreeETHError', { error: 'Invalid IP!' })
      return
    }
  
    // Find user by address
    const user = await User.findOne({ address: data.address })
    if (user === null) {
      socket.emit('rollFreeETHError', { error: 'User not found!' })
      return
    }

    // Check ip & user lastRollTime
    ip.lastRollTime = ip.lastRollTime || new Date(0)
    user.lastRollTime = user.lastRollTime || new Date(0)

    const lastRollTime = (ip.lastRollTime > user.lastRollTime) ? ip.lastRollTime : user.lastRollTime
    if ( (new Date().getTime()) < (lastRollTime.getTime() + 60 * 60 * 1000) ) {
      socket.emit('rollFreeETHError', { error: 'Invalid time!' })
      return
    }
  
    // Retrieve random number
    const resultNumber = parseInt(Math.random() * 10000)
    if (resultNumber >= 9994) resultNumber -=100

    // Define prize
    let resultPrize = 0
    const prizes = await getFreeETHPrizes()
    for (let i = 0; i < prizes.length; i++) {
      if (resultNumber >= prizes[i].min && resultNumber <= prizes[i].max) {
        resultPrize = prizes[i].prize
        break
      }
    }

    // Update ip
    ip.lastRollTime = new Date()
    ip.save()

    // Update user
    user.freeAmount += resultPrize
    user.totalAmount += resultPrize
    user.lastRollTime = new Date()
    user.save()

    // Find & update referrer
    let referrer = null
    if (user.referrer) {
      referrer = await User.findOne({ address: user.referrer })
      if (referrer !== null) {
        referalAmount = parseInt(resultPrize * config.referalRate / 100)
        referrer.referalAmount += referalAmount
        referrer.totalAmount += referalAmount
        referrer.save()
      }
    }

    const result = {
      resultNumber: resultNumber,
      resultPrize: resultPrize
    }

    socket.emit('rollFreeETHSuccess', result)
  }

}

// Return data for admin visits page
async function getAdminVisitsData(data, socket) {

  if (!data.year || !data.month) {
    const now = new Date()
    data.year = now.getFullYear()
    data.month = now.getMonth() + 1
  }

  try {
    data.year = parseInt(data.year)
    data.month = parseInt(data.month)
  } catch {
    const now = new Date()
    data.year = now.getFullYear()
    data.month = now.getMonth() + 1
  }
  
  const ipsPromise = Ip.find({})
  const ipStatPromise = Ipstat.find({ year: data.year, month: data.month })
  const excludeIPsPromise = getAdminIPs()

  const ips = await ipsPromise
  const ipStat = await ipStatPromise
  const excludeIPs = await excludeIPsPromise

  const result = {
    newUsers: ips.length,
    visits:  0,
    online: USERS_ONLINE,
    ipStat: []
  }

  ips.forEach(elem => {
    if (excludeIPs.indexOf(elem.ip) === -1) {
      result.visits += elem.cnt
    }
  })
  result.ipStat = ipStat

  socket.emit('getAdminVisitsDataSuccess', result)
}

// Return data for admin users page
async function getAdminUsersData(data, socket) {

  const result = []

  const users = await User.find()

  for (let i = 0; i < users.length; i++) {
    const obj = {
      address: users[i].address,
      username: users[i].username,
      ips: users[i].ips,
      isAdmin: users[i].isAdmin,
      chatBlocked: users[i].chatBlocked,
      status: users[i].status,
      tickets: 0
    }
    obj.tickets = await Member.countDocuments({ address: users[i].address })
    result.push(obj)
  }
  
  socket.emit('getAdminUsersDataSuccess', result)
}

// Change user flags
async function changeUserFlags (data, socket) {

  if (!data.address) return

  const user = await User.findOne({ address: data.address })
  if(!user) return

  user.isAdmin = !!data.isAdmin
  user.chatBlocked = !!data.chatBlocked

  if (user.isAdmin) {
    user.username = 'Admin'
  } else {
    user.username = ''
  }

  await user.save()

  socket.emit('changeUserFlagsSuccess')
}

// Return data for admin IPs page
async function getAdminIPsData(data, socket) {

  const ips = await Ip.find()

  socket.emit('getAdminIPsDataSuccess', ips)
}

// Return data for admin messages page
async function getAdminMessagesData(data, socket) {

  const messages = await Chat.find()
  
  messages.forEach(elem => {
    elem.address = getShortAddress(elem.address)
  })

  socket.emit('getAdminMessagesDataSuccess', messages)
}

// Change user flags
async function changeMessageFlags (data, socket) {

  if (!data.created) return

  const message = await Chat.findOne({ created: data.created })
  if(!message) return

  message.visible = !!data.visible
  await message.save()

  socket.emit('changeMessageFlagsSuccess')
}

// Add socket IP
async function addSocketIP(socketIP) {
  
  const axios = require('axios')
  const ipGeoUrl = 'https://api.sypexgeo.net/json/'
    
  const excludeIPs = await getAdminIPs()
  if (excludeIPs.indexOf(socketIP) !== -1) return
  
  // Add in DB
  Ip.findOne({ ip: socketIP }).exec(async (err, ip) => {
    if(err) {
      console.log('Ip find Error: ' + err)
      return
    }
        
    let isNew = false
    if (!ip) {
      ip = new Ip({
        ip: socketIP,
        cnt: 1,
        country: ''
      })
      isNew = true
    } else {
      ip.cnt = ip.cnt + 1
    }
    
    if (!ip.country) {
      const ipGeo = await axios.get(ipGeoUrl + ip.ip)
      if (ipGeo && ipGeo.data && ipGeo.data.country && ipGeo.data.city) {
        ip.country = ipGeo.data.country.name_en + ', ' + ipGeo.data.city.name_en
      }
    }
    
    ip.updated = new Date()
    ip.save()

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const date = now.getDate()
        
    Ipstat.findOne({ year: year, month: month, date: date }).exec((err, stat) => {
      if(err) {
        console.log('Ipstat find Error:' + err)
        return
      }

      if (!stat) {
        stat = new Ipstat({
          year: year,
          month: month,
          date: date,
          newUsers: 0,
          visits: 1
        })
      } else {
        stat.visits += 1
      }

      if (isNew) {
        stat.newUsers += 1
      }
      stat.save()
    })

  })
}

// Add online user
async function addOnlineUser(socketIP) {
  
  const excludeIPs = await getAdminIPs()
  if (excludeIPs.indexOf(socketIP) !== -1) return
  
  USERS_ONLINE++

}

// Remove online user
async function removeOnlineUser(socketIP) {
  
  const excludeIPs = await getAdminIPs()
  if (excludeIPs.indexOf(socketIP) !== -1) return
  
  USERS_ONLINE--
  
}

// Return real socket IP
function getRealSocketIP(socket) {
        
  let origin_client_ip = ''
  let x_forwarded_for = []

  // Check crawlers
  const regExp = /(Google|Yahoo|Rambler|Bot|Yandex|Spider|Snoopy|Crawler|Finder|Mail|curl)/i
  if (regExp.test(socket.handshake.headers['user-agent'])) {
    return ''
  }

  // Define IP
  if(socket.handshake.headers['x-forwarded-for']) {
      x_forwarded_for = socket.handshake.headers['x-forwarded-for'].split(', ')
      origin_client_ip = x_forwarded_for[0]
  } else {
      origin_client_ip = socket.handshake.address
  }

  return origin_client_ip
}

// Return short address in format 0x28c2...65e3
function getShortAddress (address) {
  return (address.substr(0, 6) + '...' + address.substr(-4))
}

// Return array of admin IPs
async function getAdminIPs () {
  return new Promise(async (resolve) => {

    const result = []
    const admins = await User.find({ isAdmin: true })

    admins.forEach(admin => {
      admin.ips.forEach(ip => { result.push(ip) })
    })

    resolve(result)
  })
}

async function getFreeETHPrizes () {
  
  const minInUSD = 0.0007             // Выплата за прокрутку (1-я строка)
  let minInGwei = minInUSD / cryptocurrency.rates.ethereum.value * 1000000000
  minInGwei = parseInt(minInGwei / 100) * 100


  const m1 = 1
  const m2 = 29.7
  const m3 = 297
  const m4 = 2972
  const m5 = 29724
  const m6 = 297246

  // Prizes in Gwei
  const result = [
    {
      min: 0,
      max: 9885,
      range: '0 - 9885',
      prize: minInGwei * m1
    },
    {
      min: 9886,
      max: 9985,
      range: '9886 - 9985',
      prize: minInGwei * m2
    },
    {
      min: 9986,
      max: 9993,
      range: '9986 - 9993',
      prize: minInGwei * m3
    },
    {
      min: 9994,
      max: 9996,
      range: '9994 - 9996',
      prize: minInGwei * m4
    },
    {
      min: 9997,
      max: 9998,
      range: '9997 - 9998',
      prize: minInGwei * m5
    },
    {
      min: 9999,
      max: 9999,
      range: '9999',
      prize: minInGwei * m6
    }
  ]

  return new Promise((resolve, reject) => {
    resolve(result)
  })
}
