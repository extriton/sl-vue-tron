#!/usr/bin/env node
const app = require('../app')
const debug = require('debug')('mevn-app:server')
const http = require('http')
const contracts = require('../util/contracts')
const news = require('../util/news')
const cryptocurrency = require('../util/cryptocurrency')

// const test = require('../util/test')

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

// Create HTTP server & socket connection
const server = http.createServer(app)

// Listen on provided port, on all network interfaces.
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)


// Create socket connection
const io = require('socket.io').listen(server, { secure: false, rejectUnauthorized: false, path: '/ws/socket.io' })

// Run cryptocurrency updater
cryptocurrency.run()

const SYNC_INTERVAL = 30 * 60 * 1000                        // Synchronize every 30 minutes
const CLEAR_COLLECTION = false

// Init contracts data
contracts.init(io, () => {

  // Set contracts listeners
  contracts.setListeners()

  // Synchronize db & contracts data (true - clear collection)
  contracts.syncAllContracts(CLEAR_COLLECTION)
  setInterval(() => { contracts.syncAllContracts(CLEAR_COLLECTION) }, SYNC_INTERVAL)

  // Drawing contracts
  // contracts.drawAllContracts()

  // Set socket listeners
  require('../sockets/sockets')(io)

  // Run News updater
  news.runUpdater(io)

})

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}


// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}
