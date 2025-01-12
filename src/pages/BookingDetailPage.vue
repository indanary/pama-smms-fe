<template>
  <PageCard title="Booking Detail" back-path="/bookings">
    <template v-if="!isLoadingDetail && !isLoadingPo">
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 32px">
        <DetailItem label="Booking ID">
          <span>BOOKSM{{ detailData?.id }}</span>
        </DetailItem>

        <DetailItem label="Approved Status">
          <div style="display: flex; align-items: left; gap: 8px">
            <q-icon
              :name="detailData?.approved_status === 0 ? 'close' : 'check'"
              :color="detailData?.approved_status === 0 ? 'red' : 'green'"
            ></q-icon>
            <q-btn
              v-if="detailData?.approved_status === 0"
              color="secondary"
              no-caps
              @click="openModalUpdateApproveStatus(detailData?.id.toString())"
              >Update</q-btn
            >
          </div>
        </DetailItem>

        <DetailItem label="Description">
          <span>{{ detailData?.description }}</span>
        </DetailItem>

        <DetailItem label="PO Numbers">
          <template v-if="detailData?.approved_status === 1">
            <span v-if="detailData?.po_details.length !== 0">
              {{ detailData?.po_details.map((p: any) => p.po_number).join(', ') }}
            </span>
            <q-btn
              v-else
              color="secondary"
              no-caps
              @click.stop="openModalUpdatePO(detailData?.id.toString())"
              >Update</q-btn
            >
          </template>
        </DetailItem>

        <DetailItem label="Booking Status">
          <span>{{ detailData?.booking_status === 'open' ? 'Open' : 'Close' }}</span>
        </DetailItem>

        <DetailItem label="Received Date">
          <template v-if="canUpdateReceivedDate()">
            <span v-if="detailData?.received_date">
              {{ detailData?.received_date }}
            </span>
            <q-btn v-else color="secondary" no-caps>Update</q-btn>
          </template>
        </DetailItem>

        <DetailItem label="Received">
          <q-icon
            :name="detailData?.received === 0 ? 'close' : 'check'"
            :color="detailData?.received === 0 ? 'red' : 'green'"
          ></q-icon>
        </DetailItem>

        <DetailItem label="WR No">
          <q-btn
            v-if="detailData?.received === 1 && detailData?.wr_no === ''"
            color="secondary"
            no-caps
            >Create WR</q-btn
          >
          <span v-if="detailData?.wr_no !== ''">{{ detailData?.wr_no }}</span>
        </DetailItem>

        <DetailItem label="Created At">
          <span>{{ detailData?.created_at }}</span>
        </DetailItem>

        <DetailItem label="Created By">
          <span>{{ detailData?.created_by }}</span>
        </DetailItem>

        <DetailItem label="Last Updated At">
          <span>{{ detailData?.last_updated_at }}</span>
        </DetailItem>

        <DetailItem label="Last Updated By">
          <span>{{ detailData?.last_updated_by }}</span>
        </DetailItem>

        <div style="display: flex; align-items: left; gap: 8px">
          <!-- <q-btn color="secondary" no-caps>Edit</q-btn> -->
          <q-btn color="red" no-caps @click="openModalDelete(detailData?.id)">Delete</q-btn>
        </div>
      </div>

      <q-table
        :rows="bookingPo"
        :columns="tableColumns"
        :loading="isLoadingPo"
        row-key="id"
        style="margin-top: 32px"
        table-header-style="background: var(--app-primary); color: white"
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
                    label="Update Due Date"
                    no-caps
                    color="secondary"
                    size="sm"
                    @click.stop="openModalUpdatePODueDate(props.row.id)"
                  ></q-btn>
                </div>
              </template>

              <!-- <template v-else-if="col.name === 'notes'">
                <div style="display: flex; align-items: center; justify-content: start; gap: 16px">
                  <span v-if="props.row.notes !== ''">{{ props.row.notes }}</span>
                  <q-btn label="Update Notes" no-caps color="secondary" size="sm"></q-btn>
                </div>
              </template> -->

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
                <q-btn
                  v-if="props.row.items.length === 0"
                  label="Choose Items"
                  no-caps
                  color="secondary"
                  size="sm"
                  @click="openModalChoosePO(props.row.po_number)"
                ></q-btn>
                <template v-else>
                  <q-card
                    v-for="(item, index) in props.row.items"
                    :key="index"
                    style="display: flex; flex-direction: column; align-items: start; padding: 4px"
                    flat
                    bordered
                  >
                    <span style="font-size: 10px">Stock Code: {{ item.stock_code }}</span>
                    <span style="font-size: 10px">Item Name: {{ item.item_name }}</span>
                    <span style="font-size: 10px">Qty: {{ item.qty }}</span>
                  </q-card>
                </template>
              </template>

              <template v-else>
                <span>{{ props.row[col.name] }}</span>
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </template>

    <div v-else style="margin-top: 32px">
      <SkeletonLoader :num="6"></SkeletonLoader>
    </div>
  </PageCard>
</template>

<script lang="ts">
import { ref } from 'vue'
import { type QTableColumn } from 'quasar'
import { useBookingStore } from 'src/stores/booking'
import ModalUpdateApproveStatus from 'src/components/booking/ModalUpdateApproveStatus.vue'
import ModalUpdatePO from 'src/components/booking/ModalUpdatePO.vue'
import ModalChoosePOItem from 'src/components/booking/ModalChoosePOItem.vue'
import ModalUpdateTotal from 'src/components/booking/ModalUpdateTotal.vue'
import ModalUpdateDueDate from 'src/components/booking/ModalUpdateDueDate.vue'

export default {
  name: 'BookingDetailPage',
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
      // {
      //   name: 'notes',
      //   required: true,
      //   label: 'Notes',
      //   field: 'notes',
      //   align: 'left',
      // },
    ]

    const detailData = ref(null as Booking | null)
    const isLoadingDetail = ref(true)
    const bookingPo = ref([] as BookingPo[])
    const isLoadingPo = ref(true)

    return {
      bookingStore,
      tableColumns,
      detailData,
      isLoadingDetail,
      bookingPo,
      isLoadingPo,
    }
  },

  mounted() {
    this.fetchData()
    this.fetchListPo()
  },

  methods: {
    fetchData(): void {
      this.isLoadingDetail = true

      this.bookingStore
        .getBookingDetail(Number(this.$route.params.id))
        .then((res) => {
          this.detailData = res
        })
        .finally(() => {
          this.isLoadingDetail = false
        })
    },

    fetchListPo(): void {
      this.isLoadingPo = true

      const params: ParamsBookingPoList = {
        booking_id: Number(this.$route.params.id),
      }

      this.bookingStore
        .getBookingListPo(params)
        .then((res) => {
          this.bookingPo = res
        })
        .finally(() => {
          this.isLoadingPo = false
        })
    },

    openModalDelete(id: number | undefined): void {
      console.log(id, 'id')
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

    openModalUpdatePO(id: string): void {
      this.$q
        .dialog({
          component: ModalUpdatePO,
          componentProps: {
            id: id,
          },
        })
        .onOk(() => {
          this.fetchData()
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
          this.fetchData()
          this.fetchListPo()
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
          this.fetchData()
          this.fetchListPo()
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
          this.fetchData()
          this.fetchListPo()
        })
    },

    canUpdateReceivedDate(): boolean {
      if (!this.detailData) return false

      return this.detailData?.po_details.every((po) => po.status === 'completed')
    },
  },
}
</script>
