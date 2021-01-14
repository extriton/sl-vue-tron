<template>
  <div class="games-list-wrapper">
    <!-- Title -->
    <h3 class="title-text">
      {{ dict.play_title1 }} <strong class="blue-color">{{ dict.play_title2 }}</strong> 
      {{ dict.play_title3 }} {{ dict.play_title4 }}
    </h3>
    <!-- Description -->
    <h4 class="title-desc">{{ dict.play_title5 }}</h4>
    <!-- Games list -->
    <div class="games-list">
      <div class="games-list-item" v-for="game in games" :key="game.type">
        <div class="game-name">{{ game.name }}</div>
        <div class="game-info-block">
          <span class="text">{{dict.rules_address}}:</span>
          <span class="copy-contract-button"
                @click="doCopyAddress(game)">
            <i class="fa fa-files-o" aria-hidden="true"></i>
          </span>
          <br />
          <a :href="contractUrl(game)" target="_blank" rel="noreferrer">
            <span class="value">{{ game.contractAddress }}</span>
          </a>
        </div>
        <div class="game-info-block">
          <span class="text">{{dict.ticket_price}}:</span><br />
          <span class="value">{{ game.ticketPrice }} ETH</span>
        </div>
        <div class="game-info-block">
          <span class="text">{{dict.draw_time}}:</span><br />
          <span class="value">{{ textDrawTime(game) }}</span>
        </div>
        <router-link class="game-link" :to="gameLink(game)">{{ dict.menu_play }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import util from '@/util/util'

export default {
  name: 'GamesList',
  components: {
  },
  data () {
    return {}
  },
  computed: {
    dict () {
      return this.$store.state.dict
    },
    games () {
      return this.gameSettings.games
    },
    ...mapGetters(['gameSettings'])
  },
  methods: {
    contractUrl (game) {
      return this.gameSettings.etherscanAddressUrl + game.contractAddress
    },
    gameLink (game) {
      return `/${game.type}/play`
    },
    textDrawTime (game) {
      const dows = { '1': 'monday', '2': 'tuesday', '3': 'wednesday', '4': 'thursday', '5': 'friday', '6': 'saturday', '0': 'sunday' }
      let res = ''
      if (game.drawDow >= 0 && game.drawDow <= 6) 
        res = this.dict[dows[game.drawDow]] + ' '
      else
        res = this.dict.everyday + ' '
            
      const _time = util.calcDrawPeriod(game)

      res += this.dict.from + ' '
      res += _time.fromHour + '-' + _time.fromMinute + ' '
      res += this.dict.to + ' '
      res += _time.toHour + '-' + _time.toMinute + ' '
      res += 'GMT'

      return res
    },
    doCopyAddress (game) {
      this.$copyText(game.contractAddress)
      .then(() => {
        this.newNotify({ type: 'success', title: '<b>:: Copy ::</b>', text: `Smart-contract address successfull copied!` })
      })
      .catch(() => {
        this.newNotify({ type: 'error', title: '<b>:: Copy ::</b>', text: `Smart-contract address not copied!` })
      })
    },
    ...mapMutations(['newNotify'])
  }
}
</script>

<style lang="scss">
.games-list-wrapper {
  padding: 2em 0;
  .title-text {
    color: #FAFAFA;
  }
  .title-desc {
    margin-top: 15px;
    color: #3BB9FB;
    border: 1px solid #3BB9FB;
    padding: 10px 20px;
  }
  .blue-color {
    color: #3BB9FB;
  }
  .games-list {
    margin: 1em auto 0 auto;
    padding: 1em 0;
    overflow: none;
    box-shadow:
      0 1px 4px rgba(0, 0, 0, .3),
      -23px 0 20px -23px rgba(0, 0, 0, .8),
      23px 0 20px -23px rgba(0, 0, 0, .8),
      0 0 40px rgba(0, 0, 0, .1) inset;
    .games-list-item {
      font-size: 1em;
      width: 95%;
      margin: 0 auto 2em auto;
      overflow: hidden;
      text-shadow: 0 -1px 1px #cc5500;
      user-select: none;
      padding: 0;
      outline: none;
      border-radius: 1px;
      background: linear-gradient(to left, rgba(0,0,0,.3), rgba(0,0,0,.0) 50%, rgba(0,0,0,.3)), linear-gradient(#08161E, #08161E, #08161E);
      background-size: 100% 100%, auto;
      background-position: 50% 50%;
      box-shadow: inset #ebab00 0 -1px 1px, inset 0 1px 1px #ffbf00, #cc7722 0 0 0 1px, #000 0 10px 15px -10px;
      .game-name {
        font-weight: bold;
        text-shadow: 0 -1px 1px #cc5500;
        padding: .8em 2em;
        outline: none;
        border-radius: 1px;
        background: linear-gradient(to left, rgba(0,0,0,.3), rgba(0,0,0,.0) 50%, rgba(0,0,0,.3)), linear-gradient(#d77d31, #fe8417, #d77d31);
        background-size: 100% 100%, auto;
        background-position: 50% 50%;
        box-shadow: inset #ebab00 0 -1px 1px, inset 0 1px 1px #ffbf00, #cc7722 0 0 0 1px, #000 0 10px 15px -10px;
      }
      .game-info-block {
        margin-top: .4em; 
        font-style: italic;
        line-height: 1.3em;
        .copy-contract-button {
          margin: 0 .3em;
          color: #EECA57;
          &:hover {
            cursor: pointer;
          }
        }
        a {
          text-decoration: none;
        }
        .text {
          color: #E17615;
        }
        .value {
          color: #3BB9FB;
          text-shadow: none;
        }
      }
      .game-link {
        position: relative;
        display: block;
        width: 50%;
        padding: 13px 14px 16px 15px;
        margin: 1em auto;
        border-radius: 5px;
        box-shadow: inset 0 -3px 0 0 rgba(0, 0, 0, 0.24);
        background-image: linear-gradient(to bottom, #ffed2a 5%, #ffdc2a 94%);
        font-size: 18px;
        font-weight: bold;
        line-height: 21px;
        text-align: center;
        color: #000;
        text-decoration: none;
        &:hover {
          box-shadow: inset 0 -3px 0 0 rgba(0, 0, 0, 0.24);
          background-image: linear-gradient(to bottom, #ffcb00 5%, #ffaf00 94%);
        }
      }
      
      /*
      .game-link {
        position: relative;
        display: block;
        width: 90%;
        margin: 1em auto;
        color: #777674;
        font-weight: bold;
        text-decoration: none;
        text-shadow: rgba(255,255,255,.5) 1px 1px, rgba(100,100,100,.3) 3px 7px 3px;
        user-select: none;
        padding: 1em 2em;
        outline: none;
        border-radius: 3px / 100%;
        background-image:
        linear-gradient(45deg, rgba(255,255,255,.0) 30%, rgba(255,255,255,.8), rgba(255,255,255,.0) 70%),
        linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0) 20%, rgba(255,255,255,0) 90%, rgba(255,255,255,.3)),
        linear-gradient(to right, rgba(125,125,125,1), rgba(255,255,255,.9) 45%, rgba(125,125,125,.5)),
        linear-gradient(to right, rgba(125,125,125,1), rgba(255,255,255,.9) 45%, rgba(125,125,125,.5)),
        linear-gradient(to right, rgba(223,190,170,1), rgba(255,255,255,.9) 45%, rgba(223,190,170,.5)),
        linear-gradient(to right, rgba(223,190,170,1), rgba(255,255,255,.9) 45%, rgba(223,190,170,.5));
        background-repeat: no-repeat;
        background-size: 200% 100%, auto, 100% 2px, 100% 2px, 100% 1px, 100% 1px;
        background-position: 200% 0, 0 0, 0 0, 0 100%, 0 4px, 0 calc(100% - 4px);
        box-shadow: rgba(0,0,0,.5) 3px 10px 10px -10px;
        &:hover {
          transition: .5s linear;
          background-position: -200% 0, 0 0, 0 0, 0 100%, 0 4px, 0 calc(100% - 4px);
        }
        &:active {
          top: 1px;
        }
      }
      */
    }
    .games-list-item:last-child {
      margin-bottom: 0;
    }
  }
}
@media all and (max-width: 760px) {
  .games-list-wrapper {
    padding: 1em 0;
    .title-text {
      font-size: 0.7em;
    }
    .title-desc {
      display: none;
    }
    .games-list {
      .games-list-item {
        margin: 0 auto 1em auto;
        font-size: 0.68em;
        .game-link {
          margin-top: 1em;
        }
      }
    }
  }
}
</style>

