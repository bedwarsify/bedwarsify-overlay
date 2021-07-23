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
  source: PlayerSource | undefined
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
  superShortDisplayName?: string
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
    | {
        customDisplay: false
        getValues: (
          player: Player,
          modePrefix: string,
          options?: {
            shortTags?: boolean
            players?: Player[]
            partyDetection?: boolean
          }
        ) => [string, number][]
      }
  )

export const columns: { [p: string]: ColumnDefinition } = {
  [Column.NAME]: {
    displayName: 'Name',
    superShortDisplayName: 'N',
    sort: Sort.ALPHABETICALLY,
    getSortValue: (player) => {
      return player.hypixelPlayer?.displayname || player.name
    },
    customDisplay: true,
  },
  [Column.LEVEL]: {
    displayName: 'Level',
    superShortDisplayName: 'L',
    sort: Sort.VALUE,
    getSortValue: (player) => {
      return player.hypixelBedwarsLevelInfo?.level || 0
    },
    customDisplay: true,
  },
  [Column.TAG]: {
    displayName: 'Tag',
    superShortDisplayName: 'T',
    sort: Sort.NONE,
    customDisplay: false,
    getValues: (player, modePrefix, options) => {
      const values: [string, number][] = []

      if (player.user?.customTagText) {
        values.push([
          `[${player.user?.customTagText}]`,
          player.user.customTagColor ?? 0xffffff,
        ])
      } else if (player.user?.role === Role.DEVELOPER) {
        values.push(['[DEV]', 0x3b82f6])
      } else if (player.user?.role === Role.COMMUNITY_MANAGER) {
        values.push(['[CM]', 0xf59e0b])
      } else if (player.user?.role === Role.HELPER) {
        values.push(['[HLP]', 0x22d3ee])
      } else if (player.user?.role === Role.PARTNER) {
        values.push(['[P]', 0x22c55e])
      } else if (player.user?.role === Role.NITRO_BOOSTER) {
        values.push(['[NB]', 0xec4899])
      }

      if (player.user?.reportsSummary === 'SNIPER') {
        values.push([options?.shortTags ? '[S]' : '[SNIP]', 0xb91c1c])
      } else if (player.user?.reportsSummary === 'POTENTIAL_SNIPER') {
        values.push([options?.shortTags ? '[S?]' : '[SNIP?]', 0xfca5a5])
      } else if (player.user?.reportsSummary === 'HACKER') {
        values.push([options?.shortTags ? '[H]' : '[HACK]', 0xb91c1c])
      } else if (player.user?.reportsSummary === 'POTENTIAL_HACKER') {
        values.push([options?.shortTags ? '[H?]' : '[HACK?]', 0xfca5a5])
      } else if (player.suspicious) {
        values.push([options?.shortTags ? '[S@]' : '[SNIP@]', 0xfca5a5])
      }

      if (
        options?.partyDetection &&
        (player.hypixelPlayer?.channel === 'PARTY' ||
          ((player.hypixelPlayer?.stats.Bedwars?.winstreak || 0) >= 3 &&
            (options?.players?.filter(
              (player) =>
                player.hypixelPlayer?.stats.Bedwars?.winstreak ===
                player.hypixelPlayer?.stats.Bedwars?.winstreak
            ).length || 0) >= 2))
      ) {
        values.push([options?.shortTags ? '[P]' : '[PARTY]', 0xe879f9])
      }

      return values
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
    superShortDisplayName: 'NL',
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
    superShortDisplayName: 'I',
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
    superShortDisplayName: 'FK',
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
    superShortDisplayName: 'FD',
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
    superShortDisplayName: 'FKD',
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
    superShortDisplayName: 'W',
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
    superShortDisplayName: 'L',
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
    superShortDisplayName: 'WL',
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
    superShortDisplayName: 'BB',
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
    superShortDisplayName: 'BL',
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
    displayName: 'BBL',
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
    superShortDisplayName: 'K',
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
    superShortDisplayName: 'D',
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
    superShortDisplayName: 'KD',
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

export enum PlayerSource {
  PLAYERS = 'PLAYERS',
}

export enum FontFamilyPreset {
  MINECRAFT = 'MINECRAFT',
  SYSTEM_UI = 'SYSTEM_UI',
  CUSTOM = 'CUSTOM',
}

export enum Mode {
  OVERALL = 'OVERALL',
  EIGHT_ONE = 'EIGHT_ONE',
  EIGHT_TWO = 'EIGHT_TWO',
  FOUR_THREE = 'FOUR_THREE',
  FOUR_FOUR = 'FOUR_FOUR',
  TWO_FOUR = 'TWO_FOUR',
  EIGHT_TWO_RUSH = 'EIGHT_TWO_RUSH',
  FOUR_FOUR_RUSH = 'FOUR_FOUR_RUSH',
  EIGHT_TWO_ULTIMATE = 'EIGHT_TWO_ULTIMATE',
  FOUR_FOUR_ULTIMATE = 'FOUR_FOUR_ULTIMATE',
  CASTLE = 'CASTLE',
  EIGHT_TWO_VOIDLESS = 'EIGHT_TWO_VOIDLESS',
  FOUR_FOUR_VOIDLESS = 'FOUR_FOUR_VOIDLESS',
  EIGHT_TWO_ARMED = 'EIGHT_TWO_ARMED',
  FOUR_FOUR_ARMED = 'FOUR_FOUR_ARMED',
  EIGHT_TWO_LUCKY = 'EIGHT_TWO_LUCKY',
  FOUR_FOUR_LUCKY = 'FOUR_FOUR_LUCKY',
}

export interface ModeDefinition {
  displayName: string
  dream?: boolean
}

export const modes: { [p: string]: ModeDefinition } = {
  [Mode.OVERALL]: {
    displayName: 'Overall',
  },
  [Mode.EIGHT_ONE]: {
    displayName: 'Solo',
  },
  [Mode.EIGHT_TWO]: {
    displayName: 'Doubles',
  },
  [Mode.FOUR_THREE]: {
    displayName: '3v3v3v3',
  },
  [Mode.FOUR_FOUR]: {
    displayName: '4v4v4v4',
  },
  [Mode.TWO_FOUR]: {
    displayName: '4v4',
  },
  [Mode.EIGHT_TWO_RUSH]: {
    displayName: 'Rush Doubles',
    dream: true,
  },
  [Mode.FOUR_FOUR_RUSH]: {
    displayName: 'Rush 4v4v4v4',
    dream: true,
  },
  [Mode.EIGHT_TWO_ULTIMATE]: {
    displayName: 'Ultimate Doubles',
    dream: true,
  },
  [Mode.FOUR_FOUR_ULTIMATE]: {
    displayName: 'Ultimate 4v4v4v4',
    dream: true,
  },
  [Mode.CASTLE]: {
    displayName: 'Castle',
    dream: true,
  },
  [Mode.EIGHT_TWO_VOIDLESS]: {
    displayName: 'Voidless Doubles',
    dream: true,
  },
  [Mode.FOUR_FOUR_VOIDLESS]: {
    displayName: 'Voidless 4v4v4v4',
    dream: true,
  },
  [Mode.EIGHT_TWO_ARMED]: {
    displayName: 'Armed Doubles',
    dream: true,
  },
  [Mode.FOUR_FOUR_ARMED]: {
    displayName: 'Armed 4v4v4v4',
    dream: true,
  },
  [Mode.EIGHT_TWO_LUCKY]: {
    displayName: 'Lucky Blocks Doubles',
    dream: true,
  },
  [Mode.FOUR_FOUR_LUCKY]: {
    displayName: 'Lucky Blocks 4v4v4v4',
    dream: true,
  },
}

enum TextShadow {
  ENABLED = 'ENABLED',
  PLAYERS_ONLY = 'PLAYERS_ONLY',
  DISABLED = 'DISABLED',
}

enum ColumnLabels {
  NORMAL = 'NORMAL',
  SHORT = 'SHORT',
  DISABLED = 'DISABLED',
}

export const defaultColumns = [
  Column.TAG,
  Column.LEVEL,
  Column.NAME,
  Column.WIN_STREAK,
  Column.FKDR,
  Column.WLR,
  Column.FINAL_KILLS,
  Column.WINS,
  Column.INDEX,
]

const store = new Vuex.Store({
  modules: {
    config: {
      state: () => ({
        apiKey: '',
        setApiKeyFromCmd: true,
        opacity: 0.5,
        mode: Mode.OVERALL,
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
        autoAddReconnected: false,
        autoRemoveAllOnServerChange: true,
        autoRemoveAllOnWho: true,
        autoRemoveDisconnected: false,
        autoRemoveOnFinalDeath: false,
        sortBy: Column.INDEX as Column,
        sortAscending: false,
        keyboardShortcutMinimizeUnminize: '',
        keyboardShortcutClearPlayers: '',
        hackersSnipersSoundEffect: null as SoundEffect | null,
        autoReportSnipers: true,
        shortTags: false,
        superShortColumnDisplayNames: false,
        missingPlayersWarning: true,
        customBackgroundColor: '#18181b',
        columns: defaultColumns as (Column | null)[],
        fontSize: 16,
        fontFamilyPreset: FontFamilyPreset.MINECRAFT,
        fontFamilyCustom: '',
        textShadow: TextShadow.PLAYERS_ONLY,
        columnLabels: ColumnLabels.NORMAL,
        roundedCorners: true,
        partyDetection: true,
        dismissedPatreonReminder: false,
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
        backgroundColor: (state, getters, rootState: any) => {
          const color = /^#[A-Fa-f0-9]{6}$/.test(state.customBackgroundColor)
            ? state.customBackgroundColor.slice(1)
            : '18181b'

          return `#${color}${Math.floor(
            (rootState.temp.capturingScreenshot ? 1 : state.opacity) * 255
          )
            .toString(16)
            .padStart(2, '0')}`
        },
        opacityStyle: (state, getters, rootState: any) => {
          return {
            '--tw-bg-opacity': rootState.temp.capturingScreenshot
              ? 1
              : state.opacity,
          }
        },
        fontFamily: (state) => {
          if (state.fontFamilyPreset === FontFamilyPreset.MINECRAFT) {
            return 'Minecraft'
          } else if (state.fontFamilyPreset === FontFamilyPreset.SYSTEM_UI) {
            return 'system-ui'
          } else {
            return state.fontFamilyCustom
          }
        },
      },
      mutations: {
        set(state, [key, newValue]) {
          state[key] = newValue
        },
        setColumn(state, [i, newColumn]: [number, Column]) {
          state.columns[i] = newColumn
        },
        addColumnStart(state) {
          state.columns = [null, ...state.columns]
        },
        removeColumnStart(state) {
          state.columns = state.columns.slice(1)
        },
        addColumnEnd(state) {
          state.columns = [...state.columns, null]
        },
        removeColumnEnd(state) {
          state.columns = state.columns.slice(0, -1)
        },
      },
      actions: {
        async setLogFilePathFromPreset(
          { commit },
          preset:
            | 'STANDARD'
            | 'LUNAR_CLIENT'
            | 'BADLION_CLIENT'
            | 'LABYMOD'
            | 'PVPLOUNGE'
            | 'CUSTOM'
        ) {
          commit('set', ['logFilePathPreset', preset])

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
        playersCount: null as number | null,
        launchSettingsVisible: null as boolean | null,
        startedAt: new Date(),
        now: new Date(),
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
        setPlayersCount(state, newValue: number | null) {
          state.playersCount = newValue
        },
        setLaunchSettingsVisible(state, newValue: boolean | null) {
          state.launchSettingsVisible = newValue
        },
        updateNow(state) {
          state.now = new Date()
        },
      },
      actions: {
        async addPlayerName(
          { commit, state, rootState },
          [name, apolloClient, source]
        ) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const nick: Nick | undefined = rootState.nicks.nicks.find(
            (nick: Nick) => nick.nick.toLowerCase() === name.toLowerCase()
          )

          if (
            state.players.find(
              (player: Player) =>
                player.name.toLowerCase() === name.toLowerCase()
            )
          )
            return

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
            source,
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
