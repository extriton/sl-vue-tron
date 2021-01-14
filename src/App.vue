<template>
  <div id="app">
    <GameWrapper />
    <notifications group="main" position="right bottom"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GameWrapper from '@/components/GameWrapper.vue'

export default {
  name: 'app',
  components: {
    GameWrapper,
  },
  computed: {
    ...mapGetters(['notification', 'notificationCounter'])
  },
  watch: {
    notificationCounter (value) {
      if (value > 0) {
        this.$notify({  group: 'main',
                        type: this.notification.type,
                        title: this.notification.title,
                        text: this.notification.text,
                        duration: 3000,
                        speed: 1000
                    })
      }
    }
  }
}
</script>

<style lang="scss">
@import './../public/css/reset.css';
@import './../public/fonts/font-awesome-4.7.0/css/font-awesome.min.css';
@import './../public/fonts/comfortaa/comfortaa.css';
#app {
  font-family: 'Comfortaa', sans;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  text-align: center;
  translate: no;
}
</style>