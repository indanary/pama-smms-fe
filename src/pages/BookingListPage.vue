<template>
  <PageCard title="Booking List">
    <div class="filter-layout">
      <div style="display: flex; gap: 12px; align-items: center">
        <q-btn
          label="Export Excel"
          color="primary"
          no-caps
          :loading="isLoadingExport"
          @click="exportData"
        ></q-btn>
        <q-btn
          label="Update Spreadsheet"
          color="primary"
          no-caps
          :loading="isLoadingUpdateSheet"
          @click="updateSpreadsheet"
        ></q-btn>
      </div>
      <div class="input-search">
        <SearchInput
          :placeholder="'Search by Booking ID, PO Numbers'"
          @search="onSearch"
        ></SearchInput>
      </div>
    </div>

    <q-table
      :rows="bookingList"
      :columns="tableColumns"
      :pagination="tablePaginations"
      :rows-per-page-options="tablePaginations.recordPerPage"
      :loading="isLoadingFetchList"
      row-key="id"
      style="margin-top: 16px"
      table-header-style="background: var(--app-primary); color: white"
      flat
      @request="onRequest"
    >
      <template v-slot:body="props">
        <q-tr :props="props" style="cursor: pointer">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            @click="goToDetail(props.row.id)"
          >
            <template v-if="col.name === 'id'"> BOOKSM{{ props.row.id }} </template>

            <template v-else-if="col.name === 'approved_status'">
              <div style="display: flex; align-items: center; justify-content: center; gap: 8px">
                <q-icon
                  :name="props.row.approved_status === 0 ? 'close' : 'check'"
                  :color="props.row.approved_status === 0 ? 'red' : 'green'"
                ></q-icon>
                <q-btn
                  v-if="props.row.approved_status === 0 && $permission(['planner', 'super_admin'])"
                  color="secondary"
                  no-caps
                  @click.stop="openModalUpdateApproveStatus(props.row.id)"
                  >Approve</q-btn
                >
              </div>
            </template>

            <template v-else-if="col.name === 'booking_status'">
              {{ props.row.booking_status === 'open' ? 'Open' : 'Closed' }}
            </template>

            <template v-else-if="col.name === 'po_numbers'">
              <template v-if="props.row.approved_status === 1">
                <span>
                  {{ props.row.po_numbers.map((p: any) => p).join(', ') }}
                </span>
              </template>
            </template>

            <template v-else-if="col.name === 'received_date'">
              <template v-if="props.row.approved_status === 1">
                <span v-if="props.row.received_date !== ''">
                  {{ props.row.received_date }}
                </span>
              </template>
            </template>

            <template v-else-if="col.name === 'received'">
              <q-icon
                :name="props.row.received === 0 ? 'close' : 'check'"
                :color="props.row.received === 0 ? 'red' : 'green'"
              ></q-icon>
            </template>

            <template v-else-if="col.name === 'wr_no'">
              <template v-if="props.row.approved_status === 1">
                <q-btn
                  v-if="props.row.received === 1 && props.row.wr_no === ''"
                  color="secondary"
                  no-caps
                  @click="openModalAddWR(props.row.id)"
                  >Add WR</q-btn
                >
                <span v-if="props.row.wr_no !== ''">{{ props.row.wr_no }}</span>
              </template>
            </template>

            <template v-else-if="col.name === 'posting_wr'">
              <q-btn
                v-if="
                  props.row.wr_no !== '' &&
                  props.row.booking_status === 'open' &&
                  $permission(['warehouse', 'super_admin'])
                "
                color="secondary"
                no-caps
                @click="openModalPublishWR(props.row.id)"
                >Posting WR No</q-btn
              >
              <q-icon
                :name="props.row.posting_wr === 0 ? 'close' : 'check'"
                :color="props.row.posting_wr === 0 ? 'red' : 'green'"
              ></q-icon>
            </template>

            <template v-else-if="col.name === 'action'">
              <div style="display: flex; align-items: center; gap: 8px">
                <q-btn
                  v-if="$permission(['warehouse', 'super_admin'])"
                  color="red"
                  no-caps
                  @click.stop="openModalDelete(props.row.id)"
                  >Delete</q-btn
                >
              </div>
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
  </PageCard>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import { type QTableColumn } from 'quasar'
import { useBookingStore } from 'src/stores/booking'
import ModalDeleteBooking from 'src/components/booking/ModalDeleteBooking.vue'
import ModalUpdateApproveStatus from 'src/components/booking/ModalUpdateApproveStatus.vue'
import ModalCreateWR from 'src/components/booking/ModalCreateWR.vue'
import ModalPublishWR from 'src/components/booking/ModalPublishWR.vue'

