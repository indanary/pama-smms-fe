<template>
  <q-select
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    filled
    dense
    outlined
    emit-value
    map-options
    multiple
    fill-input
    use-input
    placeholder="Choose item"
    :options="options"
    :option-label="'part_no'"
    :option-value="'id'"
  >
  </q-select>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useItemStore } from 'src/stores/item'

export default {
  name: 'SelectItem',
  props: {
    modelValue: {
      type: Object as () => number[],
      required: true,
    },
  },
  setup() {
    const itemStore = useItemStore()

    const options = ref([] as Item[])

    return {
      itemStore,
      options,
    }
  },

  mounted() {
    this.fetchOptions()
  },

  methods: {
    fetchOptions(): void {
      this.itemStore.getItemList().then((res) => {
        this.options = res
      })
    },
  },
}
</script>
