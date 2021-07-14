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
          <template
            v-if="
              $store.state.temp.apiKeyValid &&
              $store.state.temp.launchSettingsVisible === false &&
              $route.name === 'Home'
            "
          >
            <div class="flex-grow max-w-[10rem]">
              <input
                v-model.trim="manualAddPlayerName"
                @keypress.enter="manualAddPlayer()"
                class="
                  bg-transparent
                  border border-2 border-gray-400
                  px-1
                  w-full
                  no-drag
                "
                :style="$store.getters['config/opacityStyle']"
              />
            </div>

            <mode-select no-label class="p-2 no-drag" />

            <button
              @click="$store.commit('temp/clearPlayers')"
              class="p-2 hover:bg-gray-700 no-drag"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2h6v2h-6v6h-2V4h2V2zm0 8h6v2h-6v-2zm8-6h-2v6h2V4zM9 16H7v6h16v-6h-2v4H9v-4h12v-2H9v2zm-2-6H1v2h6v-2z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </template>

          <div class="group relative">
            <button class="p-2 hover:bg-gray-700 no-drag">
              <svg
                class="w-6 h-6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm16 5H4v2h16v-2z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <div
              class="
                absolute
                right-0
                flex-col
                bg-gray-900
                hidden
                group-hover:flex
              "
            >
              <router-link
                to="/"
                class="
                  p-2
                  hover:bg-gray-700
                  no-drag
                  flex
                  space-x-2
                  items-center
                "
                exact-active-class="bg-gray-800"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M14 2h-4v2H8v2H6v2H4v2H2v2h2v10h7v-6h2v6h7V12h2v-2h-2V8h-2V6h-2V4h-2V2zm0 2v2h2v2h2v2h2v2h-2v8h-3v-6H9v6H6v-8H4v-2h2V8h2V6h2V4h4z"
                    fill="currentColor"
                  />
                </svg>

                <div class="leading-none">Home</div>
              </router-link>

              <template
                v-if="
                  $store.state.temp.apiKeyValid &&
                  $store.state.temp.launchSettingsVisible === false
                "
              >
                <router-link
                  to="/nicks"
                  class="
                    p-2
                    hover:bg-gray-700
                    no-drag
                    flex
                    space-x-2
                    items-center
                  "
                  active-class="bg-gray-800"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 4H2v16h20V4H4zm0 2h16v12H4V6zm2 2h12v2H6V8zm0 4h10v2H6v-2z"
                      fill="currentColor"
                    />
                  </svg>

                  <div class="leading-none">Nicks</div>
                </router-link>

                <router-link
                  to="/tracking"
                  class="
                    p-2
                    hover:bg-gray-700
                    no-drag
                    flex
                    space-x-2
                    items-center
                  "
                  active-class="bg-gray-800"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M13 5h2v14h-2V5zm-2 4H9v10h2V9zm-4 4H5v6h2v-6zm12 0h-2v6h2v-6z"
                      fill="currentColor"
                    />
                  </svg>

                  <div class="leading-none">Tracking</div>
                </router-link>
              </template>

              <router-link
                to="/settings"
                class="
                  p-2
                  hover:bg-gray-700
                  no-drag
                  flex
                  space-x-2
                  items-center
                "
                active-class="bg-gray-800"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M18 2h-2v2h2V2zM4 4h6v2H4v14h14v-6h2v8H2V4h2zm4 8H6v6h6v-2h2v-2h-2v2H8v-4zm4-2h-2v2H8v-2h2V8h2V6h2v2h-2v2zm2-6h2v2h-2V4zm4 0h2v2h2v2h-2v2h-2v2h-2v-2h2V8h2V6h-2V4zm-4 8h2v2h-2v-2z"
                    fill="currentColor"
                  />
                </svg>

                <div class="leading-none">Settings</div>
              </router-link>
            </div>
          </div>
        </div>

        <button class="no-drag p-2 hover:bg-gray-700" @click="minimize()">
          <svg
            class="w-6 h-6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M4 11h16v2H4z" />
          </svg>
        </button>

        <button
          class="no-drag p-2 hover:bg-gray-700"
          :class="{ 'rounded-tr-[8px]': $store.state.config.roundedCorners }"
          @click="close()"
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
</template>

<script lang="ts">
import Vue from 'vue'
import ModeSelect from '@/components/ModeSelect.vue'

export default Vue.extend({
  components: { ModeSelect },
  data() {
    return {
      menu: false,
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
