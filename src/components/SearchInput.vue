<template>
  <div style="width: 100%; display: flex; justify-content: space-between; align-items: end">
    <div></div>
    <q-input v-model="searchValue" outlined dense style="width: 200px" :placeholder="placeholder">
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>
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
