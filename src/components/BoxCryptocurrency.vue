<template>
    <div class="box-cryptocurrency" v-show="rates !== null">
        <h3 class="box-cryptocurrency__caption">
            Cryptocurrencies
        </h3>
        <p
            v-for="(rate, name) in rates"
            :key="'cc' + name"
            class="box-cryptocurrency__item"
            :class="[rate.icon]"
        >
            <span class="box-cryptocurrency__item-name">{{ rate.name }}</span>
            <span class="box-cryptocurrency__item-value">$ {{ rate.value }}</span>
        </p>
    </div>
</template>

<script>
/* eslint-disable */
/* eslint linebreak-style: ["error", "windows"] */
export default {
    name: 'BoxCryptocurrency',
    data () {
        return {
            rates: null,
            intervalId: null,
            intervalTime: 25 * 60 * 1000
        }
    },
    methods: {
        async loadData () {
           this.$socket.emit('getCryptoRates')
        }
    },
    sockets: {
        getCryptoRatesSuccess (data) {
            this.rates = data.rates
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
.box-cryptocurrency {
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
        background-repeat: no-repeat;
        background-size: 20px 20px;
        background-position: 8px 3px;
        &.bitcoin {
            background-image: url('../../public/img/icons/icon_bitcoin.png');
        }
        &.ethereum {
            background-image: url('../../public/img/icons/icon_ethereum.png');
        }
        &.litecoin {
            background-image: url('../../public/img/icons/icon_litecoin.png');
        }
        &.monero {
            background-image: url('../../public/img/icons/icon_monero.png');
        }
    }
    &__item-name {
        display: inline-block;
        width: 60%;
        margin-left: 10%;
    }
    &__item-value {
        display: inline-block;
        width: 30%;
        text-align: right;
        color: #34bbff;
    }
}
</style>
