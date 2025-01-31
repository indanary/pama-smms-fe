<template>
  <span style="font-size: 20px; font-weight: 600">List Item Part</span>

  <q-table
    :rows="itemBookingList"
    :columns="tableColumns"
    :loading="isLoadingItem"
    row-key="id"
    table-header-style="background: var(--app-primary); color: white"
    style="margin-top: 12px"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <template v-if="col.name === 'total_received_items'">
            <div style="display: flex; align-items: center; justify-content: center; gap: 16px">
              <span>{{ props.row.total_received_items }}</span>
              <q-btn
                v-if="$permission(['warehouse'])"
                label="Update Total"
                no-caps
                color="secondary"
                size="sm"
                @click="
                  openModalUpdateTotal(
                    props.row.id,
                    props.row.item_qty,
                    props.row.total_received_items,
                    props.row.po_number,
                  )
                "
              ></q-btn>
            </div>
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
import ModalUpdateTotal from 'components/booking/ModalUpdateTotal.vue'

export default {
  name: 'TabListItem',
  props: {
    itemBookingList: {
      type: Object as () => ItemBooking[],
      required: true,
    },
    isLoadingItem: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const tableColumns: QTableColumn[] = [
      {
        name: 'po_number',
        required: true,
        label: 'PO Number',
        field: 'po_number',
        align: 'left',
      },
      {
        name: 'stock_code',
        required: true,
        label: 'Stock Code',
        field: 'stock_code',
        align: 'left',
      },
      {
        name: 'part_no',
        required: true,
        label: 'Part No',
        field: 'part_no',
        align: 'left',
      },
      {
        name: 'mnemonic',
        required: true,
        label: 'Mnemonic',
        field: 'mnemonic',
        align: 'left',
      },
      {
        name: 'class',
        required: true,
        label: 'Class',
        field: 'class',
        align: 'left',
      },
      {
        name: 'item_name',
        required: true,
        label: 'Item Name',
        field: 'item_name',
        align: 'left',
      },
      {
        name: 'uoi',
        required: true,
        label: 'UOI',
        field: 'uoi',
        align: 'left',
      },
      {
        name: 'item_qty',
        required: true,
        label: 'Qty',
        field: 'item_qty',
        align: 'left',
      },
      {
        name: 'total_received_items',
        required: true,
        label: 'Total Received Items',
        field: 'total_received_items',
        align: 'center',
      },
      {
        name: 'created_at',
        required: true,
        label: 'Created At',
        field: 'created_at',
        align: 'left',
      },
      {
        name: 'created_by',
        required: true,
        label: 'Created By',
        field: 'created_by',
        align: 'left',
      },
    ]

    return {
      tableColumns,
    }
  },
  methods: {
    openModalUpdateTotal(
      id: number,
      item_qty: number,
      total_received_items: number,
      po_number: string,
    ): void {
      this.$q
        .dialog({
          component: ModalUpdateTotal,
          componentProps: {
            id: id,
            totalItems: item_qty,
            totalReceived: total_received_items,
            poNumber: po_number,
          },
        })
        .onOk(() => {
          this.$emit('refresh')
        })
    },
  },
}
</script>
