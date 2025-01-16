<template>
  <q-dialog persistent ref="dialogRef">
    <q-card style="width: 1000px">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Delete Booking </span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section style="max-height: 60vh" class="scroll">
        <span style="font-size: 16px; font-weight: 500"
          >Are you sure you want to delete this booking?</span
        >
        <q-form
          greedy
          ref="formRef"
          style="display: flex; flex-direction: column; gap: 8px; margin-top: 16px"
        >
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Delete Reason</span>
            <q-input
              v-model="formState.remove_reason"
              type="textarea"
              filled
              dense
              outlined
              placeholder="Input delete reason"
              :rules="[new BookingRules().validateRequired]"
            ></q-input>
          </div>
        </q-form>
      </q-card-section>

      <q-card-section>
        <div style="display: flex; justify-content: end; align-items: center; gap: 8px">
          <q-btn no-caps label="Cancel" @click="onDialogCancel"></q-btn>
          <q-btn no-caps label="Delete" color="primary" @click="onDeleteBooking"></q-btn>
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
  name: 'ModalDeleteBooking',
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
      remove_reason: '',
    })
    const isLoadingDelete = ref(false)

    return {
      dialogRef,
      onDialogCancel,
      onDialogOK,
      bookingStore,
      BookingRules,
      formState,
      isLoadingDelete,
    }
  },
  methods: {
    onDeleteBooking(): void {
      ;(this.$refs.formRef as QForm).validate().then((isValid) => {
        if (!isValid) return

        this.isLoadingDelete = true

        const payload: PayloadDeleteBooking = {
          remove_reason: this.formState.remove_reason,
        }

        this.bookingStore
          .deleteBooking(this.id, payload)
          .then(() => {
            this.onDialogOK()
          })
          .finally(() => {
            this.isLoadingDelete = false
          })
      })
    },
  },
}
</script>
