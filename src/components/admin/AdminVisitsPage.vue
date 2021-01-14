<template>
    <div class="admin-visits-page">
        <h3 class="admin-visits-page__summary">
            <span class="admin-visits-page__summary-item">Новые пользователи: <i class="value">{{ newUsers }}</i></span>
            <span class="admin-visits-page__summary-item">Посещения: <i class="value">{{ visits }}</i></span>
            <span class="admin-visits-page__summary-item">Онлайн: <i class="value">{{ online }}</i></span>
        </h3>
        <hr />
        <IpStat />
    </div>
</template>

<script>
import IpStat from '@/components/admin/IpStat'

export default {
    name: 'AdminVisitsPage',
    components: {
      IpStat
    },
    data () {
        return {
            newUsers: 0,
            visits: 0,
            online: 0,
            intervalId: null
        }
    },
    methods: {
        updateAdminVisitsData () {
            this.$socket.emit('getAdminVisitsData', {})
        },
    },
    mounted () {
        this.updateAdminVisitsData()
        this.intervalId = setInterval(() => {
            this.updateAdminVisitsData()
        }, 60 * 1000)
    },
    sockets: {
        getAdminVisitsDataSuccess (data) {
            this.newUsers = data.newUsers
            this.visits = data.visits
            this.online = data.online
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
.admin-visits-page {
    padding-top: 20px;
    &__summary {
        height: 20px;
        .value {
            color: green;
        }
        &-item {
            display: inline-block;
            width: 33%;
            text-align: center;
        }
    }
}
</style>
