import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import LogIn from '../views/LogIn.vue'
import Tracking from '../views/Tracking.vue'
import TrackingPlayer from '../views/TrackingPlayer.vue'
import TrackingPlayerSettings from '../views/TrackingPlayerSettings.vue'
import Nicks from '../views/Nicks.vue'
import Settings from '../views/settings/Settings.vue'
import GeneralSettings from '../views/settings/GeneralSettings.vue'
import AppearanceSettings from '../views/settings/AppearanceSettings.vue'
import ColumnsSettings from '../views/settings/ColumnsSettings.vue'
import AutoAddRemoveSettings from '../views/settings/AutoAddRemove.vue'
import KeyboardShorcutsSettings from '../views/settings/KeyboardShortcutsSettings.vue'
import SoundsSettings from '../views/settings/SoundsSettings.vue'
import AdvancedSettings from '../views/settings/AdvancedSettings.vue'

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
    path: '/settings/general',
    name: 'GeneralSettings',
    component: GeneralSettings,
  },
  {
    path: '/settings/appearance',
    name: 'AppearanceSettings',
    component: AppearanceSettings,
  },
  {
    path: '/settings/columns',
    name: 'ColumnsSettings',
    component: ColumnsSettings,
  },
  {
    path: '/settings/auto-add-remove',
    name: 'AutoAddRemoveSettings',
    component: AutoAddRemoveSettings,
  },
  {
    path: '/settings/keyboard-shortcuts',
    name: 'KeyboardShortcutsSettings',
    component: KeyboardShorcutsSettings,
  },
  {
    path: '/settings/sounds',
    name: 'SoundsSettings',
    component: SoundsSettings,
  },
  {
    path: '/settings/advanced',
    name: 'AdvancedSettings',
    component: AdvancedSettings,
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
