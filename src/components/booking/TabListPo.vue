<template>
  <span style="font-size: 20px; font-weight: 600">List Booking PO</span>

  <q-table
    :rows="bookingPo"
    :columns="tableColumns"
    :loading="isLoadingPo"
    row-key="id"
    table-header-style="background: var(--app-primary); color: white"
    style="margin-top: 12px"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <template v-if="col.name === 'status'">
            <div style="display: flex; align-items: center; justify-content: start; gap: 16px">
              <span>{{ props.row.status === '' ? 'not complete' : props.row.status }}</span>
            </div>
          </template>

          <template v-else-if="col.name === 'due_date'">
            <div style="display: flex; align-items: center; justify-content: start; gap: 16px">
              <span v-if="props.row.due_date !== ''">{{ props.row.due_date }}</span>
              <q-btn
                label="Update Due Date"
                no-caps
                color="secondary"
                size="sm"
                @click.stop="openModalUpdatePODueDate(props.row.id)"
              ></q-btn>
            </div>
          </template>

          <!-- <template v-else-if="col.name === 'notes'">
          <div style="display: flex; align-items: center; justify-content: start; gap: 16px">
            <span v-if="props.row.notes !== ''">{{ props.row.notes }}</span>
            <q-btn label="Update Notes" no-caps color="secondary" size="sm"></q-btn>
          </div>
        </template> -->

          <template v-else-if="col.name === 'total_received_items'">
            <div style="display: flex; align-items: center; justify-content: start; gap: 16px">
              <span>{{ props.row.total_received_items }}</span>
              <q-btn
                v-if="props.row.status !== 'completed'"
                label="Update Total"
                no-caps
                color="secondary"
                size="sm"
                @click.stop="
                  openModalUpdatePOTotal(
                    props.row.id,
                    props.row.total_qty_items,
                    props.row.total_received_items,
                  )
                "
              ></q-btn>
            </div>
          </template>

          <template v-else-if="col.name === 'items'">
            <q-btn
              v-if="props.row.items.length === 0"
              label="Choose Items"
              no-caps
              color="secondary"
              size="sm"
              @click="openModalChoosePO(props.row.po_number)"
            ></q-btn>
            <template v-else>
              <q-card
                v-for="(item, index) in props.row.items"
                :key="index"
                style="display: flex; flex-direction: column; align-items: start; padding: 4px"
                flat
                bordered
              >
                <span style="font-size: 10px">Stock Code: {{ item.stock_code }}</span>
                <span style="font-size: 10px">Item Name: {{ item.item_name }}</span>
              </q-card>
            </template>
          </template>

          <template v-else>
            <span>{{ props.row[col.name] }}</span>
          </template>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
import { type QTableColumn } from 'quasar'
import { ref } from 'vue'
import { useBookingStore } from 'src/stores/booking'
import ModalUpdateDueDate from 'src/components/booking/ModalUpdateDueDate.vue'
import ModalUpdateTotal from 'src/components/booking/ModalUpdateTotal.vue'
import ModalChoosePOItem from 'src/components/booking/ModalChoosePOItem.vue'

export default {
  name: 'TabListPo',
  setup() {
    const bookingStore = useBookingStore()

    const tableColumns: QTableColumn[] = [
      {
        name: 'po_number',
        required: true,
        label: 'PO Number',
        field: 'po_number',
        align: 'left',
      },
      {
        name: 'items',
        required: true,
        label: 'Items',
        field: 'items',
        align: 'left',
      },
      {
        name: 'total_qty_items',
        required: true,
        label: 'Total Qty Items',
        field: 'total_qty_items',
        align: 'left',
      },
      {
        name: 'total_received_items',
        required: true,
        label: 'Total Received Items',
        field: 'total_received_items',
        align: 'left',
      },
      {
        name: 'status',
        required: true,
        label: 'Status',
        field: 'status',
        align: 'left',
      },
      {
        name: 'due_date',
        required: true,
        label: 'Due Date',
        field: 'due_date',
        align: 'left',
      },
      // {
      //   name: 'notes',
      //   required: true,
      //   label: 'Notes',
      //   field: 'notes',
      //   align: 'left',
      // },
    ]

    const bookingPo = ref([] as BookingPo[])
    const isLoadingPo = ref(true)

    return {
      bookingStore,
      tableColumns,
      bookingPo,
      isLoadingPo,
    }
  },

  mounted() {
    this.fetchListPo()
  },

  methods: {
    fetchListPo(): void {
      this.isLoadingPo = true

      const params: ParamsBookingPoList = {
        booking_id: Number(this.$route.params.id),
      }

      this.bookingStore
        .getBookingListPo(params)
        .then((res) => {
          this.bookingPo = res
        })
        .finally(() => {
          this.isLoadingPo = false
        })
    },

    openModalUpdatePODueDate(id: number): void {
      this.$q
        .dialog({
          component: ModalUpdateDueDate,
          componentProps: {
            id: id,
          },
        })
        .onOk(() => {
          this.fetchListPo()
        })
    },

    openModalUpdatePOTotal(id: number, totalItems: number, totalReceived: number): void {
      this.$q
        .dialog({
          component: ModalUpdateTotal,
          componentProps: {
            id: id,
            totalItems: totalItems,
            totalReceived: totalReceived,
          },
        })
        .onOk(() => {
          this.fetchListPo()
        })
    },

    openModalChoosePO(poNumber: string): void {
      this.$q
        .dialog({
          component: ModalChoosePOItem,
          componentProps: {
            bookingId: Number(this.$route.params.id),
            poNumber: poNumber,
          },
        })
        .onOk(() => {
          this.fetchListPo()
        })
    },
  },
}
</script>
