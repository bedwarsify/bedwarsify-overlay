<template>
  <div class="p-2">
    <div class="flex justify-between items-start mb-4">
      <div class="flex items-center space-x-4">
        <div class="font-bold">Tracking:</div>

        <div class="flex items-center space-x-2">
          <img
            :src="`https://crafatar.com/avatars/${player.id}?size=16`"
            alt=""
          />

          <select
            class="bg-transparent"
            :class="{
              'appearance-none': $store.state.temp.capturingScreenshot,
            }"
            :value="$route.params.playerId"
            @change="
              $router.push({
                name: 'TrackingPlayer',
                params: {
                  playerId: $event.target.value,
                },
              })
            "
          >
            <option
              v-for="player in $store.state.tracking.players"
              :key="player.id"
              :value="player.id"
              class="bg-gray-900"
            >
              {{ player.name }}
            </option>
          </select>
        </div>
      </div>

      <div>
        <div
          class="flex space-x-4 mb-2"
          v-if="!$store.state.temp.capturingScreenshot"
        >
          <button @click="load()" class="hover:text-gray-200">Refresh</button>

          <button @click="record()" class="hover:text-gray-200">
            Record Now
          </button>

          <button @click="captureScreenshot()" class="hover:text-gray-200">
            Copy Image
          </button>

          <router-link
            :to="{
              name: 'TrackingPlayerSettings',
              params: { playerId: player.id },
            }"
            class="hover:text-gray-200"
          >
            Settings
          </router-link>

          <router-link to="/tracking" class="hover:text-gray-200">
            Back
          </router-link>
        </div>

        <div class="flex justify-end items-center space-x-4">
          <div class="flex space-x-2 items-center">
            <div>Timeframe:</div>

            <select
              class="bg-transparent"
              :class="{
                'appearance-none': $store.state.temp.capturingScreenshot,
              }"
              v-model="timeframe"
            >
              <option :value="30 * 60 * 1000" class="bg-gray-900">
                Last 30 mins
              </option>
              <option :value="60 * 60 * 1000" class="bg-gray-900">
                Last 1 hour
              </option>
              <option :value="2 * 60 * 60 * 1000" class="bg-gray-900">
                Last 2 hours
              </option>
              <option :value="6 * 60 * 60 * 1000" class="bg-gray-900">
                Last 6 hours
              </option>
              <option :value="12 * 60 * 60 * 1000" class="bg-gray-900">
                Last 12 hours
              </option>
              <option :value="24 * 60 * 60 * 1000" class="bg-gray-900">
                Last 24 hours
              </option>
              <option :value="3 * 24 * 60 * 60 * 1000" class="bg-gray-900">
                Last 3 days
              </option>
              <option :value="7 * 24 * 60 * 60 * 1000" class="bg-gray-900">
                Last week
              </option>
              <option :value="2 * 7 * 24 * 60 * 60 * 1000" class="bg-gray-900">
                Last 2 weeks
              </option>
              <option :value="31 * 24 * 60 * 60 * 1000" class="bg-gray-900">
                Last month
              </option>
              <option :value="365 * 24 * 60 * 60 * 1000" class="bg-gray-900">
                Last year
              </option>
              <option :value="null" class="bg-gray-900">All time</option>
            </select>
          </div>

          <div class="flex space-x-2 items-center">
            <div>Mode:</div>

            <select
              v-model="mode"
              :class="{
                'appearance-none': $store.state.temp.capturingScreenshot,
              }"
              class="bg-transparent"
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
        </div>
      </div>
    </div>

    <div v-if="timeframeEndRecord">
      <div class="grid grid-cols-4 grid-rows-4 text-center">
        <div class="col-span-4 p-4 space-y-1">
          <div class="text-lg">
            {{
              (
                ((this.timeframeEndRecord &&
                  calculateLevel(
                    this.timeframeEndRecord.stats.Experience ||
                      this.timeframeEndRecord.stats.Experience_new ||
                      0
                  )) ||
                  0) -
                ((this.timeframeStartRecord &&
                  calculateLevel(
                    this.timeframeStartRecord.stats.Experience ||
                      this.timeframeStartRecord.stats.Experience_new ||
                      0
                  )) ||
                  0)
              ).toLocaleString(undefined, { maximumFractionDigits: 2 })
            }}
          </div>

          <div class="text-sm">Level</div>
        </div>

        <div class="p-4 space-y-1">
          <div class="text-lg">
            {{
              (
                (((this.timeframeEndRecord &&
                  this.timeframeEndRecord.stats[
                    modePrefix + 'final_kills_bedwars'
                  ]) ||
                  0) -
                  ((this.timeframeStartRecord &&
                    this.timeframeStartRecord.stats[
                      modePrefix + 'final_kills_bedwars'
                    ]) ||
                    0)) /
                (((this.timeframeEndRecord &&
                  this.timeframeEndRecord.stats[
                    modePrefix + 'final_deaths_bedwars'
                  ]) ||
                  0) -
                  ((this.timeframeStartRecord &&
                    this.timeframeStartRecord.stats[
                      modePrefix + 'final_deaths_bedwars'
                    ]) ||
                    0) || 1)
              ).toLocaleString(undefined, { maximumFractionDigits: 2 })
            }}
          </div>

          <div class="text-sm">FKDR</div>
        </div>

        <div class="p-4 space-y-1">
          <div class="text-lg">
            {{
              (
                (((this.timeframeEndRecord &&
                  this.timeframeEndRecord.stats[modePrefix + 'wins_bedwars']) ||
                  0) -
                  ((this.timeframeStartRecord &&
                    this.timeframeStartRecord.stats[
                      modePrefix + 'wins_bedwars'
                    ]) ||
                    0)) /
                (((this.timeframeEndRecord &&
                  this.timeframeEndRecord.stats[
                    modePrefix + 'losses_bedwars'
                  ]) ||
                  0) -
                  ((this.timeframeStartRecord &&
                    this.timeframeStartRecord.stats[
                      modePrefix + 'losses_bedwars'
                    ]) ||
                    0) || 1)
              ).toLocaleString(undefined, { maximumFractionDigits: 2 })
            }}
          </div>

          <div class="text-sm">WLR</div>
        </div>

        <div class="p-4 space-y-1">
          <div class="text-lg">
            {{
              (
                (((this.timeframeEndRecord &&
                  this.timeframeEndRecord.stats[
                    modePrefix + 'beds_broken_bedwars'
                  ]) ||
                  0) -
                  ((this.timeframeStartRecord &&
                    this.timeframeStartRecord.stats[
                      modePrefix + 'beds_broken_bedwars'
                    ]) ||
                    0)) /
                (((this.timeframeEndRecord &&
                  this.timeframeEndRecord.stats[
                    modePrefix + 'beds_lost_bedwars'
                  ]) ||
                  0) -
                  ((this.timeframeStartRecord &&
                    this.timeframeStartRecord.stats[
                      modePrefix + 'beds_lost_bedwars'
                    ]) ||
                    0) || 1)
              ).toLocaleString(undefined, { maximumFractionDigits: 2 })
            }}
          </div>

          <div class="text-sm">BBLR</div>
        </div>

        <div class="p-4 space-y-1">
          <div class="text-lg">
            {{
              (
                (((this.timeframeEndRecord &&
                  this.timeframeEndRecord.stats[
                    modePrefix + 'kills_bedwars'
                  ]) ||
                  0) -
                  ((this.timeframeStartRecord &&
                    this.timeframeStartRecord.stats[
                      modePrefix + 'kills_bedwars'
                    ]) ||
                    0)) /
                (((this.timeframeEndRecord &&
                  this.timeframeEndRecord.stats[
                    modePrefix + 'deaths_bedwars'
                  ]) ||
                  0) -
                  ((this.timeframeStartRecord &&
                    this.timeframeStartRecord.stats[
                      modePrefix + 'deaths_bedwars'
                    ]) ||
                    0) || 1)
              ).toLocaleString(undefined, { maximumFractionDigits: 2 })
            }}
          </div>

          <div class="text-sm">KDR</div>
        </div>

        <div class="p-4 space-y-1">
          <div class="text-lg">
            {{
              (
                ((this.timeframeEndRecord &&
                  this.timeframeEndRecord.stats[
                    modePrefix + 'final_kills_bedwars'
                  ]) ||
                  0) -
                ((this.timeframeStartRecord &&
                  this.timeframeStartRecord.stats[
                    modePrefix + 'final_kills_bedwars'
                  ]) ||
                  0)
              ).toLocaleString(undefined, { maximumFractionDigits: 2 })
            }}
          </div>

          <div class="text-sm">Final Kills</div>
        </div>

        <div class="p-4 space-y-1">
          <div class="text-lg">
            {{
              (
                ((this.timeframeEndRecord &&
                  this.timeframeEndRecord.stats[modePrefix + 'wins_bedwars']) ||
                  0) -
                ((this.timeframeStartRecord &&
                  this.timeframeStartRecord.stats[
                    modePrefix + 'wins_bedwars'
                  ]) ||
                  0)
              ).toLocaleString(undefined, { maximumFractionDigits: 2 })
            }}
          </div>

          <div class="text-sm">Wins</div>
        </div>

        <div class="p-4 space-y-1">
          <div class="text-lg">
            {{
              (
                ((this.timeframeEndRecord &&
                  this.timeframeEndRecord.stats[
                    modePrefix + 'beds_broken_bedwars'
                  ]) ||
                  0) -
                ((this.timeframeStartRecord &&
                  this.timeframeStartRecord.stats[
                    modePrefix + 'beds_broken_bedwars'
                  ]) ||
                  0)
              ).toLocaleString(undefined, { maximumFractionDigits: 2 })
            }}
          </div>

          <div class="text-sm">Beds Broken</div>
        </div>

        <div class="p-4 space-y-1">
          <div class="text-lg">
            {{
              (
                ((this.timeframeEndRecord &&
                  this.timeframeEndRecord.stats[
                    modePrefix + 'kills_bedwars'
                  ]) ||
                  0) -
                ((this.timeframeStartRecord &&
                  this.timeframeStartRecord.stats[
                    modePrefix + 'kills_bedwars'
                  ]) ||
                  0)
              ).toLocaleString(undefined, { maximumFractionDigits: 2 })
            }}
          </div>

          <div class="text-sm">Kills</div>
        </div>

        <div class="p-4 space-y-1">
          <div class="text-lg">
            {{
              (
                ((this.timeframeEndRecord &&
                  this.timeframeEndRecord.stats[
                    modePrefix + 'final_deaths_bedwars'
                  ]) ||
                  0) -
                ((this.timeframeStartRecord &&
                  this.timeframeStartRecord.stats[
                    modePrefix + 'final_deaths_bedwars'
                  ]) ||
                  0)
              ).toLocaleString(undefined, { maximumFractionDigits: 2 })
            }}
          </div>

          <div class="text-sm">Final Deaths</div>
        </div>

        <div class="p-4 space-y-1">
          <div class="text-lg">
            {{
              (
                ((this.timeframeEndRecord &&
                  this.timeframeEndRecord.stats[
                    modePrefix + 'losses_bedwars'
                  ]) ||
                  0) -
                ((this.timeframeStartRecord &&
                  this.timeframeStartRecord.stats[
                    modePrefix + 'losses_bedwars'
                  ]) ||
                  0)
              ).toLocaleString(undefined, { maximumFractionDigits: 2 })
            }}
          </div>

          <div class="text-sm">Losses</div>
        </div>

        <div class="p-4 space-y-1">
          <div class="text-lg">
            {{
              (
                ((this.timeframeEndRecord &&
                  this.timeframeEndRecord.stats[
                    modePrefix + 'beds_lost_bedwars'
                  ]) ||
                  0) -
                ((this.timeframeStartRecord &&
                  this.timeframeStartRecord.stats[
                    modePrefix + 'beds_lost_bedwars'
                  ]) ||
                  0)
              ).toLocaleString(undefined, { maximumFractionDigits: 2 })
            }}
          </div>

          <div class="text-sm">Beds Lost</div>
        </div>

        <div class="p-4 space-y-1">
          <div class="text-lg">
            {{
              (
                ((this.timeframeEndRecord &&
                  this.timeframeEndRecord.stats[
                    modePrefix + 'deaths_bedwars'
                  ]) ||
                  0) -
                ((this.timeframeStartRecord &&
                  this.timeframeStartRecord.stats[
                    modePrefix + 'deaths_bedwars'
                  ]) ||
                  0)
              ).toLocaleString(undefined, { maximumFractionDigits: 2 })
            }}
          </div>

          <div class="text-sm">Deaths</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TrackingPlayer } from '@/store'
