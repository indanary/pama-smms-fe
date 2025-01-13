<template>
  <q-dialog persistent ref="dialogRef">
    <q-card style="width: 1000px">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Create WR</span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section style="max-height: 60vh" class="scroll">
        <q-form greedy ref="formRef" style="display: flex; flex-direction: column; gap: 20px">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">WR No</span>
            <q-input
              v-model="formState.wr_no"
              type="text"
              filled
              dense
              outlined
              placeholder="Input WR no"
              :rules="[new BookingRules().validateRequired]"
            >
            </q-input>
          </div>
        </q-form>
      </q-card-section>

      <q-card-section>
        <div style="display: flex; justify-content: end; align-items: center; gap: 8px">
          <q-btn no-caps label="Cancel" @click="onDialogCancel" :disable="isLoadingAdd"></q-btn>
          <q-btn no-caps label="Add" color="primary" @click="onAdd" :loading="isLoadingAdd"></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent, type QForm } from 'quasar'
import { reactive, ref } from 'vue'
import { useBookingStore } from 'src/stores/booking'
import { BookingRules } from 'app/utils/booking.util.js'

export default {
  name: 'ModalUpdateTotal',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()
    const bookingStore = useBookingStore()

    const formState = reactive({
      wr_no: '',
    })
    const isLoadingAdd = ref(false)

    return {
      dialogRef,
      onDialogCancel,
      onDialogOK,
      bookingStore,
      formState,
      isLoadingAdd,
      BookingRules,
    }
  },
  methods: {
    onAdd(): void {
      ;(this.$refs.formRef as QForm).validate().then((isValid) => {
        if (!isValid) return

        this.isLoadingAdd = true

        const payload: PayloadUpdateBooking = {
          wr_no: this.formState.wr_no,
        }

        this.bookingStore
          .updateBooking(this.id, payload)
          .then(() => {
            this.onDialogOK()
          })
          .finally(() => {
            this.isLoadingAdd = false
          })
      })
    },
  },
}
</script>
