import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { AxiosResponse } from 'axios'
import {
  BedwarsLevelInfo,
  Components,
  NetworkLevel,
  PlayerRank,
} from '@zikeji/hypixel'
import gql from 'graphql-tag'
import soundEffects, { SoundEffect } from '@/sound-effects'

Vue.use(Vuex)

export interface Player {
  name: string
  id: string | null
  nicked: boolean | null
  hypixelPlayer: Components.Schemas.Player | null
  hypixelPlayerRank: PlayerRank | null
  hypixelBedwarsLevelInfo: BedwarsLevelInfo | null
  hypixelGuild: Components.Schemas.Guild | null
  hypixelNetworkLevel: NetworkLevel | null
  user: User | null
  suspicious: boolean | null
}

export interface TrackingPlayer {
  id: string
  name: string
  autoRecord: {
    onLaunch: boolean
    afterGameEnd: boolean
    interval: number | null
  }
}

export interface Nick {
  id: string
  nick: string
  name: string
}

export enum Column {
  NAME = 'NAME',
  LEVEL = 'LEVEL',
  TAG = 'TAG',
  HEAD = 'HEAD',
  NETWORK_LEVEL = 'NETWORK_LEVEL',
  INDEX = 'INDEX',
  WIN_STREAK = 'WIN_STREAK',
  FINAL_KILLS = 'FINAL_KILLS',
  FINAL_DEATHS = 'FINAL_DEATHS',
  FKDR = 'FKDR',
  WINS = 'WINS',
  LOSSES = 'LOSSES',
  WLR = 'WLR',
  BEDS_BROKEN = 'BEDS_BROKEN',
  BEDS_LOST = 'BEDS_LOST',
  BBLR = 'BBLR',
  KILLS = 'KILLS',
  DEATHS = 'DEATHS',
  KDR = 'KDR',
}

export enum Sort {
  NONE = 'NONE',
  VALUE = 'VALUE',
  ALPHABETICALLY = 'ALPHABETICALLY',
}

enum Color {
  PROVIDED = 'PROVIDED',
  COLOR_CODING = 'COLOR_CODING',
}

type ColumnDefinition = {
  displayName: string
  shortDisplayName?: string
} & (
  | {
      sort: Sort.NONE
    }
  | {
      sort: Sort.VALUE
      getSortValue: (player: Player, modePrefix: string) => number
    }
  | {
      sort: Sort.ALPHABETICALLY
      getSortValue: (player: Player, modePrefix: string) => string
    }
) &
  (
    | {
        customDisplay: true
      }
    | ({
        customDisplay: false
        getDisplayValue?: (
          player: Player,
          modePrefix: string,
          options?: {
            shortTags?: boolean
          }
        ) => string
      } & (
        | {
            color: Color.PROVIDED
            getColor: (player: Player, modePrefix: string) => number
          }
        | {
            color: Color.COLOR_CODING
            formatNumber?: boolean
            colorCodingThresholds: [
              number,
              number,
              number,
              number,
              number,
              number,
              number,
              number
            ]
          }
      ))
  )

