<template>
    <div class="box-chat" :class="{ opened: isOpened }">
        <h3
            class="box-chat__caption"
            @click.stop="isOpened = true"
        >
            {{ dict.chat }}
            <span
                class="close-button"
                v-show="isOpened === true"
                @click.stop="isOpened = false"
            >
                X
            </span>
        </h3>
        <h3 class="box-chat__caption-mobile">
            <span
                class="box-chat__caption-mobile-icon"
                @click.stop="isOpened = true"
            >
                <img src="../../public/img/icons/icon_chat.png"  alt="" title="" />
            </span>
        </h3>
        <div class="box-chat__body">
            <ul class="messages-list" ref="messagesList">
                <li
                    v-for="(message, index) in limitMessages"
                    :key="'m' + index"
                    class="messages-list__item">
                    <p class="messages-list__item-username">{{ message.username }}</p>
                    <p class="messages-list__item-message">{{ message.message }}</p>
                </li>
            </ul>
        </div>
        <div class="box-chat__input">
            <div v-show="!web3.coinbase" class="box-chat__input-error">
                {{ dict.chat_need_auth }}
            </div>
            <div v-show="user.chatBlocked" class="box-chat__input-error">
                {{ dict.chat_blocked }}
            </div>
            <div v-show="web3.coinbase && !user.chatBlocked" class="box-chat__input-text">
                <textarea
                    v-model="messageText"
                    maxlength="150"
                    @keydown.enter.prevent="sendMessage"
                >
                </textarea>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
/* eslint linebreak-style: ["error", "windows"] */
import { mapGetters } from 'vuex'

export default {
    name: 'BoxChat',
    data () {
        return {
            isOpened: false,
            messageText: '',
            messages: []
        }
    },
    computed: {
        dict () {
            return this.$store.state.dict
        },
        limitMessages () {
            return this.messages.slice(-30)
        },
        ...mapGetters(['web3', 'user'])
    },
    methods: {
        sendMessage () {
            if (this.messageText === '') return

            const newMessage = {
                address: this.web3.coinbase,
                message: this.messageText
            }
            this.$socket.emit('newChatMessage', newMessage)
            this.messageText = ''
        }
    },
    sockets: {
        newChatMessageSuccess (data) {
            this.messages.push(data)
        },
        getChatHistorySuccess (data) {
            this.messages = data.history.slice()
        }
    },
    created () {
        this.$socket.emit('getChatHistory')
    },
    updated () {
        const elem = this.$refs.messagesList
        elem.scrollTop = elem.scrollHeight
    }
}
</script>

<style lang="scss">
.box-chat {
    position: absolute;
    width: 100%;
    height: calc(100vh - 100px - 58px - 126px - 155px - 10px);
    border: 1px solid #000;
    border-top: none;
    font-size: 14px;
    text-align: left;
    transition: top .5s linear;
    top: -35px;
    &.opened {
        top: calc(-1 * (100vh - 100px - 58px - 126px - 155px - 10px));
    }
    &__caption {
        padding: 10px;
        background: linear-gradient(to left, rgba(0,0,0,.3), rgba(0,0,0,.0) 50%, rgba(0,0,0,.3)), linear-gradient(#d77d31, #fe8417, #d77d31);
        box-shadow: inset #6e5a24 0 -1px 1px, #663c12 0 0 0 1px, #000 0 10px 15px -10px;
        color: #000;
        &:hover {
            cursor: pointer;
        }
        &.opened {
            &:hover {
                cursor: default;
            }
        }
        .close-button {
            display: block;
            float: right;
            &:hover {
                cursor: pointer;
            }
        }
    }
    &__caption-mobile {
        display: none;
        padding: 10px;
        height: 35px;
        position: relative;
    }
    &__caption-mobile-icon {
        position: absolute;
        right: 0;
        top: 0;
        width: 35px;
        height: 35px;
        border-radius: 35px;
        color: #fe8417;
        padding: 2px 1px 1px 2px;
        &:hover {
            cursor: poiner;
        }
        img {
            width: 32px;
            height: 32px;
        }
    }
    &.opened {
        .box-chat__caption {
            &:hover {
                cursor: default;
            }
        }
    }
    &__body {
        height: calc(100% - 35px - 100px);
        background-color: #0A1A22;
        .messages-list {
            display: block;
            width: 100%;
            height: 100%;
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
                display: block;
                padding: 10px;
                font-size: 12px;
                border-bottom: 1px solid #000;
                &-username {
                    color: #34bbff;
                    overflow: hidden;
                    margin-bottom: 5px;
                }
                &-message {
                    color: #aaa;
                    overflow: hidden;
                    padding-left: 10px;
                }
            }
        }
    }
    &__input {
        width: 100%;
        height: 100px;
        border-top: 1px solid #000;
        padding:10px;
        position: relative;
        background-color: #0A1A22;
        &-error {
            width: 90%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            font-size: 0.8em;
            font-style: italic;
            color: #34BBF0;
        }
        &-text {
            height: 100%;
            textarea {
                width: 100%;
                height: 100%;
                border-radius: 5px;
                background-color: #000A12;
                border: none;
                color: #aaa;
                padding: 5px;
                font-size: 12px;
                resize: none;
                &:focus {
                    outline: none;
                }
            }

        }
    }
}
@media all and (max-width: 1400px) {
    .box-chat {
        height: calc(100vh - 100px - 58px - 10px);
        &.opened {
            top: calc(-1 * (100vh - 100px - 58px - 10px));
        }
    }
  
  .game-wrapper {
    .info-block {
      display: none;
    }
  }
}
@media all and (max-width: 760px) {
    .box-chat {
        height: calc(100vh - 70px - 40px);
        border: none;
        transition: none;
        &__caption {
            display: none;
        }
        &__caption-mobile {
            display: block;
        }
        &.opened {
            top: calc(-1 * (100vh - 70px - 40px));
            .box-chat__caption {
                display: block;
            }
            .box-chat__caption-mobile {
                display: none;
            }
        }
    }
}
</style>