import { db, record, Record } from '@/db'

function wait(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

export default Vue.extend({
  data() {
    return {
      timeframe: (60 * 60 * 1000) as number | null,
      timeframeStartRecord: null as Record | null,
      timeframeEndRecord: null as Record | null,
      mode: 'OVERALL' as
        | 'OVERALL'
        | 'EIGHT_ONE'
        | 'EIGHT_TWO'
        | 'FOUR_THREE'
        | 'FOUR_FOUR'
        | 'TWO_FOUR'
        | 'EIGHT_TWO_RUSH'
        | 'FOUR_FOUR_RUSH'
        | 'EIGHT_TWO_ULTIMATE'
        | 'FOUR_FOUR_ULTIMATE'
        | 'CASTLE'
        | 'EIGHT_TWO_VOIDLESS'
        | 'FOUR_FOUR_VOIDLESS'
        | 'EIGHT_TWO_ARMED'
        | 'FOUR_FOUR_ARMED'
        | 'EIGHT_TWO_LUCKY'
        | 'FOUR_FOUR_LUCKY',
    }
  },
  methods: {
    async load() {
      const timeframeStartRecord =
        this.timeframe !== null
          ? (
              await db.records
                .where('playerId')
                .equals(this.player.id)
                .and(
                  (record) =>
                    record.createdAt >= new Date(Date.now() - this.timeframe!)
                )
                .sortBy('createdAt')
            )[0]
          : null
      const timeframeEndRecord =
        (await db.records
          .orderBy('createdAt')
          .filter((record) => record.playerId === this.player.id)
          .reverse()
          .first()) || null

      this.timeframeStartRecord = timeframeStartRecord
      this.timeframeEndRecord = timeframeEndRecord
    },
    calculateLevel(experience: number) {
      let level = Math.floor(experience / 487000) * 100
      experience = experience % 487000
      if (experience < 500) return level + experience / 500
      level++
      if (experience < 1500) return level + (experience - 500) / 1000
      level++
      if (experience < 3500) return level + (experience - 1500) / 2000
      level++
      if (experience < 7000) return level + (experience - 3500) / 3500
      level++
      experience -= 7000
      return level + experience / 5000
    },
    async record() {
      await record(this.player.id)
    },
    async captureScreenshot() {
      this.$store.commit('temp/setCapturingScreenshot', true)
      await wait(50)
      await window.ipcRenderer.invoke('captureScreenshotToClipboard')
      await wait(50)
      this.$store.commit('temp/setCapturingScreenshot', false)
    },
  },
  computed: {
    player() {
      return this.$store.state.tracking.players.find(
        (player: TrackingPlayer) => player.id === this.$route.params.playerId
      )
    },
    modePrefix() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return this.mode === 'OVERALL' ? '' : this.mode.toLowerCase() + '_'
    },
  },
  async mounted() {
    await this.load()
  },
  watch: {
    async player() {
      await this.load()
    },
    async timeframe() {
      await this.load()
    },
  },
})
</script>