export const columns: { [p: string]: ColumnDefinition } = {
  [Column.NAME]: {
    displayName: 'Name',
    sort: Sort.ALPHABETICALLY,
    getSortValue: (player) => {
      return player.hypixelPlayer?.displayname || player.name
    },
    customDisplay: true,
  },
  [Column.LEVEL]: {
    displayName: 'Level',
    sort: Sort.VALUE,
    getSortValue: (player) => {
      return player.hypixelBedwarsLevelInfo?.level || 0
    },
    customDisplay: true,
  },
  [Column.TAG]: {
    displayName: 'Tag',
    sort: Sort.NONE,
    customDisplay: false,
    getDisplayValue: (player, modePrefix, options) => {
      if (player.user?.reportsSummary === 'SNIPER') {
        return options?.shortTags ? '[S]' : '[SNIPER]'
      } else if (player.user?.reportsSummary === 'POTENTIAL_SNIPER') {
        return options?.shortTags ? '[S?]' : '[SNIPER?]'
      } else if (player.user?.reportsSummary === 'HACKER') {
        return options?.shortTags ? '[H]' : '[HACKER]'
      } else if (player.user?.reportsSummary === 'POTENTIAL_HACKER') {
        return options?.shortTags ? '[H?]' : '[HACKER?]'
      } else if (player.suspicious) {
        return options?.shortTags ? '[S@]' : '[SNIPER@]'
      } else if (player.user?.customTagText) {
        return `[${player.user?.customTagText}]`
      } else if (player.user?.role === Role.DEVELOPER) {
        return '[DEV]'
      } else if (player.user?.role === Role.COMMUNITY_MANAGER) {
        return '[CM]'
      } else if (player.user?.role === Role.HELPER) {
        return '[HLP]'
      } else if (player.user?.role === Role.PARTNER) {
        return '[P]'
      } else if (player.user?.role === Role.NITRO_BOOSTER) {
        return '[NB]'
      } else {
        return ''
      }
    },
    color: Color.PROVIDED,
    getColor: (player) => {
      if (
        player.user?.reportsSummary === ReportsSummary.SNIPER ||
        player.user?.reportsSummary === ReportsSummary.HACKER
      ) {
        return 0xb91c1c
      } else if (
        player.user?.reportsSummary === ReportsSummary.POTENTIAL_SNIPER ||
        player.user?.reportsSummary === ReportsSummary.POTENTIAL_HACKER ||
        player.suspicious
      ) {
        return 0xfca5a5
      } else if (player.user?.customTagColor) {
        return player.user.customTagColor
      } else if (player.user?.role === Role.DEVELOPER) {
        return 0x3b82f6
      } else if (player.user?.role === Role.COMMUNITY_MANAGER) {
        return 0xf59e0b
      } else if (player.user?.role === Role.HELPER) {
        return 0x22d3ee
      } else if (player.user?.role === Role.PARTNER) {
        return 0x22c55e
      } else if (player.user?.role === Role.NITRO_BOOSTER) {
        return 0xec4899
      } else {
        return 0xffffff
      }
    },
  },
  [Column.HEAD]: {
    displayName: 'Head',
    shortDisplayName: 'H',
    sort: Sort.NONE,
    customDisplay: true,
  },
  [Column.NETWORK_LEVEL]: {
    displayName: 'Network Level',
    shortDisplayName: 'N. Level',
    sort: Sort.VALUE,
    getSortValue: (player) => {
      return player.hypixelNetworkLevel?.level || 0
    },
    customDisplay: false,
    color: Color.COLOR_CODING,
    colorCodingThresholds: [0, 75, 150, 250, 500, 750, 1000, 1500],
    formatNumber: true,
  },
  [Column.INDEX]: {
    displayName: 'Index',
    sort: Sort.VALUE,
    getSortValue: (player, modePrefix) => {
      return (
        (player.hypixelBedwarsLevelInfo?.level || 0) *
        (((player.hypixelPlayer?.stats.Bedwars?.[
          modePrefix + 'final_kills_bedwars'
        ] as number | undefined) || 0) /
          ((player.hypixelPlayer?.stats.Bedwars?.[
            modePrefix + 'final_deaths_bedwars'
          ] as number | undefined) || 1)) **
          2
      )
    },
    customDisplay: false,
    color: Color.COLOR_CODING,
    colorCodingThresholds: [
      0, 1000, 2500, 4000, 10000, 100000, 250000, 1000000,
    ],
    formatNumber: true,
  },
  [Column.WIN_STREAK]: {
    displayName: 'Win Streak',
    shortDisplayName: 'WS',
    sort: Sort.VALUE,
    getSortValue: (player, modePrefix) => {
      return (
        (player.hypixelPlayer?.stats.Bedwars?.[modePrefix + 'winstreak'] as
          | number
          | undefined) || 0
      )
    },
    customDisplay: false,
    color: Color.COLOR_CODING,
    colorCodingThresholds: [0, 5, 15, 25, 50, 75, 175, 250],
    formatNumber: true,
  },
  [Column.FINAL_KILLS]: {
    displayName: 'Final Kills',
    shortDisplayName: 'F. Kills',
    sort: Sort.VALUE,
    getSortValue: (player, modePrefix) => {
      return (
        (player.hypixelPlayer?.stats.Bedwars?.[
          modePrefix + 'final_kills_bedwars'
        ] as number | undefined) || 0
      )
    },
    customDisplay: false,
    color: Color.COLOR_CODING,
    colorCodingThresholds: [0, 1000, 2500, 4000, 8000, 12000, 48000, 100000],
    formatNumber: true,
  },
  [Column.FINAL_DEATHS]: {
    displayName: 'Final Deaths',
    shortDisplayName: 'F. Deaths',
    sort: Sort.VALUE,
    getSortValue: (player, modePrefix) => {
      return (
        (player.hypixelPlayer?.stats.Bedwars?.[
          modePrefix + 'final_deaths_bedwars'
        ] as number | undefined) || 0
      )
    },
    customDisplay: false,
    color: Color.COLOR_CODING,
    colorCodingThresholds: [0, 1000, 2500, 4000, 8000, 12000, 48000, 100000],
    formatNumber: true,
  },
  [Column.FKDR]: {
    displayName: 'FKDR',
    sort: Sort.VALUE,
    getSortValue: (player, modePrefix) => {
      return (
        ((player.hypixelPlayer?.stats.Bedwars?.[
          modePrefix + 'final_kills_bedwars'
        ] as number | undefined) || 0) /
        ((player.hypixelPlayer?.stats.Bedwars?.[
          modePrefix + 'final_deaths_bedwars'
        ] as number | undefined) || 1)
      )
    },
    customDisplay: false,
    color: Color.COLOR_CODING,
    colorCodingThresholds: [0, 2, 4, 6, 10, 15, 25, 50],
    formatNumber: true,
  },
  [Column.WINS]: {
    displayName: 'Wins',
    sort: Sort.VALUE,
    getSortValue: (player, modePrefix) => {
      return (
        (player.hypixelPlayer?.stats.Bedwars?.[modePrefix + 'wins_bedwars'] as
          | number
          | undefined) || 0
      )
    },
    customDisplay: false,
    color: Color.COLOR_CODING,
    colorCodingThresholds: [0, 250, 500, 750, 1000, 1500, 5000, 10000],
    formatNumber: true,
  },
  [Column.LOSSES]: {
    displayName: 'Losses',
    sort: Sort.VALUE,
    getSortValue: (player, modePrefix) => {
      return (
        (player.hypixelPlayer?.stats.Bedwars?.[
          modePrefix + 'losses_bedwars'
        ] as number | undefined) || 0
      )
    },
    customDisplay: false,
    color: Color.COLOR_CODING,
    colorCodingThresholds: [0, 250, 500, 750, 1000, 1500, 5000, 10000],
    formatNumber: true,
  },
  [Column.WLR]: {
    displayName: 'WLR',
    sort: Sort.VALUE,
    getSortValue: (player, modePrefix) => {
      return (
        ((player.hypixelPlayer?.stats.Bedwars?.[modePrefix + 'wins_bedwars'] as
          | number
          | undefined) || 0) /
        ((player.hypixelPlayer?.stats.Bedwars?.[
          modePrefix + 'losses_bedwars'
        ] as number | undefined) || 1)
      )
    },
    customDisplay: false,
    color: Color.COLOR_CODING,
    colorCodingThresholds: [0, 1, 2, 3, 5, 7, 12, 25],
    formatNumber: true,
  },
  [Column.BEDS_BROKEN]: {
    displayName: 'Beds Broken',
    shortDisplayName: 'B. Broken',
    sort: Sort.VALUE,
    getSortValue: (player, modePrefix) => {
      return (
        (player.hypixelPlayer?.stats.Bedwars?.[
          modePrefix + 'beds_broken_bedwars'
        ] as number | undefined) || 0
      )
    },
    customDisplay: false,
    color: Color.COLOR_CODING,
    colorCodingThresholds: [0, 750, 1500, 2500, 5000, 10000, 25000, 50000],
    formatNumber: true,
  },
  [Column.BEDS_LOST]: {
    displayName: 'Beds Lost',
    shortDisplayName: 'B. Lost',
    sort: Sort.VALUE,
    getSortValue: (player, modePrefix) => {
      return (
        (player.hypixelPlayer?.stats.Bedwars?.[
          modePrefix + 'beds_lost_bedwars'
        ] as number | undefined) || 0
      )
    },
    customDisplay: false,
    color: Color.COLOR_CODING,
    colorCodingThresholds: [0, 750, 1500, 2500, 5000, 10000, 25000, 50000],
    formatNumber: true,
  },
  [Column.BBLR]: {
    displayName: 'BBLR',
    sort: Sort.VALUE,
    getSortValue: (player, modePrefix) => {
      return (
        ((player.hypixelPlayer?.stats.Bedwars?.[
          modePrefix + 'beds_broken_bedwars'
        ] as number | undefined) || 0) /
        ((player.hypixelPlayer?.stats.Bedwars?.[
          modePrefix + 'beds_lost_bedwars'
        ] as number | undefined) || 1)
      )
    },
    customDisplay: false,
    color: Color.COLOR_CODING,
    colorCodingThresholds: [0, 2, 4, 6, 8, 12, 15, 25],
    formatNumber: true,
  },
  [Column.KILLS]: {
    displayName: 'Kills',
    sort: Sort.VALUE,
    getSortValue: (player, modePrefix) => {
      return (
        (player.hypixelPlayer?.stats.Bedwars?.[modePrefix + 'kills_bedwars'] as
          | number
          | undefined) || 0
      )
    },
    customDisplay: false,
    color: Color.COLOR_CODING,
    colorCodingThresholds: [0, 1000, 2500, 4000, 8000, 12000, 48000, 100000],
    formatNumber: true,
  },
  [Column.DEATHS]: {
    displayName: 'Deaths',
    sort: Sort.VALUE,
    getSortValue: (player, modePrefix) => {
      return (
        (player.hypixelPlayer?.stats.Bedwars?.[
          modePrefix + 'deaths_bedwars'
        ] as number | undefined) || 0
      )
    },
    customDisplay: false,
    color: Color.COLOR_CODING,
    colorCodingThresholds: [0, 1000, 2500, 4000, 8000, 12000, 48000, 100000],
    formatNumber: true,
  },
  [Column.KDR]: {
    displayName: 'KDR',
    sort: Sort.VALUE,
    getSortValue: (player, modePrefix) => {
      return (
        ((player.hypixelPlayer?.stats.Bedwars?.[
          modePrefix + 'kills_bedwars'
        ] as number | undefined) || 0) /
        ((player.hypixelPlayer?.stats.Bedwars?.[
          modePrefix + 'deaths_bedwars'
        ] as number | undefined) || 1)
      )
    },
    customDisplay: false,
    color: Color.COLOR_CODING,
    colorCodingThresholds: [0, 2, 4, 6, 10, 15, 25, 50],
    formatNumber: true,
  },
}

