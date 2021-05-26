import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { AxiosResponse } from 'axios'
import { BedwarsLevelInfo, Components, PlayerRank } from '@zikeji/hypixel'
import gql from 'graphql-tag'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    config: {
      state: () => ({
        apiKey: '',
        setApiKeyFromCmd: true,
        opacity: 0.5,
        mode: 'OVERALL' as
          | 'OVERALL'
          | 'EIGHT_ONE'
          | 'EIGHT_TWO'
          | 'FOUR_THREE'
          | 'FOUR_FOUR'
          | 'TWO_FOUR'
          | 'EIGHT_TWO_RUSH'
          | 'FOUR_FOUR_RUSH'
          | 'EIGHT_TWO_ULTIMATE'
          | 'FOUR_FOUR_ULTIMATE'
          | 'CASTLE'
          | 'EIGHT_TWO_VOIDLESS'
          | 'FOUR_FOUR_VOIDLESS'
          | 'EIGHT_TWO_ARMED'
          | 'FOUR_FOUR_ARMED'
          | 'EIGHT_TWO_LUCKY'
          | 'FOUR_FOUR_LUCKY',
        showDreamModes: false,
        showGuildTag: false,
        unnickYourself: true,
        autoDetectOwnNickOnJoin: false,
        autoReportSnipers: true,
        logFileFormat: 'STANDARD' as 'STANDARD' | 'LUNAR_CLIENT' | 'LABYMOD',
        logFilePathPreset: 'STANDARD' as
          | 'STANDARD'
          | 'LUNAR_CLIENT'
          | 'BADLION_CLIENT'
          | 'LABYMOD'
          | 'PVPLOUNGE'
          | 'CUSTOM',
        logFilePath: '',
        autoAddPlayers: true,
        autoAddPartyMembers: true,
        autoAddPartyRequests: true,
        autoAddFriendRequests: false,
        autoAddLobbyChat: false,
        autoAddMentions: true,
        autoRemoveAllOnServerChange: true,
        autoRemoveAllOnWho: true,
        sortBy: 'INDEX' as
          | 'INDEX'
          | 'LEVEL'
          | 'FKDR'
          | 'WLR'
          | 'WS'
          | 'FINALS'
          | 'WINS',
        sortAscending: false,
      }),
      getters: {
        modePrefix: (state) =>
          state.mode === 'OVERALL' ? '' : state.mode.toLowerCase() + '_',
      },
      mutations: {
        set(state, [key, newValue]) {
          state[key] = newValue
        },
      },
      namespaced: true,
    },
    temp: {
      state: () => ({
        apiKeyValid: null as boolean | null,
        players: [] as {
          name: string
          id: string | null
          nicked: boolean | null
          hypixelPlayer: Components.Schemas.Player | null
          hypixelPlayerRank: PlayerRank | null
          hypixelBedwarsLevelInfo: BedwarsLevelInfo | null
          hypixelGuild: Components.Schemas.Guild | null
        }[],
        logFilePathReadable: null as boolean | null,
        name: null as string | null,
        nick: null as string | null,
        lastMessageServerChange: false,
      }),
      mutations: {
        setApiKeyValid(state, newValue) {
          state.apiKeyValid = newValue
        },
        addPlayer(state, player) {
          state.players = [...state.players, player]
        },
        removePlayerByName(state, name) {
          state.players = state.players.filter(
            (player: any) => player.name !== name
          )
        },
        updatePlayerByName(state, [name, newValue]) {
          state.players = [
            ...state.players.filter((player: any) => player.name !== name),
            newValue,
          ]
        },
        clearPlayers(state) {
          state.players = []
        },
        setLogFilePathReadable(state, newValue) {
          state.logFilePathReadable = newValue
        },
        setName(state, newValue) {
          state.name = newValue
        },
        setNick(state, newValue) {
          state.nick = newValue
        },
        setLastMessageServerChange(state, newValue) {
          state.lastMessageServerChange = newValue
        },
      },
      actions: {
        async addPlayerName({ commit, state, rootState }, name: string) {
          if (
            state.players.find(
              (player: any) => player.name.toLowerCase() === name.toLowerCase()
            )
          )
            return

          commit('addPlayer', {
            name,
            id: null,
            nicked: false,
            hypixelPlayer: null,
            hypixelPlayerRank: null,
            hypixelBedwarsLevelInfo: null,
            hypixelGuild: null,
          })

          const minecraftProfile: AxiosResponse<{
            id: string
            name: string
          }> = await window.ipcRenderer.invoke(
            'axios',
            `https://api.mojang.com/users/profiles/minecraft/${name}`,
            undefined,
            [200, 204, 404]
          )

          if (
            minecraftProfile.status === 204 ||
            minecraftProfile.status === 404
          ) {
            commit('updatePlayerByName', [
              name,
              {
                ...state.players.find((player: any) => player.name === name),
                nicked: true,
              },
            ])
          } else {
            commit('updatePlayerByName', [
              name,
              {
                ...state.players.find((player: any) => player.name === name),
                id: minecraftProfile.data.id,
              },
            ])

            const hypixelPlayer: Components.Schemas.Player =
              await window.ipcRenderer.invoke(
                'hypixel',
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                rootState.config.apiKey,
                'player.uuid',
                minecraftProfile.data.id
              )

            if (name.toLowerCase() !== hypixelPlayer.playername) {
              commit('updatePlayerByName', [
                name,
                {
                  ...state.players.find((player: any) => player.name === name),
                  nicked: true,
                },
              ])

              return
            }

            try {
              const hypixelPlayerRank = await window.ipcRenderer.invoke(
                'hypixelUtils',
                'getPlayerRank',
                hypixelPlayer
              )

              const hypixelBedwarsLevelInfo =
                hypixelPlayer.stats.Bedwars !== undefined
                  ? await window.ipcRenderer.invoke(
                      'hypixelUtils',
                      'getBedwarsLevelInfo',
                      hypixelPlayer
                    )
                  : null

              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const hypixelGuild = rootState.config.showGuildTag
                ? await window.ipcRenderer.invoke(
                    'hypixel',
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    rootState.config.apiKey,
                    'guild.player',
                    minecraftProfile.data.id
                  )
                : null

              commit('updatePlayerByName', [
                name,
                {
                  ...state.players.find((player: any) => player.name === name),
                  hypixelPlayer,
                  hypixelPlayerRank,
                  hypixelBedwarsLevelInfo,
                  hypixelGuild,
                },
              ])
            } catch (error) {
              commit('updatePlayerByName', [
                name,
                {
                  ...state.players.find((player: any) => player.name === name),
                  nicked: true,
                },
              ])
            }
          }
        },

        async updateName({ commit }, apolloClient) {
          const user = await apolloClient.query({
            query: gql`
              query {
                session {
                  id
                  user {
                    id
                    minecraftId
                  }
                }
              }
            `,
          })

          if (user.data !== null) {
            if (user.data.session !== null) {
              const minecraftProfile = await window.ipcRenderer.invoke(
                'axios',
                `https://sessionserver.mojang.com/session/minecraft/profile/${user.data.session.user.minecraftId}`
              )
              commit('setName', minecraftProfile.data?.name || null)
            } else {
              commit('setName', null)
            }
          }
        },
      },
      namespaced: true,
    },
  },
  plugins: [
    createPersistedState({
      key: 'config',
      paths: ['config'],
    }),
  ],
})
