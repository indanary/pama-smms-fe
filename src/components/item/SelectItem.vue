<template>
  <q-select
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    filled
    dense
    outlined
    emit-value
    multiple
    fill-input
    use-input
    placeholder="Choose item"
    :loading="isLoadingFetch"
    :options="options"
    :rules="[new BookingRules().validateItems]"
    style="width: 100%"
    @filter="filterFn"
  >
    <template v-slot:selected-item="{ opt, toggleOption }">
      <template v-if="modelValue.length > 0">
        <q-chip
          v-if="opt.stock_code !== null"
          dense
          removable
          color="gray"
          text-color="black"
          style="cursor: pointer"
          @remove="toggleOption(opt)"
        >
          Stock Code: {{ opt.stock_code }}
        </q-chip>
        <q-chip
          v-else
          dense
          removable
          color="gray"
          text-color="black"
          style="cursor: pointer"
          @remove="toggleOption(opt)"
        >
          Part No: {{ opt.part_no }}
        </q-chip>
      </template>
    </template>
    <template v-slot:option="{ itemProps, opt }">
      <q-item v-bind="itemProps">
        <q-item-section>
          <q-item-label>
            <div>Stock Code: {{ opt.stock_code }}</div>
          </q-item-label>
          <q-item-label style="font-size: 12px">
            <div>Part No: {{ opt.part_no }}</div>
          </q-item-label>
          <q-item-label style="font-size: 12px">
            <div>Item Name: {{ opt.item_name }}</div>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:no-option>
      <span>No options</span>
    </template>
  </q-select>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import { useItemStore } from 'src/stores/item'
import { BookingRules } from 'app/utils/booking.util.js'

export default {
  name: 'SelectItem',
  props: {
    modelValue: {
      type: Object as () => SelectedItemBooking[],
      required: true,
    },
  },
  setup() {
    const itemStore = useItemStore()

    const options = ref([] as SelectedItemBooking[])
    const params = reactive<ParamItemList>({
      search: '',
      limit: 25,
    })
    const isLoadingFetch = ref(true)

    return {
      itemStore,
      options,
      BookingRules,
      params,
      isLoadingFetch,
    }
  },

  mounted() {
    this.fetchOptions()
  },

  methods: {
    fetchOptions(): void {
      this.isLoadingFetch = true

      this.itemStore
        .getItemList(this.params)
        .then((res) => {
          this.options = res.data.map((data) => ({
            ...data,
            qty: 0,
          }))
        })
        .finally(() => {
          this.isLoadingFetch = false
        })
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filterFn(val: string, update: any): void {
      update(() => {
        const searchKeyword = val.toLowerCase()

        this.params.search = searchKeyword

        this.fetchOptions()
      })
    },
  },
}
</script>
