<template>
  <div
    class="w-screen h-screen text-white flex flex-col select-none p-px"
    :class="{ 'text-shadow': $store.state.config.textShadow }"
    :style="{
      'font-family': $store.getters['config/fontFamily'],
      'background-color': $store.getters['config/backgroundColor'],
    }"
  >
    <title-bar />

    <router-view class="overflow-auto flex-grow" />
  </div>
</template>

<script lang="ts">
import TitleBar from '@/components/TitleBar.vue'
import Vue from 'vue'
import gql from 'graphql-tag'
import { record } from '@/db'
import uuid from 'uuid'
import { Nick, Player, PlayerSource } from '@/store'

export default Vue.extend({
  data() {
    return {
      recordIntervalsIds: [] as number[],
    }
  },
  components: { TitleBar },
  methods: {
    async updateApiKeyValid() {
      this.$store.commit('temp/setApiKeyValid', null)

      try {
        await window.ipcRenderer.invoke(
          'hypixel',
          this.$store.state.config.apiKey,
          'key'
        )

        this.$store.commit('temp/setApiKeyValid', true)
      } catch (error) {
        this.$store.commit('temp/setApiKeyValid', false)
      }
    },
    async updateLogFilePathReadable() {
      this.$store.commit('temp/setLogFilePathReadable', null)

      if (
        await window.ipcRenderer.invoke(
          'fileReadable',
          this.$store.state.config.logFilePath
        )
      ) {
        this.$store.commit('temp/setLogFilePathReadable', true)
        await window.ipcRenderer.send(
          'logFileSet',
          this.$store.state.config.logFilePath
        )
      } else {
        this.$store.commit('temp/setLogFilePathReadable', false)
      }
    },
    updateRootFontSize() {
      document.documentElement.style.fontSize = `${this.$store.state.config.fontSize}px`
    },
    async registerGlobalShortcuts() {
      const shortcuts = [
        this.$store.state.config.keyboardShortcutMinimizeUnminize,
        this.$store.state.config.keyboardShortcutClearPlayers,
      ].filter((shortcut) => shortcut !== '')

      await window.ipcRenderer.invoke('registerGlobalShortcuts', shortcuts)
    },
  },
  watch: {
    async '$store.state.config.apiKey'() {
      await this.updateApiKeyValid()
    },
    async '$store.state.config.logFilePath'() {
      await window.ipcRenderer.send('logFileSet', null)
      await this.updateLogFilePathReadable()
    },
    async '$store.state.tracking.players'() {
      for (const intervalId of this.recordIntervalsIds) {
        window.clearInterval(intervalId)
      }

      this.recordIntervalsIds = []

      for (const player of this.$store.state.tracking.players) {
        record(player.id)

        if (player.autoRecord.interval) {
          this.recordIntervalsIds.push(
            window.setInterval(() => {
              record(player.id)
            }, player.autoRecord.interval)
          )
        }
      }
    },
    '$store.state.config.fontSize'() {
      this.updateRootFontSize()
    },
    async '$store.state.config.keyboardShortcutMinimizeUnminize'() {
      await this.registerGlobalShortcuts()
    },
    async '$store.state.config.keyboardShortcutClearPlayers'() {
      await this.registerGlobalShortcuts()
    },
  },
  async mounted() {
    this.updateRootFontSize()
    this.registerGlobalShortcuts()

    for (const player of this.$store.state.tracking.players) {
      if (player.autoRecord.onLaunch) {
        record(player.id)
      }

      if (player.autoRecord.interval !== null) {
        this.recordIntervalsIds.push(
          window.setInterval(() => {
            record(player.id)
          }, player.autoRecord.interval)
        )
      }
    }

    if (this.$store.state.config.logFilePath === '') {
      await this.$store.dispatch('config/setLogFilePathFromPreset', 'STANDARD')
    }

    await this.updateApiKeyValid()
    await this.updateLogFilePathReadable()
    await this.$store.dispatch('temp/updateName', this.$apollo.getClient())

    window.ipcRenderer.on('logFileLine', async (event, line: string) => {
      if (
        line === '' ||
        (line.includes('[Client thread/INFO]:') &&
          !line.includes('[Client thread/INFO]: [CHAT]')) ||
        (line.includes('[Client thread/') &&
          !line.includes('[Client thread/INFO]')) ||
        line.startsWith('java.') ||
        line.startsWith('\tat ') ||
        line.startsWith('Caused by: ')
      ) {
        return
      }

      const chatRegExp = {
        STANDARD:
          /^\[[0-9]{2}:[0-9]{2}:[0-9]{2}\] \[(?:(?:Client thread)|(?:main))\/INFO\]: \[CHAT\] (.+)$/,
        LUNAR_CLIENT:
          /^\[[0-9]{2}:[0-9]{2}:[0-9]{2}\] \[(?:(?:Client thread)|(?:main))\/INFO\]: \[CHAT\] (.+)$/,
        LABYMOD:
          /^\[[0-9]{2}:[0-9]{2}:[0-9]{2}] \[(?:(?:Client thread)|(?:main))\/INFO] \[net\.labymod\.core_implementation\.mc18\.gui\.GuiChatAdapter\/]: \[CHAT] (.+)$/,
      }[
        this.$store.state.config.logFileFormat as
          | 'STANDARD'
          | 'LUNAR_CLIENT'
          | 'LABYMOD'
      ]

      const match = line.match(chatRegExp)
      const message = match !== null ? match[1] : line

      if (message === '§r                           §bBed Wars Experience§b') {
        for (const player of this.$store.state.tracking.players) {
          if (player.autoRecord.afterGameEnd) {
            record(player.id)
          }
        }

        return
      }

      if (/^\s+$/.test(message)) {
        if (this.$store.state.config.autoRemoveAllOnServerChange) {
          this.$store.commit('temp/clearPlayers')
        }

        this.$store.commit('temp/setLastMessageServerChange', true)
        this.$store.commit('temp/setPlayersCount', null)

        return
      }

      if (this.$store.state.config.autoAddPlayers) {
        const joinMatch = message.match(
          /^([A-Za-z0-9_]{1,16}) has joined \(([0-9]{1,2})\/[0-9]{1,2}\)!$/
        )

        if (joinMatch !== null) {
          this.$store.commit('temp/setPlayersCount', Number(joinMatch[2]))
          await this.$store.dispatch('temp/addPlayerName', [
            joinMatch[1],
            this.$apollo.getClient(),
            PlayerSource.PLAYERS,
          ])

          return
        }

        const onlineMatch = message.match(
          /^ONLINE: ((?:(?:\[[A-Z+]+\] )?[A-Za-z0-9_]{1,16}(?:, )?)+)$/
        )

        if (onlineMatch !== null) {
          const playerNames = onlineMatch[1].split(', ')

          if (this.$store.state.config.autoRemoveAllOnWho) {
            this.$store.commit('temp/clearPlayers')
          }

          this.$store.commit('temp/setPlayersCount', playerNames.length)

          await Promise.all(
            playerNames.map((name) =>
              this.$store.dispatch('temp/addPlayerName', [
                name,
                this.$apollo.getClient(),
                PlayerSource.PLAYERS,
              ])
            )
          )

          return
        }

        const quitMatch = message.match(/^([A-Za-z0-9_]{1,16}) has quit!$/)

        if (quitMatch !== null) {
          if (this.$store.state.temp.playersCount) {
            this.$store.commit(
              'temp/setPlayersCount',
              this.$store.state.temp.playersCount - 1
            )
          }

          const nick = this.$store.state.nicks.nicks.find(
            (nick: Nick) => nick.nick.toLowerCase() === quitMatch[1]
          )?.name

          await this.$store.commit(
            'temp/removePlayerByName',
            nick || quitMatch[1]
          )

          return
        }
      }

      if (this.$store.state.config.setApiKeyFromCmd) {
        const keyMatch = message.match(
          /^Your new API key is ([0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12})$/
        )

        if (keyMatch !== null) {
          await this.$store.commit('config/set', ['apiKey', keyMatch[1]])
        }
      }

      const shoutMatch = message.match(
        /^\[SHOUT] \[[A-Z]+] (?:\[[A-Z+]+] )?([A-Za-z0-9_]{1,16}): (.+)$/
      )

      if (shoutMatch !== null) {
        const shoutMessage = shoutMatch[2]

        const snipedRegexps = [
          /^(?:.+)?(?:(?:kcals)|(?:xylans)|(?:dark))(?:.+)?(?:(?:id)|#)(?:.+)?$/i,
          /^(?:.+)?sniped(?:.+)?by(?:.+)?$/i,
        ]

        if (
          this.$store.state.config.autoReportSnipers &&
          snipedRegexps.find((regexp) => regexp.test(shoutMessage))
        ) {
          const reporteeMinecraftId =
            this.$store.state.temp.players.find(
              (player: any) => player.name === shoutMatch[1]
            )?.id ??
            (
              await window.ipcRenderer
                .invoke(
                  'axios',
                  `https://api.mojang.com/users/profiles/minecraft/${shoutMatch[1]}`,
                  undefined,
                  [200, 204, 404]
                )
                .catch(() => ({}))
            )?.data?.id

          await this.$apollo
            .mutate({
              mutation: gql`
                mutation ($reporteeMinecraftId: String!) {
                  createReport(
                    reporteeMinecraftId: $reporteeMinecraftId
                    reason: SNIPER
                  ) {
                    id
                  }
                }
              `,
              variables: {
                reporteeMinecraftId,
              },
            })
            .then((result) => {
              const reporteePlayer = this.$store.state.temp.players.find(
                (player: Player) => player.id === reporteeMinecraftId
              )

              this.$store.commit('temp/updatePlayerByName', [
                reporteePlayer.name,
                {
                  ...reporteePlayer,
                  user: result.data.createReport.reportee,
                },
              ])
            })
            .catch(() => ({}))
        }

        return
      }

      if (this.$store.state.config.autoAddPartyMembers) {
        const leaderMatch = message.match(
          /^Party Leader: (?:\[[A-Z+]+\] )?([A-Za-z0-9_]{1,16})(?:.+)?$/
        )

        if (leaderMatch !== null) {
          await this.$store.dispatch('temp/addPlayerName', [
            leaderMatch[1],
            this.$apollo.getClient(),
          ])

          return
        }

        const moderatorsMatch = message.match(
          /^Party Moderators: ((?:(?:\[[A-Z+]+] )?[A-Za-z0-9_]{1,16}(?: \? )?)+) \? ?$/
        )

        if (moderatorsMatch !== null) {
          const moderatorNames = moderatorsMatch[1]
            .split(' ? ')
            .map((playerFullName) => playerFullName.split(' ').slice(-1)[0])
          await Promise.all(
            moderatorNames.map((name) =>
              this.$store.dispatch('temp/addPlayerName', [
                name,
                this.$apollo.getClient(),
              ])
            )
          )

          return
        }

        const membersMatch = message.match(
          /^Party Members: ((?:(?:\[[A-Z+]+] )?[A-Za-z0-9_]{1,16}(?: \? )?)+) \? ?$/
        )

        if (membersMatch !== null) {
          const memberNames = membersMatch[1]
            .split(' ? ')
            .map((playerFullName) => playerFullName.split(' ').slice(-1)[0])
          await Promise.all(
            memberNames.map((name) =>
              this.$store.dispatch('temp/addPlayerName', [
                name,
                this.$apollo.getClient(),
              ])
            )
          )

          return
        }

        const joinedLeaderMatch = message.match(
          /^You have joined (?:\[[A-Z+]+\] )?([A-Za-z0-9_]{1,16})'s party!$/
        )

        if (joinedLeaderMatch !== null) {
          await this.$store.dispatch('temp/addPlayerName', [
            joinedLeaderMatch[1],
            this.$apollo.getClient(),
          ])

          return
        }

        const joinedMembersMatch = message.match(
          /^You'll be partying with: ((?:(?:\[[A-Z+]+\] )?[A-Za-z0-9_]{1,16}(?:, )?)+)(?:.+)?$/
        )

        if (joinedMembersMatch !== null) {
          const joinedMemberNames = joinedMembersMatch[1]
            .split(', ')
            .map((playerFullName) => playerFullName.split(' ').slice(-1)[0])
          await Promise.all(
            joinedMemberNames.map((name) =>
              this.$store.dispatch('temp/addPlayerName', [
                name,
                this.$apollo.getClient(),
              ])
            )
          )

          return
        }
      }

      if (this.$store.state.config.autoAddPartyRequests) {
        const incomingPartyRequestMatch = message.match(
          /^(?:\[[A-Z+]+\] )?([A-Za-z0-9_]{1,16}) has invited you to join their party!$/
        )

        if (incomingPartyRequestMatch !== null) {
          await this.$store.dispatch(
            'temp/addPlayerName',
            incomingPartyRequestMatch[1]
          )

          return
        }

        const outgoingPartyRequestMatch = message.match(
          /^(?:\[[A-Z+]+\] )?(?:[A-Za-z0-9_]{1,16}) invited (?:\[[A-Z+]+\] )?([A-Za-z0-9_]{1,16}) to the party! They have 60 seconds to accept\.$/
        )

        if (outgoingPartyRequestMatch !== null) {
          await this.$store.dispatch(
            'temp/addPlayerName',
            outgoingPartyRequestMatch[1]
          )

          return
        }
      }

      if (this.$store.state.config.autoAddFriendRequests) {
        const incomingFriendRequestMatch = message.match(
          /^Friend request from (?:\[[A-Z+]+\] )([A-Za-z0-9_]{1,16})$/
        )

        if (incomingFriendRequestMatch !== null) {
          await this.$store.dispatch(
            'temp/addPlayerName',
            incomingFriendRequestMatch[1]
          )

          return
        }

        const outgoingFriendRequestMatch = message.match(
          /^You sent a friend request to ([A-Za-z0-9_]{1,16})! They have 5 minutes to accept it!$/
        )

        if (outgoingFriendRequestMatch !== null) {
          await this.$store.dispatch(
            'temp/addPlayerName',
            outgoingFriendRequestMatch[1]
          )

          return
        }
      }

      if (this.$store.state.config.autoAddLobbyChat) {
        const lobbyChatMatch = message.match(
          /^[§�][0-9a-fk-r]\[[0-9]{1,4}.\] [§�][0-9a-fk-r](?:\[[A-Z+§�a-fk-r0-9]+\] )?([A-Za-z0-9_]{1,16})[§�][0-9a-fk-r]: .+$/
        )

        if (lobbyChatMatch !== null) {
          await this.$store.dispatch('temp/addPlayerName', [
            lobbyChatMatch[1],
            this.$apollo.getClient(),
          ])

          return
        }
      }

      if (
        this.$store.state.config.autoAddMentions &&
        this.$store.state.temp.name !== null
      ) {
        const mentionsMatch = message.match(
          /^[§�][0-9a-fk-r]\[[0-9]{1,4}.\] [§�][0-9a-fk-r](?:\[[A-Z+§�a-fk-r0-9]+\] )?([A-Za-z0-9_]{1,16})[§�][0-9a-fk-r]: (.+)$/
        )

        if (
          mentionsMatch !== null &&
          mentionsMatch[2]
            .toLowerCase()
            .includes(this.$store.state.temp.name.toLowerCase())
        ) {
          await this.$store.dispatch('temp/addPlayerName', [
            mentionsMatch[1],
            this.$apollo.getClient(),
          ])

          return
        }
      }

      if (this.$store.state.config.autoRemoveOnFinalDeath) {
        const finalDeathMatch = message.match(
          /^([A-Za-z0-9_]{1,16}).+FINAL KILL!$/
        )

        if (finalDeathMatch) {
          const nick = this.$store.state.nicks.nicks.find(
            (nick: Nick) =>
              nick.nick.toLowerCase() === finalDeathMatch[1].toLowerCase()
          )?.name

          const name = nick || finalDeathMatch[1]

          const existingPlayer = this.$store.state.temp.players.find(
            (player: Player) => player.name.toLowerCase() === name.toLowerCase()
          )

          if (!existingPlayer) return

          if (
            this.$store.state.temp.playersCount &&
            existingPlayer.source === PlayerSource.PLAYERS
          ) {
            this.$store.commit(
              'temp/setPlayersCount',
              this.$store.state.temp.playersCount - 1
            )
          }

          await this.$store.commit('temp/removePlayerByName', name)
        }
      }

      if (this.$store.state.config.autoAddReconnected) {
        const reconnectedMatch = message.match(
          /^([A-Za-z0-9_]{1,16}) reconnected$/
        )

        if (reconnectedMatch) {
          const nick = this.$store.state.nicks.nicks.find(
            (nick: Nick) =>
              nick.nick.toLowerCase() === reconnectedMatch[1].toLowerCase()
          )?.name

          const name = nick || reconnectedMatch[1]

          if (
            this.$store.state.temp.players.find(
              (player: Player) =>
                player.name.toLowerCase() === name.toLowerCase()
            )
          )
            return

          if (this.$store.state.temp.playersCount) {
            this.$store.commit(
              'temp/setPlayersCount',
              this.$store.state.temp.playersCount + 1
            )
          }

          await this.$store.dispatch('temp/addPlayerName', [
            name,
            this.$apollo.getClient(),
            PlayerSource.PLAYERS,
          ])
        }
      }

      if (this.$store.state.config.autoRemoveDisconnected) {
        const disconnectedMatch = message.match(
          /^([A-Za-z0-9_]{1,16}) disconnected$/
        )

        if (disconnectedMatch) {
          const nick = this.$store.state.nicks.nicks.find(
            (nick: Nick) =>
              nick.nick.toLowerCase() === disconnectedMatch[1].toLowerCase()
          )?.name

          const name = nick || disconnectedMatch[1]

          const existingPlayer = this.$store.state.temp.players.find(
            (player: Player) => player.name.toLowerCase() === name.toLowerCase()
          )

          if (!existingPlayer) return

          if (
            this.$store.state.temp.playersCount &&
            existingPlayer.source === PlayerSource.PLAYERS
          ) {
            this.$store.commit(
              'temp/setPlayersCount',
              this.$store.state.temp.playersCount - 1
            )
          }

          this.$store.commit('temp/removePlayerByName', name)
        }
      }

      const nickedMatch = message.match(
        /^You are now nicked as ([A-Za-z0-9_]{1,16})!$/
      )

      if (nickedMatch !== null && this.$store.state.temp.name) {
        this.$store.commit('nicks/addNick', [
          uuid.v4(),
          nickedMatch[1],
          this.$store.state.temp.name,
        ])

        return
      }

      const chatCommandMatch = message.match(
        /^Can't find a player by the name of '(.+)'$/
      )

      if (chatCommandMatch !== null) {
        const command = chatCommandMatch[1]

        if (command === '-') {
          this.$store.commit('temp/clearPlayers')

          return
        }

        const addPlayerMatch = chatCommandMatch[1].match(
          /\+([A-Za-z0-9_]{1,16})/
        )

        if (addPlayerMatch !== null) {
          this.$store.dispatch('temp/addPlayerName', [
            addPlayerMatch[1],
            this.$apollo.getClient(),
          ])

          return
        }

        return
      }
    })

    window.ipcRenderer.on(
      'globalShortcutPressed',
      async (event, shortcut: string) => {
        if (
          shortcut === this.$store.state.config.keyboardShortcutMinimizeUnminize
        ) {
          await window.ipcRenderer.invoke('toggleWinMinimized')
        } else if (
          shortcut === this.$store.state.config.keyboardShortcutClearPlayers
        ) {
          this.$store.commit('temp/clearPlayers')
        }
      }
    )
  },
})
</script>
