import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Settings from '../views/Settings.vue'
import LogIn from '../views/LogIn.vue'
import Tracking from '../views/Tracking.vue'
import TrackingPlayer from '../views/TrackingPlayer.vue'
import TrackingPlayerSettings from '../views/TrackingPlayerSettings.vue'
import Nicks from '../views/Nicks.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/log-in',
    name: 'LogIn',
    component: LogIn,
  },
  {
    path: '/tracking',
    name: 'Tracking',
    component: Tracking,
  },
  {
    path: '/tracking/:playerId',
    name: 'TrackingPlayer',
    component: TrackingPlayer,
  },
  {
    path: '/tracking/:playerId/settings',
    name: 'TrackingPlayerSettings',
    component: TrackingPlayerSettings,
  },
  {
    path: '/nicks',
    name: 'Nicks',
    component: Nicks,
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
})

export default router
