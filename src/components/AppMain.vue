<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex justify-between mb-4 p-2">
      <div>
        <input
          type="text"
          class="bg-transparent border-b"
          v-model.trim="manualAddPlayerName"
          @keypress.enter="manualAddPlayer()"
        />
      </div>

      <div class="flex space-x-4">
        <div v-if="$store.state.temp.nick !== null">
          Nick: {{ $store.state.temp.nick }}
        </div>

        <div class="flex space-x-2 items-center">
          <div>Mode:</div>

          <select
            class="bg-transparent"
            :value="$store.state.config.mode"
            @change="$store.commit('config/set', ['mode', $event.target.value])"
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

        <button
          @click="$store.commit('temp/clearPlayers')"
          class="hover:text-gray-200"
        >
          Clear Players
        </button>

        <router-link to="/settings" class="hover:text-gray-200">
          Settings
        </router-link>
      </div>
    </div>

    <div class="flex-grow p-2 pt-0">
      <table class="w-full table-auto text-center">
        <thead>
          <tr>
            <th>Tag</th>

            <th
              v-for="column in [
                'Player (Level)',
                'WS',
                'FKDR',
                'WLR',
                'Finals',
                'Wins',
                'Index',
              ]"
              :key="column"
            >
              <button
                @click="
                  $store.state.config.sortBy ===
                  (column === 'Player (Level)' ? 'LEVEL' : column.toUpperCase())
                    ? $store.commit('config/set', [
                        'sortAscending',
                        !$store.state.config.sortAscending,
                      ])
                    : $store.commit('config/set', [
                        'sortBy',
                        column === 'Player (Level)'
                          ? 'LEVEL'
                          : column.toUpperCase(),
                      ])
                "
                class="
                  font-bold
                  hover:text-gray-200
                  flex
                  justify-center
                  w-full
                  items-center
                  space-x-1
                "
              >
                <span>{{ column }}</span>

                <template
                  v-if="
                    $store.state.config.sortBy ===
                    (column === 'Player (Level)'
                      ? 'LEVEL'
                      : column.toUpperCase())
                  "
                >
                  <svg
                    v-if="$store.state.config.sortAscending"
                    class="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <svg
                    v-else
                    class="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </template>
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="player in playersSorted" :key="player.name">
            <template v-if="player.nicked">
              <td class="text-green-500">[NICKED]</td>
              <td>{{ player.name }}</td>
              <td v-for="i in 6" :key="i">?</td>
            </template>

            <template v-else-if="player.hypixelPlayer">
              <td>
                <apollo-query
                  :query="
                    (gql) => gql`
                      query ($minecraftId: ID!) {
                        userByMinecraftId(minecraftId: $minecraftId) {
                          id
                          minecraftId
                          role
                          customTagText
                          customTagColor
                          reportsSummary
                        }
                      }
                    `
                  "
                  :variables="{
                    minecraftId: player.id,
                  }"
                  v-if="player.id"
                >
                  <template v-slot="{ result: { data } }">
                    <template
                      v-if="
                        data && data.userByMinecraftId && data.userByMinecraftId
                      "
                    >
                      <template>
                        <span
                          v-if="data.userByMinecraftId.customTagText"
                          :style="
                            'color: #' +
                            (data.userByMinecraftId.customTagColor || 0xffffff)
                              .toString(16)
                              .padStart(6, '0')
                          "
                        >
                          [{{ data.userByMinecraftId.customTagText }}]
                        </span>

                        <span
                          v-if="data.userByMinecraftId.role === 'DEVELOPER'"
                          class="text-blue-500"
                        >
                          [DEV]
                        </span>

                        <span
                          v-else-if="
                            data.userByMinecraftId.role === 'COMMUNITY_MANAGER'
                          "
                          class="text-yellow-500"
                        >
                          [CM]
                        </span>

                        <span
                          v-else-if="data.userByMinecraftId.role === 'PARTNER'"
                          class="text-green-500"
                        >
                          [P]
                        </span>

                        <span
                          v-else-if="
                            data.userByMinecraftId.role === 'NITRO_BOOSTER'
                          "
                          class="text-pink-500"
                        >
                          [NB]
                        </span>
                      </template>

                      <template>
                        <span
                          v-if="
                            data.userByMinecraftId.reportsSummary ===
                            'POTENTIAL_HACKER'
                          "
                          class="text-red-300"
                        >
                          [HACKER?]
                        </span>

                        <span
                          v-else-if="
                            data.userByMinecraftId.reportsSummary === 'HACKER'
                          "
                          class="text-red-700"
                        >
                          [HACKER]
                        </span>

                        <span
                          v-else-if="
                            data.userByMinecraftId.reportsSummary ===
                            'POTENTIAL_SNIPER'
                          "
                          class="text-red-300"
                        >
                          [SNIPER?]
                        </span>

                        <span
                          v-else-if="
                            data.userByMinecraftId.reportsSummary === 'SNIPER'
                          "
                          class="text-red-700"
                        >
                          [SNIPER]
                        </span>
                      </template>
                    </template>
                  </template>
                </apollo-query>
              </td>

              <td class="inline-flex space-x-1 justify-center">
                <span
                  v-if="
                    player.hypixelBedwarsLevelInfo &&
                    player.hypixelBedwarsLevelInfo.level >= 1000
                  "
                  class="inline-flex"
                >
                  <span
                    :class="
                      'text-minecraft-' +
                      prestigeFromLevel(player.hypixelBedwarsLevelInfo.level)
                        .colors[0]
                    "
                  >
                    [
                  </span>

                  <span
                    :class="
                      'text-minecraft-' +
                      prestigeFromLevel(player.hypixelBedwarsLevelInfo.level)
                        .colors[1]
                    "
                  >
                    {{ player.hypixelBedwarsLevelInfo.level.toString()[0] }}
                  </span>

                  <span
                    :class="
                      'text-minecraft-' +
                      prestigeFromLevel(player.hypixelBedwarsLevelInfo.level)
                        .colors[2]
                    "
                  >
                    {{ player.hypixelBedwarsLevelInfo.level.toString()[1] }}
                  </span>

                  <span
                    :class="
                      'text-minecraft-' +
                      prestigeFromLevel(player.hypixelBedwarsLevelInfo.level)
                        .colors[3]
                    "
                  >
                    {{ player.hypixelBedwarsLevelInfo.level.toString()[2] }}
                  </span>

                  <span
                    :class="
                      'text-minecraft-' +
                      prestigeFromLevel(player.hypixelBedwarsLevelInfo.level)
                        .colors[4]
                    "
                  >
                    {{ player.hypixelBedwarsLevelInfo.level.toString()[3] }}
                  </span>

                  <span
                    :class="
                      'text-minecraft-' +
                      prestigeFromLevel(player.hypixelBedwarsLevelInfo.level)
                        .colors[5]
                    "
                  >
                    {{
                      prestigeStarFromLevel(
                        player.hypixelBedwarsLevelInfo.level
                      ).star
                    }}
                  </span>

                  <span
                    :class="
                      'text-minecraft-' +
                      prestigeFromLevel(player.hypixelBedwarsLevelInfo.level)
                        .colors[6]
                    "
                  >
                    ]
                  </span>
                </span>

                <span
                  v-else
                  :style="{
                    color:
                      '#' +
                      ((player.hypixelBedwarsLevelInfo &&
                        player.hypixelBedwarsLevelInfo.prestigeColorHex) ||
                        'aaaaaa'),
                  }"
                >
                  [{{
                    (player.hypixelBedwarsLevelInfo &&
                      player.hypixelBedwarsLevelInfo.level) ||
                    '0'
                  }}✫]
                </span>

                <span
                  v-if="player.hypixelPlayer.prefix"
                  :style="'color: #' + player.hypixelPlayerRank.colorHex"
                >
                  {{ player.hypixelPlayer.prefix.replace(/§./g, '') }}
                  {{ player.hypixelPlayer.displayname }}
                </span>

                <span
                  v-else-if="player.hypixelPlayer.rank === 'GAME_MASTER'"
                  class="text-minecraft-green"
                >
                  [GM] {{ player.hypixelPlayer.displayname }}
                </span>

                <span
                  v-else-if="player.hypixelPlayerRank.cleanName === 'YOUTUBER'"
                  class="inline-flex"
                >
                  <span class="text-minecraft-red">[</span>
                  <span class="text-minecraft-white">YOUTUBE</span>
                  <span class="text-minecraft-red"
                    >] {{ player.hypixelPlayer.displayname }}</span
                  >
                </span>

                <span
                  v-else-if="player.hypixelPlayerRank.cleanName.includes('+')"
                  :class="[
                    'inline-flex',

                    player.hypixelPlayerRank.cleanName === 'MVP++'
                      ? 'text-minecraft-' +
                        (player.hypixelPlayer.monthlyRankColor || 'gold')
                          .toLowerCase()
                          .replace('_', '-')
                      : '',
                  ]"
                  :style="
                    player.hypixelPlayerRank.cleanName !== 'MVP++'
                      ? 'color: #' + player.hypixelPlayerRank.colorHex
                      : ''
                  "
                >
                  <span>
                    {{
                      player.hypixelPlayerRank.cleanPrefix.replace(/\+.+$/, '')
                    }}
                  </span>

                  <span
                    :class="
                      'text-minecraft-' +
                      (player.hypixelPlayer.rankPlusColor || 'gold')
                        .toLowerCase()
                        .replace('_', '-')
                    "
                  >
                    <template
                      v-if="player.hypixelPlayerRank.cleanName === 'MVP++'"
                    >
                      ++
                    </template>

                    <template v-else> + </template>
                  </span>

                  <span>] {{ player.hypixelPlayer.displayname }}</span>
                </span>

                <span
                  :style="{ color: '#' + player.hypixelPlayerRank.colorHex }"
                  v-else
                >
                  {{
                    player.hypixelPlayerRank.cleanPrefix !== ''
                      ? player.hypixelPlayerRank.cleanPrefix + ' '
                      : ''
                  }}{{ player.hypixelPlayer.displayname }}
                </span>

                <span
                  v-if="
                    $store.state.config.showGuildTag &&
                    player.hypixelGuild &&
                    player.hypixelGuild.tag
                  "
                  :class="
                    'text-minecraft-' +
                    (player.hypixelGuild.tagColor || 'gray')
                      .toLowerCase()
                      .replace('_', '-')
                  "
                >
                  [{{ player.hypixelGuild.tag }}]
                </span>
              </td>

              <template
                v-if="
                  player.hypixelPlayer.stats &&
                  player.hypixelPlayer.stats.Bedwars
                "
              >
                <td
                  v-for="stat in [
                    {
                      value:
                        player.hypixelPlayer.stats.Bedwars[
                          $store.getters['config/modePrefix'] + 'winstreak'
                        ],
                      colorSteps: [0, 5, 15, 25, 50, 75, 175, 250],
                    },
                    {
                      value:
                        player.hypixelPlayer.stats.Bedwars[
                          $store.getters['config/modePrefix'] +
                            'final_kills_bedwars'
                        ] /
                        Math.max(
                          player.hypixelPlayer.stats.Bedwars[
                            $store.getters['config/modePrefix'] +
                              'final_deaths_bedwars'
                          ],
                          1
                        ),
                      colorSteps: [0, 2, 4, 6, 10, 15, 25, 50],
                    },
                    {
                      value:
                        player.hypixelPlayer.stats.Bedwars[
                          $store.getters['config/modePrefix'] + 'wins_bedwars'
                        ] /
                        Math.max(
                          player.hypixelPlayer.stats.Bedwars[
                            $store.getters['config/modePrefix'] +
                              'losses_bedwars'
                          ],
                          1
                        ),
                      colorSteps: [0, 1, 2, 3, 5, 7, 12, 25],
                    },
                    {
                      value:
                        player.hypixelPlayer.stats.Bedwars[
                          $store.getters['config/modePrefix'] +
                            'final_kills_bedwars'
                        ],
                      colorSteps: [
                        0, 1000, 2500, 4000, 8000, 12000, 48000, 100000,
                      ],
                    },
                    {
                      value:
                        player.hypixelPlayer.stats.Bedwars[
                          $store.getters['config/modePrefix'] + 'wins_bedwars'
                        ],
                      colorSteps: [0, 250, 500, 750, 1000, 1500, 5000, 10000],
                    },
                    {
                      value:
                        ((player.hypixelBedwarsLevelInfo &&
                          player.hypixelBedwarsLevelInfo.level) ||
                          0) *
                        (player.hypixelPlayer.stats.Bedwars[
                          $store.getters['config/modePrefix'] +
                            'final_kills_bedwars'
                        ] /
                          Math.max(
                            player.hypixelPlayer.stats.Bedwars[
                              $store.getters['config/modePrefix'] +
                                'final_deaths_bedwars'
                            ],
                            1
                          )) **
                          2,
                      colorSteps: [
                        0, 1000, 2500, 4000, 10000, 100000, 250000, 1000000,
                      ],
                    },
                  ]"
                  :key="JSON.stringify(stat.colorSteps)"
                  :class="
                    colorCodeValue(stat.value, stat.colorSteps) ||
                    'text-minecraft-gray'
                  "
                >
                  {{
                    (stat.value &&
                      stat.value.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })) ||
                    '0'
                  }}
                </td>

                <td>
                  <apollo-query
                    :query="
                      (gql) => gql`
                        query ($minecraftId: ID!) {
                          userByMinecraftId(minecraftId: $minecraftId) {
                            id
                            minecraftId
                            role
                            reportsSummary
                          }
                        }
                      `
                    "
                    :variables="{
                      minecraftId: player.id,
                    }"
                    v-if="player.id"
                    class="flex justify-center items-center"
                  >
                    <template v-slot="{ result: { data } }">
                      <button
                        v-if="
                          !player.hypixelPlayerRank.staff &&
                          player.hypixelPlayerRank.cleanName !== 'YOUTUBER' &&
                          !(
                            data &&
                            data.userByMinecraftId &&
                            ['DEVELOPER', 'COMMUNITY_MANAGER'].includes(
                              data.userByMinecraftId.role
                            )
                          )
                        "
                        @click="
                          reportName = player.name
                          reportModal = true
                        "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    </template>
                  </apollo-query>
                </td>
              </template>

              <td v-else v-for="i in 6" :key="i">0</td>
            </template>

            <template v-else>
              <td>...</td>
              <td>{{ player.name }}</td>
              <td v-for="i in 6" :key="i">...</td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="bg-red-600 p-2 flex space-x-2"
      v-if="$store.state.temp.logFilePathReadable === false"
    >
      <div class="font-semibold">Log File Path Invalid!</div>

      <router-link to="/settings" class="hover:text-gray-200">
        Go To Settings
      </router-link>
    </div>

    <div
      class="
        absolute
        left-0
        top-0
        w-full
        h-full
        flex
        justify-center
        items-center
      "
      v-if="reportModal"
      @click.self="reportModal = false"
    >
      <div
        class="bg-gray-900 p-4 max-w-sm"
        :style="{
          '--tw-bg-opacity': Math.min($store.state.config.opacity * 2, 1),
        }"
      >
        <apollo-mutation
          :mutation="
            (gql) => gql`
              mutation ($reporteeMinecraftId: String!, $reason: ReportReason!) {
                createReport(
                  reporteeMinecraftId: $reporteeMinecraftId
                  reason: $reason
                ) {
                  id
                }
              }
            `
          "
          :variables="{
            reporteeMinecraftId: reportPlayer.id,
            reason: reportReason,
          }"
          @done="reportModal = false"
        >
          <template v-slot="{ mutate, loading, error }">
            <div class="space-y-3" v-if="!error && !loading">
              <div class="font-semibold text-center">Report</div>

              <div>
                <div class="flex space-x-2">
                  <div>User:</div>

                  <div>
                    <span
                      v-if="reportPlayer.hypixelBedwarsLevelInfo !== null"
                      :style="{
                        color:
                          '#' +
                          ((reportPlayer.hypixelBedwarsLevelInfo &&
                            reportPlayer.hypixelBedwarsLevelInfo
                              .prestigeColorHex) ||
                            'aaaaaa'),
                      }"
                    >
                      [{{
                        (reportPlayer.hypixelBedwarsLevelInfo &&
                          reportPlayer.hypixelBedwarsLevelInfo.level) ||
                        '0'
                      }}]
                    </span>

                    <span
                      :style="{
                        color: '#' + reportPlayer.hypixelPlayerRank.colorHex,
                      }"
                    >
                      {{
                        reportPlayer.hypixelPlayerRank.cleanPrefix !== ''
                          ? reportPlayer.hypixelPlayerRank.cleanPrefix + ' '
                          : ''
                      }}{{ reportPlayer.hypixelPlayer.displayname }}
                    </span>
                  </div>
                </div>

                <div class="flex space-x-2">
                  <div>Reason:</div>

                  <select v-model="reportReason" class="bg-transparent">
                    <option value="HACKER" class="bg-gray-900">Hacker</option>
                    <option value="SNIPER" class="bg-gray-900">Sniper</option>
                  </select>
                </div>
              </div>

              <div class="flex justify-center">
                <button
                  class="hover:text-gray-200"
                  :disabled="loading"
                  @click="mutate()"
                >
                  Submit
                </button>
              </div>
            </div>

            <template v-else-if="loading"> Submitting report... </template>

            <div v-else-if="error" class="text-red-300">
              <template
                v-if="
                  error.message === 'GraphQL error: Authentication required'
                "
              >
                You must log in to be able to report users!
              </template>

              <template
                v-else-if="error.message === 'GraphQL error: You cannot report'"
              >
                You cannot report!
              </template>

              <template
                v-else-if="
                  error.message === 'GraphQL error: You cannot report yourself'
                "
              >
                You cannot report yourself!
              </template>

              <template
                v-else-if="
                  error.message ===
                    'GraphQL error: You cannot report this user' ||
                  error.message ===
                    'GraphQL error: You cannot report staff or youtubers' ||
                  error.message ===
                    'GraphQL error: You can only report players who are not more than half your level'
                "
              >
                You cannot report this user!
              </template>

              <template
                v-else-if="
                  error.message ===
                  'GraphQL error: You have already reported this user'
                "
              >
                You have already reported this user!
              </template>

              <template
                v-else-if="
                  error.message ===
                    'GraphQL error: You must be at least Bed Wars level 50 to report players' ||
                  error.message ===
                    'You must be at least level 50 to report players'
                "
              >
                You must be at least Bed Wars level 50 to report players!
              </template>

              <template
                v-else-if="
                  error.message ===
                  'GraphQL error: You cannot submit any more reports at the moment'
                "
              >
                You cannot submit any more reports at the moment!
              </template>

              <template
                v-else-if="
                  error.message ===
                  'GraphQL error: You have already reported this user'
                "
              >
                You have already reported this user!
              </template>

              <template
                v-else-if="
                  error.message ===
                  'GraphQL error: You have already reported this user'
                "
              >
                You have already reported this user!
              </template>

              <template v-else> An unknown error has occurred! </template>
            </div>
          </template>
        </apollo-mutation>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      manualAddPlayerName: '',
      reportModal: false,
      reportName: null as string | null,
      reportReason: 'HACKER' as 'HACKER' | 'SNIPER',
      prestiges: [
        {
          threshold: 1000,
          colors: [
            'red',
            'gold',
            'yellow',
            'green',
            'aqua',
            'light-purple',
            'dark-purple',
          ],
        },
        {
          threshold: 1100,
          colors: [
            'gray',
            ...new Array(4).fill('white'),
            ...new Array(2).fill('gray'),
          ],
        },
        {
          threshold: 1200,
          colors: ['gray', ...new Array(4).fill('yellow'), 'gold', 'gray'],
        },
        {
          threshold: 1300,
          colors: ['gray', ...new Array(4).fill('aqua'), 'dark-aqua', 'gray'],
        },
        {
          threshold: 1400,
          colors: ['gray', ...new Array(4).fill('green'), 'dark-green', 'gray'],
        },
        {
          threshold: 1500,
          colors: ['gray', ...new Array(4).fill('dark-aqua'), 'blue', 'gray'],
        },
        {
          threshold: 1600,
          colors: ['gray', ...new Array(4).fill('red'), 'dark-red', 'gray'],
        },
        {
          threshold: 1700,
          colors: [
            'gray',
            ...new Array(4).fill('light-purple'),
            'dark-purple',
            'gray',
          ],
        },
        {
          threshold: 1800,
          colors: ['gray', ...new Array(4).fill('blue'), 'dark-blue', 'gray'],
        },
        {
          threshold: 1900,
          colors: [
            'gray',
            ...new Array(4).fill('dark-purple'),
            'dark-gray',
            'gray',
          ],
        },
        {
          threshold: 2000,
          colors: [
            'dark-gray',
            'gray',
            ...new Array(2).fill('white'),
            ...new Array(2).fill('gray'),
            'dark-gray',
          ],
        },
        {
          threshold: 2100,
          colors: [
            ...new Array(2).fill('white'),
            ...new Array(2).fill('yellow'),
            ...new Array(3).fill('gold'),
          ],
        },
        {
          threshold: 2200,
          colors: [
            ...new Array(2).fill('gold'),
            ...new Array(2).fill('white'),
            'aqua',
            ...new Array(2).fill('dark-aqua'),
          ],
        },
        {
          threshold: 2300,
          colors: [
            ...new Array(2).fill('dark-purple'),
            ...new Array(2).fill('light-purple'),
            'gold',
            ...new Array(2).fill('yellow'),
          ],
        },
        {
          threshold: 2400,
          colors: [
            ...new Array(2).fill('aqua'),
            ...new Array(2).fill('white'),
            ...new Array(2).fill('gray'),
            'dark-gray',
          ],
        },
        {
          threshold: 2500,
          colors: [
            ...new Array(2).fill('white'),
            ...new Array(2).fill('green'),
            ...new Array(3).fill('dark-green'),
          ],
        },
        {
          threshold: 2600,
          colors: [
            ...new Array(2).fill('dark-red'),
            ...new Array(2).fill('red'),
            ...new Array(2).fill('light-purple'),
            'dark-purple',
          ],
        },
        {
          threshold: 2700,
          colors: [
            ...new Array(2).fill('dark-red'),
            ...new Array(2).fill('red'),
            ...new Array(2).fill('light-purple'),
            'dark-purple',
          ],
        },
        {
          threshold: 2800,
          colors: [
            ...new Array(2).fill('green'),
            ...new Array(2).fill('dark-green'),
            ...new Array(2).fill('gold'),
            'yellow',
          ],
        },
        {
          threshold: 2900,
          colors: [
            ...new Array(2).fill('aqua'),
            ...new Array(2).fill('dark-aqua'),
            ...new Array(2).fill('blue'),
            'dark-blue',
          ],
        },
        {
          threshold: 3000,
          colors: [
            ...new Array(2).fill('yellow'),
            ...new Array(2).fill('gold'),
            ...new Array(2).fill('red'),
            'dark-red',
          ],
        },
      ],
      prestigesStars: [
        {
          threshold: 0,
          star: '✫',
        },
        {
          threshold: 1100,
          star: '✪',
        },
        {
          threshold: 2100,
          star: '❀',
        },
      ],
    }
  },
  computed: {
    playersSorted() {
      return [...this.$store.state.temp.players].sort((a, b) => {
        if (
          (!a.nicked && a.hypixelPlayer === null) ||
          (!b.nicked && b.hypixelPlayer === null)
        ) {
          if (
            !a.nicked &&
            a.hypixelPlayer === null &&
            !b.nicked &&
            b.hypixelPlayer === null
          ) {
            return a.name.localeCompare(b.name)
          } else if (!a.nicked && a.hypixelPlayer === null) {
            return 1
          } else if (!b.nicked && b.hypixelPlayer === null) {
            return -1
          }
        } else if (a.nicked || b.nicked) {
          if (a.nicked && b.nicked) {
            return a.name.localeCompare(b.name)
          } else if (a.nicked) {
            return -1
          } else if (b.nicked) {
            return 1
          }
        } else {
          return (
            (() => {
              if (this.$store.state.config.sortBy === 'LEVEL') {
                return (
                  (b.hypixelBedwarsLevelInfo?.level ?? 0) -
                  (a.hypixelBedwarsLevelInfo?.level ?? 0)
                )
              } else if (this.$store.state.config.sortBy === 'WS') {
                return (
                  (b.hypixelPlayer?.stats?.Bedwars?.[
                    this.$store.getters['config/modePrefix'] + 'winstreak'
                  ] ?? 0) -
                  (a.hypixelPlayer?.stats?.Bedwars?.[
                    this.$store.getters['config/modePrefix'] + 'winstreak'
                  ] ?? 0)
                )
              } else if (this.$store.state.config.sortBy === 'FKDR') {
                return (
                  (b.hypixelPlayer?.stats?.Bedwars?.[
                    this.$store.getters['config/modePrefix'] +
                      'final_kills_bedwars'
                  ] ?? 0) /
                    (b.hypixelPlayer?.stats?.Bedwars?.[
                      this.$store.getters['config/modePrefix'] +
                        'final_deaths_bedwars'
                    ] || 1) -
                  (a.hypixelPlayer?.stats?.Bedwars?.[
                    this.$store.getters['config/modePrefix'] +
                      'final_kills_bedwars'
                  ] ?? 0) /
                    (a.hypixelPlayer?.stats?.Bedwars?.[
                      this.$store.getters['config/modePrefix'] +
                        'final_deaths_bedwars'
                    ] || 1)
                )
              } else if (this.$store.state.config.sortBy === 'WLR') {
                return (
                  (b.hypixelPlayer?.stats?.Bedwars?.[
                    this.$store.getters['config/modePrefix'] + 'wins_bedwars'
                  ] ?? 0) /
                    (b.hypixelPlayer?.stats?.Bedwars?.[
                      this.$store.getters['config/modePrefix'] +
                        'losses_bedwars'
                    ] || 1) -
                  (a.hypixelPlayer?.stats?.Bedwars?.[
                    this.$store.getters['config/modePrefix'] + 'wins_bedwars'
                  ] ?? 0) /
                    (a.hypixelPlayer?.stats?.Bedwars?.[
                      this.$store.getters['config/modePrefix'] +
                        'losses_bedwars'
                    ] || 1)
                )
              } else if (this.$store.state.config.sortBy === 'FINALS') {
                return (
                  (b.hypixelPlayer?.stats?.Bedwars?.[
                    this.$store.getters['config/modePrefix'] +
                      'final_kills_bedwars'
                  ] ?? 0) -
                  (a.hypixelPlayer?.stats?.Bedwars?.[
                    this.$store.getters['config/modePrefix'] +
                      'final_kills_bedwars'
                  ] ?? 0)
                )
              } else if (this.$store.state.config.sortBy === 'WINS') {
                return (
                  (b.hypixelPlayer?.stats?.Bedwars?.[
                    this.$store.getters['config/modePrefix'] + 'wins_bedwars'
                  ] ?? 0) -
                  (a.hypixelPlayer?.stats?.Bedwars?.[
                    this.$store.getters['config/modePrefix'] + 'wins_bedwars'
                  ] ?? 0)
                )
              } else {
                return (
                  (b.hypixelBedwarsLevelInfo?.level || 0) *
                    ((b.hypixelPlayer?.stats?.Bedwars?.[
                      this.$store.getters['config/modePrefix'] +
                        'final_kills_bedwars'
                    ] ?? 0) /
                      (b.hypixelPlayer?.stats?.Bedwars?.[
                        this.$store.getters['config/modePrefix'] +
                          'final_deaths_bedwars'
                      ] || 1)) **
                      2 -
                  (a.hypixelBedwarsLevelInfo?.level || 0) *
                    ((a.hypixelPlayer?.stats?.Bedwars?.[
                      this.$store.getters['config/modePrefix'] +
                        'final_kills_bedwars'
                    ] ?? 0) /
                      (a.hypixelPlayer?.stats?.Bedwars?.[
                        this.$store.getters['config/modePrefix'] +
                          'final_deaths_bedwars'
                      ] || 1)) **
                      2
                )
              }
            })() * (this.$store.state.config.sortAscending ? -1 : 1)
          )
        }
      })
    },
    reportPlayer() {
      return this.$store.state.temp.players.find(
        (player: any) => player.name === this.reportName
      )
    },
  },
  methods: {
    prestigeFromLevel(level: number) {
      for (const prestige of [...this.prestiges].reverse()) {
        if (level >= prestige.threshold) {
          return prestige
        }
      }

      return null
    },
    prestigeStarFromLevel(level: number) {
      for (const prestigeStar of [...this.prestigesStars].reverse()) {
        if (level >= prestigeStar.threshold) {
          return prestigeStar
        }
      }

      return null
    },
    manualAddPlayer() {
      this.$store.dispatch('temp/addPlayerName', this.manualAddPlayerName)
      this.manualAddPlayerName = ''
    },
    colorCodeValue(value: number, steps: number[]) {
      const classNamesSteps = [
        ['text-minecraft-gray', steps[0]],
        ['text-minecraft-white', steps[1]],
        ['text-minecraft-green', steps[2]],
        ['text-minecraft-dark-green', steps[3]],
        ['text-minecraft-red', steps[4]],
        ['text-minecraft-dark-red', steps[5]],
        ['text-minecraft-light-purple', steps[6]],
        ['text-minecraft-dark-purple', steps[7]],
      ] as [string, number][]

      let finalClassName = ''

      for (const [className, step] of classNamesSteps) {
        if (value >= step) {
          finalClassName = className
        } else {
          break
        }
      }

      return finalClassName
    },
  },
})
</script>
