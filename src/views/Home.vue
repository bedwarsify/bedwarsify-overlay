<template>
  <div class="w-full h-full">
    <div class="w-full h-full">
      <div v-if="$store.state.temp.apiKeyValid" class="w-full h-full flex">
        <app-main />
      </div>

      <div
        v-else-if="$store.state.temp.apiKeyValid === false"
        class="
          w-full
          h-full
          flex flex-col
          justify-center
          items-center
          space-y-3
        "
      >
        <div class="font-semibold text-red-600 text-xl">
          <template v-if="$store.state.config.apiKey !== ''">
            Invalid API Key!
          </template>

          <template v-else>No API Key Set!</template>
        </div>

        <div v-if="$store.state.config.setApiKeyFromCmd" class="text-lg">
          Use /api new
        </div>

        <router-link to="/settings" class="hover:text-gray-200">
          Go To Settings
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import AppMain from '@/components/AppMain'

export default {
  components: { AppMain },
}
</script>
