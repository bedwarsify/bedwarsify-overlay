<template>
  <div class="p-2">
    <div class="flex justify-between mb-4">
      <div class="font-bold">Nicks</div>

      <router-link to="/" class="hover:text-gray-200">Back</router-link>
    </div>

    <div class="space-y-3">
      <div
        v-for="nick in [...$store.state.nicks.nicks].sort((a, b) =>
          a.nick.localeCompare(b.nick)
        )"
        :key="nick.id"
        class="flex space-x-5 items-center p-1"
      >
        <div class="flex-1">{{ nick.nick }}</div>
        <div class="flex-1">{{ nick.name }}</div>

        <button
          @click="$store.commit('nicks/removeNick', nick.id)"
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
          placeholder="Nick"
          class="bg-transparent border-b"
          v-model.trim="addNickNick"
          @keypress.enter="addNick()"
        />

        <input
          type="text"
          placeholder="Name"
          class="bg-transparent border-b"
          v-model.trim="addNickName"
          @keypress.enter="addNick()"
        />

        <button
          @click="addNick()"
          class="hover:text-gray-200"
          :disabled="!addNickValid"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid'

export default Vue.extend({
  data() {
    return {
      addNickNick: '',
      addNickName: '',
    }
  },
  computed: {
    addNickValid() {
      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        /^[A-Za-z0-9_]{1,16}$/.test(this.addNickNick) &&
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        /^[A-Za-z0-9_]{1,16}$/.test(this.addNickName)
      )
    },
  },
  methods: {
    addNick() {
      this.$store.commit('nicks/addNick', [
        uuid.v4(),
        this.addNickNick,
        this.addNickName,
      ])
      this.addNickNick = ''
      this.addNickName = ''
    },
  },
})
</script>
