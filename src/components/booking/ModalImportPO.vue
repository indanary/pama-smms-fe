<template>
  <q-dialog persistent ref="dialogRef">
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Import PO </span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section style="max-height: 70vh" class="scroll">
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
              :rules="[(val: object | null) => new BookingRules().validateFileRequired(val)]"
              @rejected="onRejected"
            ></q-file>
          </div>
        </q-form>

        <q-banner
          v-if="isItemError"
          inline-actions
          dense
          rounded
          class="text-white bg-red"
          style="margin-bottom: 12px"
        >
          There are mismatched data between the imported file and the PO list.
        </q-banner>

        <q-banner
          v-if="isItemEmpty"
          inline-actions
          dense
          rounded
          class="text-white bg-red"
          style="margin-bottom: 12px"
        >
          There is no booking po data found for this booking.
        </q-banner>

        <template v-if="tableData.length > 0">
          <q-table
            flat
            :columns="tableColumns"
            :rows="tableData"
            row-key="id"
            table-header-style="background: var(--app-primary); color: white"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  <template v-if="col.name === 'error_message'">
                    <span style="color: red">{{ props.row.error_message }}</span>
                  </template>

                  <template v-else>
                    <span>{{ props.row[col.name] }}</span>
                  </template>
                </q-td>
              </q-tr>
            </template>
          </q-table>

          <div style="display: flex; justify-content: start">
            <q-pagination
              v-model="tablePaginations.page"
              :max="tablePaginations.rowsNumber"
              :max-pages="6"
              boundary-numbers
              size="12px"
              @update:model-value="onPagePagination"
            />
          </div>
        </template>
      </q-card-section>

      <q-card-section>
        <div style="display: flex; justify-content: end; align-items: center; gap: 8px">
          <q-btn no-caps label="Cancel" @click="onDialogCancel" :disable="isLoadingImport"></q-btn>
          <q-btn
            :disable="isItemError"
            no-caps
            label="Import"
            color="primary"
            @click="onImport"
            :loading="isLoadingImport"
          ></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import { useDialogPluginComponent, type QTableColumn } from 'quasar'
import { showNotificationFailed } from 'app/utils/notify.util.js'
import { BookingRules } from 'app/utils/booking.util.js'
import * as XLSX from 'xlsx'
import { useBookingStore } from 'src/stores/booking'

export default {
  name: 'ModalImportPO',
  props: {
    id: {
      type: String,
      required: true,
    },
    itemBookingList: {
      type: Object as () => ItemBooking[],
      required: true,
    },
  },
  setup() {
    const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()
    const bookingStore = useBookingStore()

    const tableColumns: QTableColumn[] = [
      {
        name: 'booking_id',
        required: true,
        label: 'Booking ID',
        field: 'booking_id',
        align: 'left',
      },
      {
        name: 'po_number',
        required: true,
        label: 'PO Number',
        field: 'po_number',
        align: 'left',
      },
      {
        name: 'item_stock_code',
        required: true,
        label: 'Item Stock Code',
        field: 'item_stock_code',
        align: 'left',
      },
      {
        name: 'total_qty',
        required: true,
        label: 'Total Qty',
        field: 'total_qty',
        align: 'left',
      },
      {
        name: 'error_message',
        required: true,
        label: 'Error',
        field: 'error_message',
        align: 'left',
      },
    ]

    const isLoadingImport = ref(false)
    const file = ref<null | File>(null)
    const tableData = ref([] as ExcelDataBookingPo[])
    const isItemError = ref(false)
    const isItemEmpty = ref(false)
    const tablePaginations = reactive({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
      recordPerPage: [10, 25, 50],
    })

    return {
      tableColumns,
      dialogRef,
      onDialogCancel,
      onDialogOK,
      bookingStore,
      isLoadingImport,
      BookingRules,
      file,
      tableData,
      isItemError,
      isItemEmpty,
      tablePaginations,
    }
  },
  watch: {
    file() {
      this.onExtractData()
    },
  },
  methods: {
    onPagePagination(page: number): void {
      this.tablePaginations.page = page
    },

    onRejected() {
      showNotificationFailed('File must be .xlsx')
    },

    handleFailedImport(error?: string): void {
      let message = 'Import file failed'
      if (error) message += `: ${error}`
      showNotificationFailed(message)
    },

    onExtractData(): void {
      if (!this.file) return

      this.isItemEmpty = false
      this.isItemError = false

      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0] ?? ''
          const worksheet = workbook.Sheets[sheetName]

          if (!worksheet) return

          const jsonData: ExcelColumnBookingPo[] =
            XLSX.utils.sheet_to_json<ExcelColumnBookingPo>(worksheet)

          this.bookingStore
            .mapExportedBookingPo(jsonData, this.itemBookingList, this.id)
            .then((res: ExcelDataBookingPo[]) => {
              this.tableData = res
              this.isItemEmpty = this.tableData.length === 0
              this.isItemError = this.tableData.some((data) => data.error_message !== '')
            })
            .catch((err) => {
              this.handleFailedImport(err)
            })
        } catch (error) {
          this.handleFailedImport(error as string)
        }
      }

      reader.onerror = () => {
        this.handleFailedImport()
      }

      reader.readAsBinaryString(this.file)
    },

    onImport(): void {
      this.isLoadingImport = true

      const payload: PayloadUploadBookingPo = {
        po_data: this.tableData.map((data) => ({
          po_number: data.po_number,
          item_stock_code: data.item_stock_code,
          total_qty: data.total_qty,
        })),
      }

      this.bookingStore
        .uploadBookingPo(Number(this.id), payload)
        .then(() => {
          this.onDialogOK()
        })
        .finally(() => {
          this.isLoadingImport = false
        })
    },
  },
}
</script>
