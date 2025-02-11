<template>
  <div style="display: flex; justify-content: space-between; align-items: center">
    <span style="font-size: 20px; font-weight: 600">List PO Numbers</span>
    <q-btn-dropdown
      v-if="$permission(['purchasing', 'inventory', 'super_admin'])"
      :disable="disableUpdatePO()"
      label="Add PO Number"
      color="primary"
      no-caps
    >
      <q-list>
        <q-item clickable v-close-popup @click="openModalUpdatePO">
          <q-item-section>
            <q-item-label>Input Manually</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="openModalImportPO">
          <q-item-section>
            <q-item-label>Import PO</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
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
                v-if="$permission(['inventory', 'purchasing', 'super_admin'])"
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

          <template v-else-if="col.name === 'action'">
            <q-btn
              v-if="
                $permission(['purchasing', 'inventory', 'super_admin']) &&
                props.row.items.length === 0
              "
              label="Delete PO"
              no-caps
              color="red"
              size="sm"
              @click="deleteBookingPo(props.row.id)"
            >
            </q-btn>
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
import ModalChoosePOItem from 'src/components/booking/ModalChoosePOItem.vue'
import ModalItemDetails from 'src/components/booking/ModalItemDetails.vue'
import ModalImportPO from 'src/components/booking/ModalImportPO.vue'

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
    itemBookingList: {
      type: Object as () => ItemBooking[],
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
      {
        name: 'action',
        required: true,
        label: 'Action',
        field: 'id',
        align: 'left',
      },
    ]

    return {
      bookingStore,
      tableColumns,
    }
  },

  methods: {
    disableUpdatePO(): boolean {
      return this.bookingPo.length === this.itemBookingList.length
    },

    openModalUpdatePO(): void {
      this.$q
        .dialog({
          component: ModalUpdatePO,
          componentProps: {
            id: this.$route.params.id as string,
            totalItems: this.itemBookingList.length,
          },
        })
        .onOk(() => {
          this.$emit('refresh')
        })
    },

    openModalImportPO(): void {
      this.$q
        .dialog({
          component: ModalImportPO,
          componentProps: {
            id: this.$route.params.id as string,
            itemBookingList: this.itemBookingList,
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

    deleteBookingPo(id: number): void {
      this.bookingStore.deleteBookingPo(id).then(() => {
        this.$emit('refresh')
      })
    },
  },
}
</script>
