<template>
  <q-dialog persistent ref="dialogRef">
    <q-card style="width: 1000px">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Add Booking </span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section style="max-height: 60vh" class="scroll">
        <q-form greedy ref="formRef" style="display: flex; flex-direction: column; gap: 20px">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Description</span>
            <q-input
              v-model="formState.description"
              type="text"
              filled
              dense
              outlined
              placeholder="Input description"
              :rules="[new BookingRules().validateRequired]"
            ></q-input>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Items</span>
            <SelectItem v-model="formState.items"></SelectItem>
          </div>
        </q-form>
      </q-card-section>

      <q-card-section>
        <div style="display: flex; justify-content: end; align-items: center; gap: 8px">
          <q-btn no-caps label="Cancel" @click="onDialogCancel"></q-btn>
          <q-btn no-caps label="Add" color="primary" @click="onAddBooking"></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent, type QForm } from 'quasar'
import { reactive } from 'vue'
import { useBookingStore } from 'src/stores/booking'
import SelectItem from 'src/components/item/SelectItem.vue'
import { BookingRules } from 'app/utils/booking.util.js'

export default {
  name: 'ModalAddBooking',
  components: { SelectItem },
  setup() {
    const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()
    const bookingStore = useBookingStore()

    const formState = reactive<FormBooking>({
      description: '',
      items: [],
    })

    return {
      dialogRef,
      onDialogCancel,
      onDialogOK,
      bookingStore,
      formState,
      BookingRules,
    }
  },

  methods: {
    onAddBooking(): void {
      ;(this.$refs.formRef as QForm).validate().then((isValid) => {
        if (!isValid) return

        const payload: PayloadAddBooking = {
          description: this.formState.description,
          items: this.formState.items,
        }

        this.bookingStore.addBooking(payload).then(() => {
          this.onDialogOK()
        })
      })
    },
  },
}
</script>
