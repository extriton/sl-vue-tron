const gameSettings = require('../../config/server/game-settings-server')
const util = require('./util')
const Game = require('../models/Game')
const Member = require('../models/Member')
// const drawAllContracts = require('./drawing').drawAllContracts

// const Contract = require('../classes/contract')

const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider
const fullNode = new HttpProvider(gameSettings.fullNode)
const solidityNode = new HttpProvider(gameSettings.solidityNode)
const eventServer = new HttpProvider(gameSettings.eventServer)

module.exports = {
    init                    : init,
    setListeners            : setListeners,
    syncAllContracts        : syncAllContracts,
//    drawAllContracts        : drawAllContracts
}

//-------------------------------------------------------------------------------------------------//
// Init contracts data
//-------------------------------------------------------------------------------------------------//
async function init(io, cb) {

    gameSettings.io = io
    
    /*
    const tmpContract = new Contract('w5x36', io)
    tmpContract._showSettings()

    return
    */

    // Define contracts connections and init contract phases
    for (const game of gameSettings.games) {
        const privateKey = game.ownerPrivKey
        const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey)
        game.contract = await tronWeb.contract().at(game.contractAddress)                   // ABI не нужно
        game.currentNum = (await game.contract.getGameInfo(0).call())._gamenum
        game.phase = 'ready'
        game.txCounter = 0
    }
    
    if (typeof(cb) === 'function') cb()

}

//-------------------------------------------------------------------------------------------------//
// Set listeners for all contracts
//-------------------------------------------------------------------------------------------------//
function setListeners() {
    
    // Check contracts.init() call
    if (gameSettings.games[0].contract === undefined) {
        console.log(`setListeners...  Error: contracts.init() not called!`)
        return
    }
    
    for (let i = 0; i < gameSettings.games.length; i++) {
        let game = gameSettings.games[i]
        setContractListeners(game, game.contract)
    }

    // Set listeners for contract
    function setContractListeners(_game, _contract) {
        // Process event GameChanged
        _contract.GameChanged().watch((error, event) => {
            console.log(`Event GameChanged started... (game_type: ${_game.type})`)
            if (error) { console.log(error); return }
            GameChanged(_game, _contract, event.result)
        })

        // Process event MemberChanged
        _contract.MemberChanged().watch((error, event) => {
            console.log(`Event MemberChanged started... (game_type: ${_game.type})`);
            if (error) { console.log(error); return; }
            console.log(event)
            MemberChanged(_game, _contract, event.result)
        })

    }

}

//-------------------------------------------------------------------------------------------------//
// Synchronize all contracts data (called on start serve and throw interval)
//-------------------------------------------------------------------------------------------------//
async function syncAllContracts(clear = false) {

    // Check contracts.init() call
    if (gameSettings.games[0].contract === undefined) {
        console.log(`syncAllContracts...  Error: contracts.init() not called!`)
        return
    }

    // Clear games and members data if 'clear' === true
    if (clear) {
        console.log(`Clearing Game and Member collection data`)
        await Game.deleteMany()
        await Member.deleteMany()
    }
    
    for (let i = 0; i < gameSettings.games.length; i++) {
        let game = gameSettings.games[i]
        syncContract(game, game.contract)
    }

}

//-------------------------------------------------------------------------------------------------//
// Synchronize contract data
//-------------------------------------------------------------------------------------------------//
async function syncContract(_game, _contract) {
    console.log(`syncContract started... (${_game.type})`)

    // Get contract last game, database games and define games array
    const lastGameContract = await _contract.getGameInfo(0).call()
    const dbGames = await Game.find({ type: _game.type })

    _game.currentNum = parseInt(lastGameContract._gamenum._hex)
    _game.phase = 'ready'

    for (const [i, v] of (new Array(_game.currentNum)).entries()) {
       const savedGame = await saveGame(_game, _contract, i + 1)

        for (const [j, v] of (new Array(savedGame.membersCounter)).entries()) {
            await saveMember(_game, _contract, i + 1, j + 1)
        }

    }

}

//-------------------------------------------------------------------------------------------------//
// Events handler functions                                                                        //
//-------------------------------------------------------------------------------------------------//
async function GameChanged(_game, _contract, res) {
    console.log(`Game ${res._gameNum} changed. (${_game.type})`)
    
    // 0 - New game
    if (res._action == 0) {
        syncContract(_game, _contract)
    }

    // 1 - Change status or 2 - Change Jackpot
    if (res._action == 1 || res._action == 2) {
        await saveGame(_game, _contract, res._gameNum)
    }

}

