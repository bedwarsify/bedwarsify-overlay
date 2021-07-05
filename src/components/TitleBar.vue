<template>
  <div class="drag">
    <div class="flex justify-between">
      <div class="flex items-center flex-shrink-0">
        <div class="p-2">
          <img src="../assets/icon.svg" alt="" class="w-6 h-6" />
        </div>

        <div class="font-semibold">Bedwarsify Overlay</div>
      </div>

      <div
        class="flex items-center justify-end flex-grow"
        v-if="!$store.state.temp.capturingScreenshot"
      >
        <div class="flex flex-grow items-center justify-end ml-3 mr-2">
          <template v-if="$store.state.temp.apiKeyValid">
            <template v-if="$route.name === 'Home'">
              <div class="flex-grow max-w-[10rem]">
                <input
                  v-model.trim="manualAddPlayerName"
                  @keypress.enter="manualAddPlayer()"
                  class="bg-transparent border px-1 w-full no-drag"
                />
              </div>

              <mode-select no-label class="p-2 no-drag" />

              <button
                @click="$store.commit('temp/clearPlayers')"
                class="p-2 hover:bg-gray-700 no-drag"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM13 8a1 1 0 100 2h4a1 1 0 100-2h-4z"
                  />
                </svg>
              </button>
            </template>

            <router-link v-else to="/" class="p-2 hover:bg-gray-700 no-drag">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                />
              </svg>
            </router-link>

            <router-link to="/nicks" class="p-2 hover:bg-gray-700 no-drag">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </router-link>

            <router-link to="/tracking" class="p-2 hover:bg-gray-700 no-drag">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"
                />
              </svg>
            </router-link>
          </template>

          <router-link to="/settings" class="p-2 hover:bg-gray-700 no-drag">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              />
            </svg>
          </router-link>
        </div>

        <button class="no-drag p-2 hover:bg-gray-700" @click="minimize()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <button class="no-drag p-2 hover:bg-gray-700" @click="close()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ModeSelect from '@/components/ModeSelect.vue'

export default Vue.extend({
  components: { ModeSelect },
  data() {
    return {
      manualAddPlayerName: '',
    }
  },
  methods: {
    minimize(): void {
      window.ipcRenderer.send('winMinimize')
    },
    close(): void {
      window.ipcRenderer.send('winClose')
    },
    async manualAddPlayer() {
      if (
        !/^[A-Za-z0-9_]{1,16}(?:(?:\s+[A-Za-z0-9_]{1,16})+)?$/.test(
          this.manualAddPlayerName
        )
      )
        return

      const playerNames = this.manualAddPlayerName.split(/\s+/)

      for (const playerName of playerNames) {
        this.$store.dispatch('temp/addPlayerName', [
          playerName,
          this.$apollo.getClient(),
        ])
      }

      this.manualAddPlayerName = ''
    },
  },
})
</script>

<style>
.drag {
  -webkit-app-region: drag;
}

.no-drag {
  -webkit-app-region: no-drag;
}
</style>
