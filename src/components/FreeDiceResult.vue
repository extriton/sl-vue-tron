<template>
  <div class="dice-result">
    <div class="dice-honeycomb-wrap">
      <div class="dice-honeycomb-img" :class="classObj">
        <img src="../../public/img/dices/honeycomb_green.svg" class="yellow">
        <img src="../../public/img/dices/honeycomb_green.svg" class="green">
        <img src="../../public/img/dices/honeycomb_green.svg" class="red">
      </div>
      <FreeDiceHoneycomb
        :digit="parseInt(result.charAt(0))"
        :delay="0"
        :game-counter="gameCounter"
      />
    </div>
    <div class="dice-honeycomb-wrap">
      <div class="dice-honeycomb-img" :class="classObj">
        <img src="../../public/img/dices/honeycomb_green.svg" class="yellow">
        <img src="../../public/img/dices/honeycomb_green.svg" class="green">
        <img src="../../public/img/dices/honeycomb_green.svg" class="red">
      </div>
      <FreeDiceHoneycomb
        :digit="parseInt(result.charAt(1))"
        :delay="100"
        :game-counter="gameCounter"
      />
    </div>
    <div class="dice-honeycomb-wrap">
      <div class="dice-honeycomb-img" :class="classObj">
        <img src="../../public/img/dices/honeycomb_green.svg" class="yellow">
        <img src="../../public/img/dices/honeycomb_green.svg" class="green">
        <img src="../../public/img/dices/honeycomb_green.svg" class="red">
      </div>
      <FreeDiceHoneycomb
        :digit="parseInt(result.charAt(2))"
        :delay="200"
        :game-counter="gameCounter"
      />
    </div>
    <div class="dice-honeycomb-wrap">
      <div class="dice-honeycomb-img" :class="classObj">
        <img src="../../public/img/dices/honeycomb_green.svg" class="yellow">
        <img src="../../public/img/dices/honeycomb_green.svg" class="green">
        <img src="../../public/img/dices/honeycomb_green.svg" class="red">
      </div>
      <FreeDiceHoneycomb
        :digit="parseInt(result.charAt(3))"
        :delay="300"
        :game-counter="gameCounter"
      />
    </div>
    <div class="clearfix" />
  </div>
</template>

<script>
import FreeDiceHoneycomb from '@/components/FreeDiceHoneycomb.vue'

export default {
  name: 'FreeDiceResult',
  components: {
    FreeDiceHoneycomb
  },
  props: {
    gameValue: {
      type: Number,
      required: true
    },
    gameCounter: {
      type: Number,
      required: true
    },
    resultType: {
      type: Number,
      required: true
    }
  },
  computed: {
    result () {
      const zeros = '0000'
      let res
      if (this.gameCounter === 0) {
        res = (parseInt(Math.random() * 10000)).toString()
      } else {
        res = this.gameValue.toString()
      }

      if (res.length < 4) {
        res = zeros.substr(0, 4 - res.length) + res
      }

      return res
    },
    // Выставлеят класс для блока и корнеров в зависиомсти от типа результата
    classObj () {
      return {
        'default': this.resultType === 0,
        'win': this.resultType === 1,
        'lose': this.resultType === 2
      }
    }
  }
}
</script>

<style>
.dice-result {
  width: 100%;
  position: relative;
}

.dice-result img {
  width: 100%;
  transition: opacity .1s ease-out;
  display: none;
  opacity: 0;
}

.dice-honeycomb-wrap {
  position: relative;
  width: 70px;
  height: 80px;
  margin-right: 2px;
  float: left;
}

.dice-honeycomb-wrap:nth-child(4) {
  margin-right: 0;
}

.dice-honeycomb-img,
.dice-dot-img {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
}

.dice-honeycomb-img.default .yellow,
.dice-honeycomb-img.win .green,
.dice-honeycomb-img.lose .red,
.dice-dot-img.default .yellow,
.dice-dot-img.win .green,
.dice-dot-img.lose .red {
  display: block;
  opacity: 1;
}

.clearfix {
  clear: both;
}
</style>
