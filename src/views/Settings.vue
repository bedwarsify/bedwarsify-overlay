<template>
  <div class="p-2">
    <div class="flex justify-between mb-4">
      <div class="font-bold">Settings</div>

      <router-link to="/" class="hover:text-gray-200">Back</router-link>
    </div>

    <div class="space-y-5">
      <div class="flex space-x-4">
        <div>Bedwarsify Overlay v{{ version }}</div>

        <button
          @click="openExternal('https://bedwarsify.com')"
          class="hover:text-gray-200"
        >
          (Website)
        </button>

        <button
          @click="openExternal('https://docs.bedwarsify.com/overlay')"
          class="hover:text-gray-200"
        >
          (Docs)
        </button>

        <button
          @click="openExternal('https://discord.gg/XyEv5JQ53S')"
          class="hover:text-gray-200"
        >
          (Discord)
        </button>
      </div>

      <div>
        <div class="font-semibold mb-3">General</div>

        <div class="space-y-2">
          <div class="flex">
            <div class="mr-2">Account:</div>

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
            >
              <template v-slot="{ result: { loading, error, data } }">
                <template v-if="data">
                  <div class="flex" v-if="data.session">
                    <div class="mr-2">{{ $store.state.temp.name }}</div>

                    <div>
                      <img
                        :src="`https://crafatar.com/avatars/${data.session.user.minecraftId}?size=32&overlay`"
                        class="h-6"
                      />
                    </div>

                    <div>
                      <button
                        @click="logOut()"
                        class="ml-4 hover:text-gray-200"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>

                  <router-link to="/log-in" class="hover:text-gray-200" v-else>
                    Log In
                  </router-link>
                </template>
              </template>
            </apollo-query>
          </div>

          <div class="flex">
            <div class="mr-2">API Key (/api new):</div>

            <input
              type="password"
              class="bg-transparent border-b flex-grow max-w-xs"
              :value="$store.state.config.apiKey"
              @change="
                $store.commit('config/set', ['apiKey', $event.target.value])
              "
            />
          </div>

          <div class="flex">
            <div class="mr-2">Opacity:</div>

            <input
              type="range"
              min="0"
              max="1"
              :step="Number.MIN_VALUE"
              class="flex-grow max-w-xs"
              :value="$store.state.config.opacity"
              @input="
                $store.commit('config/set', ['opacity', $event.target.value])
              "
            />
          </div>

          <mode-select />

          <div class="flex items-center">
            <div class="mr-2">Show Dream Modes:</div>

            <input
              type="checkbox"
              :checked="$store.state.config.showDreamModes"
              @change="
                $store.commit('config/set', [
                  'showDreamModes',
                  !$store.state.config.showDreamModes,
                ])
              "
            />
          </div>

          <div class="flex items-center">
            <div class="mr-2">Show Guild Tag:</div>

            <input
              type="checkbox"
              :checked="$store.state.config.showGuildTag"
              @change="
                $store.commit('config/set', [
                  'showGuildTag',
                  !$store.state.config.showGuildTag,
                ])
              "
            />
          </div>

          <div class="flex items-center">
            <div class="mr-2">Hackers And Snipers On Top:</div>

            <input
              type="checkbox"
              :checked="$store.state.config.showHackersAndSnipersOnTop"
              @change="
                $store.commit('config/set', [
                  'showHackersAndSnipersOnTop',
                  !$store.state.config.showHackersAndSnipersOnTop,
                ])
              "
            />
          </div>
        </div>
      </div>

      <div>
        <div class="font-semibold mb-3">Log File</div>

        <div class="space-y-2">
          <div class="flex space-x-2 items-center">
            <div>Format:</div>

            <select
              class="bg-transparent"
              :value="$store.state.config.logFileFormat"
              @change="
                $store.commit('config/set', [
                  'logFileFormat',
                  $event.target.value,
                ])
              "
            >
              <option value="STANDARD" class="bg-gray-900">Standard</option>
            </select>
          </div>

          <div class="flex space-x-2 items-center">
            <div>Path Preset:</div>

            <select
              class="bg-transparent"
              :value="$store.state.config.logFilePathPreset"
              @change="
                $store.dispatch(
                  'config/setLogFilePathFromPreset',
                  $event.target.value
                )
              "
            >
              <option value="STANDARD" class="bg-gray-900">Standard</option>

              <option value="LUNAR_CLIENT" class="bg-gray-900">
                Lunar Client
              </option>

              <option value="BADLION_CLIENT" class="bg-gray-900">
                Badlion Client
              </option>

              <option value="PVPLOUNGE" class="bg-gray-900">PvPLounge</option>

              <option value="CUSTOM" class="bg-gray-900">Custom</option>
            </select>
          </div>

          <div
            class="flex space-x-2 items-center"
            v-if="$store.state.config.logFilePathPreset === 'CUSTOM'"
          >
            <div>Custom Path:</div>

            <button class="hover:text-gray-200" @click="setCustomPath()">
              Set
            </button>
          </div>

          <div class="flex space-x-2 items-center">
            <div>Valid Path:</div>

            <div
              v-if="$store.state.temp.logFilePathReadable"
              class="text-green-200"
            >
              Yes
            </div>

            <div
              v-else-if="$store.state.temp.logFilePathReadable === false"
              class="text-red-200"
            >
              No
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="font-semibold mb-3">Auto Add</div>

        <div class="space-y-2">
          <div
            class="flex items-center"
            v-for="entry in [
              {
                label: 'Players (/who):',
                key: 'autoAddPlayers',
              },
              {
                label: 'Party Members (/pl):',
                key: 'autoAddPartyMembers',
              },
              {
                label: 'Party Requests:',
                key: 'autoAddPartyRequests',
              },
              {
                label: 'Friend Requests:',
                key: 'autoAddFriendRequests',
              },
              {
                label: 'Lobby Chat:',
                key: 'autoAddLobbyChat',
              },
              {
                label: 'Chat Mentions:',
                key: 'autoAddMentions',
              },
              {
                label: 'Reconnected',
                key: 'autoAddReconnected',
              },
            ]"
            :key="entry.key"
          >
            <div class="mr-2">{{ entry.label }}</div>

            <input
              type="checkbox"
              :checked="$store.state.config[entry.key]"
              @change="
                $store.commit(`config/set`, [
                  entry.key,
                  !$store.state.config[entry.key],
                ])
              "
            />
          </div>
        </div>
      </div>

      <div>
        <div class="font-semibold mb-3">Auto Remove</div>

        <div class="space-y-2">
          <div
            class="flex items-center"
            v-for="entry in [
              {
                label: 'All on Server Change:',
                key: 'autoRemoveAllOnServerChange',
              },
              {
                label: 'All on /who:',
                key: 'autoRemoveAllOnWho',
              },
              {
                label: 'On Final Death',
                key: 'autoRemoveOnFinalDeath',
              },
              {
                label: 'Disconnected',
                key: 'autoRemoveDisconnected',
              },
            ]"
            :key="entry.key"
          >
            <div class="mr-2">{{ entry.label }}</div>

            <input
              type="checkbox"
              :checked="$store.state.config[entry.key]"
              @change="
                $store.commit(`config/set`, [
                  entry.key,
                  !$store.state.config[entry.key],
                ])
              "
            />
          </div>
        </div>
      </div>

      <div>
        <div class="font-semibold mb-3 flex items-center space-x-1">
          <span> Columns </span>

          <button @click="columnsVisible = !columnsVisible">
            <svg
              v-if="columnsVisible"
              class="w-5 h-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M7 8H5v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2h-2v-2H9v-2H7V8z"
                fill="currentColor"
              />
            </svg>

            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M7 16H5v-2h2v-2h2v-2h2V8h2v2h2v2h2v2h2v2h-2v-2h-2v-2h-2v-2h-2v2H9v2H7v2z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div class="flex flex-wrap" v-if="columnsVisible">
          <div v-for="(_, i) in columnsShownCount" :key="i">
            <select
              :value="$store.state.config.columns[i]"
              @change="
                $store.commit('config/setColumn', [i, $event.target.value])
              "
              class="bg-transparent m-2"
            >
              <option :value="null" class="bg-gray-900">None</option>

              <option
                v-for="[key, column] in Object.entries(columns)"
                :key="key"
                :value="key"
                class="bg-gray-900"
              >
                {{ column.displayName }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <div class="font-semibold mb-3">
          Keyboard Shortcuts

          <span class="text-red-300">[Beta]</span>
        </div>

        <div class="space-y-2">
          <div class="flex items-center">
            <div class="mr-2">Minimize/Unminimize:</div>

            <input
              @click="
                $store.commit('config/set', [
                  'keyboardShortcutMinimizeUnminize',
                  '',
                ])
              "
              @keydown="
                !$event.repeat &&
                  $store.commit('config/set', [
                    'keyboardShortcutMinimizeUnminize',
                    $store.state.config.keyboardShortcutMinimizeUnminize +
                      ($store.state.config.keyboardShortcutMinimizeUnminize !==
                      ''
                        ? '+'
                        : '') +
                      $event.key,
                  ])
              "
              @keyup="$event.target.blur()"
              :value="$store.state.config.keyboardShortcutMinimizeUnminize"
              class="bg-transparent border-b flex-grow max-w-[12rem]"
              spellcheck="false"
            />
          </div>

          <div class="flex items-center">
            <div class="mr-2">Clear Players:</div>

            <input
              @click="
                $store.commit('config/set', [
                  'keyboardShortcutClearPlayers',
                  '',
                ])
              "
              @keydown="
                !$event.repeat &&
                  $store.commit('config/set', [
                    'keyboardShortcutClearPlayers',
                    $store.state.config.keyboardShortcutClearPlayers +
                      ($store.state.config.keyboardShortcutClearPlayers !== ''
                        ? '+'
                        : '') +
                      $event.key,
                  ])
              "
              @keyup="$event.target.blur()"
              :value="$store.state.config.keyboardShortcutClearPlayers"
              class="bg-transparent border-b flex-grow max-w-[12rem]"
              spellcheck="false"
            />
          </div>
        </div>
      </div>

      <div>
        <div class="font-semibold mb-3 flex items-center space-x-1">
          <span> Sounds </span>

          <button @click="soundsVisible = !soundsVisible">
            <svg
              v-if="soundsVisible"
              class="w-5 h-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M7 8H5v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2h-2v-2H9v-2H7V8z"
                fill="currentColor"
              />
            </svg>

            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M7 16H5v-2h2v-2h2v-2h2V8h2v2h2v2h2v2h2v2h-2v-2h-2v-2h-2v-2h-2v2H9v2H7v2z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div class="space-y-3" v-if="soundsVisible">
          <div class="space-y-2">
            <div class="flex space-x-2 items-center">
              <div>Hackers and Snipers:</div>

              <select
                class="bg-transparent"
                :value="$store.state.config.hackersSnipersSoundEffect"
                @change="
                  $store.commit('config/set', [
                    'hackersSnipersSoundEffect',
                    $event.target.value,
                  ])
                "
              >
                <option :value="null" class="bg-gray-900">None</option>

                <option
                  v-for="[key, soundEffect] in Object.entries(soundEffects)"
                  :key="key"
                  :value="key"
                  class="bg-gray-900"
                >
                  {{ soundEffect.displayName }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="font-semibold mb-3 flex items-center space-x-1">
          <span> Font </span>

          <button @click="fontVisible = !fontVisible">
            <svg
              v-if="fontVisible"
              class="w-5 h-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M7 8H5v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2h-2v-2H9v-2H7V8z"
                fill="currentColor"
              />
            </svg>

            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M7 16H5v-2h2v-2h2v-2h2V8h2v2h2v2h2v2h2v2h-2v-2h-2v-2h-2v-2h-2v2H9v2H7v2z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div class="space-y-2" v-if="fontVisible">
          <div class="flex">
            <div class="mr-2">Size:</div>

            <input
              type="number"
              :value="$store.state.config.fontSize"
              @change="
                $store.commit('config/set', ['fontSize', $event.target.value])
              "
              class="bg-transparent border-b w-[3rem]"
            />

            px
          </div>

          <div class="flex">
            <div class="mr-2">Family Preset:</div>

            <select
              class="bg-transparent"
              :value="$store.state.config.fontFamilyPreset"
              @change="
                $store.commit('config/set', [
                  'fontFamilyPreset',
                  $event.target.value,
                ])
              "
            >
              <option value="MINECRAFT" class="bg-gray-900">Minecraft</option>

              <option value="SYSTEM_UI" class="bg-gray-900">System UI</option>

              <option value="CUSTOM" class="bg-gray-900">Custom</option>
            </select>
          </div>

          <div
            class="flex"
            v-if="$store.state.config.fontFamilyPreset === 'CUSTOM'"
          >
            <div class="mr-2">Custom Family:</div>

            <input
              class="bg-transparent border-b flex-grow max-w-[8rem]"
              :value="$store.state.config.fontFamilyCustom"
              @change="
                $store.commit('config/set', [
                  'fontFamilyCustom',
                  $event.target.value,
                ])
              "
            />
          </div>
        </div>
      </div>

      <div>
        <div class="font-semibold mb-3 flex items-center space-x-1">
          <span> Advanced </span>

          <button @click="advancedVisible = !advancedVisible">
            <svg
              v-if="advancedVisible"
              class="w-5 h-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M7 8H5v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2h-2v-2H9v-2H7V8z"
                fill="currentColor"
              />
            </svg>

            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M7 16H5v-2h2v-2h2v-2h2V8h2v2h2v2h2v2h2v2h-2v-2h-2v-2h-2v-2h-2v2H9v2H7v2z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div class="space-y-2" v-if="advancedVisible">
          <div class="flex items-center">
            <div class="mr-2">Set API Key From Cmd:</div>

            <input
              type="checkbox"
              :checked="$store.state.config.setApiKeyFromCmd"
              @change="
                $store.commit('config/set', [
                  'setApiKeyFromCmd',
                  !$store.state.config.setApiKeyFromCmd,
                ])
              "
            />
          </div>

          <div class="flex items-center">
            <div class="mr-2">Auto Report Snipers:</div>

            <input
              type="checkbox"
              :checked="$store.state.config.autoReportSnipers"
              @change="
                $store.commit('config/set', [
                  'autoReportSnipers',
                  !$store.state.config.autoReportSnipers,
                ])
              "
            />
          </div>

          <div class="flex items-center">
            <div class="mr-2">Short Tags:</div>

            <input
              type="checkbox"
              :checked="$store.state.config.shortTags"
              @change="
                $store.commit('config/set', [
                  'shortTags',
                  !$store.state.config.shortTags,
                ])
              "
            />
          </div>

          <div class="flex items-center">
            <div class="mr-2">Super Short Column Display Names:</div>

            <input
              type="checkbox"
              :checked="$store.state.config.superShortColumnDisplayNames"
              @change="
                $store.commit('config/set', [
                  'superShortColumnDisplayNames',
                  !$store.state.config.superShortColumnDisplayNames,
                ])
              "
            />
          </div>

          <div class="flex items-center">
            <div class="mr-2">Missing Players Warning:</div>

            <input
              type="checkbox"
              :checked="$store.state.config.missingPlayersWarning"
              @change="
                $store.commit('config/set', [
                  'missingPlayersWarning',
                  !$store.state.config.missingPlayersWarning,
                ])
              "
            />
          </div>

          <div class="flex">
            <div class="mr-2">Custom Background Color:</div>

            <input
              class="bg-transparent border-b flex-grow max-w-[8rem]"
              :value="$store.state.config.customBackgroundColor"
              @change="
                $store.commit('config/set', [
                  'customBackgroundColor',
                  $event.target.value,
                ])
              "
            />

            <button
              v-if="$store.state.config.customBackgroundColor !== '#18181b'"
              @click="
                $store.commit('config/set', [
                  'customBackgroundColor',
                  '#18181b',
                ])
              "
              class="ml-2"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onLogout } from '@/vue-apollo'
import Vue from 'vue'
import ModeSelect from '@/components/ModeSelect.vue'
import { columns } from '@/store'
import soundEffects from '@/sound-effects'

export default Vue.extend({
  components: { ModeSelect },
  data() {
    return {
      columnsVisible: false,
      soundsVisible: false,
      fontVisible: false,
      advancedVisible: false,
    }
  },
  computed: {
    version() {
      return process.env.VUE_APP_VERSION
    },
    columnsShownCount() {
      if (this.$store.state.config.columns[17]) {
        return 18
      }

      for (let i = 16; i >= 0; i--) {
        if (this.$store.state.config.columns[i]) {
          return i + 2
        }
      }

      return 1
    },
    columns() {
      return columns
    },
    soundEffects() {
      return soundEffects
    },
  },
  methods: {
    async logOut() {
      await onLogout(this.$apollo.getClient())
      await this.$store.dispatch('temp/updateName', this.$apollo.getClient())
    },
    async setCustomPath() {
      const openFileResult = await window.ipcRenderer.invoke('openFileLog')

      if (openFileResult.filePaths.length === 1) {
        this.$store.commit('config/set', [
          'logFilePath',
          openFileResult.filePaths[0],
        ])
      }
    },
    openExternal(url: string) {
      window.ipcRenderer.send('openExternal', url)
    },
  },
})
</script>
