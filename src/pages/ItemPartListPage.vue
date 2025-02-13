<template>
  <PageCard title="Item Part List">
    <div class="filter-layout">
      <q-btn-dropdown label="Add Item Part" color="primary" no-caps>
        <q-list>
          <q-item clickable v-close-popup @click="openModalAddInput">
            <q-item-section>
              <q-item-label>Input Manually</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="openModalAddImport">
            <q-item-section>
              <q-item-label>Import from File</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <div class="input-search">
        <SearchInput
          :placeholder="'Search by Stock Code, Part No, Item Name'"
          @search="onSearch"
        ></SearchInput>
      </div>
    </div>

    <q-table
      :rows="itemList"
      :columns="tableColumns"
      :loading="isLoadingFetchList"
      :pagination="tablePaginations"
      :rows-per-page-options="tablePaginations.recordPerPage"
      row-key="id"
      style="margin-top: 16px"
      table-header-style="background: var(--app-primary); color: white"
      flat
      @request="onRequest"
    >
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
  </PageCard>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import { type QTableColumn } from 'quasar'
import { useItemStore } from 'src/stores/item'
import ModalAddItem from 'src/components/item/ModalAddItem.vue'
import ModalImportItem from 'src/components/item/ModalImportItem.vue'

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
      rowsPerPage: 10,
      rowsNumber: 0,
      recordPerPage: [10, 25, 50],
    })
    const isLoadingFetchList = ref(true)
    const params: ParamItemList = reactive({
      page: tablePaginations.page,
      limit: tablePaginations.rowsPerPage,
    })

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
          this.itemList = res.data

          this.tablePaginations.page = res.page
          this.tablePaginations.rowsPerPage = res.limit
          this.tablePaginations.rowsNumber = res.totalPages
        })
        .finally(() => {
          this.isLoadingFetchList = false
        })
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRequest(props: any): void {
      this.tablePaginations.page = 1
      this.tablePaginations.rowsPerPage = props.pagination.rowsPerPage

      this.params.page = 1
      this.params.limit = props.pagination.rowsPerPage

      this.fetchData()
    },

    onPagePagination(page: number): void {
      this.tablePaginations.page = page

      this.params.page = page

      this.fetchData()
    },

    openModalAddInput(): void {
      this.$q
        .dialog({
          component: ModalAddItem,
        })
        .onOk(() => {
          this.fetchData()
        })
    },

    openModalAddImport(): void {
      this.$q
        .dialog({
          component: ModalImportItem,
        })
        .onOk(() => {
          this.fetchData()
        })
    },

    onSearch(val: string): void {
      this.params.search = val

      this.fetchData()
    },
  },
}
</script>

<style lang="scss">
.filter-layout {
  display: flex;
  justify-content: space-between;
  align-items: center;

  flex-direction: row;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: start;
    gap: 12px;
  }
}

.input-search {
  width: 324px;

  @media (max-width: 600px) {
    width: 100%;
  }
}
</style>
