<template>
  <div>
    <div class="drag flex justify-between">
      <div class="flex items-center">
        <div class="p-2">
          <img src="../assets/icon.svg" alt="" class="w-6 h-6" />
        </div>

        <div class="font-semibold">Bedwarsify Overlay</div>
      </div>

      <div v-if="!$store.state.temp.capturingScreenshot">
        <button class="no-drag p-2 hover:bg-gray-700" @click="minimize()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <button class="no-drag p-2 hover:bg-gray-700" @click="close()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    minimize(): void {
      window.ipcRenderer.send('winMinimize')
    },
    close(): void {
      window.ipcRenderer.send('winClose')
    },
  },
}
</script>

<style>
.drag {
  -webkit-app-region: drag;
}

.no-drag {
  -webkit-app-region: no-drag;
}
</style>
