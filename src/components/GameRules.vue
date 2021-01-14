<template>
    <div class="game-rules-wrapper">
        <div class="game-rules-caption"><h3>{{ dict.menu_rules }}</h3></div>
        <div class="rules-row">
            <span class="rules-dotter">
                <img src="../../public/img/icons/icon_clock.png"  alt="" title="" />
            </span>
            {{ dict.rules_play_time1 }}: <span class="data-value">{{ textDrawTime }}.</span><br />
            {{ dict.rules_play_time3 }}
        </div>
        <div class="rules-row">
            <span class="rules-dotter">
                <img src="../../public/img/icons/icon_cost.png"  alt="" title="" />
            </span>
            {{ dict.rules_ticket_cost }}: <span class="data-value">{{ gameCurrent.ticketPrice }} ETH</span><br />
            {{ dict.rules_ticket_cost1 }}<br />
            {{ dict.rules_ticket_cost5 }}<br />
            <!--
            <i class="fa fa-warning warn data-value"></i>
            {{ dict.rules_ticket_cost2 }} <span class="data-value">0 ETH</span><br />
            {{ dict.rules_ticket_cost3 }} <span class="data-value">200 000 - 700 000</span><br />
            {{ dict.rules_ticket_cost4 }}
            -->
        </div>
        <div class="rules-row">
            <span class="rules-dotter">
                <img src="../../public/img/icons/icon_address.png"  alt="" title="" />
            </span>
            {{ dict.rules_address }}: <a :href="contractUrl" target="_blank" rel="noreferrer">{{ gameCurrent.contractAddress }}</a>
        </div>
        <div class="rules-row">
            <span class="rules-dotter">
                <img src="../../public/img/icons/icon_wallet.png"  alt="" title="" />
            </span>
            {{ dict.rules_wallets }}: <span><a href="https://www.myetherwallet.com/" target="_blank" rel="noreferrer">MyEtherWallet</a>, <a href="https://metamask.io/" target="_blank" rel="noreferrer">MetaMask</a></span>
            {{ dict.rules_wallets1 }}<br />{{ dict.rules_wallets2 }} <br /> <i class="fa fa-warning warn data-value"></i>{{ dict.rules_wallets3 }}
        </div>
        <div class="rules-row">
            <span class="rules-dotter">
                <img src="../../public/img/icons/icon_gas.png"  alt="" title="" />
            </span>
            {{ dict.rules_gas_limit }}: <span class="data-value">350 000</span><br />
            {{ dict.rules_gas_price }}: <span class="data-value">{{ gasPriceAverage }} Gwei</span>
        </div>
        <div class="rules-row">
            <span class="rules-dotter">
                <img src="../../public/img/icons/icon_fund1.png"  alt="" title="" />
            </span>
            {{ dict.rules_distr_funds }}: 
            <div class="column data-value">
                <i class="fa fa-minus"></i>&nbsp;&nbsp; 80% - {{ dict.rules_prize_fund }}<br />
                <i class="fa fa-minus"></i>&nbsp;&nbsp; 20% - {{ dict.rules_service }}
            </div>
        </div>
        <div class="rules-row">
            <span class="rules-dotter">
                <img src="../../public/img/icons/icon_fund2.png"  alt="" title="" />
            </span>
            {{ dict.rules_prize_pool_distr }}: 
            <div class="column data-value">
                <span v-for="(item, index) in distribFunds" :key="index">
                    <i class="fa fa-minus"></i>&nbsp;&nbsp; {{ item }}<br />
                </span>
            </div>
            <div style="min-height: 20px;"></div>
            <i class="fa fa-minus"></i> {{ dict.rules_prize_txt1 }}<br />
            <i class="fa fa-minus"></i> {{ dict.rules_prize_txt2 }}
        </div>
    </div>
</template>

<script>
/* eslint-disable */
/* eslint linebreak-style: ["error", "windows"] */
import { mapGetters } from 'vuex'
import axios from 'axios'
import util from '@/util/util'