async function MemberChanged(_game, _contract, res) {
    console.log(`Member ${res._gameNum}, ${res._member} changed. (${_game.type})`)
    
    saveGame(_game, _contract, res._gameNum)
    saveMember(_game, _contract, res._gameNum, res._member)

}

//-------------------------------------------------------------------------------------------------//
// Save Game / Member                                                                              //
//-------------------------------------------------------------------------------------------------//
async function saveGame(_game, _contract, id) {

    const gamePromise = Game.findOne({ type: _game.type, id: id })
    let game = await gamePromise

    if (game !== null && game.status === 2) {
        return game
    }

    console.log(`SaveGame... id: ${id} (${_game.type})`)

    const gameInfoPromise = _contract.getGameInfo(id).call()
    const gameWinNumbersPromise = _contract.getGameWinNumbers(id).call()
    const gameFundsPromise = _contract.getGameFunds(id).call()
    const gameWinnersPromise = _contract.getGameWinners(id).call()

    const gameInfo = await gameInfoPromise
    const gameWinNumbers = await gameWinNumbersPromise
    const gameFunds = await gameFundsPromise
    const gameWinners = await gameWinnersPromise

    const privateKey = _game.ownerPrivKey
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey)

    const tmpGameFunds = new Array(_game.arrSize).fill(0)
    for (let i = 0; i < gameFunds._funds.length; i++) {
        tmpGameFunds[i] = +tronWeb.fromSun(gameFunds._funds[i]._hex)
        gameWinners[i] = parseInt(gameWinners[i])
    }

    if (game === null) { 
        game = new Game()
        game.type               = _game.type
        game.id                 = gameInfo._gamenum
        game.winNumbers         = new Array(_game.reqNumbers).fill(0)
        game.funds              = new Array(_game.arrSize).fill(0)
        game.winners            = new Array(_game.arrSize).fill(0)
    }

    if (gameInfo._status > game.status) {
        game.status = gameInfo._status
    }

    if (gameInfo._membersCounter > game.membersCounter) {
        game.membersCounter = parseInt(gameInfo._membersCounter._hex)
    }
    
    const totalFund = +tronWeb.fromSun(gameInfo._totalFund._hex)
    if (totalFund > game.totalFund) {
        game.totalFund = totalFund
    }

    game.funds = tmpGameFunds

    // Drawing or closed game
    if (game.status == 1 || game.status == 2) {
        game.winNumbers         = gameWinNumbers._winNumbers
    }

    // Closed game
    if (game.status == 2) {
        for (let i = 0; i < gameWinners._winners.length; i++)
            game.winners[i] = parseInt(gameWinners._winners[i]._hex)
    }
    
    await game.save()

    gameSettings.io.emit('refreshContractData',  { type: _game.type })

    return game
}

async function saveMember(_game, _contract, game_id, id) {
    
    const gamePromise = Game.findOne({ type: _game.type, id: game_id })
    const memberPromise = Member.findOne({ game_type: _game.type, game_id: game_id, id: id })
    
    const game = await gamePromise
    let member = await memberPromise

    if (member !== null && member.payout === 1) {
        return member
    }

    console.log(`SaveMember... game_id: ${game_id}, id: ${id} (${_game.type})`)

    const memberInfoPromise = _contract.methods.getMemberInfo(game_id, id).call()
    const memberInfo = await memberInfoPromise

    if (member === null) {
        member = new Member()
        member.game_type        = _game.type
        member.game_id          = game_id
        member.id               = id
    }

    member.address          = memberInfo._addr.toLowerCase()
    member.numbers          = memberInfo._numbers
    member.prize            = 0
    member.payout           = 0

    if (game.status == 2) {
        member.winNumbers       = game.winNumbers
        member.matchNumbers     = util.findMatch(memberInfo._numbers, game.winNumbers)
        //member.prize            = +tronWeb.fromSun(memberInfo._prize._hex)
        member.prize            = parseInt(memberInfo._prize._hex) / 1000000
        member.payout           = 1
    }

    await member.save()

    gameSettings.io.emit('refreshContractData',  { type: _game.type })

    return member
}