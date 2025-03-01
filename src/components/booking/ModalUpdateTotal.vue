<template>
  <q-dialog persistent ref="dialogRef">
    <q-card style="width: 1000px">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Update Total Received Items </span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section style="max-height: 60vh" class="scroll">
        <q-form greedy ref="formRef" style="display: flex; flex-direction: column; gap: 20px">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Total Received Items</span>
            <q-input
              v-model="formState.total_received_items"
              type="number"
              filled
              dense
              outlined
              placeholder="Input total"
              :rules="[($event) => new BookingRules().validatePoTotal($event, totalItems)]"
            ></q-input>
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
import { BookingRules } from 'app/utils/booking.util.js'
import { useItemStore } from 'src/stores/item'

export default {
  name: 'ModalUpdateTotal',
  props: {
    id: {
      type: Number,
      required: true,
    },
    poNumber: {
      type: String,
      required: true,
    },
    totalItems: {
      type: Number,
      required: false,
      default: 0,
    },
    totalReceived: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  setup(props) {
    const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()
    const itemStore = useItemStore()

    const formState = reactive({
      total_received_items: props.totalReceived ?? 0,
    })
    const isLoadingUpdate = ref(false)

    return {
      dialogRef,
      onDialogCancel,
      onDialogOK,
      formState,
      isLoadingUpdate,
      BookingRules,
      itemStore,
    }
  },
  methods: {
    onUpdate(): void {
      ;(this.$refs.formRef as QForm).validate().then((isValid) => {
        if (!isValid) return

        this.isLoadingUpdate = true

        const payload: PayloadUpdateTotalReceivedItems = {
          booking_id: Number(this.$route.params.id as string),
          item_id: this.id,
          po_number: this.poNumber,
          total_received_items: Number(this.formState.total_received_items),
        }

        this.itemStore
          .updateTotalReceivedItems(payload)
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
