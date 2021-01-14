<template>
    <div class="box-eth-gas-price">
        <h3 class="box-eth-gas-price__caption">
            ETH Gas prices (Gwei)
        </h3>
        <p
            v-for="(price, name) in gasPrices"
            :key="'gp' + name"
            class="box-eth-gas-price__item"
        >
            <span class="box-eth-gas-price__item-name">{{ price.name }}</span>
            <span class="box-eth-gas-price__item-value">{{ price.value }}</span>
        </p>
    </div>
</template>

<script>
/* eslint-disable */
/* eslint linebreak-style: ["error", "windows"] */
import axios from 'axios'

const ethgasUrl = 'https://ethgasstation.info/json/ethgasAPI.json'

export default {
    name: 'BoxETHGasPrice',
    data () {
        return {
            gasPrices: {
                fast: {
                    name: 'FAST',
                    value: 'n/a'
                },
                average: {
                    name: 'STANDART',
                    value: 'n/a'
                },
                low: {
                    name: 'SAFE LOW',
                    value: 'n/a'
                }
            },
            intervalId: null,
            intervalTime: 5 * 60 * 1000
        }
    },
    methods: {
        async loadData () {
            const gasPrice = await axios.get(ethgasUrl)
            if (gasPrice !== null) {
                this.gasPrices.fast.value = '' + (gasPrice.data.fast / 10)
                this.gasPrices.average.value = '' + (gasPrice.data.average / 10)
                this.gasPrices.low.value = '' + (gasPrice.data.safeLow / 10)
            } else {
                this.gasPrices.fast.value = 'n/a'
                this.gasPrices.average.value = 'n/a'
                this.gasPrices.low.value = 'n/a'
            }
        }
    },
    created () {
        this.loadData()
        this.intervalId = setInterval(() => {
            this.loadData()
        }, this.intervalTime)
    },
    beforeDestroy () {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
    }
}
</script>

<style lang="scss">
.box-eth-gas-price {
    border: 1px solid #000;
    border-top: none;
    background-color: rgba(0, 0, 0, 0.2);
    font-size: 14px;
    text-align: left;
    &__caption {
        padding: 10px;
        background: linear-gradient(to left, rgba(0,0,0,.3), rgba(0,0,0,.0) 50%, rgba(0,0,0,.3)), linear-gradient(#d77d31, #fe8417, #d77d31);
        box-shadow: inset #6e5a24 0 -1px 1px, #663c12 0 0 0 1px, #000 0 10px 15px -10px;
        color: #000;
        margin-bottom: 3px;
    }
    &__item {
        padding: 7px 10px;
        font-size: 12px;
        border-bottom: 1px solid #000;
    }
    &__item-name {
        display: inline-block;
        width: 80%;
    }
    &__item-value {
        display: inline-block;
        width: 20%;
        text-align: right;
        color: #34bbff;
    }
}
</style>
