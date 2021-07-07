<template>
  <div class="w-full h-full p-2 flex flex-col space-y-2">
    <div class="flex justify-between items-center p-1">
      <div class="text-lg font-bold leading-none flex space-x-1 items-center">
        Sounds Settings
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
      v-for="sound in sounds"
      :key="sound.key"
      class="flex justify-between p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <div class="text-lg">{{ sound.label }}</div>

      <div class="flex flex-grow items-center justify-end space-x-3">
        <select
          :value="$store.state.config[sound.key]"
          @change="
            $store.commit('config/set', [sound.key, $event.target.value])
          "
          class="
            bg-transparent
            appearance-none
            border border-2
            py-1
            px-3
            hover:bg-gray-700
            focus:bg-gray-700
          "
        >
          <option :value="null">None</option>

          <option
            v-for="[key, soundEffect] of Object.entries(soundEffects)"
            :key="key"
            :value="key"
          >
            {{ soundEffect.displayName }}
          </option>
        </select>

        <button
          @click="
            soundEffects[$store.state.config[sound.key]] &&
              soundEffects[$store.state.config[sound.key]].audio.play()
          "
          class="border border-2 p-1 hover:bg-gray-700 text-green-500"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              v-if="soundEffects[$store.state.config[sound.key]]"
              d="M10 20H8V4h2v2h2v3h2v2h2v2h-2v2h-2v3h-2v2z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import soundEffects from '@/sound-effects'

export default Vue.extend({
  data() {
    return {
      sounds: [
        {
          key: 'hackersSnipersSoundEffect',
          label: 'Hackers and Snipers',
        },
      ],
    }
  },
  computed: {
    soundEffects() {
      return soundEffects
    },
  },
})
</script>