enum Role {
  NONE = 'NONE',
  NITRO_BOOSTER = 'NITRO_BOOSTER',
  PARTNER = 'PARTNER',
  HELPER = 'HELPER',
  COMMUNITY_MANAGER = 'COMMUNITY_MANAGER',
  DEVELOPER = 'DEVELOPER',
}

export enum ReportsSummary {
  NONE = 'NONE',
  POTENTIAL_HACKER = 'POTENTIAL_HACKER',
  HACKER = 'HACKER',
  POTENTIAL_SNIPER = 'POTENTIAL_SNIPER',
  SNIPER = 'SNIPER',
}

export interface User {
  id: string
  minecraftId: string
  role: Role
  customTagText: string | null
  customTagColor: number | null
  reportsSummary: ReportsSummary
}

const store = new Vuex.Store({
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
        sortBy: Column.INDEX as Column,
        sortAscending: false,
        keyboardShortcutMinimizeUnminize: '',
        keyboardShortcutClearPlayers: '',
        hackersSnipersSoundEffect: null as SoundEffect | null,
        showHackersAndSnipersOnTop: true,
        autoReportSnipers: true,
        shortTags: false,
        customFontFamily: 'system-ui',
        customFontSize: '16px',
        customBackgroundColor: '#18181b',
        columns: {
          0: Column.TAG,
          1: Column.LEVEL,
          2: Column.NAME,
          3: Column.WIN_STREAK,
          4: Column.FKDR,
          5: Column.WLR,
          6: Column.FINAL_KILLS,
          7: Column.WINS,
          8: Column.INDEX,
          9: null,
          10: null,
          11: null,
          12: null,
          13: null,
          14: null,
          15: null,
          16: null,
          17: null,
        } as {
          [p: number]: Column | null
        },
      }),
      getters: {
        modePrefix: (state) =>
          state.mode === 'OVERALL' ? '' : state.mode.toLowerCase() + '_',
        activeColumns: (state) => {
          const activeColumns = []

          for (let i = 0; i < 18; i++) {
            if (state.columns[i]) {
              activeColumns.push(state.columns[i])
            }
          }

          return activeColumns
        },
        backgroundColor: (state) => {
          const color = /^#[A-Fa-f0-9]{6}$/.test(state.customBackgroundColor)
            ? state.customBackgroundColor.slice(1)
            : '18181b'

          return `#${color}${Math.floor(state.opacity * 255)
            .toString(16)
            .padStart(2, '0')}`
        },
      },
      mutations: {
        set(state, [key, newValue]) {
          state[key] = newValue
        },
        setColumn(state, [i, newColumn]: [number, Column]) {
          state.columns[i] = newColumn
        },
      },
      actions: {
        async setLogFilePathFromPreset(
          { commit, state },
          preset:
            | 'STANDARD'
            | 'LUNAR_CLIENT'
            | 'BADLION_CLIENT'
            | 'LABYMOD'
            | 'PVPLOUNGE'
            | 'CUSTOM'
        ) {
          state.logFilePathPreset = preset

          if (preset === 'STANDARD') {
            commit('set', [
              'logFilePath',
              await window.ipcRenderer.invoke(
                'pathJoin',
                'appData',
                '.minecraft',
                'logs',
                'latest.log'
              ),
            ])
          } else if (preset === 'LUNAR_CLIENT') {
            commit('set', [
              'logFilePath',
              await window.ipcRenderer.invoke(
                'pathJoin',
                'home',
                '.lunarclient',
                'offline',
                '1.8',
                'logs',
                'latest.log'
              ),
            ])
          } else if (preset === 'BADLION_CLIENT') {
            commit('set', [
              'logFilePath',
              await window.ipcRenderer.invoke(
                'pathJoin',
                'appData',
                '.minecraft',
                'logs',
                'blclient',
                'minecraft',
                'latest.log'
              ),
            ])
          } else if (preset === 'LABYMOD') {
            commit('set', [
              'logFilePath',
              await window.ipcRenderer.invoke(
                'pathJoin',
                'appData',
                '.minecraft',
                'logs',
                'fml-client-latest.log'
              ),
            ])
          } else if (preset === 'PVPLOUNGE') {
            commit('set', [
              'logFilePath',
              await window.ipcRenderer.invoke(
                'pathJoin',
                'appData',
                '.pvplounge',
                'logs',
                'latest.log'
              ),
            ])
          }
        },
      },
      namespaced: true,
    },
    tracking: {
      state: () => ({
        players: [] as TrackingPlayer[],
      }),
      mutations: {
        addPlayer(state, [id, name]: string[]) {
          if (state.players.find((player: TrackingPlayer) => player.id === id))
            return

          state.players = [
            ...state.players,
            {
              id,
              name,
              autoRecord: {
                onLaunch: true,
                afterGameEnd: false,
                interval: 30 * 60 * 1000,
              },
            },
          ]
        },
        removePlayer(state, id: string) {
          state.players = state.players.filter(
            (player: TrackingPlayer) => player.id !== id
          )
        },
        updatePlayer(state, [id, player]: [string, TrackingPlayer]) {
          state.players = [
            ...state.players.filter(
              (player: TrackingPlayer) => player.id !== id
            ),
            player,
          ]
        },
      },
      namespaced: true,
    },
    nicks: {
      state: () => ({
        nicks: [] as Nick[],
      }),
      mutations: {
        addNick(state, [id, nick, name]: [string, string, string]) {
          if (state.nicks.find((nick: Nick) => nick.id === id)) return

          state.nicks = [
            ...state.nicks.filter(
              (nickIt: Nick) => nickIt.nick.toLowerCase() !== nick
            ),
            {
              id,
              nick,
              name,
            },
          ]
        },
        removeNick(state, id: string) {
          state.nicks = state.nicks.filter((nick: Nick) => nick.id !== id)
        },
      },
      namespaced: true,
    },
    temp: {
      state: () => ({
        apiKeyValid: null as boolean | null,
        players: [] as Player[],
        logFilePathReadable: null as boolean | null,
        name: null as string | null,
        lastMessageServerChange: false,
        capturingScreenshot: false,
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
            (player: Player) => player.name !== name
          )
        },
        updatePlayerByName(state, [name, newValue]) {
          if (!state.players.find((player: Player) => player.name === name))
            return

          state.players = [
            ...state.players.filter((player: Player) => player.name !== name),
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
        setCapturingScreenshot(state, newValue: boolean) {
          state.capturingScreenshot = newValue
        },
      },
      actions: {
        async addPlayerName(
          { commit, state, rootState },
          [name, apolloClient]
        ) {
          if (
            state.players.find(
              (player: Player) =>
                player.name.toLowerCase() === name.toLowerCase()
            )
          )
            return

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const nick: Nick | undefined = rootState.nicks.nicks.find(
            (nick: Nick) => nick.nick.toLowerCase() === name.toLowerCase()
          )

          if (nick) {
            name = nick.name
          }

          commit('addPlayer', {
            name,
            id: null,
            nicked: false,
            hypixelPlayer: null,
            hypixelPlayerRank: null,
            hypixelBedwarsLevelInfo: null,
            hypixelGuild: null,
            hypixelNetworkLevel: null,
            user: null,
            suspicious: null,
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

              const hypixelNetworkLevel = await window.ipcRenderer.invoke(
                'hypixelUtils',
                'getNetworkLevel',
                hypixelPlayer
              )

              commit('updatePlayerByName', [
                name,
                {
                  ...state.players.find((player: any) => player.name === name),
                  hypixelPlayer,
                  hypixelPlayerRank,
                  hypixelBedwarsLevelInfo,
                  hypixelGuild,
                  hypixelNetworkLevel,
                },
              ])

              const userResponse = await apolloClient
                .query({
                  query: gql`
                    query ($minecraftId: ID!) {
                      userByMinecraftId(minecraftId: $minecraftId) {
                        id
                        minecraftId
                        role
                        customTagText
                        customTagColor
                        reportsSummary
                      }
                      suspicious(minecraftId: $minecraftId)
                    }
                  `,
                  variables: {
                    minecraftId: minecraftProfile.data.id,
                  },
                })
                .catch(() => null)

              const user =
                (userResponse?.data?.userByMinecraftId as User | null) || null
              const suspicious =
                (userResponse?.data?.suspicious as boolean | null) || null

              commit('updatePlayerByName', [
                name,
                {
                  ...state.players.find((player: any) => player.name === name),
                  user,
                  suspicious,
                },
              ])

              if (
                ((user?.reportsSummary &&
                  user?.reportsSummary !== ReportsSummary.NONE) ||
                  suspicious) &&
                (rootState as any).config.hackersSnipersSoundEffect
              ) {
                await soundEffects[
                  (rootState as any).config.hackersSnipersSoundEffect
                ].audio.play()
              }
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

          if (user.data?.session) {
            const minecraftProfile = await window.ipcRenderer.invoke(
              'axios',
              `https://sessionserver.mojang.com/session/minecraft/profile/${user.data.session.user.minecraftId}`
            )
            commit('setName', minecraftProfile.data?.name || null)
          } else {
            commit('setName', null)
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
    createPersistedState({
      key: 'tracking',
      paths: ['tracking'],
    }),
    createPersistedState({
      key: 'nicks',
      paths: ['nicks'],
    }),
  ],
})

export default store
