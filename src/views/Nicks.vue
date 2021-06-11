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
        /^[A-Za-z0-9_]{3,16}$/.test(this.addNickNick) &&
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        /^[A-Za-z0-9_]{3,16}$/.test(this.addNickName)
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
