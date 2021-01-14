<template>
    <div class="header-menu">
        <!-- Temporary roll button -->
        <div class="roll-button" @click="doRoll">
            Roll
        </div>
        <div class="header-menu__button" @click="showMenu = !showMenu">&#9776;</div>
        <ul class="header-menu-list" v-show="showMenu">
            <li class="header-menu-list__item">
                <router-link to='/'
                    class="header-menu-list__item-link"

                >
                    <span @click="showMenu = false">{{ dict.menu_lottery }}</span>
                </router-link>
            </li>
            <li class="header-menu-list__item">
                <router-link to='/news' class="header-menu-list__item-link">
                    <span @click="showMenu = false">{{ dict.menu_news }}</span>
                </router-link>
            </li>
            <li class="header-menu-list__item" v-if="web3.coinbase">
                <router-link to='/profile' class="header-menu-list__item-link">
                    <span @click="showMenu = false">{{ dict.menu_profile }}</span>
                </router-link>
            </li>
            <li class="header-menu-list__item">
                <router-link to='/free-eth' class="header-menu-list__item-link">
                    <span @click="showMenu = false">{{ dict.menu_free_eth }}</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import { mapGetters } from 'vuex'

export default {
    name: 'TheHeaderMenu',
    data () {
        return {
            showMenu: false
        }
    },
    computed: {
        dict () {
            return this.$store.state.dict
        },
        ...mapGetters(['web3', 'gameCurrent'])
    },
    methods: {
        // Temporary roll button action
        async doRoll () {
            const contractHEXAddress = window.tronWeb.address.toHex(this.gameCurrent.contractAddress)
            let contract = await window.tronWeb.contract().at(contractHEXAddress)

            contract.rollRound().send({
                callValue: 0,
                shouldPollResponse: true
            })
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.log(err)
            })
        }
    }
}
</script>

<style lang="scss">
.header-menu {
    position: relative;
    /* Temporary roll button */
    .roll-button {
        position: absolute;
        top: 25px;
        left: 200px;
        width: 100px;
        height: 30px;
        line-height: 30px;
        padding: 0 5px;
        text-align: center;
        font-size: 20px;
        border: 1px solid blue;
        color: blue;
        &:hover {
            cursor: pointer;
            background-color: blue;
            border-color: white;
            color: white;
        }
    }
    &__button {
        position: absolute;
        top: 0;
        left: 0;
        color: #aaa;
        width: 32px;
        height: 32px;
        font-size: 28px;
        top: -4px;
        &:hover {
            cursor: pointer;
            color: #ffa959;
        }
        @media all and (min-width: 761px) {
            display: none;
        }
    }
    &-list {
        display: block;
        position: absolute;
        top: 32px;
        right: -32px;
        width: 200px;
        background-color: #000;
        padding: 10px;
        @media all and (min-width: 761px) {
            display: inline-block!important;
            position: static;
            width: auto;
            margin-top: 15px;
        }
        &__item {
            display: block;
            padding: 10px 10px;
            text-align: left;
            border-top: 1px solid #666;
            @media all and (min-width: 761px) {
                display: inline-block;
                border: none;
                margin-right: 20px;
                &:last-child {
                    border: none;
                }
            }
            &:last-child {
                border-bottom: 1px solid #666;
                @media all and (min-width: 761px) {
                    border: none;
                }
            }
            &-link {
                display: block;
                text-decoration: none;
                color: #aaa;
                /*
                &.router-link-active {
                    color: #ffa959;
                }
                */
                &:hover {
                    color: #ffa959;
                }
                span {
                    display: block;
                }
            }
        }
    }
}
</style>
