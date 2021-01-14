<template>
  <div class="game-item">
    <!-- Game name -->
    <div class="game-name">
      {{ gameName }}
      <div class="game-description">
        {{ dict.play_title1 }} <strong class="blue-color">{{ dict.play_title2 }}</strong> 
        {{ dict.play_title3 }} {{ dict.play_title4 }}
      </div>
    </div>
    <!-- Game menu -->
    <div class="menu-list">
      <router-link :to="linkPath('play')" class="menu-list-item">{{ dict.menu_play }}</router-link>
      <router-link :to="linkPath('game-history')" class="menu-list-item">{{ dict.menu_history }}</router-link>
      <router-link :to="linkPath('player-history')" class="menu-list-item">{{ dict.menu_statistics }}</router-link>
      <router-link :to="linkPath('rules')" class="menu-list-item">{{ dict.menu_rules }}</router-link>
    </div>
    <!-- Game body -->
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'GameItem',
  props: ['gameType'],
  components: {
  },
  data () {
    return {}
  },
  computed: {
    dict () {
      return this.$store.state.dict
    },
    gameName () {
      return this.gameCurrent.name
    },
    ...mapGetters(['gameSettings', 'gameCurrent'])
  },
  methods: {
    linkPath (path) {
      return `/${this.gameType}/${path}`
    }
  },
  created () {

    // Define current game by router id
    let index = null
    
    for (let i = 0; i < this.gameSettings.games.length; i++)
      if (this.gameSettings.games[i].type === this.$route.params.gameType) {
          index = i
          break
      }

    if (index === null)
      this.$router.push({ path: '/' })
    else
      this.$store.commit('gameCurrentChange', index)

  }
}
</script>

<style lang="scss">
.game-item {
  .menu-list-item {
    display: inline-block;
    width: 25%;
    color: rgb(205,216,228);
    text-decoration: none;
    outline: none;
    border-right: 1px solid rgba(13,20,27,.5);
    border-top: 1px solid rgba(270,278,287,.01);
    background-color: rgb(12,33,43);
    background-image:
      radial-gradient(1px 60% at 0% 50%, rgba(255,255,255,.3), transparent),
      radial-gradient(1px 60% at 100% 50%, rgba(255,255,255,.3), transparent),
      linear-gradient(rgb(12,33,43), rgb(20,41,51));
    font-size: 1em;
    padding: .5em 1em;
    @media all and (max-width: 760px) {
      font-size: .5em;
      padding: .2em .1em;
    }
    &:hover {
      background-image:
        radial-gradient(1px 60% at 0% 50%, rgba(255,255,255,.3), transparent),
        radial-gradient(1px 60% at 100% 50%, rgba(255,255,255,.3), transparent),
        linear-gradient(rgb(0,21,29), rgb(5,24,34));
    }
    &.router-link-active {
      color: rgb(245,247,250);
      border-top: 1px solid rgb(67,111,136);
      background-image:
        linear-gradient(rgb(0,55,83), rgb(0,27,53));
    }
    &.router-link-active:hover {
      border-top: 1px solid rgb(49,87,107);
      background-image:
        linear-gradient(rgb(33,77,98), rgb(29,57,77));
    }
  }
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
    @media all and (max-width: 760px) {
      font-size: .8em;
      padding: .3em .3em;
    }
    .game-description {
      margin-top: 10px;
      font-size: 14px;
      color: #222;
      .blue-color {
        color: blue;/* #3BB9FB; */
      }
      @media all and (max-width: 760px) {
        margin-top: 5px;
        font-size: .8em;
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
</style>