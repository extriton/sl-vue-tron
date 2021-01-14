<template>
    <div v-show="visits !== 0" class="box-visits">
        <img src="../../public/img/icons/icon_people.png" class="box-visits__icon" />
        <div class="box-visits__value">
            {{ newUsers }} / {{ visits }}
        </div>
    </div>
</template>

<script>
/* eslint-disable */
/* eslint linebreak-style: ["error", "windows"] */
export default {
    name: 'BoxVisits',
    data () {
        return {
            newUsers: 0,
            visits: 0,
            intervalId: null,
            intervalTime: 5 * 60 * 1000
        }
    },
    created () {
        this.$socket.emit('getVisits')
        this.intervalId = setInterval(() => {
            this.$socket.emit('getVisits')
        }, this.intervalTime)
    },
    sockets: {
        getVisitsSuccess (data) {
            this.newUsers = data.newUsers
            this.visits = data.visits
        }
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
.box-visits {
    &__icon {
        display: inline-block;
    }
    &__value {
        color: #EEA201;
        font-weight: bold;
        float: right;
        text-shadow: 2px 2px 5px #EEA201;
    }
}
@media all and (min-width: 761px) {
    .box-visits {
        min-width: 200px;
        padding: 10px;
        &__icon {
            width: 50px;
            height: 40px;
            margin-right: 20px;
        }
        &__value {
            /* width: 150px; */
            padding-top: 5px;
            font-size: 30px;
        }
    }
}
@media all and (max-width: 760px) {
    .box-visits {
        min-width: 120px;
        padding: 10px 5px 5px 5px;
        &__icon {
            width: 30px;
            height: 20px;
            margin-right: 10px;
        }
        &__value {
            /* width: 80px; */
            padding-top: 2px;
            font-size: 16px;
        }
    }
}
</style>