<template>
    <div class="box-news">
        <h3 class="box-news__caption">
            LAST NEWS
        </h3>
        <ul class="box-news-list">
            <li
                class="box-news-list__item"
                v-for="(item, index) in news"
                :key="'n' + index"
            >
                <div>
                    <div class="box-news-list__item-icon" >
                        <img :src="item.imgURL" />
                    </div>
                    <router-link :to="{ name: 'NewsItemPage', params: { id: item.innerLink }}" class="box-news-list__item-link">
                        <span v-html="item.title"></span>
                    </router-link>
                </div>
                <div class="clearfix"></div>
                <div class="box-news-list__item-footer">
                    <span class="box-news-list__item-footer-ago">{{ getAgo(item.feedDate) }}</span>
                    <span class="box-news-list__item-footer-link">{{ getUrlDomain(item.link) }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
/* eslint-disable */
/* eslint linebreak-style: ["error", "windows"] */
export default {
    name: 'BoxNews',
    data () {
        return {
            news: []
        }
    },
    methods: {
        getNews () {
            this.$socket.emit('getNews', { skip: 0, limit: 5})
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
        }
    },
    sockets: {
        refreshNews (data) {
            this.getNews()
        },
        getNewsSuccess (data) {
            this.news = data.news
        }
    },
    created () {
        this.getNews()
    }
}
</script>

<style lang="scss">
.box-news {
    height: calc(100% - 10px);
    border-top: none;
    font-size: 14px;
    text-align: left;
    &__caption {
        padding: 10px;
        background: linear-gradient(to left, rgba(0,0,0,.3), rgba(0,0,0,.0) 50%, rgba(0,0,0,.3)), linear-gradient(#d77d31, #fe8417, #d77d31);
        box-shadow: inset #6e5a24 0 -1px 1px, #663c12 0 0 0 1px, #000 0 10px 15px -10px;
        color: #000;
        margin-bottom: 3px;
    }
    .box-news-list {
        display: block;
        width: 100%;
        max-height: calc(100% - 35px);
        overflow-y: auto;
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
            background-color: rgba(0, 0, 0, 0.8);
            border-radius: 10px;
            margin-top: 10px;
            padding: 5px 10px;
            overflow-x: hidden;
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
                    transform: translateY(-50%);
                }
            }
            &-link {
                display: block;
                color: #34bbff;
                text-decoration: none;
                &:hover {
                    color: #ffa959;
                }
            }
            &-footer {
                font-size: 12px;
                color: #999;
                padding: 5px 0;
                border-top: 1px solid #888;
                &-ago {
                    display: inline-block;
                    width: 120px;
                }
            }
        }
    }
}
</style>
