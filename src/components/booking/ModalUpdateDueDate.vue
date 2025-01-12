<template>
  <q-dialog persistent ref="dialogRef">
    <q-card style="width: 1000px">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Update Due Date </span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section style="max-height: 60vh" class="scroll">
        <q-form greedy ref="formRef" style="display: flex; flex-direction: column; gap: 20px">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Due Date</span>
            <q-input
              v-model="formState.due_date"
              type="text"
              filled
              dense
              outlined
              placeholder="Choose date"
              :mask="formState.due_date"
              :rules="[new BookingRules().validateRequired]"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer"> </q-icon>
              </template>

              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="formState.due_date" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-input>
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
      due_date: '',
    })
    const isLoadingUpdate = ref(false)

    return {
      dialogRef,
      onDialogCancel,
      onDialogOK,
      bookingStore,
      formState,
      isLoadingUpdate,
      BookingRules,
    }
  },
  methods: {
    onUpdate(): void {
      ;(this.$refs.formRef as QForm).validate().then((isValid) => {
        if (!isValid) return

        this.isLoadingUpdate = true

        const payload: PayloadUpdateBookingPoDetail = {
          due_date: this.formState.due_date,
        }

        this.bookingStore
          .updateBookingPoDetail(this.id, payload)
          .then(() => {
            this.onDialogOK()
          })
          .finally(() => {
            this.isLoadingUpdate = false
          })
      })
    },
  },
}
</script>
