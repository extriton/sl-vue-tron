<template>
    <div class="news-item-page">
        <div class="close-button" @click="backToNewsPage">
            &#10006;
        </div>
        <div v-if="newsItem" class="news-item-body">
            <div>
                <div class="news-item__icon" >
                    <img :src="newsItem.imgURL" />
                </div>
                <div class="news-item__title" v-html="newsItem.title"></div>

                    <!-- <a :href="item.link" target="_blank" class="box-news-list__item-link"> -->
                    <!-- <span v-html="newsItem.title"></span> -->
                    <!-- </a> -->
            </div>
            <div class="clearfix"></div>
            <div class="news-item__description" v-html="newsItem.description"></div>
            <div class="news-item__footer">
                <span class="news-item__footer-ago">{{ getAgo(newsItem.feedDate) }}</span>
                <a :href="newsItem.link" target="_blank" class="news-item__footer-link">{{ getUrlDomain(newsItem.link) }}</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NewsItemPage',
    props: ['id'],
    data () {
        return {
            newsItem: null
        }
    },
    methods: {
        getNewsItem (id) {
            this.$socket.emit('getNewsItem', { id: id })
        },
        backToNewsPage () {
            this.$router.push({ name: 'NewsPage' })
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
        changePageMeta (item) {
            document.title = 'Smart Lotto - ' + item.title
            document.querySelector('meta[name="description"]').setAttribute("content", 'test')
        }
    },
    sockets: {
        getNewsItemSuccess (data) {
            this.newsItem = data.newsItem
            this.changePageMeta(this.newsItem)
        }
    },
    created () {
        this.getNewsItem(this.id)
    }
}
</script>

<style lang="scss">
.news-item-page {
    user-select: text;
    -moz-user-select: text;
    -webkit-user-select: text;
    -ms-user-select: text;
    background: linear-gradient(to right, black -50%, rgb(17, 46, 61) 150%);
    max-width: 800px;
    margin: 0 auto;
    height: calc(100vh - 90px - 58px - 5px);
    position: relative;
    padding: 20px;
    overflow-y: auto;
    .close-button {
        position: absolute;
        top: 0px;
        right: 0px;
        padding: 5px;
        font-size: 24px;
        color: #777;
        &:hover {
            cursor: pointer;
            color: #ffa959;
        }
    }
    .news-item {
        text-align: left;
        &__icon {
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
        &__title {
            color: #34bbff;
            font-size: 24px;
            text-align: left;
        }
        &__description {
            color: #ccc;
            font-size: 16px;
            text-align: left;
            margin: 20px 0;
            line-height: 1.5;
        }
        &__footer {
            font-size: 12px;
            color: #999;
            padding: 5px 0;
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
                color: #999;
                text-decoration: none;
                &:hover {
                    color: #ffa959;
                    border: 1px solid #ffa959;
                }
            }
        }
    }
}
@media all and (max-width: 760px) {
    .news-item-page {
        .news-item {
            &__title {
                font-size: 16px;
            }
            &__description {
                font-size: 12px;
            }
        }
    }
}
</style>
