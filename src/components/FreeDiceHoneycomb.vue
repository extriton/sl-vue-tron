<template>
  <div class="dice-honeycomb">
    <transition
      name="odometr"
      @before-enter="beforeEnter"
    >
      <ul
        ref="digits"
        :key="gameCounter"
        class="dice-honeycomb-digits"
        :class="classObj"
      >
        <li
          v-for="(item, index) in outArray"
          :key="'d' + index"
          class="dice-honeycomb-digit"
        >
          {{ item }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'FreeDiceHoneycomb',
  props: {
    digit: {
      type: Number,
      required: true
    },
    delay: {
      type: Number,
      required: true
    },
    gameCounter: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      digitsArray: [this.digit],
      animated: false
    }
  },
  computed: {
    outArray () {
      return this.digitsArray
    },
    classObj () {
      const styleName = 'delay-' + this.delay
      return {
        [styleName]: true,
        animated: this.animated
      }
    }
  },
  methods: {
    beforeEnter () {
      // Создаём массив цифр
      const digitsArray = []
      const oldDigit = this.digitsArray[this.digitsArray.length - 1]
      for (let i = oldDigit; i >= 0; i--) {
        digitsArray.push(i)
      }
      for (let i = 9; i >= 0; i--) {
        digitsArray.push(i)
      }
      for (let i = 9; i >= parseInt(this.digit); i--) {
        digitsArray.push(i)
      }
      this.digitsArray = digitsArray

      // Запускаем отолженную анимацию
      setTimeout(() => {
        this.animated = true
        this.digitsArray = this.digitsArray.slice(-1)
        setTimeout(() => {
          this.animated = false
        }, 200)
      }, 1000 + this.delay)
    }
  }
}
</script>

<style>
.dice-honeycomb {
  height: 62px;
  margin-top: 9px;
  overflow: hidden;
}

.dice-honeycomb-digit {
  position: relative;
  font-size: 41px;
  line-height: 67px;
  font-weight: bold;
  color: #fff;
  text-align: center;
}

.odometr-enter-active {
  transition: transform 1s cubic-bezier(0.29, 0.01, .02, 0.99);
}
.odometr-enter-active.delay-100 { transition-delay: .1s }
.odometr-enter-active.delay-200 { transition-delay: .2s }
.odometr-enter-active.delay-300 { transition-delay: .3s }

.odometr-enter { transform: translateY(0); }
.odometr-enter-to { transform: translateY(calc(-100% + 58px)); }

.animated {
  animation: bounce .2s 1;
}

@keyframes bounce {
  0% {
    transform: translateY(-5px);
  }
  20% {
    transform: translateY(-5px);
  }
  40% {
    transform: translateY(-4px);
  }
  60% {
    transform: translateY(-2px);
  }
  80% {
    transform: translateY(2px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
