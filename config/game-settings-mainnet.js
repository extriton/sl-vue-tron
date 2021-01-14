module.exports = {
    tronscanAddressUrl: 'https://tronscan.io/#/contract/',
    metamaskNetId: 1,
    games: [
        {   
            reqNumbers: 5,
            padSize: 36,
            minWinMatch: 2,
            arrSize: 4,                         // REQ_NUMBERS - MIN_WIN_MATCH + 1
            drawDow: 2,                         // Day of week: 0 ... 6 (Sunday ... Saturday), other value - everyday
            drawHour: 16,                        // Hour: 0-23
            drawMinute: 0,                      // Minute: 0-59
            preDrawPeriod: 60,                   // (minutes)
            postDrawPeriod: 60,                  // (minutes)
            ticketPrice: 0.01,
            distribFund: { '2': 20, '3': 30, '4': 35, '5': 15},
            isActive: true,
            contractAddress: 'none',
        }
    ]

}