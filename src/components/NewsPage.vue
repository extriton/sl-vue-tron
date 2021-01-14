<template>
    <div class="news-page">
        <h3 class="news-page__caption">
            {{ dict.menu_news.toUpperCase() }}
        </h3>
        <!-- News List -->
        <ul class="news-list"
            ref="newsList"
            @scroll="scroll"
        >
            <li
                class="news-list__item"
                v-for="(item, index) in news"
                :key="'n' + index"
            >
                <router-link
                    class="news-list__item-link"
                    :to="'/news/' + item.innerLink"
                >
                    <div>
                        <div class="news-list__item-icon" >
                            <img :src="item.imgURL" />
                        </div>
                        <span v-html="item.title"></span>
                    </div>
                    <div class="clearfix"></div>
                    <div class="news-list__item-footer">
                        <span class="news-list__item-footer-ago">{{ getAgo(item.feedDate) }}</span>
                        <span class="news-list__item-footer-link">{{ getUrlDomain(item.link) }}</span>
                    </div>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'NewsPage',
    data () {
        return {
            news: []
        }
    },
    computed: {
        dict () {
            return this.$store.state.dict
        }
    },
    methods: {
        getNews (skip, limit) {
            this.$socket.emit('getNews', { skip: skip, limit: limit })
        },
        getAgo (feedDate) {
            const SEC_IN_HOUR = 60 * 60
            const SEC_IN_DAY = 24 * SEC_IN_HOUR

            const delta = ((new Date()).getTime() - feedDate) / 1000

            if (delta > SEC_IN_DAY) return parseInt(delta / SEC_IN_DAY) + 'd ago'
            if (delta > SEC_IN_HOUR) return parseInt(delta / SEC_IN_HOUR) + 'h ago'
            
            if (delta > 60)
                return parseInt(delta / 60) + 'm ago'
            else
                return 1 + 'm ago'
        },
        getUrlDomain(url) {
            let c = url.indexOf('//')
            if (c !== -1)
                url = url.substr(c + 2)
            
            c = url.indexOf('/')
            if (c !== -1)
                url = url.substr(0, c)

            return url
        },
        scroll () {
            const newsList = this.$refs.newsList
            let bottomOfList = newsList.scrollHeight - newsList.scrollTop === newsList.clientHeight
            if (bottomOfList) this.getNews(this.news.length, 10)
        }
    },
    sockets: {
        refreshNews () {
            this.news = []
            this.$refs.newsList.scrollTop = 0
            this.getNews(0, 30)
        },
        getNewsSuccess (data) {
            for (let i = 0; i < data.news.length; i++)
                this.news.push()    
            this.news = this.news.concat(data.news)
        }
    },
    created () {
        this.getNews(0, 30)
    }
}
</script>

<style lang="scss">
.news-page {
    user-select: text;
    -moz-user-select: text;
    -webkit-user-select: text;
    -ms-user-select: text;
    background: linear-gradient(to right, black -50%, rgb(17, 46, 61) 150%);
    max-width: 800px;
    margin: 0 auto;
    height: calc(100vh - 90px - 58px - 5px);
    &__caption {
        padding: 10px;
        background: linear-gradient(to left, rgba(0,0,0,.3), rgba(0,0,0,.0) 50%, rgba(0,0,0,.3)), linear-gradient(#d77d31, #fe8417, #d77d31);
        box-shadow: inset #6e5a24 0 -1px 1px, #663c12 0 0 0 1px, #000 0 10px 15px -10px;
        color: #000;
        margin-bottom: 3px;
    }
    .news-list {
        overflow-y: auto;
        height: calc(100% - 38px);
        display: block;
        &::-webkit-scrollbar {
            width: 6px;
            background-color: #000;
            border-radius: 10px;
            &-thumb {
                border-radius: 10px;
                background-color: #777;
            }
        }
        &__item {
            display: block;
            text-align: left;
            padding: 20px;
            border-bottom: 1px solid black;
            overflow-x: hidden;
            &:hover {
                cursor: poiter;
                background: rgba(0, 0, 0, .8);
            }
            &-link {
                display: block;
                text-decoration: none;
                color: #34bbff;
            }
            &-icon {
                width: 56px;
                height: 56px;
                margin: 0 10px 10px 0;
                float: left;
                border-radius: 5px;
                background-color: #111;
                position: relative;
                img {
                    width: 100%;
                    position: absolute;
                    top: 50%;
                    left: 0;
                    transform: translateY(-50%);
                }
            }
            &-footer {
                font-size: 12px;
                color: #999;
                padding: 5px 0 5px 60px;
                &-ago {
                    display: inline-block;
                    width: 120px;
                    border: 1px solid #777;
                    border-radius: 15px;
                    padding: 5px;
                    margin-right: 20px;
                    text-align: center;
                    margin-bottom: 5px;
                }
                &-link {
                    display: inline-block;
                    border: 1px solid #777;
                    border-radius: 15px;
                    padding: 5px;
                    text-align: center;
                    min-width: 120px;
                }
            }
        }
    }
}
</style>
