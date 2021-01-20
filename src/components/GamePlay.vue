<template>
    <div id="game-play" class="game-play-wrapper">
        <!-- Timer -->
        <div class="timer-wrapper">
            <div class="timer">
                <span class="timer__part">
                    <span class="number">{{ timerString.charAt(0) }}</span>
                    <span class="number">{{ timerString.charAt(1) }}</span>
                    <span class="number-desc">Days</span>
                </span>
                <span class="dotter">:</span>
                <span class="timer__part">
                    <span class="number">{{ timerString.charAt(2) }}</span>
                    <span class="number">{{ timerString.charAt(3) }}</span>
                    <span class="number-desc">Hours</span>
                </span>
                <span class="dotter">:</span>
                <span class="timer__part">
                    <span class="number">{{ timerString.charAt(4) }}</span>
                    <span class="number">{{ timerString.charAt(5) }}</span>
                    <span class="number-desc">Minutes</span>
                </span>
                <span class="dotter">:</span>
                <span class="timer__part">
                    <span class="number">{{ timerString.charAt(6) }}</span>
                    <span class="number">{{ timerString.charAt(7) }}</span>
                    <span class="number-desc">Seconds</span>
                </span>
            </div>
        </div>
        <!-- Loto numeric pad wrapper -->
        <div class="loto-pad-wrapper">
            <!-- Loto info -->
            <div class="loto-info">
                <!-- Game Number -->
                <div class="column">
                    <div class="icon">
                        <img src="../../public/img/icons/icon_number.png"  alt="Game number" title="Game number" width="50" height="50" />
                    </div>
                    <span>
                        {{ dict.play_game_num }} <br />
                        <transition name="info" mode="out-in" >
                            <span class="animate-info" :key="GameNum">
                                <strong class="text">{{ GameNum }}</strong>
                            </span>
                        </transition>
                    </span>
                </div>
                <!-- Game Number -->
                <div class="column">
                    <div class="icon">
                        <img src="../../public/img/icons/icon_prize.png"  alt="Prize fund" title="Prize fund" width="50" height="50" />
                    </div>
                    <span>
                        {{ dict.play_prize_fund }} <br />
                        <transition name="info" mode="out-in" >
                            <span class="animate-info" :key="Fund">
                                <strong class="text">{{ Fund }} TRX</strong>
                            </span>
                        </transition>
                    </span>
                </div>
                <!-- Game Number -->
                <div class="column">
                    <div class="icon">
                        <img src="../../public/img/icons/icon_jackpot.png"  alt="Jackpot" title="Jackpot" width="50" height="50" />
                    </div>
                    <span>
                        {{ dict.play_jackpot }} <br />
                        <transition name="info" mode="out-in" >
                            <span class="animate-info" :key="Jackpot">
                                <strong class="text">{{ Jackpot }} TRX</strong>
                            </span>
                        </transition>
                    </span>
                </div>
            </div>
            <!-- Loto pad -->
            <div class="loto-pad">
                <!-- Drawing message -->
                <div class="drawing" :class="{ active: isDrawing }">
                    <div class="drawing-box">
                        <img src="../../public/img/loading.svg"  alt="Jackpot" title="Drawing..." />
                        <span class="drawing-text">{{ drawingText }}</span>
                    </div>
                </div>
                <!--
                <div class="count-block">
                    <span v-show="leftNumbers > 0">{{ dict.play_select }} <strong class="left-numbers-color">{{ leftNumbers }}</strong> {{ dict.play_numbers }}</span>
                    <span v-show="leftNumbers === 0">{{ dict.play_ready }}</span>
                </div>
                -->

                <!-- Loto pad items -->
                <div class="loto-pad-item-adjust"> 
                    <div class="loto-pad-item" 
                         :class="{ selected:  n == 1 }" 
                         :style="{ 'height': lotoPadItemWidth, 'line-height': lotoPadItemWidth }"
                         v-for="(n, index) in numbers" 
                         @click="doSelect(index)" 
                        :key="index"
                    >
                        <span>{{ index + 1 }}</span>
                    </div>
                </div>
                <!-- Control panel -->
                <div class="control-bar">
                    <div class="m-btn btn-ctrl btn-auto" 
                         @click="doAuto()"
                    >
                        Auto
                    </div>
                    <div class="data-string">
                        <span v-show="dataString" id="data-string-text">{{ dataString }}</span>
                        <span v-show="!dataString">
                            <!-- <i>{{ dict.play_no_numbers }}</i> -->
                            None
                        </span>
                    </div>
                    <div class="m-btn btn-ctrl btn-clear" 
                         :class="{ disabled: gameCurrent !== null && leftNumbers >= gameCurrent.reqNumbers }" 
                         @click="doClear()"
                    >
                            <i class="fa fa-trash-o"></i>
                    </div>
                    <div id="copy-button" 
                         class="m-btn btn-ctrl btn-copy" 
                         data-clipboard-target="#data-string-text" 
                         :class="{ disabled: leftNumbers > 0 }"
                         @click="doCopy()">
                            <i class="fa fa-files-o" aria-hidden="true"></i>
                    </div>
                    <div class="m-btn btn-ctrl btn-play" 
                         :class="{ disabled: leftNumbers > 0 || !web3.coinbase }"
                         @click="doPlay()">
                            <p>{{ dict.menu_play }}</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- Additional info -->
        <div class="loto-info-bottom">
            {{ dict.play_txt1 }} <strong>{{ gameCurrent.ticketPrice }}</strong> {{ dict.play_txt1a }} 
            <a :href="contractUrl" target="_blank" rel="noreferrer">{{ gameCurrent.contractAddress }}</a>
            <span class="copy-contract-button"
                  @click="doCopyAddress()">
                <i class="fa fa-files-o" aria-hidden="true"></i>
            </span>
            {{ dict.play_txt2 }}<br />
            <span v-show="!web3.coinbase" style="color: #EECA57">
                {{ dict.play_txt3 }} 
                <a href="https://metamask.io/" target="_blank" rel="noreferrer">{{ dict.play_txt3link }}</a>
            </span>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
