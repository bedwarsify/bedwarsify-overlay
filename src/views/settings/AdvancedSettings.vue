<template>
  <div class="w-full h-full p-2 flex flex-col space-y-2">
    <div class="flex justify-between items-center p-1">
      <div class="text-lg font-bold leading-none flex space-x-1 items-center">
        Advanced Settings
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
      <div class="text-lg">Party Detection</div>

      <div class="flex flex-grow items-center justify-end">
        <button
          @click="
            $store.commit('config/set', [
              'partyDetection',
              !$store.state.config.partyDetection,
            ])
          "
          class="border border-2 p-1 hover:bg-gray-700"
        >
          <svg
            v-if="$store.state.config['partyDetection']"
            class="w-6 h-6 text-green-400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
              fill="currentColor"
            />
          </svg>

          <svg
            v-else
            class="w-6 h-6 text-red-400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      class="flex justify-between p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <div class="text-lg">Auto Report Snipers</div>

      <div class="flex flex-grow items-center justify-end">
        <button
          @click="
            $store.commit('config/set', [
              'autoReportSnipers',
              !$store.state.config.autoReportSnipers,
            ])
          "
          class="border border-2 p-1 hover:bg-gray-700"
        >
          <svg
            v-if="$store.state.config['autoReportSnipers']"
            class="w-6 h-6 text-green-400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
              fill="currentColor"
            />
          </svg>

          <svg
            v-else
            class="w-6 h-6 text-red-400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      class="flex justify-between p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <div class="text-lg">Missing Players Warning</div>

      <div class="flex flex-grow items-center justify-end">
        <button
          @click="
            $store.commit('config/set', [
              'missingPlayersWarning',
              !$store.state.config.missingPlayersWarning,
            ])
          "
          class="border border-2 p-1 hover:bg-gray-700"
        >
          <svg
            v-if="$store.state.config['missingPlayersWarning']"
            class="w-6 h-6 text-green-400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
              fill="currentColor"
            />
          </svg>

          <svg
            v-else
            class="w-6 h-6 text-red-400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      class="flex justify-between p-3 items-center hover:bg-gray-800"
      :style="$store.getters['config/opacityStyle']"
    >
      <div class="text-lg">Set API Key from /api new</div>

      <div class="flex flex-grow items-center justify-end">
        <button
          @click="
            $store.commit('config/set', [
              'setApiKeyFromCmd',
              !$store.state.config.setApiKeyFromCmd,
            ])
          "
          class="border border-2 p-1 hover:bg-gray-700"
        >
          <svg
            v-if="$store.state.config['setApiKeyFromCmd']"
            class="w-6 h-6 text-green-400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
              fill="currentColor"
            />
          </svg>

          <svg
            v-else
            class="w-6 h-6 text-red-400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
