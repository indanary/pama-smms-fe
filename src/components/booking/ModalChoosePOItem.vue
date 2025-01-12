<template>
  <q-dialog persistent ref="dialogRef">
    <q-card style="width: 1000px">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Choose PO Items </span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section style="max-height: 60vh" class="scroll">
        <q-form greedy ref="formRef" style="display: flex; flex-direction: column; gap: 20px">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Items</span>
            <q-select
              v-model="selectedItem"
              filled
              dense
              outlined
              emit-value
              map-options
              multiple
              fill-input
              use-input
              placeholder="Choose item"
              :options="itemBookingList"
              :option-value="'id'"
              :option-labe="'stock_code'"
              :rules="[new BookingRules().validateItems]"
            >
              <template v-slot:selected-item="{ index, opt }">
                <template v-if="selectedItem.length > 0">
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
          </div>
        </q-form>
      </q-card-section>

      <q-card-section>
        <div style="display: flex; justify-content: end; align-items: center; gap: 8px">
          <q-btn no-caps label="Cancel" @click="onDialogCancel" :disable="isLoadingSave"></q-btn>
          <q-btn
            no-caps
            label="Save"
            color="primary"
            @click="onSave"
            :loading="isLoadingSave"
          ></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent, type QForm } from 'quasar'
import { ref } from 'vue'
import { useItemStore } from 'src/stores/item'
import { BookingRules } from 'app/utils/booking.util.js'
import { useBookingStore } from 'src/stores/booking'

export default {
  name: 'ModalChoosePOItem',
  props: {
    bookingId: {
      type: Number,
      required: true,
    },
    poId: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()
    const itemStore = useItemStore()
    const bookingStore = useBookingStore()

    const isLoadingFetch = ref(true)
    const isLoadingSave = ref(false)
    const itemBookingList = ref([] as Item[])
    const selectedItem = ref([] as number[])

    return {
      dialogRef,
      onDialogCancel,
      onDialogOK,
      itemStore,
      bookingStore,
      isLoadingSave,
      isLoadingFetch,
      itemBookingList,
      selectedItem,
      BookingRules,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData(): void {
      this.isLoadingFetch = true

      const params: ParamItemBookingList = {
        booking_id: this.bookingId,
      }

      this.itemStore
        .getItemBookingList(params)
        .then((res) => {
          this.itemBookingList = res
        })
        .finally(() => {
          this.isLoadingFetch = false
        })
    },

    onSave(): void {
      ;(this.$refs.formRef as QForm).validate().then((isValid) => {
        if (!isValid) return

        this.isLoadingSave = true

        const payload: PayloadUpdateBookingPoItems = {
          booking_id: this.bookingId,
          item_ids: this.selectedItem,
          po_id: this.poId,
        }

        this.bookingStore
          .updateBookingPoItems(payload)
          .then(() => {
            this.onDialogOK()
          })
          .finally(() => {
            this.isLoadingSave = false
          })
      })
    },
  },
}
</script>