/* eslint linebreak-style: ["error", "windows"] */
import { mapGetters, mapMutations } from 'vuex'
import web3 from 'web3'
import util from '@/util/util'
import ethNetworks from '@/util/constants/networks'
import axios from 'axios'

export default {
    name: 'GamePlay',
    props: {},
    data () {
        return {
            timer: null,
            timerInterval: null,
            dataString: '',
            numbers: [],
            leftNumbers: 0,
            lotoPadItemWidth: 'auto',
            drawingStage: 0,
            drawingInterval: null,
        }
    },
    computed: {
        dict () {
            return this.$store.state.dict
        },
        contractUrl () {
            return this.gameSettings.tronscanAddressUrl + this.gameCurrent.contractAddress + '#contracts'
        },
        timerString () {
            return util.timerToStr(this.timer)
        },
        GameNum () {
            return util.formatNumber(this.gameCurrentDetail.GameNum, 7, 0)
        },
        Fund () {
            return util.formatNumber(this.gameCurrentDetail.Fund, 1, 4)
        },
        Jackpot () {
            return util.formatNumber(this.gameCurrentDetail.Jackpot, 1, 4)
        },
        isDrawing () {
            return (this.timer === 0 || this.gameCurrentDetail.Phase !== 'ready' || this.gameCurrentDetail.Status == 1) ? true : false
        },
        drawingText () {
            const text = "DRAWING..."

            if (!this.isDrawing) 
                return ''
            else
                return text.substr(0, 7 + this.drawingStage)


        },
        ...mapGetters(['gameSettings', 'gameCurrent', 'gameCurrentDetail', 'web3'])
    },
    methods: {
        runTimer () {
            if (this.timerInterval !== null) {
                clearInterval(this.timerInterval)
                this.timerInterval = null
            }
            this.timer = util.calcTimerStart(this.gameCurrent) * 1000
            this.timerInterval = setInterval(() => {
                if(this.timer > 1000) {
                    this.timer -= 1000
                } else {
                    this.timer = 0
                    if (this.gameCurrentDetail.Phase === 'ready')
                        this.timer = util.calcTimerStart(this.gameCurrent) * 1000
                }
            }, 1000)
        },
        runDrawingStage () {
            if (this.drawingInterval !== null) {
                clearInterval(this.drawingInterval)
                this.drawingInterval = null
            }
            this.drawingInterval = setInterval(() => {
                const seconds = (new Date()).getSeconds()
                this.drawingStage = seconds % 4
            }, 1000)
        },
        doSelect (index) {
            if(this.numbers[index] === 0 && this.leftNumbers === 0) return

            if(this.numbers[index] === 0) {
                this.numbers[index] = 1
                this.leftNumbers--
            } else {
                this.numbers[index] = 0
                this.leftNumbers++
            }

            this.dataString = util.calcDataString(this.numbers)
        },
        doAuto () {
            // Generate random numbers
            this.numbers.fill(0)
            for (let i = 0; i < this.gameCurrent.reqNumbers; i++) {
                let num = Math.floor(Math.random() * this.gameCurrent.padSize)
                if (this.numbers[num] === 1) {
                    i--
                    continue
                } else {
                    this.numbers[num] = 1
                }
            }
            this.leftNumbers = 0
            this.dataString = util.calcDataString(this.numbers)
        },
        doClear () {
            this.dataString = ''
            this.leftNumbers = this.gameCurrent.reqNumbers
            this.numbers.fill(0)
        },
        doCopy () {
            if(this.leftNumbers > 0) {
                this.newNotify({ type: 'error', title: '<b>:: Copy ::</b>', text: `You must select ${this.gameCurrent.reqNumbers} numbers` })
                return
            }
            
            this.$copyText(this.dataString)
            .then((e) => {
                this.newNotify({ type: 'success', title: '<b>:: Copy ::</b>', text: `DATA string successfull copied!` })
            })
            .catch((e) => {
                this.newNotify({ type: 'error', title: '<b>:: Copy ::</b>', text: `DATA string not copied!` })
            })
        },
        doPlay () {
            // Check selected numbers
            if (this.leftNumbers > 0) {
                this.newNotify({ type: 'error', title: '<b>:: Play ::</b>', text: `You must select ${this.gameCurrent.reqNumbers} numbers` })
                return
            }

            // Check Metamask install
            /*
            if (!window.ethereum || !window.ethereum.isMetaMask) {
                this.newNotify({ type: 'error', title: '<b>:: Play ::</b>', text: `Metamask not installed! <br /> Install <a href="https://metamask.io/" target="_blank rel="noreferrer"">https://metamask.io/</a>` })
                return
            }
            */
            console.log(this.web3.coinbase)
            if (!this.web3.coinbase) {
                this.newNotify({ type: 'error', title: '<b>:: Play ::</b>', text: `Metamask is locked!` })
                return
            }

            // Check Metamask network
            console.log(this.gameSettings.metamaskNetId)
            console.log(this.web3.networkId)
            if (this.gameSettings.metamaskNetId != this.web3.networkId) {
                const netId = '' + this.gameSettings.metamaskNetId
                this.newNotify({ type: 'error', title: '<b>:: Play ::</b>', text: `Choose ${ethNetworks[netId]} network in Metamask!` })
                return
            }

            // Create transaction for confirmation
            this.createTransaction()
        },
        async createTransaction () {
            const trNumbers = []
            this.numbers.forEach((item, index) => {
                if (item === 1) trNumbers.push(index + 1)
            })

            const contractHEXAddress = window.tronWeb.address.toHex(this.gameCurrent.contractAddress)
            let contract = await window.tronWeb.contract().at(contractHEXAddress)

            contract.buyTicket(trNumbers).send({
                feeLimit: window.tronWeb.toSun(100),
                callValue: window.tronWeb.toSun(this.gameCurrent.ticketPrice),
                shouldPollResponse: true
            })
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.log(err)
            })

        },
        doCopyAddress () {
            this.$copyText(this.gameCurrent.contractAddress)
            .then((e) => {
                this.newNotify({ type: 'success', title: '<b>:: Copy ::</b>', text: `Smart-contract address successfull copied!` })
            })
            .catch((e) => {
                this.newNotify({ type: 'error', title: '<b>:: Copy ::</b>', text: `Smart-contract address not copied!` })
            })
        },
        ...mapMutations(['newNotify'])
    },
    beforeMount () {
        // Run Timer
        this.runTimer()
        // Run Drawing stage
        this.runDrawingStage()
        // Init Numbers array and numbers data
        this.numbers = new Array(this.gameCurrent.padSize).fill(0)
        this.leftNumbers = this.gameCurrent.reqNumbers
        // Init and request current game data detail
        this.$store.commit('initGameDetail')
        this.$socket.emit('getGameData', { type: this.gameCurrent.type })
    },
    mounted () {
        // Define loto-pad-item width
        this.lotoPadItemWidth = this.$el.querySelector('.loto-pad-item-adjust').clientWidth / 100 * 9 + 'px'
    },
    sockets: {
        getGameDataSuccess (data) {
            this.$store.commit('getGameDataSuccess', data)
        },
        refreshContractData (data) {
            if (data.type === this.gameCurrent.type)
                this.$socket.emit('getGameData', { type: this.gameCurrent.type })
        }
    },
    beforeDestroy () {
        if(this.timerInterval !== null) clearInterval(this.timerInterval)
        if(this.drawingInterval !== null) clearInterval(this.drawingInterval)
    },
}
</script>

