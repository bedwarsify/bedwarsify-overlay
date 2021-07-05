<template>
  <div class="p-2">
    <div class="flex justify-between mb-4">
      <div class="font-bold">Tracking</div>

      <router-link to="/" class="hover:text-gray-200">Back</router-link>
    </div>

    <div class="space-y-3">
      <div
        v-for="player in [...$store.state.tracking.players].sort((a, b) =>
          a.name.localeCompare(b.name)
        )"
        :key="player.id"
        class="flex space-x-5 items-center p-1"
      >
        <router-link
          :to="{ name: 'TrackingPlayer', params: { playerId: player.id } }"
          class="flex-grow hover:text-gray-200 flex items-center space-x-5"
        >
          <img
            :src="`https://crafatar.com/avatars/${player.id}?size=32&overlay`"
            alt=""
          />
          <div class="flex-grow">{{ player.name }}</div>
        </router-link>

        <button
          @click="$store.commit('tracking/removePlayer', player.id)"
          class="hover:text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div class="flex space-x-3">
        <input
          type="text"
          placeholder="Player Name"
          class="bg-transparent border-b"
          :class="{ 'text-red-400': invalidAddPlayerName }"
          v-model.trim="addPlayerName"
          @input="invalidAddPlayerName = false"
          @keypress.enter="addPlayer()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AxiosResponse } from 'axios'

export default Vue.extend({
  data() {
    return {
      addPlayerName: '',
      invalidAddPlayerName: false,
    }
  },
  methods: {
    async addPlayer() {
      if (!/^[A-Za-z0-9_]{1,16}$/.test(this.addPlayerName)) {
        this.invalidAddPlayerName = true
        return
      }

      const minecraftProfile: AxiosResponse<{
        id: string
        name: string
      }> = await window.ipcRenderer.invoke(
        'axios',
        `https://api.mojang.com/users/profiles/minecraft/${this.addPlayerName}`,
        undefined,
        [200, 204, 404]
      )

      if (minecraftProfile.status === 204 || minecraftProfile.status === 404) {
        this.invalidAddPlayerName = true
      } else {
        this.$store.commit('tracking/addPlayer', [
          minecraftProfile.data.id,
          minecraftProfile.data.name,
        ])

        this.addPlayerName = ''
        this.invalidAddPlayerName = false
      }
    },
  },
})
</script>
