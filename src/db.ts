import Dexie from 'dexie'
import { Components } from '@zikeji/hypixel'
import uuid from 'uuid'
import store, { TrackingPlayer } from './store'

class Database extends Dexie {
  records: Dexie.Table<Record, string>

  constructor() {
    super('db')

    this.version(1).stores({
      records: 'id, playerId, createdAt',
    })

    this.records = this.table('records')
  }
}

export interface Record {
  id: string
  playerId: string
  createdAt: Date
  stats: Components.Schemas.PlayerStatsBedwars
}

export const db = new Database()

export async function record(playerId: string) {
  const player: Components.Schemas.Player = await window.ipcRenderer.invoke(
    'hypixel',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    store.state.config.apiKey,
    'player.uuid',
    playerId
  )

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const trackingPlayer = store.state.tracking.players.find(
    (player: TrackingPlayer) => player.id === playerId
  )

  if (trackingPlayer.name !== player.displayname) {
    store.commit('tracking/updatePlayer', [
      playerId,
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...trackingPlayer,
        name: player.displayname,
      },
    ])
  }

  if (player.stats?.Bedwars) {
    const id = uuid.v4()

    await db.records.add({
      id,
      playerId,
      createdAt: new Date(),
      stats: player.stats.Bedwars,
    })
  }
}
