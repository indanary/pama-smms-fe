<template>
  <q-dialog persistent ref="dialogRef">
    <q-card style="width: 1000px">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Update Approve Status </span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section>
        <span>Are you sure want to update booking status for this booking?</span>
      </q-card-section>

      <q-card-section>
        <div style="display: flex; justify-content: end; align-items: center; gap: 8px">
          <q-btn no-caps label="Cancel" @click="onDialogCancel"></q-btn>
          <q-btn no-caps label="Update" color="primary" @click="onUpdate"></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'
import { useBookingStore } from 'src/stores/booking'

export default {
  name: 'ModalUpdateApproveStatus',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()
    const bookingStore = useBookingStore()

    const isLoadingUpdate = ref(false)

    return {
      dialogRef,
      onDialogCancel,
      onDialogOK,
      bookingStore,
      isLoadingUpdate,
    }
  },
  methods: {
    onUpdate(): void {
      this.isLoadingUpdate = true

      const payload: PayloadUpdateBooking = {
        approved_status: 1,
      }

      this.bookingStore
        .updateBooking(this.id, payload)
        .then(() => {
          this.onDialogOK()
        })
        .finally(() => {
          this.isLoadingUpdate = false
        })
    },
  },
}
</script>
