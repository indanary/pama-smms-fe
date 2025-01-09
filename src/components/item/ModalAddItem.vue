<template>
  <q-dialog persistent ref="dialogRef">
    <q-card style="width: 1000px">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Add Item </span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form greedy ref="formRef" style="display: flex; flex-direction: column; gap: 20px">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span>Stock Node</span>
            <q-input
              v-model="formState.stock_code"
              type="text"
              filled
              dense
              outlined
              placeholder="Input stock node"
            ></q-input>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px">
            <span>Part No</span>
            <q-input
              v-model="formState.part_no"
              type="text"
              filled
              dense
              outlined
              placeholder="Input part no"
            ></q-input>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px">
            <span>Mnemonic</span>
            <q-input
              v-model="formState.mnemonic"
              type="text"
              filled
              dense
              outlined
              placeholder="Input mnemonic"
            ></q-input>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px">
            <span>Class</span>
            <q-input
              v-model="formState.class"
              type="text"
              filled
              dense
              outlined
              placeholder="Input class"
            ></q-input>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px">
            <span>Item Name</span>
            <q-input
              v-model="formState.item_name"
              type="text"
              filled
              dense
              outlined
              placeholder="Input item name"
            ></q-input>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px">
            <span>UOI</span>
            <q-input
              v-model="formState.uoi"
              type="text"
              filled
              dense
              outlined
              placeholder="Input uoi"
            ></q-input>
          </div>
        </q-form>
      </q-card-section>

      <q-card-section>
        <div style="display: flex; justify-content: end; align-items: center; gap: 8px">
          <q-btn no-caps label="Cancel" @click="onDialogCancel"></q-btn>
          <q-btn no-caps label="Add" color="primary" @click="onAddItem"></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent, type QForm } from 'quasar'
import { reactive } from 'vue'
import { useItemStore } from 'src/stores/item'

export default {
  name: 'ModalAddItem',
  setup() {
    const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()
    const itemStore = useItemStore()

    const formState = reactive<FormAddItem>({
      stock_code: '',
      part_no: '',
      mnemonic: '',
      class: '',
      item_name: '',
      uoi: '',
    })

    return {
      dialogRef,
      onDialogCancel,
      onDialogOK,
      itemStore,
      formState,
    }
  },

  methods: {
    onAddItem(): void {
      ;(this.$refs.formRef as QForm).validate().then((isValid) => {
        if (!isValid) return

        const payload: PayloadAddItem = {
          stock_code: this.formState.stock_code,
          part_no: this.formState.part_no,
          mnemonic: this.formState.mnemonic,
          class: this.formState.class,
          item_name: this.formState.item_name,
          uoi: this.formState.uoi,
        }

        this.itemStore.addItem(payload).then(() => {
          this.onDialogOK()
        })
      })
    },
  },
}
</script>
