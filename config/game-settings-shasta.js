module.exports = {
    tronscanAddressUrl: 'https://shasta.tronscan.io/#/contract/',
    metamaskNetId: 3,
    games: [
        {
            type: 'w5x36',   
            reqNumbers: 5,
            padSize: 36,
            minWinMatch: 2,
            arrSize: 4,                         // REQ_NUMBERS - MIN_WIN_MATCH + 1
            drawDow: 2,                         // Day of week: 0 ... 6 (Sunday ... Saturday), other value - everyday
            drawHour: 16,                        // Hour: 0-23
            drawMinute: 0,                      // Minute: 0-59
            preDrawPeriod: 10,                   // (minutes)
            postDrawPeriod: 10,                  // (minutes)
            ticketPrice: 35,                     // TRX
            distribFund: { '2': 20, '3': 30, '4': 35, '5': 15},
            isActive: true,
            contractAddress: 'TSiqyLoWG7jrTnmqRVqGx7mdytaHXZ83TH',
        }
    ]

}