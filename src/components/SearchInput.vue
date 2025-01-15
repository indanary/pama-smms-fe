<template>
  <q-input
    v-model="searchValue"
    outlined
    dense
    style="width: 100%"
    :placeholder="placeholder"
    debounce="700"
  >
    <template v-slot:append>
      <q-icon name="search" />
    </template>
  </q-input>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  name: 'SearchInput',
  props: {
    placeholder: {
      type: String,
      required: true,
    },
  },
  setup() {
    const searchValue = ref('')

    return {
      searchValue,
    }
  },
  watch: {
    searchValue(val: string) {
      this.$emit('search', val)
    },
  },
}
</script>
