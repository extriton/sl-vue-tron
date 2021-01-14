<template>
    <div class="profile-page">
        <h3 class="profile-page__caption">
            {{ dict.menu_profile.toUpperCase() }}
        </h3>
        <div class="profile-page__referal-link">
            <div class="profile-page__referal-link-caption">
                {{ dict.profile_referal_link }}
                <span class="copy-referal-link-button" @click="doCopyReferalLink()">
                    <i class="fa fa-files-o" aria-hidden="true"></i>
                </span>
            </div>
            <div class="profile-page__referal-link-input">
                {{ referalLink }}
            </div>
            <div class="profile-page__annotation">
                {{ dict.profile_referal_rate }} {{ referalRate }}% {{ dict.profile_referal_rate1 }}
            </div>
        </div>
        <div class="profile-page__table">
            <div class="profile-page__table-row">
                <div class="profile-page__table-row-caption">{{ dict.profile_address }}</div>
                <div class="profile-page__table-row-value">{{ user.address }}</div>
            </div>
            <div class="profile-page__table-row">
                <div class="profile-page__table-row-caption">{{ dict.profile_username }}</div>
                <div class="profile-page__table-row-value">
                    <input class="input-username" v-model="user.username" placeholder="Enter name">
                    <span class="save-username-button" @click="doSaveUserName()">
                        <i class="fa fa-save" aria-hidden="true"></i>
                    </span>
                </div>
            </div>
            <div class="profile-page__table-row">
                <div class="profile-page__table-row-caption">{{ dict.profile_referrer }}</div>
                <div class="profile-page__table-row-value">{{ user.referrer || 'None' }}</div>
            </div>
            <div class="profile-page__table-row">
                <div class="profile-page__table-row-caption">{{ dict.profile_referal_count }}</div>
                <div class="profile-page__table-row-value">{{ user.referalCount }}</div>
            </div>
        </div>
        <div class="profile-page__table">
            <div class="profile-page__table-row">
                <div class="profile-page__table-row-caption">{{ dict.profile_referal_amount }}</div>
                <div class="profile-page__table-row-value">{{ GweiToEther(user.referalAmount) }} ETH</div>
            </div>
            <div class="profile-page__table-row">
                <div class="profile-page__table-row-caption">{{ dict.profile_free_amount }}</div>
                <div class="profile-page__table-row-value">{{ GweiToEther(user.freeAmount) }} ETH</div>
            </div>
            <div class="profile-page__table-row">
                <div class="profile-page__table-row-caption">{{ dict.profile_total_amount }}</div>
                <div class="profile-page__table-row-value">{{ GweiToEther(user.totalAmount) }} ETH</div>
            </div>
            <div class="profile-page__annotation">
                {{ dict.profile_withdraw_min_amount }} {{ minimalWithdrawAmount }} ETH
            </div>
            <div class="btn-withdraw m-btn"
                :class="{ disabled: user.totalAmount < (minimalWithdrawAmount * 1e9) }"
                @click="doWithdraw()"
            >
                <p>{{ dict.profile_withdraw_button }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import config from '../../config/config'
import { mapGetters, mapMutations } from 'vuex'
import web3 from 'web3'

export default {
    name: 'ProfilePage',
    data () {
        return {
            referalRate: config.referalRate,
            minimalWithdrawAmount: config.minimalWithdrawAmount
        }
    },
    computed: {
        dict () {
            return this.$store.state.dict
        },
        referalLink () {
            return this.user.address ? `${config.domain}?r=${this.user.address}` : ''
        },
        ...mapGetters(['user'])
    },
    methods: {
        async doCopyReferalLink () {
            try {
                await this.$copyText(this.referalLink)
            } catch (e) {
                this.newNotify({ type: 'error', title: '<b>:: Copy ::</b>', text: `Referal link not copied!` })
                return
            }

            this.newNotify({ type: 'success', title: '<b>:: Copy ::</b>', text: `Referal link successfull copied!` })
        },
        doSaveUserName () {
            if (!this.user.username) return
            this.$socket.emit('saveUserName', { address: this.user.address, username: this.user.username })
        },
        doWithdraw () {
            if (this.user.totalAmount < (this.minimalWithdrawAmount * 1e9)) {
                this.newNotify({ type: 'error', title: '<b>:: Withdraw ::</b>', text: `The total amount must be greater ${this.minimalWithdrawAmount} ETH!` })
                return
            }
            this.$socket.emit('withdrawAmount', { address: this.user.address })
        },
        GweiToEther (amount) {
            amount = parseFloat(web3.utils.fromWei('' + amount, 'gwei')).toFixed(9)
            return amount
        },
        ...mapMutations(['newNotify'])
    },
    sockets: {
        saveUserNameSuccess () {
            this.newNotify({ type: 'success', title: '<b>:: Save ::</b>', text: `Username successfull changed!` })
        },
        saveUserNameError (data) {
            this.newNotify({ type: 'error', title: '<b>:: Save ::</b>', text: data.error })
        },
        withdrawAmountSuccess () {
            this.newNotify({ type: 'success', title: '<b>:: Save ::</b>', text: `Your order has been accepted for processing.!` })
        }
    },
    created () {
        const referrer = this.$cookies.get('referrer')
        this.$socket.emit('getUserData', { address: this.user.address, referrer: referrer })
    },
    watch: {
        'referalLink': function (value) {
            if (!value) this.$router.push('/')
        }
    }
}
</script>

<style lang="scss">
.profile-page {
    user-select: text;
    -moz-user-select: text;
    -webkit-user-select: text;
    -ms-user-select: text;
    background: linear-gradient(to right, black -50%, rgb(17, 46, 61) 150%);
    max-width: 800px;
    margin: 0 auto;
    min-height: calc(100vh - 90px - 58px - 5px);
    &__annotation {
        margin-top: 10px;
        font-size: 14px;
        color: #EECA57;
        text-align: center;
    }
    &__caption {
        padding: 10px;
        background: linear-gradient(to left, rgba(0,0,0,.3), rgba(0,0,0,.0) 50%, rgba(0,0,0,.3)), linear-gradient(#d77d31, #fe8417, #d77d31);
        box-shadow: inset #6e5a24 0 -1px 1px, #663c12 0 0 0 1px, #000 0 10px 15px -10px;
        color: #000;
        margin-bottom: 3px;
    }
    &__referal-link {
        width: calc(100% - 20px);
        margin: 20px auto 0 auto;
        background: rgba(0, 0, 0, .5);
        padding: 20px;
        &-caption {
            margin-bottom: 10px;
            .copy-referal-link-button {
                color: #EECA57;
                margin: 0 .3em;
                &:hover {
                    cursor: pointer;
                }
            }
        }
        &-input {
            padding: 10px;
            background-color: #111;
            color: #34bbff;
            text-align: center;
            border: 1px solid #34bbff;
            border-radius: 10px;
        }
    }
    &__table {
        width: calc(100% - 20px);
        text-align: left;
        margin: 20px auto 0 auto;
        background: rgba(0, 0, 0, .5);
        padding: 20px;
        &-row {
            width: 100%;
            &-caption {
                width: 40%;
                display: inline-block;
                padding: 10px;
            }
            &-value {
                width: 60%;
                display: inline-block;
                padding: 10px;
                color: #34bbff;
                .input-username {
                    width: 150px;
                    background-color: #111;
                    color: #34bbff;
                    padding: 5px 10px;
                }
                .save-username-button {
                    color: #EECA57;
                    margin-left: .5em;
                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }
        .btn-withdraw {
            display: block;
            margin: 20px auto 0 auto;
            width: 200px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            color: #33B5F7;
            &.disabled {
                color: #313232;
                &:hover {
                    cursor: default;
                }
            }
        }
    }
}
.m-btn {
  border: 0 solid;
  box-shadow: inset 0 0 20px rgba(51, 181, 247, 0);
  outline: 1px solid;
  outline-color: rgba(51, 181, 247, 0);
  outline-offset: 0px;
  text-shadow: none;
  -webkit-transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
          transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
  outline-color: rgba(51, 181, 247, 0.5);
  outline-offset: 0px;
  /*
  -moz-user-select: none;
  -webkit-user-select: none;
  */
}
.m-btn:hover {
  box-shadow: inset 0 0 20px rgba(51, 181, 247, 0.5), 0 0 20px rgba(51, 181, 247, 0.2);
  outline-offset: 15px;
  outline-color: rgba(51, 181, 247, 0);
  text-shadow: 1px 1px 2px #427388;
  cursor: pointer;
}
.m-btn.disabled {
  border: 0 solid;
  box-shadow: inset 0 0 20px rgba(51, 51, 51, 0);
  outline: 1px solid;
  outline-color: rgba(91, 91, 91, 0);
  outline-offset: 0px;
  text-shadow: none;
  -webkit-transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
          transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
  outline-color: rgba(91, 91, 91, 0.5);
  outline-offset: 0px;
  color: #333333;
}
.m-btn.disabled:hover {
  cursor: not-allowed;
}
@media all and (max-width: 760px) {
    .profile-page {
        &__annotation {
            margin-top: 5px;
            font-size: 10px;
            color: #EECA57;
        }
        &__referal-link {
            width: 100%;
            margin-top: 10px;
            padding: 10px;
            font-size: 14px;
            &-input {
                padding: 5px;
                font-size: 10px;
            }
        }
        &__table {
            width: 100%;
            margin-top: 10px;
            &-row {
                &-caption {
                    display: block;
                    width: 100%;
                    font-size: 10px;
                    padding: 5px;
                }
                &-value {
                    display: block;
                    width: 100%;
                    font-size: 10px;
                    padding: 5px;
                }
            }
        }
    }
}
</style>
