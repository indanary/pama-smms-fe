<template>
  <PageCard title="Add Booking">
    <q-form greedy ref="formRef" class="form-layout">
      <div class="left-layout">
        <div style="display: flex; flex-direction: column; gap: 8px">
          <span class="app-input-required">Description</span>
          <q-input
            v-model="formState.description"
            type="textarea"
            filled
            dense
            outlined
            placeholder="Input description"
            @update:model-value="convertToUppercase('description')"
            :rules="[new BookingRules().validateRequired]"
          ></q-input>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px">
          <span class="app-input-required">CN No</span>
          <q-input
            v-model="formState.cn_no"
            type="text"
            filled
            dense
            outlined
            placeholder="Input CN no"
            @update:model-value="convertToUppercase('cn_no')"
            :rules="[new BookingRules().validateRequired]"
          ></q-input>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px">
          <span>Requested By</span>
          <q-input
            v-model="formState.requested_by"
            type="text"
            filled
            dense
            outlined
            placeholder="Input requested by"
            @update:model-value="convertToUppercase('requested_by')"
          ></q-input>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px">
          <div style="display: flex; align-items: center; gap: 8px">
            <span class="app-input-required">Item Parts</span>
            <q-btn
              no-caps
              size="sm"
              label="Add Manual"
              color="primary"
              @click="openModalAddManual"
            ></q-btn>
          </div>
          <div style="display: flex; align-items: start; gap: 16px">
            <SelectItem v-model="formState.items"></SelectItem>
          </div>
        </div>
      </div>

      <div class="right-layout">
        <span class="app-input-required">Selected Item Parts</span>
        <div
          style="
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: 55vh;
            margin-top: 8px;
            border: 4px dashed #dddddd;
            border-radius: 4px;
            padding: 8px;
          "
          class="scroll"
        >
          <template v-if="formState.items.length === 0">
            <div
              style="
                width: 100%;
                height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <span style="opacity: 0.5">Empty Selected Item Parts</span>
            </div>
          </template>

          <template v-else>
            <div
              v-for="(item, index) in formState.items"
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
                <div style="display: flex; align-items: start; gap: 4px">
                  <span class="app-input-required" style="font-size: 12px">Item Qty: </span>
                  <q-input
                    dense
                    outlined
                    type="number"
                    v-model="item.qty"
                    :rules="[new BookingRules().validateItemsQty]"
                  ></q-input>
                </div>
              </q-card>
            </div>
          </template>
        </div>
      </div>
    </q-form>

    <div
      style="display: flex; justify-content: start; align-items: center; gap: 8px; margin-top: 24px"
    >
      <q-btn no-caps label="Cancel" @click="onCancel" :disable="isLoadingAdd"></q-btn>
      <q-btn
        no-caps
        label="Add"
        color="primary"
        @click="onAddBooking"
        :loading="isLoadingAdd"
      ></q-btn>
    </div>
  </PageCard>
</template>

<script lang="ts">
import { type QForm } from 'quasar'
import { reactive, ref } from 'vue'
import { useBookingStore } from 'src/stores/booking'
import SelectItem from 'src/components/item/SelectItem.vue'
import { BookingRules } from 'app/utils/booking.util.js'
import ModalAddManualItem from 'src/components/booking/ModalAddManualItem.vue'

export default {
  name: 'AddBookingPage',
  components: { SelectItem },
  setup() {
    const bookingStore = useBookingStore()

    const formState = reactive<FormBooking>({
      description: '',
      cn_no: '',
      items: [],
      requested_by: '',
    })

    const isLoadingAdd = ref(false)

    return {
      bookingStore,
      formState,
      isLoadingAdd,
      BookingRules,
    }
  },
  methods: {
    onAddBooking(): void {
      ;(this.$refs.formRef as QForm).validate().then((isValid) => {
        if (!isValid) return

        this.isLoadingAdd = true

        const itemsPayload: PayloadAddBooking['items'] = this.formState.items.map((item) => ({
          id: item.id,
          qty: item.qty,
        }))

        const payload: PayloadAddBooking = {
          description: this.formState.description,
          cn_no: this.formState.cn_no,
          items: itemsPayload,
          requested_by: this.formState.requested_by,
        }

        this.bookingStore
          .addBooking(payload)
          .then(() => {
            this.$router.push('/bookings')
          })
          .finally(() => {
            this.isLoadingAdd = false
          })
      })
    },

    convertToUppercase(val: keyof FormBooking): void {
      const value = this.formState[val]
      if (typeof value === 'string') {
        this.formState[val] = value.toUpperCase() as never
      } else if (value !== undefined && value !== null) {
        this.formState[val] = value.toString().toUpperCase() as never
      }
    },

    onCancel(): void {
      ;(this.$refs.formRef as QForm).reset()

      this.$router.push('/bookings')
    },

    onRemoveSelectedItem(index: number): void {
      this.formState.items = [...this.formState.items.filter((_, idx) => idx !== index)]
    },

    openModalAddManual(): void {
      this.$q
        .dialog({
          component: ModalAddManualItem,
        })
        .onOk((data: SelectedItemBooking) => {
          this.formState.items = [...this.formState.items, data]
        })
    },
  },
}
</script>

<style lang="scss">
.form-layout {
  width: 100%;
  display: flex;
  gap: 24px;

  flex-direction: row;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 12px;
  }
}

.left-layout {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 50%;

  @media (max-width: 600px) {
    width: 100%;
  }
}

.right-layout {
  width: 50%;

  @media (max-width: 600px) {
    width: 100%;
  }
}
</style>
