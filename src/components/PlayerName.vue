<template>
  <span>
    <span
      v-if="player.hypixelPlayer.prefix"
      :style="{ color: '#' + player.hypixelPlayerRank.colorHex }"
    >
      {{ player.hypixelPlayer.prefix.replace(/§./g, '') }}
      {{ player.hypixelPlayer.displayname }}
    </span>

    <span
      v-else-if="player.hypixelPlayer.rank === 'GAME_MASTER'"
      class="text-minecraft-dark-green"
    >
      [GM] {{ player.hypixelPlayer.displayname }}
    </span>

    <span
      v-else-if="player.hypixelPlayerRank.cleanName === 'YOUTUBER'"
      class="inline-flex"
    >
      <span class="text-minecraft-red">[</span>
      <span class="text-minecraft-white">YOUTUBE</span>
      <span class="text-minecraft-red">
        ]
        {{ player.hypixelPlayer.displayname }}
      </span>
    </span>

    <span
      v-else-if="player.hypixelPlayerRank.cleanName.includes('+')"
      :class="[
        'inline-flex',
        player.hypixelPlayerRank.cleanName === 'MVP++'
          ? 'text-minecraft-' +
            (player.hypixelPlayer.monthlyRankColor || 'gold')
              .toLowerCase()
              .replace('_', '-')
          : '',
      ]"
      :style="
        player.hypixelPlayerRank.cleanName !== 'MVP++'
          ? 'color: #' + player.hypixelPlayerRank.colorHex
          : ''
      "
    >
      <span>
        {{ player.hypixelPlayerRank.cleanPrefix.replace(/\+.+$/, '') }}
      </span>

      <span
        :class="
          'text-minecraft-' +
          (
            (player.hypixelPlayerRank.cleanName !== 'VIP+' &&
              player.hypixelPlayer.rankPlusColor) ||
            'gold'
          )
            .toLowerCase()
            .replace('_', '-')
        "
      >
        <template v-if="player.hypixelPlayerRank.cleanName === 'MVP++'">
          ++
        </template>

        <template v-else> + </template>
      </span>

      <span>] {{ player.hypixelPlayer.displayname }}</span>
    </span>

    <span :style="{ color: '#' + player.hypixelPlayerRank.colorHex }" v-else>
      {{
        player.hypixelPlayerRank.cleanPrefix !== ''
          ? player.hypixelPlayerRank.cleanPrefix + ' '
          : ''
      }}{{ player.hypixelPlayer.displayname }}
    </span>

    <span
      v-if="
        $store.state.config.showGuildTag &&
        player.hypixelGuild &&
        player.hypixelGuild.tag
      "
      :class="
        'text-minecraft-' +
        (player.hypixelGuild.tagColor || 'gray').toLowerCase().replace('_', '-')
      "
    >
      [{{ player.hypixelGuild.tag }}]
    </span>
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Player } from '@/store'

export default Vue.extend({
  props: {
    player: {
      type: Object as PropType<Player>,
      required: true,
    },
  },
})
</script>
