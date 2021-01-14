<template>
    <div class="paginator-box-bottom">
        <div class="paginator-button m-btn left" 
            :class="{ disabled: page === 1 }"
            @click="prevPage">
            <i class="fa fa-angle-left"></i> 
        </div>
        <div class="paginator-counter">
            <span class="counter">{{ page }}</span> / {{ maxPage }}
        </div>
        <div class="paginator-button m-btn right" 
            :class="{ disabled: page === maxPage || maxPage === 1 }"
            @click="nextPage">
            <i class="fa fa-angle-right"></i>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
/* eslint linebreak-style: ["error", "windows"] */
export default {
    name: 'ThePaginator',
    props: {
        maxPage: Number,
        onChange: Function
    },
    data () {
        return {
            page: 1
        }
    },
    methods: {
        prevPage () {
            if (this.page === 1) return
            this.page--
            this.onChange(this.page)
        },
        nextPage () {
            if (this.page === this.maxPage) return
            this.page++
            this.onChange(this.page)
        },
    },
    watch: {
        maxPage: function(value) {
            this.page = 1
        }
    }
}
</script>

<style lang="scss">
.paginator-box-bottom {
    text-align: center;
    .paginator-button {
        display: inline-block;
        color: #34BBFF;
        &:hover {
            cursor: pointer;
            color: #71E0FB;
            border-color: #71E0FB;
        }
        &.disabled {
            color: #333;
            border-color: #333;
        }
        &.disabled:hover {
            cursor: default;
        }
    }
    .paginator-counter {
        display: inline-block;
        color: #878787;
        border: 1px solid #878787;
    }
}
@media all and (min-width: 761px) {
    .paginator-box-bottom {
        font-size: 1em;
        line-height: 2em;
        .paginator-button {
            margin-right: .5em;
            width: 2em;
        }
        .paginator-counter {
            margin-right: .5em;
            padding: 0 1.5em;
        }
    }
}

@media all and (max-width: 760px) {
    .paginator-box-bottom {
        font-size: .8em;
        line-height: 1.6em;
        .paginator-button {
            margin-right: .5em;
            width: 1.6em;
        }
        .paginator-counter {
            margin-right: .5em;
            padding: 0 1.2em;
        }
    }
}
</style>