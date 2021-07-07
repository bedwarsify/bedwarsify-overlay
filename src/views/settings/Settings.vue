<template>
  <div class="w-full h-full p-2 flex flex-col space-y-2">
    <div class="flex justify-between items-center p-1">
      <div class="text-lg font-bold leading-none">Settings</div>

      <router-link to="/" class="hover:bg-gray-700 p-1">
        <svg
          class="w-6 h-6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 3v18H3V3h18zM5 19h14V5H5v14zm12-8v2h-6v2H9v-2H7v-2h2V9h2v2h6zm-4-2h-2V7h2v2zm0 8v-2h-2v2h2z"
            fill="currentColor"
          />
        </svg>
      </router-link>
    </div>

    <div class="space-y-2 flex-grow">
      <router-link
        to="/settings/general"
        class="w-full hover:bg-gray-700 p-3 flex space-x-2 items-center"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M5 3H3v18h18V3H5zm14 2v14H5V5h14zm-2 2H7v2h10V7zM7 11h10v2H7v-2zm7 4H7v2h7v-2z"
            fill="currentColor"
          />
        </svg>

        <div class="leading-none">General</div>
      </router-link>

      <router-link
        to="/settings/appearance"
        class="w-full hover:bg-gray-700 p-3 flex space-x-2 items-center"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M18 2h-2v2h-2v2h-2v2h-2v2H8v2H6v2H4v2H2v6h6v-2h2v-2h2v-2h2v-2h2v-2h2v-2h2V8h2V6h-2V4h-2V2zm0 8h-2v2h-2v2h-2v2h-2v2H8v-2H6v-2h2v-2h2v-2h2V8h2V6h2v2h2v2zM6 16H4v4h4v-2H6v-2z"
            fill="currentColor"
          />
        </svg>

        <div class="leading-none">Appearance</div>
      </router-link>

      <router-link
        to="/settings/columns"
        class="w-full hover:bg-gray-700 p-3 flex space-x-2 items-center"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M2 5h20v14H2V5zm2 2v10h7V7H4zm9 0v10h7V7h-7z"
            fill="currentColor"
          />
        </svg>

        <div class="leading-none">Columns</div>
      </router-link>

      <router-link
        to="/settings/auto-add-remove"
        class="w-full hover:bg-gray-700 p-3 flex space-x-2 items-center"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M11 0H5v2H3v6h2v2h6V8H5V2h6V0zm0 2h2v6h-2V2zM0 14h2v4h12v2H0v-6zm2 0h12v-2H2v2zm14 0h-2v6h2v-6zM15 0h4v2h-4V0zm4 8h-4v2h4V8zm0-6h2v6h-2V2zm5 12h-2v4h-4v2h6v-6zm-6-2h4v2h-4v-2z"
            fill="currentColor"
          />
        </svg>

        <div class="leading-none">Auto Add/Remove</div>
      </router-link>

      <router-link
        to="/settings/keyboard-shortcuts"
        class="w-full hover:bg-gray-700 p-3 flex space-x-2 items-center"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 3H3v18h18V3zM5 19V5h14v14H5zM9 7H7v2h2V7zm8 8H7v2h10v-2zm-2-8h2v2h-2V7zm-2 0h-2v2h2V7zm-6 4h2v2H7v-2zm10 0h-2v2h2v-2zm-6 0h2v2h-2v-2z"
            fill="currentColor"
          />
        </svg>

        <div class="leading-none">Keyboard Shortcuts</div>
      </router-link>

      <router-link
        to="/settings/sounds"
        class="w-full hover:bg-gray-700 p-3 flex space-x-2 items-center"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M14 4V2h-4v2H5v2h14V4h-5zm5 12H5v-4H3v6h5v4h2v-4h4v2h-4v2h6v-4h5v-6h-2V6h-2v8h2v2zM5 6v8h2V6H5z"
            fill="currentColor"
          />
        </svg>

        <div class="leading-none">Sounds</div>
      </router-link>

      <router-link
        to="/settings/advanced"
        class="w-full hover:bg-gray-700 p-3 flex space-x-2 items-center"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M5 3H3v18h18V3H5zm14 2v14H5V5h14zm-2 2H7v2h10V7zM7 11h10v2H7v-2zm7 4H7v2h7v-2z"
            fill="currentColor"
          />
        </svg>

        <div class="leading-none">Advanced</div>
      </router-link>
    </div>

    <div class="flex justify-between items-center px-5 space-x-3">
      <div class="py-3 font-bold">Bedwarsify Overlay v{{ version }}</div>

      <div class="flex items-center space-x-3">
        <button
          @click="openExternal('https://bedwarsify.com')"
          class="
            border border-2
            py-1
            px-3
            hover:bg-gray-700
            border-gray-200
            text-gray-200
          "
        >
          Website
        </button>

        <button
          @click="openExternal('https://docs.bedwarsify.com')"
          class="
            border border-2
            py-1
            px-3
            hover:bg-gray-700
            border-gray-200
            text-gray-200
          "
        >
          Docs
        </button>

        <button
          @click="openExternal('https://discord.gg/XyEv5JQ53S')"
          class="
            border border-2
            py-1
            px-3
            hover:bg-gray-700
            text-discord-blurple
            border-discord-blurple
          "
        >
          Discord
        </button>

        <button
          @click="openExternal('https://patreon.com/bedwarsify')"
          class="
            border border-2
            py-1
            px-3
            hover:bg-gray-700
            text-patreon-fiery-coral
            border-patreon-fiery-coral
          "
        >
          Patreon
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    version() {
      return process.env.VUE_APP_VERSION
    },
  },
  methods: {
    openExternal(url: string) {
      window.ipcRenderer.send('openExternal', url)
    },
  },
})
</script>
