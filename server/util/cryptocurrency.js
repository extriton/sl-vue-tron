const axios = require('axios')

const rates = {
    bitcoin: {
        icon: 'bitcoin',
        name: 'Bitcoin',
        value: 'n/a'
    },
    ethereum: {
        icon: 'ethereum',
        name: 'Ethereum',
        value: 'n/a'
    },
    litecoin: {
        icon: 'litecoin',
        name: 'Litecoin',
        value: 'n/a'
    },
    monero: {
        icon: 'monero',
        name: 'Monero',
        value: 'n/a'
    },
}

function run () {
    const intervalTime = 30 * 60 * 1000
    update()
    setInterval(() => { update() }, intervalTime)
}


// API KEY: 0f7509c7-8302-4b54-864b-03a75e49865d (coinmarket.com)
// https://min-api.cryptocompare.com/documentation              API_KEY = 586b07af414c807d54c0f0c6761674d6e7e1dbf3e397f577a675b79c4c2bea2a

async function update () {
    /*
    const currenciesUrl = 'https://api.coinmarketcap.com/v1/ticker/?limit=16'
    if (currencies !== null) {
        rates.bitcoin.value = getRateBySymbol('BTC', currencies.data)
        rates.ethereum.value = getRateBySymbol('ETH', currencies.data)
        rates.litecoin.value = getRateBySymbol('LTC', currencies.data)
        rates.monero.value = getRateBySymbol('XMR', currencies.data)
    }
    */

    const API_KEY = '586b07af414c807d54c0f0c6761674d6e7e1dbf3e397f577a675b79c4c2bea2a'
    const baseURL = `https://min-api.cryptocompare.com/data/price?api_key=${API_KEY}&tsyms=USD&fsym=`
    
    // Bitcoin
    axios.get(baseURL + 'BTC')
    .then(response => {
        rates.bitcoin.value = parseInt(response.data.USD * 100) / 100
    })
    // Ethereum
    axios.get(baseURL + 'ETH')
    .then(response => {
        rates.ethereum.value = parseInt(response.data.USD * 100) / 100
    })
    // Litecoin
    axios.get(baseURL + 'LTC')
    .then(response => {
        rates.litecoin.value = parseInt(response.data.USD * 100) / 100
    })
    // Monero
    axios.get(baseURL + 'XMR')
    .then(response => {
        rates.monero.value = parseInt(response.data.USD * 100) / 100
    })
}

/*
function getRateBySymbol(symbol, rates) {
    let rate = 0
    for (let i = 0; i < rates.length; i++) {
        if (rates[i].symbol == symbol) {
            rate = rates[i].price_usd
            break
        }
    }
    return parseInt(rate * 100) / 100
}
*/

module.exports = {
    rates,
    run
}