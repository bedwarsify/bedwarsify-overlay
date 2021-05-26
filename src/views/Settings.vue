<template>
  <div class="p-2 flex-grow">
    <div class="flex justify-between mb-4">
      <div class="font-bold">Settings</div>

      <router-link to="/" class="hover:text-gray-200">Back</router-link>
    </div>

    <div class="space-y-5">
      <div class="flex space-x-4">
        <div>Bedwarsify Overlay v1.0.0</div>

        <button
          @click="openExternal('https://bedwarsify.com')"
          class="hover:text-gray-200"
        >
          (Website)
        </button>

        <button
          @click="openExternal('https://discord.gg/EMgB7nrNJm')"
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
                <template v-if="data !== null">
                  <div class="flex" v-if="data.session !== null">
                    <div class="mr-2">{{ $store.state.temp.name }}</div>

                    <div>
                      <img
                        :src="`https://crafatar.com/avatars/${data.session.user.minecraftId}?size=32`"
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

          <div class="flex space-x-2 items-center">
            <div>Mode:</div>

            <select
              class="bg-transparent"
              :value="$store.state.config.mode"
              @change="
                $store.commit('config/set', ['mode', $event.target.value])
              "
            >
              <option value="OVERALL" class="bg-gray-900">Overall</option>
              <option value="EIGHT_ONE" class="bg-gray-900">Solo</option>
              <option value="EIGHT_TWO" class="bg-gray-900">Doubles</option>
              <option value="FOUR_THREE" class="bg-gray-900">3v3v3v3</option>
              <option value="FOUR_FOUR" class="bg-gray-900">4v4v4v4</option>
              <option value="TWO_FOUR" class="bg-gray-900">4v4</option>

              <template v-if="$store.state.config.showDreamModes">
                <option value="EIGHT_TWO_RUSH" class="bg-gray-900">
                  Rush Doubles
                </option>
                <option value="FOUR_FOUR_RUSH" class="bg-gray-900">
                  Rush 4v4v4v4
                </option>
                <option value="EIGHT_TWO_ULTIMATE" class="bg-gray-900">
                  Ultimate Doubles
                </option>
                <option value="FOUR_FOUR_ULTIMATE" class="bg-gray-900">
                  Ultimate 4v4v4v4
                </option>
                <option value="CASTLE" class="bg-gray-900">Castle</option>
                <option value="EIGHT_TWO_VOIDLESS" class="bg-gray-900">
                  Voidless Doubles
                </option>
                <option value="FOUR_FOUR_VOIDLESS" class="bg-gray-900">
                  Voidless 4v4v4v4
                </option>
                <option value="EIGHT_TWO_ARMED" class="bg-gray-900">
                  Armed Doubles
                </option>
                <option value="FOUR_FOUR_ARMED" class="bg-gray-900">
                  Armed 4v4v4v4
                </option>
                <option value="EIGHT_TWO_LUCKY" class="bg-gray-900">
                  Lucky Blocks Doubles
                </option>
                <option value="FOUR_FOUR_LUCKY" class="bg-gray-900">
                  Lucky Blocks 4v4v4v4
                </option>
              </template>
            </select>
          </div>

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
            <div class="mr-2">Unnick Yourself:</div>

            <input
              type="checkbox"
              :checked="$store.state.config.unnickYourself"
              @change="
                $store.commit('config/set', [
                  'unnickYourself',
                  !$store.state.config.unnickYourself,
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

              <option value="LABYMOD" class="bg-gray-900">LabyMod</option>
            </select>
          </div>

          <div class="flex space-x-2 items-center">
            <div>Path Preset:</div>

            <select
              class="bg-transparent"
              :value="$store.state.config.logFilePathPreset"
              @change="
                $store.commit('config/set', [
                  'logFilePathPreset',
                  $event.target.value,
                ])
              "
            >
              <option value="STANDARD" class="bg-gray-900">Standard</option>

              <option value="LUNAR_CLIENT" class="bg-gray-900">
                Lunar Client
              </option>

              <option value="BADLION_CLIENT" class="bg-gray-900">
                Badlion Client
              </option>

              <option value="LABYMOD" class="bg-gray-900">LabyMod</option>

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
        <div class="font-semibold mb-3">Advanced</div>

        <div class="space-y-2">
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
            <div class="mr-2">Auto Detect Own Nick on Join:</div>

            <input
              type="checkbox"
              :checked="$store.state.config.autoDetectOwnNickOnJoin"
              @change="
                $store.commit('config/set', [
                  'autoDetectOwnNickOnJoin',
                  !$store.state.config.autoDetectOwnNickOnJoin,
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onLogout } from '@/vue-apollo'
import Vue from 'vue'

export default Vue.extend({
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
