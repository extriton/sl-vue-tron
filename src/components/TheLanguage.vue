<template>
    <div class="select-lang-box" @mouseleave="hideContainer();">
        <div class="lang-selected" @click="toggleContainer();">
            <div class="flag"
                v-bind:class="getLangClass(language)"
            >
            </div>
        </div>
        <div class="lang-dropdown-container" v-bind:class="{ 'open' : open }">
            <ul>
                <li class="lang-container"
                    v-for="(lang, index) in lang_list"
                    :key="index"
                    v-show="lang != language"
                    @click="selectLang(index);"
                >
                    <div class="flag"
                        v-bind:class="getLangClass(lang)"
                    >
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
/* eslint linebreak-style: ["error", "windows"] */
import Language from '@/util/language.js';

export default {
    name: 'TheLanguage',
    data () {
        return {
            open: false,
            language: undefined,
            lang_list: Language.getLangList(),
        }
    },
    created () {
        // Определяем язык и получаем словарь
        let lang = $cookies.get('language')
        if(!lang) {
            Language.defineLanguage( () => {
                $cookies.set('language', Language.getLanguage())
                this.language = Language.getLanguage()
                this.$store.commit('setLanguage')
            });
        } else {                                                    // Если есть в куки то выставляем из куки
            Language.setLanguage(lang)
            this.language = Language.getLanguage()
            this.$store.commit('setLanguage')
        }
    },
    methods: {
        hideContainer () {
            this.open = false
        },
        toggleContainer () {
            this.open = !this.open
        },
        selectLang (index) {
            this.open = false
            
            Language.setLanguage(this.lang_list[index])
            $cookies.set('language', Language.getLanguage())
            this.language = Language.getLanguage()
            this.$store.commit('setLanguage')
        },
        getLangClass (lang) {
            let className = 'flag-' + lang
            let classObj = {}
            classObj[className] = true
            return classObj
        }
    }
}
</script>

<style lang="scss">
.select-lang-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 32px;
    height: 30px;
    &:hover {
        cursor: pointer;
    }
    .lang-dropdown-container {
        display: none;
        width: 42px;
        position: absolute;
        top: 25px;
        left: -5px;
        padding: 5px;
        z-index: 5;
        &.open {
            display: block;
        }
        ul {
            margin: 0;
            li {
                display: block;
                margin: 0;
            }
        }
        
    }
    .flag {
        width: 32px;
        height: 30px;
        background: url('../../public/img/flags/flags_v4.png') no-repeat;
        &.flag-en {
            background-position: 0px -32px;
        }
        &.flag-ru {
            background-position: -96px -32px;
        }
    }
}
</style>