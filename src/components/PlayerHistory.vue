<template>
    <div class="player-history-wrapper">
        <div class="player-history-caption">
            <h3>{{ dict.statisctics_title }}</h3>
            <div class="paginator-wrapper">
                <ThePaginator :max-page="maxPage" :on-change="onChangePage" />
            </div>
        </div>
        <div class="player-address-wrapper">
            <input  id="player-address"
                    class="player-address" 
                    name="player-address" 
                    type="text" 
                    v-model="playerAddress" 
                    maxlength="42" 
                    placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" />
            <div class="m-btn btn-update" @click="doUpdateHistory">
                <i class="fa fa-refresh"></i>
            </div>
        </div>
        <!-- Data table -->
        <table>
            <thead>
                <tr>
                    <th>{{ dict.statisctics_col1 }}</th>
                    <th>{{ dict.statisctics_col2 }}</th>
                    <th>{{ dict.statisctics_col3 }}</th>
                    <th>{{ dict.statisctics_col4 }} (ETH)</th>
                </tr>
            </thead>
            <transition name="fade" mode="out-in">
                <tbody :key="(page, changeHistory)">
                    <tr v-for="(item, index) in history" :key="index">
                        <td>{{ formatNumber(item.game_id, 7, 0) }}</td>
                        <td>{{ formatNumber(item.id, 7, 0) }}</td>
                        <td>
                            <div class="numbers-pad">
                                <span class="numbers" :class="{ matched: i.match}" v-for="(i, index) in item.numbers" :key="index">{{ i.num }}</span>
                            </div>
                        </td>
                        <td :class="{ blue: item.prize > 0 }">
                            <span v-show="item.game_id !== gameCurrentDetail.GameNum && item.prize !== 0">
                                {{ formatNumber(item.prize, 1, 5) }}
                            </span>
                            <span v-show="item.game_id !== gameCurrentDetail.GameNum && item.prize === 0">
                                <i style="font-size: 1em; color: #33B5F7;">-&nbsp;&nbsp;&nbsp;</i>
                            </span>
                            <span v-show="item.game_id === gameCurrentDetail.GameNum">
                                <i style="font-size: .5em; color: #FBCF62;">{{ dict.statisctics_no_draw }}</i>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </transition>
        </table>
        <div class="player-history-error" v-show="history.length === 0">
            {{ dict.no_tickets_found }}
        </div>
    </div>
</template>

<script>
/* eslint-disable */
/* eslint linebreak-style: ["error", "windows"] */
import util from '@/util/util'
import { mapGetters } from 'vuex'
import ThePaginator from '@/components/ThePaginator.vue'

export default {
    name: 'PlayerHistory',
    components: {
        ThePaginator
    },
    props: {},
    data () {
        return {
            page: 1,
            playerAddress: '',
            changeHistory: false
        }
    },
    computed: {
        dict () {
            return this.$store.state.dict
        },
        history () {
            return this.playerCurrentHistory.History
        },
        maxPage () {
            if (this.playerCurrentHistory.HistoryCount % 10 > 0 || this.playerCurrentHistory.HistoryCount == 0)
                return parseInt(this.playerCurrentHistory.HistoryCount / 10) + 1
            else
                return parseInt(this.playerCurrentHistory.HistoryCount / 10)
        },
        ...mapGetters(['gameSettings', 'gameCurrent', 'playerCurrentHistory', 'gameCurrentDetail', 'web3'])
    },
    methods: {
        formatNumber (value, int, frac) {
            return util.formatNumber(value, int, frac)
        },
        updateHistory () {
            this.$socket.emit('getPlayerHistory', { type: this.gameCurrent.type, address: window.tronWeb.address.toHex(this.playerAddress), page: this.page })
        },
        onChangePage (page) {
            this.page = page
            this.updateHistory()
        },
        doUpdateHistory () {
            this.page = 1
            this.updateHistory()
        },
    },
    mounted () {
            this.playerAddress = this.web3.coinbase
            this.updateHistory()
    },
    sockets: {
        getPlayerHistorySuccess (data) {
            this.$store.commit('getPlayerHistorySuccess', data)
            this.changeHistory = !this.changeHistory
        },
        refreshContractData (data) {
            if(data.type === this.gameCurrent.type && this.playerAddress)
                this.updateHistory()
        }
    },
    watch: {
        'web3.coinbase': function (value) {
            this.page = 1
            this.playerAddress = value
            this.updateHistory()
        }
    }
}
</script>

