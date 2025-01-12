<template>
  <q-dialog persistent ref="dialogRef">
    <q-card style="width: 1000px">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Update PO Number </span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form greedy ref="formRef" style="display: flex; flex-direction: column; gap: 20px">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">PO Number</span>
            <div
              v-for="(po, index) in poNumbers"
              :key="index"
              style="display: flex; flex-direction: column; gap: 8px"
            >
              <div style="display: flex; align-items: center; gap: 8px">
                <q-input
                  v-model="poNumbers[index]"
                  type="text"
                  filled
                  dense
                  outlined
                  placeholder="Input PO Number"
                  style="width: 300px"
                  :rules="[new BookingRules().validateRequired]"
                ></q-input>
                <q-btn
                  v-if="poNumbers.length > 1"
                  icon="do_not_disturb_on"
                  dense
                  flat
                  color="red"
                  @click="removePo(index)"
                  style="margin-bottom: 20px"
                ></q-btn>
                <q-btn
                  v-if="index === poNumbers.length - 1"
                  icon="add_circle"
                  dense
                  flat
                  color="green"
                  @click="addPo"
                  style="margin-bottom: 20px"
                ></q-btn>
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-section>
        <div style="display: flex; justify-content: end; align-items: center; gap: 8px">
          <q-btn no-caps label="Cancel" @click="onDialogCancel" :disable="isLoadingUpdate"></q-btn>
          <q-btn
            no-caps
            label="Update"
            color="primary"
            @click="onUpdate"
            :loading="isLoadingUpdate"
          ></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent, type QForm } from 'quasar'
import { ref } from 'vue'
import { useBookingStore } from 'src/stores/booking'
import { BookingRules } from 'app/utils/booking.util.js'

export default {
  name: 'ModalUpdatePO',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()
    const bookingStore = useBookingStore()

    const poNumbers = ref([''] as string[])

    const isLoadingUpdate = ref(false)

    return {
      dialogRef,
      onDialogCancel,
      onDialogOK,
      poNumbers,
      bookingStore,
      BookingRules,
      isLoadingUpdate,
    }
  },
  methods: {
    onUpdate(): void {
      ;(this.$refs.formRef as QForm).validate().then((isValid) => {
        if (!isValid) return

        this.isLoadingUpdate = true

        const payload: PayloadUpdateBookingPo = {
          booking_id: this.id,
          po_numbers: this.poNumbers,
        }

        this.bookingStore
          .updateBookingPo(payload)
          .then(() => {
            this.onDialogOK()
          })
          .finally(() => {
            this.isLoadingUpdate = false
          })
      })
    },

    removePo(index: number): void {
      this.poNumbers = this.poNumbers.filter((_, idx) => idx !== index)
    },

    addPo(): void {
      this.poNumbers.push('')
    },
  },
}
</script>
