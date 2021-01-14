/* eslint-disable */

import Vue from 'vue'
import Router from 'vue-router'

import GamesList from '@/components/GamesList.vue'
// import GameItem from '@/components/GameItem.vue'
// import GamePlay from '@/components/GamePlay.vue'
// import GameHistory from '@/components/GameHistory.vue'
// import PlayerHistory from '@/components/PlayerHistory.vue'
// import GameRules from '@/components/GameRules.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: GamesList,
      beforeEnter:  (to, from, next) => {
        
        const referrer = to.query.r
        if (referrer)
          $cookies.set('referrer', referrer)

        next('/w5x36/play')
      }
    },
    {
      path: '/profile',
      name: 'ProfilePage',
      component: () => import(/* webpackChunkName: "ProfilePage" */ '@/components/ProfilePage.vue'),
    },
    {
      path: '/free-eth',
      name: 'FreeETHPage',
      component: () => import(/* webpackChunkName: "ProfilePage" */ '@/components/FreeETHPage.vue'),
    },
    {
      path: '/news',
      name: 'NewsPage',
      component: () => import(/* webpackChunkName: "NewsPage" */ '@/components/NewsPage.vue'),
    },
    {
      path: '/news/:id',
      name: 'NewsItemPage',
      props: true,
      component: () => import(/* webpackChunkName: "NewsPage" */ '@/components/NewsItemPage.vue'),
    },
    {
      path: '/admin',
      // component: AdminMainPage
      component: () => import(/* webpackChunkName: "AdminPage" */ '@/components/admin/AdminMainPage.vue'),
      children: [
        {
          path: 'visits',
          component: () => import(/* webpackChunkName: "AdminPage" */ '@/components/admin/AdminVisitsPage.vue'),
        },
        {
          path: 'users',
          component: () => import(/* webpackChunkName: "AdminPage" */ '@/components/admin/AdminUsersPage.vue'),
        },
        {
          path: 'ips',
          component: () => import(/* webpackChunkName: "AdminPage" */ '@/components/admin/AdminIPsPage.vue'),
        },
        {
          path: 'messages',
          component: () => import(/* webpackChunkName: "AdminPage" */ '@/components/admin/AdminMessagesPage.vue'),
        },
        {
          path: 'news',
          component: () => import(/* webpackChunkName: "AdminPage" */ '@/components/admin/AdminNewsPage.vue'),
        },
        {
          path: '*',
          redirect: 'visits'
        }
      ]
    },
    {
      path: '/:gameType',
      // component: GameItem,
      component: () => import(/* webpackChunkName: "GameItem" */ '@/components/GameItem.vue'),
      props: true,
      children: [
        {
          path: 'play',
          // component: GamePlay
          component: () => import(/* webpackChunkName: "GameItem" */ '@/components/GamePlay.vue')
        },
        {
          path: 'game-history',
          // component: GameHistory
          component: () => import(/* webpackChunkName: "GameItem" */ '@/components/GameHistory.vue')
        },
        {
          path: 'player-history',
          // component: PlayerHistory
          component: () => import(/* webpackChunkName: "GameItem" */ '@/components/PlayerHistory.vue')
        },
        {
          path: 'rules',
          // component: GameRules
          component: () => import(/* webpackChunkName: "GameItem" */ '@/components/GameRules.vue')
        },
        {
          path: '',
          redirect: 'play'
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
