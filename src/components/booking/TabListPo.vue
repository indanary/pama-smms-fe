<template>
  <div style="display: flex; justify-content: space-between; align-items: center">
    <span style="font-size: 20px; font-weight: 600">List PO Numbers</span>
    <q-btn
      v-if="$permission(['purchasing', 'inventory'])"
      color="primary"
      no-caps
      @click="openModalUpdatePO"
      >Add PO Number</q-btn
    >
    <div v-else></div>
  </div>

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
                v-if="$permission(['inventory', 'purchasing'])"
                label="Update Due Date"
                no-caps
                color="secondary"
                size="sm"
                @click.stop="openModalUpdatePODueDate(props.row.id)"
              ></q-btn>
            </div>
          </template>

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
            <template v-if="props.row.items.length > 0">
              <q-btn
                label="See Items Detail"
                no-caps
                color="primary"
                size="sm"
                @click="openModalDetailItems(props.row.items)"
              ></q-btn>
            </template>
            <q-btn
              v-else
              label="Choose Items"
              no-caps
              color="secondary"
              size="sm"
              @click="openModalChoosePO(props.row.po_number)"
            ></q-btn>
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
import { useBookingStore } from 'src/stores/booking'
import ModalUpdatePO from 'src/components/booking/ModalUpdatePO.vue'
import ModalUpdateDueDate from 'src/components/booking/ModalUpdateDueDate.vue'
import ModalUpdateTotal from 'src/components/booking/ModalUpdateTotal.vue'
import ModalChoosePOItem from 'src/components/booking/ModalChoosePOItem.vue'
import ModalItemDetails from 'src/components/booking/ModalItemDetails.vue'

export default {
  name: 'TabListPo',
  props: {
    bookingPo: {
      type: Object as () => BookingPo[],
      required: true,
    },
    isLoadingPo: {
      type: Boolean,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
  },
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
      {
        name: 'created_at',
        required: true,
        label: 'Created At',
        field: 'created_at',
        align: 'left',
      },
    ]

    return {
      bookingStore,
      tableColumns,
    }
  },

  mounted() {},

  methods: {
    openModalUpdatePO(): void {
      this.$q
        .dialog({
          component: ModalUpdatePO,
          componentProps: {
            id: this.$route.params.id as string,
            totalItems: this.totalItems,
          },
        })
        .onOk(() => {
          this.$emit('refresh')
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
          this.$emit('refresh')
        })
    },

    openModalDetailItems(items: BookingPo['items']): void {
      this.$q
        .dialog({
          component: ModalItemDetails,
          componentProps: {
            items: items,
          },
        })
        .onOk(() => {
          this.$emit('refresh')
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
          this.$emit('refresh')
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
          this.$emit('refresh')
        })
    },
  },
}
</script>
