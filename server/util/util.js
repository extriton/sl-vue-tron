module.exports = {
    isDrawing           : isDrawing,
    findMatch           : findMatch,
    getCurrentGameNum   : getCurrentGameNum
}

//----------------------------------------------------------------------------------
// Check drawing time or no
//----------------------------------------------------------------------------------
function isDrawing(_game) {

    const SEC_IN_DAY = 24 * 60 * 60                                     // 86 400
    const isWeeklyGame = (_game.drawDow >= 0 && _game.drawDow <= 6) ? true : false
    const now = new Date()

    let timeToDraw = (_game.drawHour * 60 + _game.drawMinute) * 60
    let timeCurrent = (now.getUTCHours() * 60 + now.getUTCMinutes()) * 60 + now.getUTCSeconds()
    if (isWeeklyGame) {
        timeToDraw += _game.drawDow * SEC_IN_DAY
        timeCurrent += now.getUTCDay() * SEC_IN_DAY
    }

    // If drawing period, return time to end drawing, Else return 0
    if(timeCurrent > (timeToDraw - _game.preDrawPeriod * 60) && timeCurrent < (timeToDraw + _game.postDrawPeriod * 60))
        return true
    else
        return false
}

//----------------------------------------------------------------------------------
// Find match numbers in two arrays
//----------------------------------------------------------------------------------
function findMatch(arr1, arr2) {
    let cnt = 0
    for (let i = 0; i < arr1.length; i++)
        for (let j = 0; j < arr2.length; j++)
            if (arr1[i] === arr2[j]) { cnt++; break; }
    return cnt
}

//----------------------------------------------------------------------------------
// Get current contract gameNum
//----------------------------------------------------------------------------------
async function getCurrentGameNum (_game, _contract) {

    let currentGame = null
    try {
        currentGame = await _contract.methods.getGameInfo(0).call()
    } catch (e) {
        console.log(`${new Date()}: Error (${_game.type}): ${e}`)
    }
    
    if (currentGame === null) {
        console.log(`${new Date()}: Error (${_game.type}): currentGame === null`)
    }

    return currentGame
}