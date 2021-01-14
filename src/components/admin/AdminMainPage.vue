<template>
  <div class="admin-main-page">
    <!-- Admin menu -->
    <div class="menu-list">
      <router-link to="/admin/visits" class="menu-list-item">Посещаемость</router-link>
      <router-link to="/admin/users" class="menu-list-item">Пользователи</router-link>
      <router-link to="/admin/ips" class="menu-list-item">IPs</router-link>
      <router-link to="/admin/messages" class="menu-list-item">Сообщения</router-link>
      <router-link to="/admin/news" class="menu-list-item">Новости</router-link>
    </div>
    <!-- Admin body -->
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AdminMainPage'
}
</script>

<style lang="scss">
.admin-main-page {
  user-select: text;
  -moz-user-select: test;
  -webkit-user-select: text;
  -ms-user-select: text;
  .menu-list {
    text-align: left;
    .menu-list-item {
      display: inline-block;
      padding: 10px;
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
  }
}
</style>
