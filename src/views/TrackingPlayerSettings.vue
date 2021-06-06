<template>
  <div class="p-2">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-4">
        <div class="font-bold">Tracking Settings:</div>

        <div class="flex items-center space-x-2">
          <img
            :src="`https://crafatar.com/avatars/${player.id}?size=16`"
            alt=""
          />

          <div>{{ player.name }}</div>
        </div>
      </div>

      <div class="flex space-x-4">
        <router-link
          :to="{
            name: 'TrackingPlayer',
            params: { playerId: player.id },
          }"
          class="hover:text-gray-200"
        >
          Back
        </router-link>
      </div>
    </div>

    <div>
      <div class="font-semibold mb-3">Auto Record</div>

      <div class="space-y-2">
        <div class="flex items-center">
          <div class="mr-2">On Launch:</div>

          <input
            type="checkbox"
            :checked="player.autoRecord.onLaunch"
            @change="
              $store.commit('tracking/updatePlayer', [
                player.id,
                {
                  ...player,
                  autoRecord: {
                    ...player.autoRecord,
                    onLaunch: !player.autoRecord.onLaunch,
                  },
                },
              ])
            "
          />
        </div>

        <div class="flex items-center">
          <div class="mr-2">After Game End:</div>

          <input
            type="checkbox"
            :checked="player.autoRecord.afterGameEnd"
            @change="
              $store.commit('tracking/updatePlayer', [
                player.id,
                {
                  ...player,
                  autoRecord: {
                    ...player.autoRecord,
                    afterGameEnd: !player.autoRecord.afterGameEnd,
                  },
                },
              ])
            "
          />
        </div>

        <div class="flex items-center">
          <div class="mr-2">Interval:</div>

          <select
            :value="player.autoRecord.interval"
            @change="
              $store.commit('tracking/updatePlayer', [
                player.id,
                {
                  ...player,
                  autoRecord: {
                    ...player.autoRecord,
                    interval: $event.target.value,
                  },
                },
              ])
            "
            class="bg-transparent"
          >
            <option :value="5 * 60 * 1000" class="bg-gray-900">
              Every 5 minutes
            </option>

            <option :value="15 * 60 * 1000" class="bg-gray-900">
              Every 15 minutes
            </option>

            <option :value="30 * 60 * 1000" class="bg-gray-900">
              Every 30 minutes
            </option>

            <option :value="45 * 60 * 1000" class="bg-gray-900">
              Every 45 minutes
            </option>

            <option :value="60 * 60 * 1000" class="bg-gray-900">
              Every 1 hour
            </option>

            <option :value="null" class="bg-gray-900">Never</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TrackingPlayer } from '@/store'

export default Vue.extend({
  computed: {
    player() {
      return this.$store.state.tracking.players.find(
        (player: TrackingPlayer) => player.id === this.$route.params.playerId
      )
    },
  },
})
</script>
