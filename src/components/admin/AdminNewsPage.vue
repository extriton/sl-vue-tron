<template>
    <div class="admin-news-page">
        <h3 class="admin-news-page__caption">Новости</h3>
    </div>
</template>

<script>
export default {
    name: 'AdminNewsPage',
    data () {
        return {
            news: []
        }
    },
    methods: {
        updateAdminNewsData () {
            this.$socket.emit('getAdminNewsData', {})
        }
    },
    mounted () {
        this.updateAdminNewsData()
    },
    sockets: {
        getAdminNewsDataSuccess (data) {
            this.news = data
        }
    }
}
</script>

<style lang="scss">
.admin-news-page {
    padding-top: 20px;
    &__caption {
        text-align: left;
        color: #FA8116;
    }
}
</style>
