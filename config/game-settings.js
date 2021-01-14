const config = require('./config')
const gameSettings = require(`./game-settings-${config.trxNetwork}`)

const retSettings = JSON.parse(JSON.stringify(gameSettings))
if (retSettings.games !== undefined && Array.isArray(retSettings.games))
    for (let i = 0; i < retSettings.games.length; i++)
        if (!retSettings.games[i].isActive) {
            retSettings.games.splice(i, 1)
            i--
        } else {
            retSettings.games[i].type = getGameType(retSettings.games[i])
            retSettings.games[i].name = getGameName(retSettings.games[i])
        }


function getGameType (game) {
    let freq = (game.drawDow >= 0 && game.drawDow <= 6) ? 'w' : 'd'
    return freq + game.reqNumbers + 'x' + game.padSize
}

function getGameName (game) {
    let freq = (game.drawDow >= 0 && game.drawDow <= 6) ? 'Weekly ' : 'Daily '
    return freq + game.reqNumbers + '/' + game.padSize
}

module.exports = retSettings