export default {
    name: 'GameRules',
    props: {},
    data () {
        return {
            gasPriceAverage: '4',
            gasPriceInterval: null
        }
    },
    computed: {
        dict () {
            return this.$store.state.dict
        },
        contractUrl () {
            return this.gameSettings.etherscanAddressUrl + this.gameCurrent.contractAddress + '#contracts'
        },
        textDrawTime () {
            const dows = { '1': 'monday', '2': 'tuesday', '3': 'wednesday', '4': 'thursday', '5': 'friday', '6': 'saturday', '0': 'sunday' }
            let res = ''
            if (this.gameCurrent.drawDow >= 0 && this.gameCurrent.drawDow <= 6) 
                res = this.dict[dows[this.gameCurrent.drawDow]] + ' '
            else
                res = this.dict.everyday + ' '
            
            const _time = util.calcDrawPeriod(this.gameCurrent)

            res += this.dict.from + ' '
            res += _time.fromHour + '-' + _time.fromMinute + ' '
            res += this.dict.to + ' '
            res += _time.toHour + '-' + _time.toMinute + ' '
            res += 'GMT'

            return res
        },
        distribFunds () {
            const res = []
            for (let key in this.gameCurrent.distribFund) {
                let str = ''
                if (+key === this.gameCurrent.reqNumbers)
                    str += this.gameCurrent.distribFund[key] + '% - ' + this.dict.rules_jackpot_inc
                else
                    str += this.gameCurrent.distribFund[key] + '% - ' + this.dict.rules_match + ' ' + key + ' ' + this.dict.of + ' ' + this.gameCurrent.reqNumbers
                res.push(str)
            }
            res.reverse()
            return res
        },
        ...mapGetters(['gameSettings', 'gameCurrent'])
    },
    methods: {
        getGasPriceAverage () {
            axios.get('https://ethgasstation.info/json/ethgasAPI.json')
            .then(result => {
                this.gasPriceAverage = '' + (result.data.average / 10)
            })
            .catch((error) => {
                console.log('Error: ' + error)
            })
        }
    },
    mounted () {
        this.getGasPriceAverage()
        this.gasPriceInterval = setInterval(() => {
            this.getGasPriceAverage()
        }, 5 * 60 * 1000)
    },
    beforeDestroy () {
        if(this.gasPriceInterval !== null) clearInterval(this.gasPriceInterval)
    },
}
</script>

<style lang="scss">
.game-rules-wrapper {
    font-size: 1em;
    text-align: left;
    background: linear-gradient(to right, black -50%, rgb(23, 60, 78) 150%);
    padding-bottom: 1em;
    .game-rules-caption {
        color: #CC6610;
        position: relative;
        h3 {
            text-align: left;
            margin-top: 0;
        }
    }
    .rules-row {
        color: #ACACAC;
        position: relative;
        background: rgba(0, 0, 0, 0.4);
        border-bottom: 1px solid #10191E;
        .rules-dotter {
            position: absolute;
            width: 50px;
            height: 50px;
            border-radius: 5px;
            left: 10px;
            top: 10px;
            img {
                width: 32px;
                height: 32px;
            }
        }
        a, .data-value {
            color: #CC6610;
        }
        .column {
            padding-left: 10%;
            padding-top: 10px;
        }
    }

}

@media all and (min-width: 761px) {
    .game-rules-wrapper {
        margin-top: 3em;
        .game-rules-caption {
            h3 {
                font-size: 2em;
                padding: .5em;
            }
        }
        .rules-row {
            font-size: 1em;
            min-height: 5em;
            margin: 1em;
            padding: .7em .7em .7em 5em;
            .warn {
                margin: .7em .7em 0 .7em;
            }
        }
    }
}

@media all and (max-width: 760px) {
    .game-rules-wrapper {
        margin-top: 1em;
        .game-rules-caption {
            h3 {
                font-size: 1em;
                padding: .5em;
            }
        }
        .rules-row {
            font-size: .65em;
            min-height: 3em;
            margin: .5em;
            padding: .7em .7em .7em .7em;
            .rules-dotter {
                display: none;
            }
            .warn {
                margin: .5em .5em 0 .5em;
            }
        }
    }
}
</style>