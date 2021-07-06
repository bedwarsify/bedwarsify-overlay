<template>
  <div>
    <div class="w-full h-full">
      <div v-if="$store.state.temp.apiKeyValid" class="w-full h-full flex">
        <players />
      </div>

      <div
        v-else-if="$store.state.temp.apiKeyValid === false"
        class="
          w-full
          h-full
          flex flex-col
          justify-center
          items-center
          space-y-6
        "
      >
        <div class="space-y-2 flex flex-col items-center">
          <div class="font-semibold text-red-600 text-xl">
            <template v-if="$store.state.config.apiKey !== ''">
              Invalid API Key!
            </template>

            <template v-else>No API Key Set!</template>
          </div>

          <div
            v-if="
              $store.state.config.setApiKeyFromCmd &&
              $store.state.temp.logFilePathReadable
            "
            class="text-lg"
          >
            Type /api new
          </div>
        </div>

        <div
          v-if="!$store.state.temp.logFilePathReadable"
          class="text-red-600 font-semibold"
        >
          Log file path invalid!
        </div>

        <div class="flex flex-col space-y-2 items-center">
          <router-link to="/settings" class="hover:text-gray-200">
            Go To Settings
          </router-link>

          <button
            @click="
              openExternal(
                'https://docs.bedwarsify.com/overlay/getting-started'
              )
            "
            class="hover:text-gray-200 flex space-x-1 items-center"
          >
            <span>Getting Started Guide</span>

            <svg
              class="w-4 h-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Players from '@/components/Players.vue'

export default {
  components: { Players },
  methods: {
    openExternal(url: string) {
      window.ipcRenderer.send('openExternal', url)
    },
  },
}
</script>
