<template>
  <q-dialog persistent ref="dialogRef">
    <q-card style="width: 1000px">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Delete Booking </span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section>
        <span>Are you sure want to delete this booking?</span>
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
import { useDialogPluginComponent } from 'quasar'
import { useBookingStore } from 'src/stores/booking'

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

    return {
      dialogRef,
      onDialogCancel,
      onDialogOK,
      bookingStore,
    }
  },
  methods: {
    onDeleteBooking(): void {
      this.bookingStore.deleteBooking(this.id).then(() => {
        this.onDialogOK()
      })
    },
  },
}
</script>
