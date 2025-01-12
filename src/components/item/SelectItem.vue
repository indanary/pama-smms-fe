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
    :option-value="'id'"
    :option-labe="'stock_code'"
    :rules="[new BookingRules().validateItems]"
  >
    <template v-slot:selected-item="{ index, opt }">
      <template v-if="modelValue.length > 0">
        {{ index === 0 ? opt.stock_code : `, ${opt.stock_code}` }}
      </template>
    </template>
    <template v-slot:option="{ itemProps, opt }">
      <q-item v-bind="itemProps">
        <q-item-section>
          <q-item-label>
            <div>Stock Code: {{ opt.stock_code }}</div>
          </q-item-label>
          <q-item-label style="font-size: 10px; opacity: 70%">
            <div>Item Name: {{ opt.item_name }}</div>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useItemStore } from 'src/stores/item'
import { BookingRules } from 'app/utils/booking.util.js'

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
      BookingRules,
    }
  },

  mounted() {
    this.fetchOptions()
  },

  methods: {
    fetchOptions(): void {
      this.itemStore.getItemList({}).then((res) => {
        this.options = res
      })
    },
  },
}
</script>
