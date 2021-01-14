<template>
    <div class="header">
        <div class="container">
            <router-link to="/" class="site-logo">
                <img src="/img/brand/logo.png" alt="Logo" title="SmartLotto" />
            </router-link>
            <!-- Title -->
            <!--
            <h3 class="header-title-text">
                {{ dict.play_title1 }} <strong class="blue-color">{{ dict.play_title2 }}</strong> 
                {{ dict.play_title3 }} {{ dict.play_title4 }}
            </h3>
            -->
            <div class="language-wrapper">
                <TheLanguage />
            </div>
            <div class="header-menu-wrapper">
                <TheHeaderMenu />
            </div>
        </div>
    </div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import TheLanguage from './TheLanguage.vue';
import TheHeaderMenu from './TheHeaderMenu.vue';

export default {
    name: 'TheHeader',
    components: {
        TheLanguage,
        TheHeaderMenu
    },
    data () {
        return {}
    },
    computed: {
        dict () {
            return this.$store.state.dict
        },
    }
}
</script>

<style lang="scss">
.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 90px;
    background-color: #000;
    z-index: 5;
    font-size: 1em;
    @media all and (max-width: 760px) {
        height: 70px;
    }
    .site-logo {
        position: absolute;
        display: block;
        top: 0;
        left: 20px;
        height: 50px;
        width: 200px;
        @media all and (max-width: 760px) {
            left: 10px;
            height: 30px;
            width: 120px;
        }
    }
    /*
    .header-title-text {
        position: absolute;
        width: 60%;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        .blue-color {
            color: #3BB9FB;
        }
        @media all and (max-width: 870px) {
            display: none;
        }
    }
    */
    .language-wrapper {
        display: block;
        position: absolute;
        top: 30px;
        right: 120px;
        z-index: 10;
        @media all and (max-width: 760px) {
            top: 20px;
            right: 90px;
        }
    }
    .header-menu-wrapper {
        display: block;
        /*
        position: absolute;
        top: 30px;
        right: 70px;
        z-index: 10;
        */
        @media all and (max-width: 760px) {
            position: absolute;
            /*
            top: 30px;
            right: 70px;
            */
            top: 20px;
            right: 40px;
            z-index: 10;
        }
    }
}
</style>
