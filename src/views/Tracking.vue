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
            class="w-6 h-6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M4 11h16v2H4z" />
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
