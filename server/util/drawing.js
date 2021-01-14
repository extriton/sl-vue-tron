// Не доделан под TRON, непонятно как определять nonce, возможно надо запоминать номер игры и крутить пока не поменяется
// Закоменчен везде вызов drawAllContracts

const axios = require('axios')
const config = require('../../config/config')
const gameSettings = require('../../config/server/game-settings-server')
const util = require('./util')
const Tx = require('ethereumjs-tx').Transaction
const bufferToHex = require('ethereumjs-util').bufferToHex
const Web3 = require('web3')
const web3 = new Web3(gameSettings.websocketProvider)

module.exports = {
    drawAllContracts        : drawAllContracts
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Every time period check and run contract drawing if needed
///////////////////////////////////////////////////////////////////////////////////////////////////////
function drawAllContracts() {
    
    // Check contracts.init() call
    if (gameSettings.games[0].contract === undefined) {
        console.log(`drawAllContracts... Error: contracts.init() not called!`)
        return
    }

    // Run timer and process contracts every 3 minutes
    setInterval(() => {
        // Loop contracts
        for (let i = 0; i < gameSettings.games.length; i++) {
            const game = gameSettings.games[i]
            startContractDrawing(game, game.contract)
        }
    }, 1 * 60 * 1000)

}

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Init params and push transactions chain
///////////////////////////////////////////////////////////////////////////////////////////////////////
async function startContractDrawing(_game, _contract) {

    // Check drawing time and ready phase
    if (util.isDrawing(_game)) {
        if (_game.phase !== 'ready') return
    } else {
        if (_game.phase === 'finished') {
            _game.phase = 'ready'
            _game.currentNum = (await _game.contract.getGameInfo(0).call())._gamenum
            gameSettings.io.emit('refreshContractData',  { type: _game.type })
        }
        return
    }

    console.log(`${new Date()}: startContractDrawing... (${_game.type})`)

    _game.phase = 'starting'
    _game.txCounter = 0
    _game.currentNum = (await _game.contract.getGameInfo(0).call())._gamenum
    gameSettings.io.emit('refreshContractData',  { type: _game.type })

    // Transaction params
    const serviceAddress = _game.serviceAddress
    const servicePrivKey = Buffer.from(_game.servicePrivKey, 'hex')
    const contractAddress = _game.contractAddress

    // Raw tranaction object
    const rawTransaction = {
        nonce           : '0x00',
        gasPrice        : web3.utils.toHex('6000000000'),       // Default 6 Gwei
        gasLimit        : web3.utils.toHex('3500000'),          // 3.5 millions
	    to              : contractAddress,
	    value           : '0x00',
	    data            : ''
	}

    // Start first transaction after random pause ????
    const randomPause = _game.preDrawPeriod * 60 + Math.floor(Math.random() * _game.postDrawPeriod * 60 * 0.5)
    // const randomPause = 1
    setTimeout(() => { pushTransaction(_game, _contract) }, randomPause * 1000)

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // Push transaction 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    async function pushTransaction(_game, _contract) {

        _game.txCounter++
        console.log(`${new Date()}: pushTransaction ${_game.txCounter} started... (${_game.type})`);
        
        // Define current gasPrice (fast)
        let gasPrice = null
        try {
            gasPrice = await axios.get(`https://ethgasstation.info/json/ethgasAPI.json`)
        } catch (e) {
            console.log(`${new Date()}: Error (${_game.type}): ${e}`)
        }

        if (gasPrice !== null) 
            rawTransaction.gasPrice = web3.utils.toHex('' + (gasPrice.data.fast * 100000000))

        // Get transaction count, later will used as nonce
        console.log('web3: ' + web3)
        web3.eth.getTransactionCount(serviceAddress).then(nonce => {
            console.log('nonce: ' + nonce)
            rawTransaction.data = web3.utils.toHex(_game.txCounter)
            rawTransaction.nonce = web3.utils.toHex(nonce)

            // Creating tranaction via ethereumjs-tx
            const tx = new Tx(rawTransaction, { chain: config.ethNetwork, hardfork: 'petersburg' })
            tx.sign(servicePrivKey)

            // Validate transaction: if transaction incorrect then log and return
            if (!tx.validate() || bufferToHex(tx.getSenderAddress()) !== serviceAddress.toLowerCase()) {
                console.log(`Invalid transaction: #${_game.txCounter} (Game: ${_game.type}, GameNum: ${_game.currentNum})`)
                return
            }

            // Sending transacton via web3 module
            web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'))
                .on('receipt', onReceipt)
                .on('error', onError)
        })
        
        async function onReceipt (receipt) {
           
            // Compare drawingGameNum and currentGameNum
           const currentGameNum = (await _game.contract.methods.getGameInfo(0).call())._gamenum

           if (currentGameNum == _game.currentNum) {
               pushTransaction(_game, _contract)
           } else {
               _game.phase = 'finished'
           }
        
        }

        function onError (error) {
            console.log(`${new Date()}: Error (${_game.type}): ${error}`)
        }

    }

}