<style lang="scss">
.player-history-wrapper {
    color: #CC6610;
    font-size: 1em;
    background: linear-gradient(to right, black -50%, rgb(23, 60, 78) 150%);
    text-align: left;
    margin-bottom: 100px;
    .player-history-caption {
        color: #CC6610;
        position: relative;
        h3 {
            text-align: left;
            margin-top: 0;
            width: 50%;
        }
        .paginator-wrapper {
            position: absolute;
            width: auto;
            right: 0;
        }
    }
    .player-address-wrapper {
        width: 100%;
        position: relative;
        .player-address {
            text-align: center;
            width: 100%;
            color: #D97318;
            border: 1px solid #000;
            border-radius: 4px;
            box-shadow: inset 0 2px 10px 1px rgba(0,0,0,.3), inset 0 0 0 60px rgba(0,0,0,.3), 0 1px rgba(255,255,255,.08);
            background: linear-gradient(rgb(9,26,34), rgb(59,76,84));
            transition: .5s linear;
            &:focus {
                outline: none;
                box-shadow: inset 0 1px 3px 1px  rgba(0,0,0,.5), inset 0 0 0 60px rgba(0,0,0,0), 0 1px rgba(255,255,255,.08);
            }
        }
        .btn-update {
            position: absolute;
            text-align: center;
            color: #33B5F7;
            background: linear-gradient(rgb(9,26,34), rgb(59,76,84));
        }
    }
    table {
        width: 100%;
        text-align: center;
        th, td {
            padding: .3em;
            word-wrap: break-word;
            height: 3em;
            vertical-align: middle;
            &:nth-child(1),
            &:nth-child(2) {
                width: 5em;
            }
            &:nth-child(4) {
                width: 7em;
                text-align: right;
            }
        }
        thead {
            tr {
                width: 100%;
                border-top: 2px solid black;
                border-bottom: 2px solid black;
                color: #34BBFF;
            }
        }
        tbody { 
            tr {
                border-bottom: 1px solid black;
                &:hover {
                    cursor: pointer;
                    background-color: rgba(0, 0 ,0 , 0.2)
                }
            }
        }
    }
    .numbers-pad {
        .numbers {
            display: inline-block;
            border-radius: 50%;
            text-align: center;
            color: black;
            background: white;
            &.matched {
                background: linear-gradient(-45deg, #FEE864, #F5965E);
            }
         }
    }
    .player-history-error {
        text-align: center;
        color: #1CACFF;
    }
}

@media all and (min-width: 761px) {
    .player-history-wrapper {
        margin-top: 3em;
        .player-history-caption {
            h3 {
                font-size: 2em;
                padding: .5em;
            }
            .paginator-wrapper {
                top: 1em;
            }
        }
        .player-address-wrapper {
            font-size: 1.4em;
            padding: .5em;
            .player-address {
                padding: .5em 2.7em .5em .5em;
            }
            .btn-update {
                width: 2.2em;
                height: 2.2em;
                line-height: 2.2em;
                right: .5em;
                top: .5em;
            }
        }
        .unpaid-amount-wrapper {
            margin: 1em .5em .5em 0;
            font-size: 1em;
            .unpaid-amount {
                padding: .7em;
            }
            .btn-payout {
                padding: .7em;
            }
        }
        table {
            font-size: 1em;
        }
        .numbers-pad {
            .numbers {
                width: 2em;
                height: 2em;
                line-height: 2em;
                margin-right: 1.5em;
                text-shadow: 2px 3px 5px rgba(224, 186, 6, 0), 3px 3px 5px black;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
        .player-history-error {
            padding: 4em;
            font-size: 1.5em;
        }
    }
}

@media all and (max-width: 760px) {
    .player-history-wrapper {
        margin-top: 1em;
        .player-history-caption {
            h3 {
                font-size: 1em;
                padding: .5em;
            }
            .paginator-wrapper {
                top: .4em;
            }
        }
        .player-address-wrapper {
            font-size: .60em;
            padding: .2;
            .player-address {
                padding: .2em 1.7em .2em .2em;
            }
            .btn-update {
                width: 1.3em;
                height: 1.3em;
                line-height: 1.3em;
                right: .2em;
                top: .2em;
            }
        }
        .unpaid-amount-wrapper {
            margin: .7em .3em .3em 0;
            font-size: .7em;
            .unpaid-amount {
                padding: .7em;
            }
            .btn-payout {
                padding: .7em;
            }
        }
        table {
            font-size: .65em;
        }
        .numbers-pad {
            .numbers {
                width: 1.8em;
                height: 1.8em;
                line-height: 1.9em;
                margin-right: .1em;
                text-shadow: none;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
        .player-history-error {
            padding: 3em;
            font-size: 1em;
        }
    }
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 1s
}
.fade-enter, .fade-leave-active {
    opacity: 0
}
</style>