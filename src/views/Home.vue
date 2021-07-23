<template>
  <div>
    <div class="w-full h-full flex flex flex-col">
      <players
        v-if="$store.state.temp.launchSettingsVisible === false"
        class="flex-grow"
      />

      <launch-settings
        v-else-if="$store.state.temp.launchSettingsVisible === true"
        class="flex-grow"
      />

      <div
        class="
          w-full
          bg-patreon-fiery-coral
          p-2
          pl-4
          flex
          justify-between
          items-center
        "
        :class="{
          'rounded-b-[8px]': $store.state.config.roundedCorners,
        }"
        :style="$store.getters['config/opacityStyle']"
        v-if="
          !$store.state.config.dismissedPatreonReminder &&
          $store.state.temp.now.getTime() -
            $store.state.temp.startedAt.getTime() >
            15 * 60e3
        "
      >
        <div>
          Liking the overlay? Please consider supporting its development.
        </div>

        <div class="flex space-x-2">
          <button
            @click="openExternal('https://patreon.com/bedwarsify')"
            class="border border-2 py-1 px-3 hover:bg-gray-700"
          >
            Open Patreon
          </button>

          <button
            @click="
              $store.commit('config/set', ['dismissedPatreonReminder', true])
            "
            class="border border-2 p-1 hover:bg-gray-700"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Players from '@/views/Players.vue'
import LaunchSettings from '@/views/LaunchSettings.vue'

export default {
  components: { LaunchSettings, Players },
  methods: {
    openExternal(url: string) {
      window.ipcRenderer.send('openExternal', url)
    },
  },
}
</script>
