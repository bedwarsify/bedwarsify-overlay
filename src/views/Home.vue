<template>
  <div>
    <div class="w-full h-full">
      <players v-if="$store.state.temp.launchSettingsVisible === false" />

      <launch-settings
        v-else-if="$store.state.temp.launchSettingsVisible === true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Players from '@/views/Players.vue'
import LaunchSettings from '@/views/LaunchSettings.vue'

export default {
  components: { LaunchSettings, Players },
  methods: {
    openExternal(url: string) {
      window.ipcRenderer.send('openExternal', url)
    },
  },
}
</script>
