<template>
  <PageCard title="Item Part List">
    <SearchInput :placeholder="'Search by Part No'"></SearchInput>

    <q-table
      :rows="itemList"
      :columns="tableColumns"
      :pagination="tablePaginations"
      :rows-per-page-options="tablePaginations.recordPerPage"
      row-key="id"
      style="margin-top: 16px"
      table-header-style="background: var(--app-primary); color: white"
    >
    </q-table>
  </PageCard>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import { type QTableColumn } from 'quasar'
import { useItemStore } from 'src/stores/item'

export default {
  name: 'ItemPartListPage',
  setup() {
    const itemStore = useItemStore()

    const itemList = ref([] as Item[])
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
      {
        name: 'last_updated_at',
        required: true,
        label: 'Last Updated At',
        field: 'last_updated_at',
        align: 'left',
      },
      {
        name: 'last_updated_by',
        required: true,
        label: 'Last Updated By',
        field: 'last_updated_by',
        align: 'left',
      },
    ]
    const tablePaginations = reactive({
      page: 1,
      rowsPerPage: 25,
      rowsNumber: 0,
      recordPerPage: [10, 25, 50],
    })
    const isLoadingFetchList = ref(true)

    return {
      itemStore,
      itemList,
      tableColumns,
      tablePaginations,
      isLoadingFetchList,
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    fetchData(): void {
      this.isLoadingFetchList = true

      this.itemStore
        .getItemList()
        .then((res) => {
          this.itemList = res
        })
        .finally(() => {
          this.isLoadingFetchList = false
        })
    },
  },
}
</script>
