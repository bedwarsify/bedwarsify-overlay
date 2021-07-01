<template>
  <span>
    <span
      v-if="
        player.hypixelBedwarsLevelInfo &&
        player.hypixelBedwarsLevelInfo.level >= 1000
      "
      class="inline-flex"
    >
      <span :class="'text-minecraft-' + colors[0]"> [ </span>

      <span :class="'text-minecraft-' + colors[1]">
        {{ player.hypixelBedwarsLevelInfo.level.toString()[0] }}
      </span>

      <span :class="'text-minecraft-' + colors[2]">
        {{ player.hypixelBedwarsLevelInfo.level.toString()[1] }}
      </span>

      <span :class="'text-minecraft-' + colors[3]">
        {{ player.hypixelBedwarsLevelInfo.level.toString()[2] }}
      </span>

      <span :class="'text-minecraft-' + colors[4]">
        {{ player.hypixelBedwarsLevelInfo.level.toString()[3] }}
      </span>

      <span :class="'text-minecraft-' + colors[5]">
        {{ star }}
      </span>

      <span :class="'text-minecraft-' + colors[6]"> ] </span>
    </span>

    <span
      v-else
      :style="{
        color:
          '#' +
          ((player.hypixelBedwarsLevelInfo &&
            player.hypixelBedwarsLevelInfo.prestigeColorHex) ||
            'aaaaaa'),
      }"
    >
      [{{
        (player.hypixelBedwarsLevelInfo &&
          player.hypixelBedwarsLevelInfo.level) ||
        '0'
      }}✫]
    </span>
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Player } from '@/store'

const prestiges = [
  {
    threshold: 1000,
    colors: [
      'red',
      'gold',
      'yellow',
      'green',
      'aqua',
      'light-purple',
      'dark-purple',
    ],
  },
  {
    threshold: 1100,
    colors: [
      'gray',
      ...new Array(4).fill('white'),
      ...new Array(2).fill('gray'),
    ],
  },
  {
    threshold: 1200,
    colors: ['gray', ...new Array(4).fill('yellow'), 'gold', 'gray'],
  },
  {
    threshold: 1300,
    colors: ['gray', ...new Array(4).fill('aqua'), 'dark-aqua', 'gray'],
  },
  {
    threshold: 1400,
    colors: ['gray', ...new Array(4).fill('green'), 'dark-green', 'gray'],
  },
  {
    threshold: 1500,
    colors: ['gray', ...new Array(4).fill('dark-aqua'), 'blue', 'gray'],
  },
  {
    threshold: 1600,
    colors: ['gray', ...new Array(4).fill('red'), 'dark-red', 'gray'],
  },
  {
    threshold: 1700,
    colors: [
      'gray',
      ...new Array(4).fill('light-purple'),
      'dark-purple',
      'gray',
    ],
  },
  {
    threshold: 1800,
    colors: ['gray', ...new Array(4).fill('blue'), 'dark-blue', 'gray'],
  },
  {
    threshold: 1900,
    colors: ['gray', ...new Array(4).fill('dark-purple'), 'dark-gray', 'gray'],
  },
  {
    threshold: 2000,
    colors: [
      'dark-gray',
      'gray',
      ...new Array(2).fill('white'),
      ...new Array(2).fill('gray'),
      'dark-gray',
    ],
  },
  {
    threshold: 2100,
    colors: [
      ...new Array(2).fill('white'),
      ...new Array(2).fill('yellow'),
      ...new Array(3).fill('gold'),
    ],
  },
  {
    threshold: 2200,
    colors: [
      ...new Array(2).fill('gold'),
      ...new Array(2).fill('white'),
      'aqua',
      ...new Array(2).fill('dark-aqua'),
    ],
  },
  {
    threshold: 2300,
    colors: [
      ...new Array(2).fill('dark-purple'),
      ...new Array(2).fill('light-purple'),
      'gold',
      ...new Array(2).fill('yellow'),
    ],
  },
  {
    threshold: 2400,
    colors: [
      ...new Array(2).fill('aqua'),
      ...new Array(2).fill('white'),
      ...new Array(2).fill('gray'),
      'dark-gray',
    ],
  },
  {
    threshold: 2500,
    colors: [
      ...new Array(2).fill('white'),
      ...new Array(2).fill('green'),
      ...new Array(3).fill('dark-green'),
    ],
  },
  {
    threshold: 2600,
    colors: [
      ...new Array(2).fill('dark-red'),
      ...new Array(2).fill('red'),
      ...new Array(2).fill('light-purple'),
      'dark-purple',
    ],
  },
  {
    threshold: 2700,
    colors: [
      ...new Array(2).fill('dark-red'),
      ...new Array(2).fill('red'),
      ...new Array(2).fill('light-purple'),
      'dark-purple',
    ],
  },
  {
    threshold: 2800,
    colors: [
      ...new Array(2).fill('green'),
      ...new Array(2).fill('dark-green'),
      ...new Array(2).fill('gold'),
      'yellow',
    ],
  },
  {
    threshold: 2900,
    colors: [
      ...new Array(2).fill('aqua'),
      ...new Array(2).fill('dark-aqua'),
      ...new Array(2).fill('blue'),
      'dark-blue',
    ],
  },
  {
    threshold: 3000,
    colors: [
      ...new Array(2).fill('yellow'),
      ...new Array(2).fill('gold'),
      ...new Array(2).fill('red'),
      'dark-red',
    ],
  },
]

const stars = [
  {
    threshold: 0,
    star: '✫',
  },
  {
    threshold: 1100,
    star: '✪',
  },
  {
    threshold: 2100,
    star: '❀',
  },
]

export default Vue.extend({
  computed: {
    colors() {
      for (const { threshold, colors } of [...prestiges].reverse()) {
        if ((this.player.hypixelBedwarsLevelInfo?.level || 0) >= threshold) {
          return colors
        }
      }

      return prestiges[0].colors
    },
    star() {
      for (const { threshold, star } of [...stars].reverse()) {
        if ((this.player.hypixelBedwarsLevelInfo?.level || 0) >= threshold) {
          return star
        }
      }

      return stars[0].star
    },
  },
  props: {
    player: {
      type: Object as PropType<Player>,
      required: true,
    },
  },
})
</script>
