<template>
  <q-dialog persistent ref="dialogRef">
    <q-card style="width: 1000px">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Add Item Part</span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section style="max-height: 60vh" class="scroll">
        <q-form greedy ref="formRef" style="display: flex; flex-direction: column; gap: 8px">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Stock Node</span>
            <q-input
              v-model="formState.stock_code"
              type="text"
              filled
              dense
              outlined
              placeholder="Input stock node"
              :rules="[new ItemRules().validateStockCode]"
            ></q-input>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Part No</span>
            <q-input
              v-model="formState.part_no"
              type="text"
              filled
              dense
              outlined
              placeholder="Input part no"
              :rules="[new ItemRules().validateRequired]"
            ></q-input>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Mnemonic</span>
            <q-input
              v-model="formState.mnemonic"
              type="text"
              filled
              dense
              outlined
              placeholder="Input mnemonic"
              :rules="[new ItemRules().validateRequired]"
            ></q-input>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Class</span>
            <q-input
              v-model="formState.class"
              type="text"
              filled
              dense
              outlined
              placeholder="Input class"
              :rules="[new ItemRules().validateRequired]"
            ></q-input>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Item Name</span>
            <q-input
              v-model="formState.item_name"
              type="text"
              filled
              dense
              outlined
              placeholder="Input item name"
              :rules="[new ItemRules().validateRequired]"
            ></q-input>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">UOI</span>
            <q-input
              v-model="formState.uoi"
              type="text"
              filled
              dense
              outlined
              placeholder="Input uoi"
              :rules="[new ItemRules().validateRequired]"
            ></q-input>
          </div>
        </q-form>
      </q-card-section>

      <q-card-section>
        <div style="display: flex; justify-content: end; align-items: center; gap: 8px">
          <q-btn no-caps label="Cancel" @click="onDialogCancel" :disable="isLoadingAdd"></q-btn>
          <q-btn
            no-caps
            label="Add"
            color="primary"
            @click="onAddItem"
            :loading="isLoadingAdd"
          ></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent, type QForm } from 'quasar'
import { reactive, ref } from 'vue'
import { useItemStore } from 'src/stores/item'
import { ItemRules } from 'app/utils/item.util.js'

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
    const isLoadingAdd = ref(false)

    return {
      dialogRef,
      onDialogCancel,
      onDialogOK,
      itemStore,
      formState,
      ItemRules,
      isLoadingAdd,
    }
  },

  methods: {
    onAddItem(): void {
      ;(this.$refs.formRef as QForm).validate().then((isValid) => {
        if (!isValid) return

        this.isLoadingAdd = true

        const payload: PayloadAddItem = {
          stock_code: this.formState.stock_code,
          part_no: this.formState.part_no,
          mnemonic: this.formState.mnemonic,
          class: this.formState.class,
          item_name: this.formState.item_name,
          uoi: this.formState.uoi,
        }

        this.itemStore
          .addItem(payload)
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
