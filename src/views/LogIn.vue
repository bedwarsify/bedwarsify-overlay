<template>
  <div class="p-2 flex justify-center items-center">
    <div v-if="status === 'IN_PROGRESS'">Logging In...</div>

    <div
      v-else-if="status === 'AUTH_FAILED'"
      class="flex flex-col text-center space-y-2"
    >
      <div class="font-semibold text-lg">Authentication Failed</div>

      <button class="hover:text-gray-200" @click="startAuth()">
        Try Again
      </button>

      <button @click="$router.go(-1)" class="hover:text-gray-200">Back</button>
    </div>

    <div
      v-else-if="status === 'NOT_LINKED'"
      class="flex flex-col text-center space-y-2"
    >
      <div class="font-semibold text-lg">Account Not Linked</div>

      <div>
        Before you can log in, you need to link your Discord account on our
        Discord server.
      </div>

      <button
        class="hover:text-gray-200"
        @click="openExternal('https://discord.gg/XyEv5JQ53S')"
      >
        Join Discord Server
      </button>

      <button class="hover:text-gray-200" @click="startAuth()">
        Try Again
      </button>

      <button @click="$router.go(-1)" class="hover:text-gray-200">Back</button>
    </div>
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import { onLogin } from '@/vue-apollo'

enum Status {
  IN_PROGRESS = 'IN_PROGRESS',
  AUTH_FAILED = 'AUTH_FAILED',
  NOT_LINKED = 'NOT_LINKED',
}

export default Vue.extend({
  data() {
    return {
      status: Status.IN_PROGRESS,
      code: null as string | null,
    }
  },
  mounted() {
    this.startAuth()

    window.ipcRenderer.on('discordAuthCode', (event, code: string) => {
      this.code = code
    })

    window.ipcRenderer.on('discordAuthEnd', async () => {
      if (this.status !== Status.IN_PROGRESS) return

      if (this.code === null) {
        this.status = Status.AUTH_FAILED
      } else {
        try {
          const mutation = await this.$apollo.mutate({
            mutation: gql`
              mutation ($discordCode: String!) {
                createSessionWithDiscordCode(
                  discordCode: $discordCode
                  type: OVERLAY
                ) {
                  id
                  secret
                  user {
                    id
                    minecraftId
                  }
                }
              }
            `,
            variables: {
              discordCode: this.code,
            },
          })

          this.code = null

          await onLogin(
            this.$apollo.getClient(),
            `${mutation.data.createSessionWithDiscordCode.id}.${mutation.data.createSessionWithDiscordCode.secret}`
          )
          await this.$store.dispatch(
            'temp/updateName',
            this.$apollo.getClient()
          )
          await this.$router.go(-1)
        } catch (error) {
          if (
            error.message ===
            'GraphQL error: This Discord account is not linked to any account'
          ) {
            this.status = Status.NOT_LINKED
          } else {
            this.status = Status.AUTH_FAILED
          }
        }
      }
    })
  },
  methods: {
    startAuth() {
      this.status = Status.IN_PROGRESS
      window.ipcRenderer.send('discordAuthStart')
    },
    openExternal(url: string) {
      window.ipcRenderer.send('openExternal', url)
    },
  },
})
</script>
