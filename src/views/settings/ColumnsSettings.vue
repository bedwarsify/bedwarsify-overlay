<template>
  <div class="w-full h-full p-2 flex flex-col space-y-2">
    <div class="flex justify-between items-center p-1">
      <div class="text-lg font-bold leading-none flex space-x-1 items-center">
        Columns Settings
      </div>

      <router-link to="/settings" class="hover:bg-gray-700 p-1">
        <svg
          class="w-6 h-6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 3v18H3V3h18zM5 19h14V5H5v14zm12-8v2h-6v2H9v-2H7v-2h2V9h2v2h6zm-4-2h-2V7h2v2zm0 8v-2h-2v2h2z"
            fill="currentColor"
          />
        </svg>
      </router-link>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <select
        v-for="(column, i) of $store.state.config.columns"
        :key="i"
        :value="column"
        @change="$store.commit('config/setColumn', [i, $event.target.value])"
        class="
          flex-grow
          bg-transparent
          appearance-none
          border border-2
          m-3
          py-1
          px-3
          hover:bg-gray-700
          focus:bg-gray-700
        "
      >
        <option :value="null">None</option>

        <option
          v-for="[key, column] of Object.entries(columns)"
          :key="key"
          :value="key"
        >
          {{ column.displayName }}
        </option>
      </select>
    </div>

    <div class="p-3 flex space-x-8 items-center">
      <button
        @click="$store.commit('config/set', ['columns', defaultColumns])"
        class="border border-2 py-1 px-3 hover:bg-gray-700"
      >
        Reset
      </button>

      <div class="flex space-x-2 items-center">
        <div class="mr-2">Start:</div>

        <button
          @click="$store.commit('config/addColumnStart')"
          class="border border-2 py-1 px-3 hover:bg-gray-700"
        >
          Add
        </button>

        <button
          @click="$store.commit('config/removeColumnStart')"
          class="border border-2 py-1 px-3 hover:bg-gray-700"
        >
          Remove
        </button>
      </div>

      <div class="flex space-x-2 items-center">
        <div class="mr-2">End:</div>

        <button
          @click="$store.commit('config/addColumnEnd')"
          class="border border-2 py-1 px-3 hover:bg-gray-700"
        >
          Add
        </button>

        <button
          @click="$store.commit('config/removeColumnEnd')"
          class="border border-2 py-1 px-3 hover:bg-gray-700"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { columns, defaultColumns } from '@/store'

export default Vue.extend({
  computed: {
    columns() {
      return columns
    },
    defaultColumns() {
      return defaultColumns
    },
  },
})
</script>
