export default {
    
    // Return time to draw in secods or 0 if game drawing 
    // preDrawPeriod, postDrawPeriod params in minutes
    calcTimerStart (_game) {
        
        const SEC_IN_DAY = 24 * 60 * 60                                     // 86 400
        const SEC_IN_WEEK = 7 * SEC_IN_DAY                                  // 604 800
        const isWeeklyGame = (_game.drawDow >= 0 && _game.drawDow <= 6) ? true : false
        const now = new Date()

        let timeToDraw = (_game.drawHour * 60 + _game.drawMinute) * 60
        let timeCurrent = (now.getUTCHours() * 60 + now.getUTCMinutes()) * 60 + now.getUTCSeconds()
        if (isWeeklyGame) {
            timeToDraw += _game.drawDow * SEC_IN_DAY
            timeCurrent += now.getUTCDay() * SEC_IN_DAY
        }

        // If blocked period, set timer to 0
        if(timeCurrent > (timeToDraw - _game.preDrawPeriod * 60) && timeCurrent < (timeToDraw + _game.postDrawPeriod * 60)) return 0

        // Else, return timer value
        let result = timeToDraw - timeCurrent - _game.preDrawPeriod * 60
        if (timeCurrent > timeToDraw) {                                     // Add week or day to result      
            if (isWeeklyGame) result += SEC_IN_WEEK                         // Weekly game
            else result += SEC_IN_DAY                                       // Daily game
        }

        return result
    },

    timerToStr (timer) {
        let days = '', hours = '', minutes = '', seconds = '';    
        if(timer <= 0) return '00000000'

        const timeLeft = new Date(timer)
        days = '0' + (timeLeft.getUTCDate() - 1)               // days

        hours = '' + timeLeft.getUTCHours()                    // hours
        if(hours.length === 1) hours = '0' + hours

        minutes = '' + timeLeft.getUTCMinutes()                // minutes
        if(minutes.length == 1) minutes = '0' + minutes

        seconds = '' + timeLeft.getUTCSeconds()                // seconds
        if(seconds.length == 1) seconds = '0' + seconds

        return (days + hours + minutes + seconds)            
    },

    formatNumber (value, int, frac) {
        const zeroString = '00000000000000000000'
        
        try {
            value = parseFloat(value)
        } catch(e) {
            return ''
        }

        let _int = '' + parseInt(value)
        let _frac = '' + (value - parseInt(value))
        _frac = _frac.substr(2)

        // Integer part
        if(int > _int.length) _int = zeroString.substr(0, int - _int.length) + _int
        
        // Fractional part
        if(frac === 0) return _int
        if(frac === _frac.length) return _int + '.' + _frac

        if(frac > _frac.length) 
            _frac += zeroString.substr(0, frac - _frac.length)
        else
            _frac = _frac.substr(0, frac)

        return _int + '.' + _frac
    },

    calcDataString (arr) {
        let dataString = ''
        let hex = ''
    
        for(let i = 0; i < arr.length; i++) {
            if(arr[i] === 1) {
                hex = Number(i + 1).toString(16)
                hex = hex.toUpperCase()
                if(hex.length === 1) hex = '0' + hex
                dataString += hex
            }
        }
    
        return dataString
    },

    calcDrawPeriod (_game) {

        const res = {
            fromHour: '00',
            fromMinute: '00',
            toHour: '00',
            toMinute: '00'
        }

        let _time = (_game.drawHour * 60 + _game.drawMinute - _game.preDrawPeriod)
        res.fromHour = '' + parseInt(_time / 60)
        res.fromMinute = '' + _time % 60
        _time = (_game.drawHour * 60 + _game.drawMinute + _game.postDrawPeriod)
        res.toHour = '' + parseInt(_time / 60)
        res.toMinute = ''+ _time % 60

        if (res.fromHour.length === 1) res.fromHour = '0' + res.fromHour
        if (res.fromMinute.length === 1) res.fromMinute = '0' + res.fromMinute
        if (res.toHour.length === 1) res.toHour = '0' + res.toHour
        if (res.toMinute.length === 1) res.toMinute = '0' + res.toMinute

        return res

    }

}