<template>
  <PageCard title="Item Part List">
    <div style="display: flex; justify-content: space-between; align-items: center">
      <q-btn label="Add Item Part" color="primary" no-caps @click="openModalAdd"></q-btn>
      <SearchInput :placeholder="'Search by Part No'" @search="onSearch"></SearchInput>
    </div>

    <q-table
      :rows="itemList"
      :columns="tableColumns"
      :pagination="tablePaginations"
      :rows-per-page-options="tablePaginations.recordPerPage"
      :loading="isLoadingFetchList"
      row-key="id"
      style="margin-top: 16px"
      table-header-style="background: var(--app-primary); color: white"
    >
      <!-- <template v-slot:body="props">
        <q-tr :props="props" style="cursor: pointer">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.name === 'action'">
              <div style="display: flex; align-items: center; gap: 8px">
                <q-btn color="secondary" no-caps>Edit</q-btn>
                <q-btn color="red" no-caps>Delete</q-btn>
              </div>
            </template>
            <template v-else>
              <span>{{ props.row[col.name] }}</span>
            </template>
          </q-td>
        </q-tr>
      </template> -->
    </q-table>

    <!-- <div v-else style="margin-top: 16px">
      <SkeletonLoader :num="6"></SkeletonLoader>
    </div> -->
  </PageCard>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import { type QTableColumn } from 'quasar'
import { useItemStore } from 'src/stores/item'
import ModalAddItem from 'src/components/item/ModalAddItem.vue'

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
      // {
      //   name: 'last_updated_at',
      //   required: true,
      //   label: 'Last Updated At',
      //   field: 'last_updated_at',
      //   align: 'left',
      // },
      // {
      //   name: 'last_updated_by',
      //   required: true,
      //   label: 'Last Updated By',
      //   field: 'last_updated_by',
      //   align: 'left',
      // },
      // {
      //   name: 'action',
      //   required: true,
      //   label: 'Action',
      //   field: 'id',
      //   align: 'left',
      // },
    ]
    const tablePaginations = reactive({
      page: 1,
      rowsPerPage: 25,
      rowsNumber: 0,
      recordPerPage: [10, 25, 50],
    })
    const isLoadingFetchList = ref(true)
    const params: ParamItemList = {}

    return {
      itemStore,
      itemList,
      tableColumns,
      tablePaginations,
      isLoadingFetchList,
      params,
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    fetchData(): void {
      this.isLoadingFetchList = true

      this.itemStore
        .getItemList(this.params)
        .then((res) => {
          this.itemList = res
        })
        .finally(() => {
          this.isLoadingFetchList = false
        })
    },

    openModalAdd(): void {
      this.$q
        .dialog({
          component: ModalAddItem,
        })
        .onOk(() => {
          this.fetchData()
        })
    },

    onSearch(val: string): void {
      this.params.stock_code = val

      this.fetchData()
    },
  },
}
</script>
