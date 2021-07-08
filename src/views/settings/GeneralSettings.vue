<template>
  <div class="w-full h-full p-2 flex flex-col space-y-2">
    <div class="flex justify-between items-center p-1">
      <div class="text-lg font-bold leading-none flex space-x-1 items-center">
        General Settings
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
      class="flex p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <apollo-query
        :query="
          (gql) => gql`
            query {
              session {
                id
                user {
                  id
                  minecraftId
                }
              }
            }
          `
        "
        class="flex flex-grow justify-between items-center"
      >
        <template v-slot="{ result: { loading, error, data } }">
          <div>
            <div class="text-lg">Account</div>

            <div v-if="data && !data.session" class="text-sm text-red-300">
              You must log in to see hacker and sniper tags!
            </div>
          </div>

          <div class="flex justify-end items-center space-x-4">
            <template v-if="data">
              <template v-if="data.session">
                <div class="flex items-center space-x-3">
                  <div>
                    <img
                      :src="`https://crafatar.com/avatars/${data.session.user.minecraftId}?size=32&overlay`"
                      alt=""
                      class="h-6"
                    />
                  </div>

                  <div>{{ $store.state.temp.name }}</div>
                </div>

                <button
                  @click="logOut()"
                  class="border border-2 py-1 px-3"
                  :class="{
                    'hover:bg-gray-700': !logOutLoading,
                    'bg-gray-500': logOutLoading,
                  }"
                  :disabled="logOutLoading"
                >
                  Log Out
                </button>
              </template>

              <template v-else>
                <router-link
                  to="/log-in"
                  class="border border-2 py-1 px-3 hover:bg-gray-700"
                >
                  Log In
                </router-link>
              </template>
            </template>
          </div>
        </template>
      </apollo-query>
    </div>

    <div
      class="flex justify-between p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <div class="text-lg">API Key</div>

      <div class="flex flex-grow items-center justify-end space-x-3">
        <div
          v-if="$store.state.temp.apiKeyValid"
          class="flex justify-center items-center space-x-1 text-green-400"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
              fill="currentColor"
            />
          </svg>

          <div>Valid</div>
        </div>

        <div
          v-else-if="$store.state.temp.apiKeyValid === false"
          class="flex flex-grow items-center justify-end space-x-1 text-red-400"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"
              fill="currentColor"
            />
          </svg>

          <div>Invalid</div>
        </div>

        <input
          type="password"
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
          :value="$store.state.config.apiKey"
          @input="$store.commit('config/set', ['apiKey', $event.target.value])"
        />
      </div>
    </div>

    <div
      class="flex justify-between p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <div class="text-lg">Log File</div>

      <div class="flex flex-grow items-center justify-end space-x-3">
        <div
          v-if="$store.state.temp.logFilePathReadable"
          class="flex justify-center items-center space-x-1 text-green-400"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
              fill="currentColor"
            />
          </svg>

          <div>Valid</div>
        </div>

        <div
          v-else-if="$store.state.temp.logFilePathReadable === false"
          class="flex flex-grow items-center justify-end space-x-1 text-red-400"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"
              fill="currentColor"
            />
          </svg>

          <div>Invalid</div>
        </div>

        <select
          :value="$store.state.config.logFilePathPreset"
          @change="
            $store.dispatch(
              'config/setLogFilePathFromPreset',
              $event.target.value
            )
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
          <option value="STANDARD">Standard</option>
          <option value="LUNAR_CLIENT">Lunar Client</option>
          <option value="BADLION_CLIENT">Badlion Client</option>
          <option value="CUSTOM">Custom</option>
        </select>

        <button
          @click="
            $store.dispatch(
              'config/setLogFilePathFromPreset',
              $store.state.config.logFilePathPreset
            )
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
              d="M16 2h-2v2h2v2H4v2H2v5h2V8h12v2h-2v2h2v-2h2V8h2V6h-2V4h-2V2zM6 20h2v2h2v-2H8v-2h12v-2h2v-5h-2v5H8v-2h2v-2H8v2H6v2H4v2h2v2z"
              fill="currentColor"
            />
          </svg>
        </button>

        <button
          v-if="$store.state.config.logFilePathPreset === 'CUSTOM'"
          @click="setCustomLogFilePath()"
          class="border border-2 py-1 px-3 hover:bg-gray-700 self-stretch"
        >
          Set
        </button>
      </div>
    </div>

    <div
      class="flex justify-between p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <div class="text-lg">Mode</div>

      <div class="flex flex-grow items-center justify-end space-x-3">
        <select
          :value="$store.state.config.mode"
          @change="$store.commit('config/set', ['mode', $event.target.value])"
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
          <option
            v-for="[key, mode] of Object.entries(modes).filter(([key, mode]) =>
              mode.dream
                ? $store.state.config.showDreamModes ||
                  key === $store.state.config.mode
                : true
            )"
            :key="key"
            :value="key"
          >
            {{ mode.displayName }}
          </option>
        </select>

        <button
          @click="
            $store.commit('config/set', [
              'showDreamModes',
              !$store.state.config.showDreamModes,
            ])
          "
          class="border border-2 py-1 px-3 hover:bg-gray-700"
        >
          <div
            v-if="$store.state.config.showDreamModes"
            class="flex items-center space-x-1 text-green-200"
          >
            <div>Dreams</div>

            <svg
              class="w-5 h-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div v-else class="flex items-center space-x-1 text-red-200">
            <div>Dreams</div>

            <svg
              class="w-5 h-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"
                fill="currentColor"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>

    <div
      class="flex justify-between p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <div class="text-lg">Sort</div>

      <div class="flex flex-grow items-center justify-end space-x-3">
        <select
          :value="$store.state.config.sortBy"
          @change="$store.commit('config/set', ['sortBy', $event.target.value])"
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
          <option
            v-for="[key, column] of Object.entries(columns).filter(
              ([key, column]) => column.sort
            )"
            :key="key"
            :value="key"
          >
            {{ column.displayName }}
          </option>
        </select>

        <button
          @click="
            $store.commit('config/set', [
              'sortAscending',
              !$store.state.config.sortAscending,
            ])
          "
          class="border border-2 p-1 hover:bg-gray-700"
        >
          <svg
            v-if="!$store.state.config.sortAscending"
            class="w-6 h-6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M11 4h2v12h2v2h-2v2h-2v-2H9v-2h2V4zM7 14v2h2v-2H7zm0 0v-2H5v2h2zm10 0v2h-2v-2h2zm0 0v-2h2v2h-2z"
              fill="currentColor"
            />
          </svg>

          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M11 20h2V8h2V6h-2V4h-2v2H9v2h2v12zM7 10V8h2v2H7zm0 0v2H5v-2h2zm10 0V8h-2v2h2zm0 0v2h2v-2h-2z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      class="flex justify-between p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <div class="text-lg">Guild Tags</div>

      <div class="flex flex-grow items-center justify-end">
        <button
          @click="
            $store.commit('config/set', [
              'showGuildTag',
              !$store.state.config.showGuildTag,
            ])
          "
          class="border border-2 p-1 hover:bg-gray-700"
        >
          <svg
            v-if="$store.state.config['showGuildTag']"
            class="w-6 h-6 text-green-400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
              fill="currentColor"
            />
          </svg>

          <svg
            v-else
            class="w-6 h-6 text-red-400"
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
import { onLogout } from '@/vue-apollo'
import { columns, modes } from '@/store'
import debounce from 'lodash/debounce'

export default Vue.extend({
  data() {
    return {
      logOutLoading: false,
    }
  },
  computed: {
    modes() {
      return modes
    },
    columns() {
      return columns
    },
  },
  methods: {
    async logOut() {
      this.logOutLoading = true
      await onLogout(this.$apollo.getClient())
      await this.$store.dispatch('temp/updateName', this.$apollo.getClient())
      this.logOutLoading = false
    },
    async setCustomLogFilePath() {
      const openFileResult = await window.ipcRenderer.invoke('openFileLog')

      if (openFileResult.filePaths.length === 1) {
        this.$store.commit('config/set', [
          'logFilePath',
          openFileResult.filePaths[0],
        ])
      }
    },
  },
})
</script>
