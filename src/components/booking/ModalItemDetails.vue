<template>
  <q-dialog persistent ref="dialogRef">
    <q-card style="width: 800px !important">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Item Details </span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section
        style="max-height: 60vh; display: flex; flex-direction: column; gap: 8px"
        class="scroll"
      >
        <q-card
          v-for="(item, index) in items"
          :key="index"
          flat
          bordered
          style="
            width: 100%;
            padding: 8px;
            min-height: 40px;
            display: flex;
            flex-direction: column;
            gap: 4px;
          "
        >
          <span style="font-weight: 500">Stock Code: {{ item.stock_code }}</span>
          <span style="font-size: 12px">Part No: {{ item.part_no }}</span>
          <span style="font-size: 12px">Item Name: {{ item.item_name }}</span>
          <span style="font-size: 12px">Item QTY: {{ item.item_qty }}</span>
        </q-card>
      </q-card-section>

      <q-card-section>
        <div style="display: flex; justify-content: end; align-items: center; gap: 8px">
          <q-btn no-caps label="Cancel" @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar'

export default {
  name: 'ModalItemDetails',
  props: {
    items: {
      type: Object as () => BookingPo['items'],
      required: true,
    },
  },
  setup() {
    const { dialogRef, onDialogCancel } = useDialogPluginComponent()

    return {
      dialogRef,
      onDialogCancel,
    }
  },
}
</script>
