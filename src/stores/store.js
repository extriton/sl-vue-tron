import Vue from 'vue'
import Vuex from 'vuex'

import Language from '@/util/language'
import gameSettings from '@/../config/game-settings'

 // import detectEthereumProvider from '@metamask/detect-provider'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // For Notification
    notification: {
      counter: 0,
      type: '',
      title: '',
      text: ''
    },
    // For TheLanguage.vue component
    language: '',
    dict: Language.getDictonary(),
    // For Game Settings
    gameSettings: gameSettings,
    gameCurrentIndex: null,
    // For current contract data
    gameCurrentDetail: {
      GameNum: 0,
      Jackpot: 0,
      Fund: 0,
      Phase: 'ready',
      Status: 0
    }, 
    // For games history
    gameCurrentHistory: {
      HistoryCount: 0,
      History: []
    },
    // For player history
    playerCurrentHistory: {
      HistoryCount: 0,
      History: [],
      UnpaidAmount: 0
    },
    // For Metamask / Mist
    web3: {
      networkId: null,
      coinbase: null,
    },
    user: {
      address: '',
      username: '',
      chatBlocked: false,
      referrer: '',
      referalCount: 0,
      referalAmount: 0,
      freeAmount: 0,
      totalAmount: 0
    }
  },
  getters: {
    notification: state => {
      return state.notification
    },
    notificationCounter: state => {
      return state.notification.counter
    },
    gameSettings: state => {
      return state.gameSettings
    },
    gameCurrentIndex: state => {
      return state.gameCurrentIndex
    },
    gamesCount: state => {
      return state.gameSettings.games.length
    },
    gameCurrent: state => {
      return state.gameSettings.games[state.gameCurrentIndex]
    },
    gameCurrentDetail: state => {
      return state.gameCurrentDetail
    },
    gameCurrentHistory: state => {
      return state.gameCurrentHistory
    },
    playerCurrentHistory: state => {
      return state.playerCurrentHistory
    },
    web3: state => {
      return  state.web3
    },
    user: state => {
      return state.user
    }
  },
  mutations: {
    newNotify (state, payload) {
      state.notification.type = payload.type
      state.notification.title = payload.title
      state.notification.text = payload.text
      state.notification.counter++
    },
    setLanguage (state) {
      state.language = Language.getLanguage()
      state.dict = Language.getDictonary()
    },
    gameCurrentChange (state, payload) {
      const index = parseInt(payload)
      state.gameCurrentIndex = index
      state.gameCurrent = state.gameSettings.games[index]
    },
    initGameDetail (state) {
      state.gameCurrentDetail.GameNum = 0
      state.gameCurrentDetail.Jackpot = 0
      state.gameCurrentDetail.Fund = 0
      state.gameCurrentDetail.Phase = 'ready'
      state.gameCurrentDetail.Status = 0
    },
    getGameDataSuccess (state, payload) {
      state.gameCurrentDetail = payload
    },
    getGameHistorySuccess (state, payload) {
      state.gameCurrentHistory = payload
    },
    getPlayerHistorySuccess (state, payload) {
      state.playerCurrentHistory = payload
    },
    changeWeb3Coinbase (state, payload) {
      console.log(payload)
      state.web3.coinbase = payload
    },
    changeWeb3NetworkId (state, payload) {
      console.log(payload)
      state.web3.networkId = payload
    },
    userInit (state) {
      state.user = {
        address: '',
        username: '',
        chatBlocked: false,
        referrer: '',
        referalCount: 0,
        referalAmount: 0,
        freeAmount: 0,
        totalAmount: 0
      }
    },
    userChange (state, payload) {
      state.user = payload
    }
  },
  actions: {
    async registerWeb3 ({commit}) {

      // Loop for check TronLink
      const intervalId = setInterval(async () => {
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
          commit('changeWeb3Coinbase', window.tronWeb.defaultAddress.base58)
          clearInterval(intervalId)
        }
      }, 1000)

      // TronLink events
      window.addEventListener('message', function (e) {
        if (e.data.message && e.data.message.action == 'tabReply') {
          console.log("tabReply event", e.data.message)
          if (e.data.message.data.data.node && e.data.message.data.data.node.chain == '_') {
            console.log("tronLink currently selects the main chain")
          } else {
            console.log("tronLink currently selects the side chain")
          }

          console.log(e)
          commit('changeWeb3Coinbase', e.data.message.data.data.address)

          // Костыль, надо придумать по другому определять main grid от других сетей
          if (e.data.message.data.data.node && e.data.message.data.data.node.fullNode === 'https://api.trongrid.io') {
            commit('changeWeb3NetworkId', 1)
          } else {
            commit('changeWeb3NetworkId', 3)
          }
        }

        if (e.data.message && e.data.message.action == "setAccount") {
          console.log("setAccount event", e.data.message)
          console.log("current address:", e.data.message.data.address)
          commit('changeWeb3Coinbase', e.data.message.data.address)
        }

        if (e.data.message && e.data.message.action == "setNode") {
          console.log("setNode event", e.data.message)
          // Костыль, надо придумать по другому определять main grid от других сетей
          if (e.data.message.data.node.fullNode === 'https://api.trongrid.io') {
            commit('changeWeb3NetworkId', 1)
          } else {
            commit('changeWeb3NetworkId', 3)
          }

          if (e.data.message.data.node.chain == '_'){
            console.log("tronLink currently selects the main chain")
          } else {
            console.log("tronLink currently selects the side chain")
          }

        }
      })
      
      /*
      // Check Metamask installation
      const provider = await detectEthereumProvider()
      if (!provider || provider !== window.ethereum) return

      // Check Metamask installation (old)
      // if (!window.ethereum || !window.ethereum.isMetaMask) return
      
      // Set Metamask events handlers
      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('accountsChanged', handleAccountsChanged)

      // Retrieve Metamask chainId
      window.ethereum.request({ method: 'eth_chainId' }).then(handleChainChanged).catch(e => { console.log(e) })

      // Retrieve Metamask accounts
      window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        window.ethereum.request({ method: 'eth_accounts' }).then(handleAccountsChanged).catch(e => { console.log(e) })
      })
      .catch(err => {
        if (err.code === 4001) {
          console.log('Please connect to MetaMask.')
        } else {
          console.error(err)
        }
      })

      // Metamask events handlers
      function handleChainChanged (chainId) {
        if (typeof chainId === 'object') chainId = chainId.result
        commit('changeWeb3NetworkId', chainId)
      }

      function handleAccountsChanged (accounts) {
        console.log(accounts)
        if (!Array.isArray(accounts)) accounts = accounts.result
        if (accounts.length === 0) {
          commit('changeWeb3Coinbase', null)
        } else {
          commit('changeWeb3Coinbase', accounts[0])
        }
      }
      */
    }
    
  }
})
