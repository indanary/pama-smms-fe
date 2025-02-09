<template>
  <q-dialog persistent ref="dialogRef" full-width>
    <q-card style="width: 800px !important">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Choose PO Items </span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section style="max-height: 60vh" class="scroll">
        <q-form greedy ref="formRef" style="display: flex; flex-direction: column; gap: 20px">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Item Parts</span>
            <div style="display: flex; align-items: start; gap: 8px">
              <div style="width: 50%">
                <q-select
                  v-model="selectedItem"
                  filled
                  dense
                  outlined
                  emit-value
                  multiple
                  fill-input
                  use-input
                  placeholder="Choose item"
                  :options="itemBookingList"
                  :rules="[new BookingRules().validateItems]"
                  @filter="filterFn"
                >
                  <template v-slot:selected-item="{ opt, toggleOption }">
                    <template v-if="selectedItem.length > 0">
                      <q-chip
                        dense
                        removable
                        color="gray"
                        text-color="black"
                        style="cursor: pointer"
                        @remove="toggleOption(opt)"
                      >
                        Stock Code: {{ opt.stock_code }}
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
                </q-select>
              </div>

              <div
                style="
                  width: 50%;
                  display: flex;
                  flex-direction: column;
                  gap: 8px;
                  max-height: 60vh;
                "
                class="scroll"
              >
                <div
                  v-for="(item, index) in selectedItem"
                  :key="index"
                  style="display: flex; align-items: start; justify-content: space-between"
                >
                  <q-card
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
                    <div style="width: 100%; display: flex; justify-content: space-between">
                      <span style="font-weight: 500">Stock Code: {{ item.stock_code }}</span>
                      <q-btn
                        icon="close"
                        flat
                        dense
                        size="sm"
                        @click="onRemoveSelectedItem(index)"
                      ></q-btn>
                    </div>
                    <span style="font-size: 12px">Part No: {{ item.part_no }}</span>
                    <span style="font-size: 12px">Item Name: {{ item.item_name }}</span>
                    <span style="font-size: 12px">Item QTY: {{ item.item_qty }}</span>
                  </q-card>
                </div>
              </div>
            </div>
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
import { ref, reactive } from 'vue'
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
    poNumber: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()
    const itemStore = useItemStore()
    const bookingStore = useBookingStore()

    const isLoadingFetch = ref(true)
    const isLoadingSave = ref(false)
    const itemBookingList = ref([] as ItemBooking[])
    const selectedItem = ref([] as ItemBooking[])
    const params = reactive<ParamItemBookingList>({
      search: '',
      options: 1,
    })

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
      params,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData(): void {
      this.isLoadingFetch = true

      this.itemStore
        .getItemBookingList(Number(this.$route.params.id as string), this.params)
        .then((res) => {
          this.itemBookingList = res
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

        this.fetchData()
      })
    },

    onRemoveSelectedItem(index: number): void {
      this.selectedItem = [...this.selectedItem.filter((_, idx) => idx !== index)]
    },

    onSave(): void {
      ;(this.$refs.formRef as QForm).validate().then((isValid) => {
        if (!isValid) return

        this.isLoadingSave = true

        const payload: PayloadUpdateBookingPoItems = {
          item_ids: this.selectedItem.map((item) => item.id),
          po_number: this.poNumber,
          booking_id: this.bookingId,
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
