<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex-grow p-2 pt-0 mt-2">
      <table class="w-full table-auto text-center">
        <thead>
          <tr>
            <th
              v-for="columnKey in $store.getters['config/activeColumns']"
              :key="columnKey"
            >
              <button
                @click="switchSort(columnKey)"
                v-if="columns[columnKey].sort !== 'NONE'"
                class="
                  hover:text-gray-200
                  font-bold
                  flex
                  justify-center
                  w-full
                  items-center
                  space-x-1
                "
              >
                <span>
                  {{
                    ($store.state.config.superShortColumnDisplayNames &&
                      columns[columnKey].superShortDisplayName) ||
                    columns[columnKey].shortDisplayName ||
                    columns[columnKey].displayName
                  }}
                </span>

                <template v-if="$store.state.config.sortBy === columnKey">
                  <svg
                    v-if="$store.state.config.sortAscending"
                    class="h-4 w-4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M7 16H5v-2h2v-2h2v-2h2V8h2v2h2v2h2v2h2v2h-2v-2h-2v-2h-2v-2h-2v2H9v2H7v2z"
                      fill="currentColor"
                    />
                  </svg>

                  <svg
                    v-else
                    class="w-4 h-4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M7 8H5v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2h-2v-2H9v-2H7V8z"
                      fill="currentColor"
                    />
                  </svg>
                </template>
              </button>

              <template v-else>
                {{
                  ($store.state.config.superShortColumnDisplayNames &&
                    columns[columnKey].superShortDisplayName) ||
                  columns[columnKey].shortDisplayName ||
                  columns[columnKey].displayName
                }}
              </template>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="player in sortedPlayers" :key="player.name">
            <td
              v-for="columnKey in $store.getters['config/activeColumns']"
              :key="columnKey"
              :style="{
                color:
                  '#' +
                  (player.hypixelPlayer
                    ? (columns[columnKey].color === 'PROVIDED'
                        ? columns[columnKey].getColor(
                            player,
                            $store.getters['config/modePrefix']
                          )
                        : columns[columnKey].color === 'COLOR_CODING'
                        ? colorCode(
                            columns[columnKey].getSortValue(
                              player,
                              $store.getters['config/modePrefix']
                            ),
                            columns[columnKey].colorCodingThresholds
                          )
                        : 0xffffff
                      )
                        .toString(16)
                        .padStart(6, '0')
                    : 'ffffff'),
              }"
              class="text-center"
            >
              <template v-if="player.hypixelPlayer">
                <template v-if="columns[columnKey].customDisplay">
                  <player-name :player="player" v-if="columnKey === 'NAME'" />

                  <player-level
                    :player="player"
                    v-else-if="columnKey === 'LEVEL'"
                  />

                  <img
                    :src="`https://crafatar.com/avatars/${player.id}?size=16&overlay`"
                    alt=""
                    v-else-if="columnKey === 'HEAD'"
                    class="inline-flex"
                  />
                </template>

                <template v-else>
                  <template v-if="columns[columnKey].formatNumber">
                    {{
                      (columns[columnKey].getDisplayValue
                        ? columns[columnKey].getDisplayValue(
                            player,
                            $store.getters['config/modePrefix']
                          )
                        : columns[columnKey].getSortValue(
                            player,
                            $store.getters['config/modePrefix']
                          )
                      ).toLocaleString(undefined, { maximumFractionDigits: 2 })
                    }}
                  </template>

                  <template v-else>
                    {{
                      columns[columnKey].getDisplayValue
                        ? columns[columnKey].getDisplayValue(
                            player,
                            $store.getters['config/modePrefix'],
                            {
                              shortTags: $store.state.config.shortTags,
                            }
                          )
                        : columns[columnKey].getSortValue(
                            player,
                            $store.getters['config/modePrefix']
                          )
                    }}
                  </template>
                </template>
              </template>

              <template v-else-if="player.nicked">
                <template v-if="columnKey === 'NAME'">
                  {{ player.name }}
                </template>

                <span v-else-if="columnKey === 'TAG'" class="text-green-500">
                  {{ $store.state.config.shortTags ? '[N]' : '[NICKED]' }}
                </span>

                <template v-else> ? </template>
              </template>

              <template v-else>
                <template v-if="columnKey === 'NAME'">
                  {{ player.name }}
                </template>

                <template v-else> ... </template>
              </template>
            </td>

            <td v-if="player.hypixelPlayer">
              <report-modal :player="player" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="p-2 bg-red-600"
      :style="$store.getters['config/opacityStyle']"
      v-if="missingPlayersWarning"
    >
      Missing Players! Type /who
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Column,
  columns,
  Player,
  PlayerSource,
  ReportsSummary,
  Sort,
} from '@/store'
import PlayerName from '@/components/PlayerName.vue'
import PlayerLevel from '@/components/PlayerLevel.vue'
import ReportModal from '@/components/ReportModal.vue'

