<template>
  <div class="w-full h-full p-2 flex flex-col space-y-2">
    <div class="flex justify-between items-center p-1">
      <div class="text-lg font-bold leading-none flex space-x-1 items-center">
        Keyboard Shortcuts Settings
      </div>

      <router-link to="/settings" class="hover:bg-gray-700 p-1">
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

    <div
      v-for="keyboardShortcut in keyboardShortcuts"
      :key="keyboardShortcut.key"
      class="flex justify-between p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <div class="text-lg">{{ keyboardShortcut.label }}</div>

      <div class="flex flex-grow items-center justify-end space-x-3">
        <input
          type="text"
          class="
            bg-transparent
            hover:bg-gray-700
            focus:bg-gray-700
            border border-2
            py-1
            px-3
            flex-grow
            max-w-[14rem]
          "
          spellcheck="false"
          :value="$store.state.config[keyboardShortcut.key]"
          @click="$store.commit('config/set', [keyboardShortcut.key, ''])"
          @keydown="
            !$event.repeat &&
              $store.commit('config/set', [
                keyboardShortcut.key,
                $store.state.config[keyboardShortcut.key] +
                  ($store.state.config[keyboardShortcut.key] ? '+' : '') +
                  $event.key,
              ])
          "
          @keyup="$event.target.blur()"
        />

        <button
          @click="$store.commit('config/set', [keyboardShortcut.key, ''])"
          class="border border-2 p-1 hover:bg-gray-700"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              v-if="$store.state.config[keyboardShortcut.key]"
              fill="currentColor"
              d="M4 11h16v2H4z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      keyboardShortcuts: [
        {
          key: 'keyboardShortcutMinimizeUnminize',
          label: 'Minimize/Unminimize',
        },
        {
          key: 'keyboardShortcutClearPlayers',
          label: 'Clear Players',
        },
      ],
    }
  },
})
</script>