<style lang="scss">
.game-play-wrapper {
    .timer-wrapper {
        .timer {
            display: block;
            width: auto;
            &__part {
                position: relative;
                .number {
                    display: inline-block;
                    background-color: #000;
                    border-radius: .25em;
                    box-shadow: inset 0px 0px 10px 0px #62EEFF;
                }
                .number-desc {
                    width: 100%;
                    position: absolute;
                    text-align: center;
                    transform: translateX(-100%);
                    color: #E97A15;
                }
            }
            .dotter {
                color: #75EEFF;
            }
        }
    }
    .loto-pad-wrapper {
        position: relative;
        .loto-info {
            background-color: rgba(0, 0, 0, 0.4);
            box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
            border-radius: .6em;
            color: #FAFAFA;
            .column {
                display: inline-block;
                width: 33%;
                .text {
                    color: #34bbff;
                }
            }
        }
        .drawing {
            width: 100%;
            height: 0;
            position: absolute;
            left: 0;
            background-color: rgba(0, 0, 0, 0.8);
            border-radius: 5px;
            z-index: 1;
            transition: height 1s ease-out 0.3s;
            overflow: hidden;
            .drawing-box {
                width: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                .drawing-text {
                    display: block;
                    width: 100px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 18px;
                    font-style: italic;
                    text-align: left;
                    text-shadow: 1px 1px 5px #34BBFF, 0 0 1em #34BBFF;
                    color: #EFCB46;
                }
            }
        }
        .drawing.active {
            height: 100%;
            /* padding: 20% 0; */
        }
        .loto-pad {
            position: relative;
            border: 1px solid #191B1C;
            border-radius: .5em 0 .5em .5em;
            background-color: rgba(0, 0, 0, 0.4);
            box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
            .count-block {
                width: 205px;
                padding: 5px 15px;
                color: #FAFAFA; 
                text-align: center; 
                position: absolute;
                right: 0;
                top: -31px;
                background-color: rgba(0, 0, 0, 0.4);
                border-radius: 15px 0 0 0;
                .left-numbers-color {
                    color: #34bbff;
                }
            }
            .loto-pad-item-adjust {
                text-align: left;
                margin: .5em auto;
            }
            .loto-pad-item {
                display: inline-block;
                padding: 0;
                width: 9%;
                border-radius: .3em;
                text-align: center;
                margin: 1%;
                border: 1px solid #D5D6D6;
                color: #D5D6D6;
                transition: all .3s linear;
                &:hover {
                    cursor: pointer;
                    color: #CC6311;
                    font-weight: bold;
                }
            }
            .loto-pad-item.selected {
                border-radius: 50%;
                border-color: #CC6311;
                color: #CC6311;
                box-shadow: inset 0px 0px 15px 0px #CC6311;
            }
            .control-bar {
                border-top: 1px solid rgb(38, 77, 97);
                width: auto;
                .data-string {
                    display: inline-block;
                    color: #FFF;
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0);
                }
                .btn-ctrl {
                    display: inline-block;
                    text-align: center;
                    color: #33B5F7;
                }
                .btn-ctrl.disabled {
                    color: #313232;
                }
            }
        }
    }
    .loto-info-bottom {
        background-color: rgba(0, 0, 0, 0.4);
        box-shadow: 0 0 .8em rgba(0, 0, 0, 0.1);
        border-radius: .8em;
        color: #FAFAFA;
        strong {
            color: #34bbff;
        }
        a {
            color: #34bbff;
        }
        .copy-contract-button {
            color: #EECA57;
            margin: 0 .3em;
            &:hover {
                cursor: pointer;
            }
        }
    }
}
@media all and (min-width: 761px) {
    .game-play-wrapper {
        font-size: .875em;
        .timer-wrapper {
            margin: 1em 0 1.5em 0;
            .timer {
                &__part {
                    font-size: 1em;
                    .number {
                        min-width: 35px;
                        padding: .3em .5em .2em .5em;
                        font-size: 1.5em;
                        margin-right: .6em;
                        text-align: center;
                    }
                    .number-desc {
                        top: 3em;
                        font-size: .6em;
                    }
                }
                .dotter {
                    padding: .3em .5em;
                    font-size: 1.5em;
                    margin-right: .6em;
                }
            }
        }
        .loto-pad-wrapper {
            margin: 1em auto;
            .loto-info {
                .column {
                    padding: .6em;
                }
            }
            .drawing-text {
                font-size: 72px;
            }
            .loto-pad-item {
                font-size: 1em;
            }
            .control-bar {
                margin: 0 auto .5em auto;
                padding: .5em 0 0 0;
                .data-string {
                    width: 180px;
                    height: 74px;
                    line-height: 72px;
                    margin-right: 1em;
                    font-size: .8em;
                }
                .btn-ctrl {
                    width: 72px;
                    height: 72px;
                    line-height: 72px;
                    margin-right: 1em;
                }
                .btn-play {
                    width: 102px;
                }
            }
        }
    }
    .loto-info-bottom {
        font-size: 1em;
        margin: 1em auto 0 auto;
        padding: 1em;
    }
}
@media all and (max-width: 760px) {
    .game-play-wrapper {
        font-size: .5em;
        .timer-wrapper {
            margin: 1.7em auto 2.2em auto;
            .timer {
                &__part {
                    font-size: 1em;
                    .number {
                        min-width: 25px;
                        padding: .5em .5em;
                        font-size: 1em;
                        margin-right: .3em;
                        text-align: center;
                    }
                    .number-desc {
                        top: 3em;
                        font-size: .7em;
                    }
                }
                .dotter {
                    padding: .1em .3em;
                    font-size: 1em;
                    margin-right: .3em;
                }
            }
        }
        .loto-pad-wrapper {
            margin: 1em auto 1em auto;
            .loto-info {
                .column {
                    padding: 0em .3em .3em .3em;
                    font-size: 1.2em;
                    img {
                        width: 40px;
                        height: 40px;
                    }
                }
            }
            .drawing-text {
                font-size: 36px;
            }
            .loto-pad {
                .loto-pad-item {
                    font-size: 1em;
                }
                .loto-pad-item.selected {
                    box-shadow: none;
                }
                .control-bar {
                    margin: .3em auto;
                    padding: .3em 0 0 0;
                    .data-string {
                        width: 100px;
                        height: 38px;
                        line-height: 36px;
                        margin-right: .4em;
                        margin-bottom: .4em;
                        font-size: 1.1em;
                    }
                    .btn-ctrl {
                        width: 36px;
                        height: 36px;
                        line-height: 36px;
                        margin-right: .4em;
                        margin-bottom: .4em;
                        font-size: 1.1em;
                    }
                    .btn-play {
                        width: 60px;
                    }
                }
            }
        }
    }
    .loto-info-bottom {
        font-size: 1em;
        margin: .8em auto 0 auto;
        padding: .3em;
        line-height: 1.2em;
    }
}

.animate-info {
    display: inline-block;
    position: relative;
}
.info-enter-active, .info-leave-active {
  transition: all 1s ease;
}
.info-enter {
  opacity: 0;
  margin-left: 50px;
}
.info-leave-to {
  opacity: 0;
  margin-left: -50px;
}
</style>