export default Vue.extend({
  components: { ReportModal, PlayerLevel, PlayerName },
  data: () => ({
    manualAddPlayerName: '',
  }),
  computed: {
    columns() {
      return columns
    },
    sortedPlayers() {
      return [...this.$store.state.temp.players].sort((a, b) => {
        if (b.nicked && !a.nicked) {
          return 1
        } else if (a.nicked && !b.nicked) {
          return -1
        } else if (a.nicked && b.nicked) {
          return a.name.localeCompare(b.name)
        } else if (b.hypixelPlayer && !a.hypixelPlayer) {
          return 1
        } else if (a.hypixelPlayer && !b.hypixelPlayer) {
          return -1
        } else if (a.hypixelPlayer && b.hypixelPlayer) {
          if (this.$store.state.config.showHackersAndSnipersOnTop) {
            if (
              new Set([ReportsSummary.HACKER, ReportsSummary.SNIPER]).has(
                b.user?.reportsSummary
              ) &&
              !new Set([ReportsSummary.HACKER, ReportsSummary.SNIPER]).has(
                a.user?.reportsSummary
              )
            ) {
              return 1
            } else if (
              new Set([ReportsSummary.HACKER, ReportsSummary.SNIPER]).has(
                a.user?.reportsSummary
              ) &&
              !new Set([ReportsSummary.HACKER, ReportsSummary.SNIPER]).has(
                b.user?.reportsSummary
              )
            ) {
              return -1
            } else if (
              new Set([
                ReportsSummary.POTENTIAL_HACKER,
                ReportsSummary.POTENTIAL_SNIPER,
              ]).has(b.user?.reportsSummary) &&
              !new Set([
                ReportsSummary.POTENTIAL_HACKER,
                ReportsSummary.POTENTIAL_SNIPER,
              ]).has(a.user?.reportsSummary)
            ) {
              return 1
            } else if (
              new Set([
                ReportsSummary.POTENTIAL_HACKER,
                ReportsSummary.POTENTIAL_SNIPER,
              ]).has(a.user?.reportsSummary) &&
              !new Set([
                ReportsSummary.POTENTIAL_HACKER,
                ReportsSummary.POTENTIAL_SNIPER,
              ]).has(b.user?.reportsSummary)
            ) {
              return -1
            }
          }

          const sortColumn = columns[this.$store.state.config.sortBy]

          if (sortColumn.sort === Sort.VALUE) {
            return (
              (sortColumn.getSortValue(
                b,
                this.$store.getters['config/modePrefix']
              ) -
                sortColumn.getSortValue(
                  a,
                  this.$store.getters['config/modePrefix']
                )) *
              (this.$store.state.config.sortAscending ? -1 : 1)
            )
          } else if (sortColumn.sort === Sort.ALPHABETICALLY) {
            return (
              sortColumn
                .getSortValue(b, this.$store.getters['config/modePrefix'])
                .localeCompare(
                  sortColumn.getSortValue(
                    a,
                    this.$store.getters['config/modePrefix']
                  )
                ) * (this.$store.state.config.sortAscending ? -1 : 1)
            )
          }
        } else {
          return a.name.localeCompare(b.name)
        }
      })
    },
    missingPlayersWarning() {
      if (
        !this.$store.state.config.missingPlayersWarning ||
        !this.$store.state.temp.playersCount
      )
        return false

      if (
        this.$store.state.temp.playersCount >
        this.$store.state.temp.players.filter(
          (player: Player) => player.source === PlayerSource.PLAYERS
        ).length
      ) {
        return true
      } else {
        return false
      }
    },
  },
  methods: {
    manualAddPlayer() {
      this.$store.dispatch('temp/addPlayerName', [
        this.manualAddPlayerName,
        this.$apollo.getClient(),
      ])
      this.manualAddPlayerName = ''
    },
    switchSort(column: Column) {
      if (this.$store.state.config.sortBy === column) {
        this.$store.commit('config/set', [
          'sortAscending',
          !this.$store.state.config.sortAscending,
        ])
      } else {
        this.$store.commit('config/set', ['sortBy', column])
        this.$store.commit('config/set', ['sortAscending', false])
      }
    },
    colorCode(
      value: number,
      colorCodingThresholds: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number
      ]
    ) {
      const colors = [
        0xaaaaaa, 0xffffff, 0x55ff55, 0x00aa00, 0xff5555, 0xaa0000, 0xff55ff,
        0xaa00aa,
      ]

      const thresholdsColors = colorCodingThresholds.map((threshold, i) => [
        threshold,
        colors[i],
      ])

      for (const [threshold, color] of [...thresholdsColors].reverse()) {
        if (value >= threshold) {
          return color
        }
      }

      return colors[0]
    },
  },
})
</script>
