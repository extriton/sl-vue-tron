const config = require('../../config/config')
const gameSettings = require(`../../config/game-settings-${config.trxNetwork}`)
const gameSettingsServer = require(`../../config/server/game-settings-server-${config.trxNetwork}`)

module.exports = class Contract {
    #io = null
    #settings = null

    constructor (type, io) {
        // Pointer to websocket
        this.#io = io
        // Define settings by game type
        this.#settings = {}
        for (const game of gameSettings.games)
            if (game.type === type) {
                this.#settings = Object.assign(this.#settings, game)
                break
            }
        for (const game of gameSettingsServer.games)
            if (game.type === type) {
                this.#settings = Object.assign(this.#settings, game)
                break
            }
    }

    _showSettings () {
        console.log('_showSettings')
        console.log(this.#settings)
    }


}