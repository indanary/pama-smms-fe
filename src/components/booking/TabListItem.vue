<template>
  <span style="font-size: 20px; font-weight: 600">List Item Part</span>

  <q-table
    :rows="itemBookingList"
    :columns="tableColumns"
    :loading="isLoadingFetch"
    row-key="id"
    table-header-style="background: var(--app-primary); color: white"
    style="margin-top: 12px"
  ></q-table>
</template>

<script lang="ts">
import { type QTableColumn } from 'quasar'
import { useItemStore } from 'src/stores/item'
import { ref } from 'vue'

export default {
  name: 'TabListItem',
  setup() {
    const itemStore = useItemStore()

    const tableColumns: QTableColumn[] = [
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
        name: 'qty',
        required: true,
        label: 'Qty',
        field: 'qty',
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
        name: 'created_by',
        required: true,
        label: 'Created By',
        field: 'created_by',
        align: 'left',
      },
    ]

    const itemBookingList = ref([] as Item[])
    const isLoadingFetch = ref(true)

    return {
      itemStore,
      tableColumns,
      itemBookingList,
      isLoadingFetch,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData(): void {
      this.isLoadingFetch = true

      const params: ParamItemBookingList = {
        booking_id: Number(this.$route.params.id as string),
      }

      this.itemStore
        .getItemBookingList(params)
        .then((res) => {
          this.itemBookingList = res
        })
        .finally(() => {
          this.isLoadingFetch = false
        })
    },
  },
}
</script>