export default {
  name: 'BookingListPage',
  setup() {
    const bookingStore = useBookingStore()

    const bookingList = ref([] as Booking[])
    const tableColumns: QTableColumn[] = [
      {
        name: 'id',
        required: true,
        label: 'Booking ID',
        field: 'id',
        align: 'center',
      },
      {
        name: 'description',
        required: true,
        label: 'Description',
        field: 'description',
        align: 'center',
      },
      {
        name: 'cn_no',
        required: true,
        label: 'CN No',
        field: 'cn_no',
        align: 'center',
      },
      {
        name: 'approved_status',
        required: true,
        label: 'Approved Status',
        field: 'approved_status',
        align: 'center',
      },
      {
        name: 'booking_status',
        required: true,
        label: 'Booking Status',
        field: 'booking_status',
        align: 'center',
      },
      {
        name: 'aging',
        required: true,
        label: 'Aging (Days)',
        field: 'aging',
        align: 'center',
      },
      {
        name: 'po_numbers',
        required: true,
        label: 'PO Numbers',
        field: 'po_numbers',
        align: 'center',
      },
      {
        name: 'received_date',
        required: true,
        label: 'Received Date',
        field: 'received_date',
        align: 'center',
      },
      {
        name: 'received',
        required: true,
        label: 'Received',
        field: 'received',
        align: 'center',
      },
      {
        name: 'wr_no',
        required: true,
        label: 'WR No',
        field: 'wr_no',
        align: 'center',
      },
      {
        name: 'posting_wr',
        required: true,
        label: 'Posting WR No',
        field: 'posting_wr',
        align: 'center',
      },
      {
        name: 'created_at',
        required: true,
        label: 'Created At',
        field: 'created_at',
        align: 'center',
      },
      {
        name: 'created_by',
        required: true,
        label: 'Created By',
        field: 'created_by',
        align: 'center',
      },
      {
        name: 'last_updated_at',
        required: true,
        label: 'Last Updated At',
        field: 'last_updated_at',
        align: 'center',
      },
      {
        name: 'last_updated_by',
        required: true,
        label: 'Last Updated By',
        field: 'last_updated_by',
        align: 'center',
      },
      {
        name: 'action',
        required: true,
        label: 'Action',
        field: 'id',
        align: 'center',
      },
    ]
    const tablePaginations = reactive({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
      recordPerPage: [10, 25, 50],
    })
    const isLoadingFetchList = ref(true)
    const params: ParamBookingList = reactive({
      page: tablePaginations.page,
      limit: tablePaginations.rowsPerPage,
    })
    const isLoadingExport = ref(false)
    const isLoadingUpdateSheet = ref(false)

    return {
      bookingStore,
      bookingList,
      tableColumns,
      tablePaginations,
      isLoadingFetchList,
      params,
      isLoadingExport,
      isLoadingUpdateSheet,
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    goToDetail(id: number): void {
      this.$router.push(`/bookings/${id}`)
    },

    fetchData(): void {
      this.isLoadingFetchList = true

      this.bookingStore
        .getBookingList(this.params)
        .then((res) => {
          this.bookingList = res.data

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

    onSearch(val: string): void {
      this.tablePaginations.page = 1

      this.params.page = 1
      this.params.search = val

      this.fetchData()
    },

    openModalDelete(id: string): void {
      this.$q
        .dialog({
          component: ModalDeleteBooking,
          componentProps: {
            id: id,
          },
        })
        .onOk(() => {
          this.fetchData()
        })
    },

    openModalUpdateApproveStatus(id: string): void {
      this.$q
        .dialog({
          component: ModalUpdateApproveStatus,
          componentProps: {
            id: id,
          },
        })
        .onOk(() => {
          this.fetchData()
        })
    },

    openModalAddWR(id: number | undefined): void {
      this.$q
        .dialog({
          component: ModalCreateWR,
          componentProps: {
            id: id,
          },
        })
        .onOk(() => {
          this.fetchData()
        })
    },

    openModalPublishWR(id: number | undefined): void {
      this.$q
        .dialog({
          component: ModalPublishWR,
          componentProps: {
            id: id,
          },
        })
        .onOk(() => {
          this.fetchData()
        })
    },

    exportData(): void {
      this.isLoadingExport = true

      this.bookingStore
        .exportBooking()
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res]))
          const link = document.createElement('a')

          const today = new Date()

          // Define formatting options
          const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          } as Intl.DateTimeFormatOptions

          // Format the date correctly
          const formattedDate = new Intl.DateTimeFormat('en-GB', options)
            .format(today)
            .replace(',', '')
          const filename = 'bookings-' + formattedDate + '.xlsx'

          link.href = url
          link.setAttribute('download', filename)
          document.body.appendChild(link)
          link.click()
          link.remove()
        })
        .finally(() => {
          this.isLoadingExport = false
        })
    },

    updateSpreadsheet(): void {
      this.isLoadingUpdateSheet = true

      this.bookingStore.updateSpreadsheet().finally(() => {
        this.isLoadingUpdateSheet = false
      })
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
  width: 280px;

  @media (max-width: 600px) {
    width: 100%;
  }
}
</style>
