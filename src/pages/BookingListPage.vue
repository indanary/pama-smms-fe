<template>
  <PageCard title="Booking List">
    <div style="display: flex; justify-content: space-between; align-items: center">
      <q-btn label="Add Booking" color="primary" no-caps @click="openModalAdd"></q-btn>
      <SearchInput :placeholder="'Search by Booking ID'" @search="onSearch"></SearchInput>
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
                  v-if="props.row.approved_status === 0"
                  color="secondary"
                  no-caps
                  @click.stop="openModalUpdateApproveStatus(props.row.id)"
                  >Update</q-btn
                >
              </div>
            </template>

            <template v-else-if="col.name === 'booking_status'">
              {{ props.row.booking_status === 'open' ? 'Open' : 'Closed' }}
            </template>

            <template v-else-if="col.name === 'po_details'">
              <template v-if="props.row.approved_status === 1">
                <span v-if="props.row.po_details.length !== 0">
                  {{ props.row.po_details.map((p: any) => p.po_number).join(', ') }}
                </span>
                <q-btn
                  v-else
                  color="secondary"
                  no-caps
                  @click.stop="openModalUpdatePO(props.row.id, props.row.items.length)"
                  >Update</q-btn
                >
              </template>
            </template>

            <template v-else-if="col.name === 'received_date'">
              <template v-if="props.row.approved_status === 1 && canUpdateReceivedDate(props.row)">
                <span v-if="props.row.received_date">
                  {{ props.row.received_date }}
                </span>
                <q-btn
                  v-else
                  color="secondary"
                  no-caps
                  @click.stop="openModalUpdateReceived(props.row.id)"
                  >Update</q-btn
                >
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
                v-if="props.row.wr_no !== '' && props.row.booking_status === 'open'"
                color="secondary"
                no-caps
                @click="openModalPublishWR(props.row.id)"
                >Posting WR No</q-btn
              >
              <q-icon
                v-if="props.row.booking_status === 'closed'"
                name="check"
                color="green"
              ></q-icon>
            </template>

            <template v-else-if="col.name === 'action'">
              <div style="display: flex; align-items: center; gap: 8px">
                <!-- <q-btn color="secondary" no-caps>Edit</q-btn> -->
                <q-btn color="red" no-caps @click.stop="openModalDelete(props.row.id)"
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
  </PageCard>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import { type QTableColumn } from 'quasar'
import { useBookingStore } from 'src/stores/booking'
import ModalAddBooking from 'src/components/booking/ModalAddBooking.vue'
import ModalDeleteBooking from 'src/components/booking/ModalDeleteBooking.vue'
import ModalUpdateApproveStatus from 'src/components/booking/ModalUpdateApproveStatus.vue'
import ModalUpdatePO from 'src/components/booking/ModalUpdatePO.vue'
import ModalUpdateReceivedDate from 'src/components/booking/ModalUpdateReceivedDate.vue'
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
        name: 'approved_status',
        required: true,
        label: 'Approved Status',
        field: 'approved_status',
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
        name: 'po_details',
        required: true,
        label: 'PO Numbers',
        field: 'po_details',
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
        label: 'Posting WR',
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
      rowsPerPage: 25,
      rowsNumber: 0,
      recordPerPage: [10, 25, 50],
    })
    const isLoadingFetchList = ref(true)
    const params: ParamBookingList = {}

    return {
      bookingStore,
      bookingList,
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
    goToDetail(id: number): void {
      this.$router.push(`/bookings/${id}`)
    },

    fetchData(): void {
      this.isLoadingFetchList = true

      this.bookingStore
        .getBookingList(this.params)
        .then((res) => {
          this.bookingList = res
        })
        .finally(() => {
          this.isLoadingFetchList = false
        })
    },

    onSearch(val: string): void {
      this.params.id = val

      this.fetchData()
    },

    openModalAdd(): void {
      this.$q
        .dialog({
          component: ModalAddBooking,
        })
        .onOk(() => {
          this.fetchData()
        })
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

    openModalUpdatePO(id: string, totalItems: number): void {
      this.$q
        .dialog({
          component: ModalUpdatePO,
          componentProps: {
            id: id,
            totalItems: totalItems,
          },
        })
        .onOk(() => {
          this.fetchData()
        })
    },

    canUpdateReceivedDate(detail: Booking): boolean {
      return detail.po_details.every((po) => po.status === 'completed')
    },

    openModalUpdateReceived(id: number | undefined): void {
      this.$q
        .dialog({
          component: ModalUpdateReceivedDate,
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
  },
}
</script>
