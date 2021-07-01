<template>
  <div
    v-if="
      !player.user ||
      (player.user.role !== 'DEVELOPER' &&
        player.user.role !== 'COMMUNITY_MANAGER')
    "
  >
    <button @click="active = true">
      <svg
        class="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
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

    <div
      v-if="active"
      class="absolute inset-0 flex justify-center items-center"
      @click.self="active = false"
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
                reportee {
                  id
                  minecraftId
                  role
                  customTagText
                  customTagColor
                  reportsSummary
                }
              }
            }
          `
        "
        :variables="{
          reporteeMinecraftId: player.id,
          reason,
        }"
        @done="done"
        class="bg-gray-900 p-4 flex flex-col justify-center max-w-xs"
      >
        <template v-slot="{ mutate, loading, error }">
          <div v-if="!error" class="space-y-2">
            <div class="font-bold">Report</div>

            <div class="flex flex-col justify-center">
              <div>Player: <player-name :player="player" /></div>

              <div>
                Reason:

                <select v-model="reason" class="bg-transparent">
                  <option value="HACKER" class="bg-gray-900">Hacker</option>
                  <option value="SNIPER" class="bg-gray-900">Sniper</option>
                </select>
              </div>
            </div>

            <button
              class="hover:text-gray-200"
              @click="mutate()"
              v-if="!loading"
            >
              Submit
            </button>

            <div v-else>Submitting...</div>
          </div>

          <div v-else class="text-red-300">
            {{ error.message.replace('GraphQL error: ', '') }}!
          </div>
        </template>
      </apollo-mutation>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Player } from '@/store'
import PlayerName from '@/components/PlayerName.vue'

export default Vue.extend({
  components: { PlayerName },
  data() {
    return {
      active: false,
      reason: 'HACKER',
    }
  },
  methods: {
    done(result: any) {
      this.active = false

      this.$store.commit('temp/updatePlayerByName', [
        this.player.name,
        {
          ...this.player,
          user: result.data.createReport.reportee,
        },
      ])
    },
  },
  props: {
    player: {
      type: Object as PropType<Player>,
      required: true,
    },
  },
})
</script>
