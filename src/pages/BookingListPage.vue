<template>
  <PageCard title="Booking List">
    <div style="display: flex; justify-content: space-between; align-items: center">
      <q-btn label="Add Booking" color="primary" no-caps @click="openModalAdd"></q-btn>
      <SearchInput :placeholder="'Search by Booking ID'"></SearchInput>
    </div>

    <q-table
      :rows="bookingList"
      :columns="tableColumns"
      :pagination="tablePaginations"
      :rows-per-page-options="tablePaginations.recordPerPage"
      row-key="id"
      style="margin-top: 16px"
      table-header-style="background: var(--app-primary); color: white"
    >
      <template v-slot:body="props">
        <q-tr :props="props" style="cursor: pointer">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.name === 'id'"> BOOKSM{{ props.row.id }} </template>

            <template v-else-if="col.name === 'approved_status'">
              <q-icon :name="props.row.approved_status === 0 ? 'close' : 'check'"></q-icon>
            </template>

            <template v-else-if="col.name === 'booking_status'">
              {{ props.row.booking_status === 'open' ? 'Open' : 'Close' }}
            </template>

            <template v-else-if="col.name === 'action'">
              <div style="display: flex; align-items: center; gap: 8px">
                <q-btn color="secondary" no-caps>Edit</q-btn>
                <q-btn color="red" no-caps @click="openModalDelete(props.row.id)">Delete</q-btn>
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
        align: 'left',
      },
      {
        name: 'approved_status',
        required: true,
        label: 'Approved Status',
        field: 'approved_status',
        align: 'center',
      },
      {
        name: 'po_number',
        required: true,
        label: 'PO Number',
        field: 'po_number',
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
        name: 'booking_status',
        required: true,
        label: 'Booking Status',
        field: 'booking_status',
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
      {
        name: 'action',
        required: true,
        label: 'Action',
        field: 'id',
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
      bookingStore,
      bookingList,
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

      this.bookingStore
        .getBookingList()
        .then((res) => {
          this.bookingList = res
        })
        .finally(() => {
          this.isLoadingFetchList = false
        })
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
  },
}
</script>
