<template>
    <div id="footer" class="footer">
        <div class="footer__copyright">
            <span class="color-blue">Copyright © 2019 –</span> SmartLotto.org
        </div>
        <div class="box-visits-wrap">
            <BoxVisits />
        </div>
    </div>
</template>

<script>
import BoxVisits from '@/components/BoxVisits.vue'
export default {
    name: 'TheFooter',
    components: {
        BoxVisits
    }
}
</script>

<style lang="scss">
#footer {
    position: fixed;
    bottom: 0;
    padding: 20px 30px;
    width: 100%;
    background-color: #0E1014;
    color: #FFF;
    z-index: 5;
    text-align: left;
    .color-blue {
        color: #34BBFF;
    }
    .box-visits-wrap {
        position: absolute;
        right: 10px;
        top: 0;
    }
}
@media all and (max-width: 760px) {
    .footer {
      font-size: 0.8em;
      padding: 10px 20px;
      &__copyright {
          display: none;
      }
    }
}
</style>
