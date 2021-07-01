<template>
  <div class="flex space-x-2 items-center">
    <div>Mode:</div>

    <select
      class="bg-transparent"
      :value="$store.state.config.mode"
      @change="$store.commit('config/set', ['mode', $event.target.value])"
    >
      <option value="OVERALL" class="bg-gray-900">Overall</option>
      <option value="EIGHT_ONE" class="bg-gray-900">Solo</option>
      <option value="EIGHT_TWO" class="bg-gray-900">Doubles</option>
      <option value="FOUR_THREE" class="bg-gray-900">3v3v3v3</option>
      <option value="FOUR_FOUR" class="bg-gray-900">4v4v4v4</option>
      <option value="TWO_FOUR" class="bg-gray-900">4v4</option>

      <template v-if="$store.state.config.showDreamModes">
        <option value="EIGHT_TWO_RUSH" class="bg-gray-900">Rush Doubles</option>
        <option value="FOUR_FOUR_RUSH" class="bg-gray-900">Rush 4v4v4v4</option>
        <option value="EIGHT_TWO_ULTIMATE" class="bg-gray-900">
          Ultimate Doubles
        </option>
        <option value="FOUR_FOUR_ULTIMATE" class="bg-gray-900">
          Ultimate 4v4v4v4
        </option>
        <option value="CASTLE" class="bg-gray-900">Castle</option>
        <option value="EIGHT_TWO_VOIDLESS" class="bg-gray-900">
          Voidless Doubles
        </option>
        <option value="FOUR_FOUR_VOIDLESS" class="bg-gray-900">
          Voidless 4v4v4v4
        </option>
        <option value="EIGHT_TWO_ARMED" class="bg-gray-900">
          Armed Doubles
        </option>
        <option value="FOUR_FOUR_ARMED" class="bg-gray-900">
          Armed 4v4v4v4
        </option>
        <option value="EIGHT_TWO_LUCKY" class="bg-gray-900">
          Lucky Blocks Doubles
        </option>
        <option value="FOUR_FOUR_LUCKY" class="bg-gray-900">
          Lucky Blocks 4v4v4v4
        </option>
      </template>
    </select>
  </div>
</template>
