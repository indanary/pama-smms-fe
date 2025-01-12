<template>
  <q-dialog persistent ref="dialogRef">
    <q-card style="width: 1200px">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Import Item Part</span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section style="max-height: 60vh" class="scroll">
        <q-form greedy ref="formRef" style="display: flex; flex-direction: column; gap: 8px">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Upload File</span>
            <q-file
              dense
              v-model="file"
              label="Select File"
              outlined
              max-files="1"
              accept=".xlsx"
              :rules="[(val: object | null) => new ItemRules().validateFileRequired(val)]"
              @rejected="onRejected"
            ></q-file>
          </div>
        </q-form>
      </q-card-section>

      <q-card-section>
        <div style="display: flex; justify-content: end; align-items: center; gap: 8px">
          <q-btn no-caps label="Cancel" @click="onDialogCancel" :disable="isLoadingAdd"></q-btn>
          <q-btn
            no-caps
            label="Upload"
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
import { useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'
import { ItemRules } from 'app/utils/item.util.js'
import { showNotificationFailed } from 'app/utils/notify.util.js'
import * as XLSX from 'xlsx'
import { useItemStore } from 'src/stores/item'

export default {
  name: 'ModalImportItem',
  setup() {
    const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
    const itemStore = useItemStore()

    const file = ref<null | File>(null)
    const isLoadingAdd = ref(false)

    return {
      dialogRef,
      onDialogOK,
      onDialogCancel,
      itemStore,
      file,
      ItemRules,
      isLoadingAdd,
    }
  },
  methods: {
    onRejected() {
      showNotificationFailed('File must be .xlsx')
    },

    handleFailedImport(error?: string): void {
      let message = 'Import file failed'
      if (error) message += `: ${error}`
      showNotificationFailed(message)
    },

    onAddItem(): void {
      if (!this.file) return

      this.isLoadingAdd = true

      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0] ?? ''
          const worksheet = workbook.Sheets[sheetName]

          if (!worksheet) return

          const jsonData: ExcelColumnItem[] = XLSX.utils.sheet_to_json<ExcelColumnItem>(worksheet)

          this.itemStore
            .mapExportedItem(jsonData)
            .then((res: ExcelColumnItem[]) => {
              const payload: PayloadImportItem = {
                items: res,
              }

              this.itemStore
                .importItem(payload)
                .then(() => {
                  this.onDialogOK()
                })
                .finally(() => {
                  this.isLoadingAdd = false
                })
            })
            .catch((err) => {
              this.handleFailedImport(err)
            })
            .finally(() => {
              this.isLoadingAdd = false
            })
        } catch (error) {
          this.isLoadingAdd = false
          this.handleFailedImport(error as string)
        }
      }

      reader.onerror = () => {
        this.handleFailedImport()
      }

      reader.readAsBinaryString(this.file)
    },
  },
}
</script>
