<template>
  <div
    class="w-full h-full flex flex-col justify-center items-center space-y-6"
  >
    <div v-if="status === 'IN_PROGRESS'" class="text-xl font-bold">
      Logging In...
    </div>

    <template v-else>
      <div
        v-if="status === 'NOT_LINKED'"
        class="flex flex-col justify-center items-center space-y-3"
      >
        <div class="text-xl font-bold text-discord-blurple">Not Linked</div>

        <div>
          Before you can log in, you must first link your account in our Discord
          server.
        </div>
      </div>

      <div
        v-else-if="status === 'AUTH_FAILED'"
        class="text-xl font-bold text-red-500"
      >
        Authentication Failed
      </div>

      <div class="flex space-x-3">
        <div
          v-if="status === 'NOT_LINKED'"
          class="
            border border-2
            py-1
            px-3
            hover:bg-gray-700
            text-discord-blurple
            border-discord-blurple
          "
          @click="openExternal('https://discord.gg/neypgUkchH')"
        >
          Discord
        </div>

        <div
          class="border border-2 py-1 px-3 hover:bg-gray-700"
          @click="start()"
        >
          Try Again
        </div>

        <div
          class="
            border border-2 border-gray-300
            text-gray-300
            py-1
            px-3
            hover:bg-gray-700
          "
          @click="$router.go(-1)"
        >
          Back
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import { onLogin } from '@/vue-apollo'
import { IpcRendererEvent } from 'electron'

enum Status {
  IN_PROGRESS = 'IN_PROGRESS',
  NOT_LINKED = 'NOT_LINKED',
  AUTH_FAILED = 'AUTH_FAILED',
}

export default Vue.extend({
  data() {
    return {
      status: Status.IN_PROGRESS,
      code: null as string | null,
    }
  },
  methods: {
    start() {
      this.code = null
      this.status = Status.IN_PROGRESS
      window.ipcRenderer.send('discordAuthStart')
    },
    onCode(event: IpcRendererEvent, code: string) {
      this.code = code
    },
    async onEnd() {
      if (this.code === null) {
        this.status = Status.AUTH_FAILED
      } else {
        try {
          const mutation = await this.$apollo.mutate({
            mutation: gql`
              mutation ($code: String!) {
                createSession(code: $code, type: OVERLAY, provider: DISCORD) {
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
              code: this.code,
            },
          })

          await onLogin(
            this.$apollo.getClient(),
            `${mutation.data.createSession.id}.${mutation.data.createSession.secret}`
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
    },
    openExternal(url: string) {
      window.ipcRenderer.send('openExternal', url)
    },
  },
  created() {
    window.ipcRenderer.on('discordAuthCode', this.onCode)
    window.ipcRenderer.on('discordAuthEnd', this.onEnd)
    this.start()
  },
  beforeDestroy() {
    window.ipcRenderer.removeAllListeners('discordAuthCode')
    window.ipcRenderer.removeAllListeners('discordAuthEnd')
  },
})
</script>
