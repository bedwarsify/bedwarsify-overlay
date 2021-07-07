<template>
  <div class="w-full h-full p-2 flex flex-col space-y-2">
    <div class="flex justify-between items-center p-1">
      <div class="text-lg font-bold leading-none flex space-x-1 items-center">
        Appearance Settings
      </div>

      <router-link to="/settings" class="hover:bg-gray-700 p-1">
        <svg
          class="w-6 h-6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 3v18H3V3h18zM5 19h14V5H5v14zm12-8v2h-6v2H9v-2H7v-2h2V9h2v2h6zm-4-2h-2V7h2v2zm0 8v-2h-2v2h2z"
            fill="currentColor"
          />
        </svg>
      </router-link>
    </div>

    <div
      class="flex justify-between p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <div class="text-lg">Opacity</div>

      <div class="flex flex-grow items-center justify-end">
        <input
          type="range"
          :min="0"
          :max="1"
          :step="Number.MIN_VALUE"
          class="input-range w-full max-w-xs"
          :value="$store.state.config.opacity"
          @input="$store.commit('config/set', ['opacity', $event.target.value])"
        />
      </div>
    </div>

    <div
      class="flex justify-between p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <div class="text-lg">Font</div>

      <div class="flex flex-grow items-center justify-end space-x-3">
        <select
          :value="$store.state.config.fontFamilyPreset"
          @change="
            $store.commit('config/set', [
              'fontFamilyPreset',
              $event.target.value,
            ])
          "
          class="
            bg-transparent
            appearance-none
            border border-2
            py-1
            px-3
            hover:bg-gray-700
            focus:bg-gray-700
          "
        >
          <option value="MINECRAFT">Minecraft</option>
          <option value="SYSTEM_UI">System UI</option>
          <option value="CUSTOM">Custom</option>
        </select>

        <input
          v-if="$store.state.config.fontFamilyPreset === 'CUSTOM'"
          type="text"
          class="
            bg-transparent
            hover:bg-gray-700
            focus:bg-gray-700
            border border-2
            py-1
            px-3
            flex-grow
            max-w-[12rem]
          "
          :value="$store.state.config.fontFamilyCustom"
          @change="
            $store.commit('config/set', [
              'fontFamilyCustom',
              $event.target.value,
            ])
          "
        />

        <div
          class="
            hover:bg-gray-700
            focus-within:bg-gray-700
            border border-2
            flex-grow
            max-w-[6rem]
            flex
          "
        >
          <input
            type="number"
            class="
              bg-transparent
              border-none
              py-1
              px-3
              flex-grow
              w-0
              text-right
            "
            :value="$store.state.config.fontSize"
            @change="
              $store.commit('config/set', ['fontSize', $event.target.value])
            "
          />

          <div class="py-1 pr-3">px</div>
        </div>
      </div>
    </div>

    <div
      class="flex justify-between p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <div class="text-lg">Text Shadow</div>

      <div class="flex flex-grow items-center justify-end space-x-3">
        <button
          class="border border-2 py-1 px-3"
          :class="{
            'hover:bg-gray-700': $store.state.config.textShadow !== 'ENABLED',
            'bg-gray-500': $store.state.config.textShadow === 'ENABLED',
          }"
          @click="$store.commit('config/set', ['textShadow', 'ENABLED'])"
        >
          Enabled
        </button>

        <button
          class="border border-2 py-1 px-3"
          :class="{
            'hover:bg-gray-700':
              $store.state.config.textShadow !== 'PLAYERS_ONLY',
            'bg-gray-500': $store.state.config.textShadow === 'PLAYERS_ONLY',
          }"
          @click="$store.commit('config/set', ['textShadow', 'PLAYERS_ONLY'])"
        >
          Players Only
        </button>

        <button
          class="border border-2 py-1 px-3"
          :class="{
            'hover:bg-gray-700': $store.state.config.textShadow !== 'DISABLED',
            'bg-gray-500': $store.state.config.textShadow === 'DISABLED',
          }"
          @click="$store.commit('config/set', ['textShadow', 'DISABLED'])"
        >
          Disabled
        </button>
      </div>
    </div>

    <div
      class="flex justify-between p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <div class="text-lg">Tags</div>

      <div class="flex flex-grow items-center justify-end space-x-3">
        <button
          class="border border-2 py-1 px-3"
          :class="{
            'hover:bg-gray-700': $store.state.config.shortTags,
            'bg-gray-500': !$store.state.config.shortTags,
          }"
          @click="$store.commit('config/set', ['shortTags', false])"
        >
          Normal — <span class="text-red-300">[SNIP@]</span>
        </button>

        <button
          class="border border-2 py-1 px-3"
          :class="{
            'hover:bg-gray-700': !$store.state.config.shortTags,
            'bg-gray-500': $store.state.config.shortTags,
          }"
          @click="$store.commit('config/set', ['shortTags', true])"
        >
          Short — <span class="text-red-300">[S@]</span>
        </button>
      </div>
    </div>

    <div
      class="flex justify-between p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <div class="text-lg">Column Labels</div>

      <div class="flex flex-grow items-center justify-end space-x-3">
        <button
          class="border border-2 py-1 px-3"
          :class="{
            'hover:bg-gray-700': $store.state.config.columnLabels !== 'NORMAL',
            'bg-gray-500': $store.state.config.columnLabels === 'NORMAL',
          }"
          @click="$store.commit('config/set', ['columnLabels', 'NORMAL'])"
        >
          Normal — <span class="font-bold">F. Kills</span>
        </button>

        <button
          class="border border-2 py-1 px-3"
          :class="{
            'hover:bg-gray-700': $store.state.config.columnLabels !== 'SHORT',
            'bg-gray-500': $store.state.config.columnLabels === 'SHORT',
          }"
          @click="$store.commit('config/set', ['columnLabels', 'SHORT'])"
        >
          Short — <span class="font-bold">FK</span>
        </button>

        <button
          class="border border-2 py-1 px-3"
          :class="{
            'hover:bg-gray-700':
              $store.state.config.columnLabels !== 'DISABLED',
            'bg-gray-500': $store.state.config.columnLabels === 'DISABLED',
          }"
          @click="$store.commit('config/set', ['columnLabels', 'DISABLED'])"
        >
          Disabled
        </button>
      </div>
    </div>

    <div
      class="flex justify-between p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <div class="text-lg">Background Color</div>

      <div class="flex flex-grow items-center justify-end space-x-3">
        <div
          class="w-[calc(2rem+4px)] h-[calc(2rem+4px)] border border-2"
          :style="{
            'background-color': $store.getters['config/backgroundColor'],
          }"
        />

        <input
          type="text"
          class="
            bg-transparent
            hover:bg-gray-700
            focus:bg-gray-700
            border border-2
            py-1
            px-3
            flex-grow
            max-w-[6rem]
          "
          :value="$store.state.config.customBackgroundColor"
          @change="
            $store.commit('config/set', [
              'customBackgroundColor',
              $event.target.value,
            ])
          "
        />

        <button
          @click="
            $store.commit('config/set', ['customBackgroundColor', '#18181b'])
          "
          class="border border-2 p-1 hover:bg-gray-700 text-red-400"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              v-if="$store.state.config.customBackgroundColor !== '#18181b'"
              d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
