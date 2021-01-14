<template>
    <div class="game-history-wrapper">
        <div class="game-history-caption">
            <h3>{{ dict.history_title }}</h3>
            <div class="paginator-wrapper">
                <ThePaginator :max-page="maxPage" :on-change="onChangePage" />
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>{{ dict.history_col1 }}</th>
                    <th>{{ dict.history_col2 }}</th>
                    <th>{{ dict.history_col3 }}</th>
                </tr>
            </thead>
            <transition name="fade" mode="out-in">
            <tbody :key="page">
                <tr v-for="(item, index) in history" 
                    :key="index"
                    @click="onShowDetails(index)">
                    <td>{{ formatNumber(item.id, 7, 0) }}</td>
                    <td>
                        <span class="win-numbers-pad" v-show="item.winNumbers[0] === 0">
                            <i>{{ dict.statisctics_no_draw }}</i>
                        </span>
                        <div class="win-numbers-pad" v-show="item.winNumbers[0] !== 0">
                            <span class="win-number" v-for="(i, index) in item.winNumbers" :key="index">{{ i }}</span>
                            <div class="game-detail" :class="{ opened: showingIndex === index }" >
                                <table class='small-table'>
                                    <thead>
                                        <tr>
                                            <td>{{ dict.matched_numbers }}</td>
                                            <td>{{ dict.prize_fund }}</td>
                                            <td>{{ dict.winners }}</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(fund, index) in item.funds" :key="index">
                                            <td>
                                                <span v-show="index < item.funds.length - 1">{{ gameCurrent.minWinMatch + index }}</span>
                                                <span v-show="index === item.funds.length - 1" style="color: #FBCF62;">Jackpot</span>
                                            </td>
                                            <td>{{ formatNumber(fund, 1, 5) }}</td>
                                            <td>
                                                <span v-show="item.winners[index] !== 0">
                                                    {{ item.winners[index] }}
                                                    <span style="color: #FBCF62;">({{ formatNumber(fund / item.winners[index], 1, 5) }})</span>
                                                </span>
                                                <span v-show="item.winners[index] === 0" style="color: #FBCF62;">-</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </td>
                    <td>{{ formatNumber(item.totalFund, 1, 4) }}</td>
                </tr>
            </tbody>
            </transition>
        </table>
    </div>
</template>

<script>
/* eslint-disable */
/* eslint linebreak-style: ["error", "windows"] */
import util from '@/util/util'
import { mapGetters } from 'vuex'
import ThePaginator from '@/components/ThePaginator.vue'

export default {
    name: 'GameHistory',
    components: {
        ThePaginator
    },
    props: {},
    data () {
        return {
            page: 1,
            showingDetailIndex: null
        }
    },
    computed: {
        dict () {
            return this.$store.state.dict
        },
        history () {
            return this.gameCurrentHistory.History
        },
        maxPage () {
            if (this.gameCurrentHistory.HistoryCount % 10 > 0 || this.gameCurrentHistory.HistoryCount == 0)
                return parseInt(this.gameCurrentHistory.HistoryCount / 10) + 1
            else
                return parseInt(this.gameCurrentHistory.HistoryCount / 10)
        },
        showingIndex () {
            return this.showingDetailIndex
        },
        ...mapGetters(['gameCurrent', 'gameCurrentHistory'])
    },
    methods: {
        formatNumber (value, int, frac) {
            return util.formatNumber(value, int, frac)
        },
        onChangePage (page) {
            this.page = page
            this.$socket.emit('getGameHistory', { type: this.gameCurrent.type, page: this.page })
        },
        onShowDetails (index) {
            if (this.showingDetailIndex === index) this.showingDetailIndex = null
            else this.showingDetailIndex = index
        },
    },
    mounted () {
        this.$socket.emit('getGameHistory', { type: this.gameCurrent.type, page: this.page })
    },
    sockets: {
        getGameHistorySuccess (data) {
            this.page = 1
            this.showingDetailIndex = null
            this.$store.commit('getGameHistorySuccess', data)
        },
        refreshContractData (data) {
            if(data.type === this.gameCurrent.type)
                this.$socket.emit('getGameHistory', { type: this.gameCurrent.type, page: this.page })
        }
    }
}
</script>

<style lang="scss">
.game-history-wrapper {
    color: #CC6610;
    font-size: 1em;
    background: linear-gradient(to right, black -50%, rgb(23, 60, 78) 150%);
    text-align: left;
    .game-history-caption {
        color: #CC6610;
        position: relative;
        h3 {
            text-align: left;
            margin-top: 0;
        }
        .paginator-wrapper {
            position: absolute;
            width: auto;
            right: 0;
        }
    }
    table {
        width: 100%;
        text-align: center;
    }
    table tr {
        width: 100%;
    }
    table thead tr {
        border-top: 2px solid black;
        border-bottom: 2px solid black;
        color: #34BBFF;
    }
    table tbody tr {
        &:hover {
            cursor: pointer;
            background-color: rgba(0, 0 ,0 , 0.2)
        }
    }
    table td, table th {
        padding: .3em;
        word-wrap: break-word;
        height: 3em;
        vertical-align: middle;
    }
    table tr td:nth-child(1) {
        width: 5em;
        text-align: left;
    }
    table tr td:nth-child(3) {
        width: 5em;
        text-align: right;
    }
    table tbody tr {
        border-bottom: 1px solid black;
    }
    .win-numbers-pad {
        .win-number {
            display: inline-block;
            border-radius: 50%;
            color: black;
            background: linear-gradient(-45deg, #FEE864, #F5965E);
        }
    }
    .game-detail {
        color: white;
        transition: height ease 0.5s;
        height: 0;
        overflow: hidden;
        &.opened {
            height: 9em;
        }
        .small-table {
            margin-top: .5em;
            width: 100%;
            color: #CACACA;
            font-size: .75em;
            tr {
                width: 100%;
                &:hover {
                    background: none;
                }
            }
            td {
                height: auto;
                padding: .3em;
                vertical-align: middle;
                text-align: center;
            }
            thead {
                tr {
                    border: none;
                }
            }
            tbody {
                tr {
                    border: none;
                    border-top: 1px solid black;
                }
            }
        }
    }
}

@media all and (min-width: 761px) {
    .game-history-wrapper {
        margin-top: 3em;
        .game-history-caption {
            h3 {
                font-size: 2em;
                padding: .5em;
            }
            .paginator-wrapper {
                top: 1em;
            }
        }
        table {
            font-size: 1em;
        }
        .win-numbers-pad {
            .win-number {
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
    }
}

@media all and (max-width: 760px) {
    .game-history-wrapper {
        margin-top: 1em;
        .game-history-caption {
            h3 {
                font-size: 1em;
                padding: .5em;
            }
            .paginator-wrapper {
                top: .4em;
            }
        }
        table {
            font-size: .65em;
        }
        .win-numbers-pad {
            .win-number {
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
    }
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 1s
}
.fade-enter, .fade-leave-active {
    opacity: 0
}
</style>
