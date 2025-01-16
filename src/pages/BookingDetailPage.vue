<template>
  <PageCard title="Booking Detail" back-path="/bookings">
    <template v-if="!isLoadingDetail">
      <div
        style="
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 32px;
          margin-bottom: 32px;
        "
      >
        <DetailItem label="Booking ID">
          <span>BOOKSM{{ detailData?.id }}</span>
        </DetailItem>

        <DetailItem label="Description">
          <span>{{ detailData?.description }}</span>
        </DetailItem>

        <DetailItem label="CN No">
          <span>{{ detailData?.cn_no }}</span>
        </DetailItem>

        <DetailItem label="Approved Status">
          <div style="display: flex; align-items: center; gap: 8px">
            <q-icon
              :name="detailData?.approved_status === 0 ? 'close' : 'check'"
              :color="detailData?.approved_status === 0 ? 'red' : 'green'"
            ></q-icon>
            <q-btn
              v-if="detailData?.approved_status === 0 && $permission(['planner'])"
              color="secondary"
              no-caps
              @click="openModalUpdateApproveStatus(detailData?.id.toString())"
              >Approve</q-btn
            >
          </div>
        </DetailItem>

        <DetailItem label="Booking Status">
          <span>{{ detailData?.booking_status === 'open' ? 'Open' : 'Closed' }}</span>
        </DetailItem>

        <DetailItem label="Aging (Days)">
          <span>{{ detailData?.aging }}</span>
        </DetailItem>

        <DetailItem label="Received Date">
          <template v-if="detailData?.approved_status === 1 && canUpdateReceivedDate()">
            <span v-if="detailData?.received_date !== ''">
              {{ detailData?.received_date }}
            </span>
            <q-btn
              v-if="detailData?.received_date === '' && $permission(['warehouse'])"
              color="secondary"
              no-caps
              @click="openModalUpdateReceived(detailData?.id)"
              >Update</q-btn
            >
          </template>
        </DetailItem>

        <DetailItem label="Received">
          <q-icon
            :name="detailData?.received === 0 ? 'close' : 'check'"
            :color="detailData?.received === 0 ? 'red' : 'green'"
          ></q-icon>
        </DetailItem>

        <DetailItem label="WR No">
          <template v-if="detailData?.approved_status === 1">
            <q-btn
              v-if="detailData?.received === 1 && detailData?.wr_no === ''"
              color="secondary"
              no-caps
              @click="openModalAddWR(detailData?.id)"
              >Create WR No</q-btn
            >
            <span v-if="detailData?.wr_no !== ''">{{ detailData?.wr_no }}</span>
          </template>
        </DetailItem>

        <DetailItem label="Posting WR No">
          <q-btn
            v-if="
              detailData?.wr_no !== '' &&
              detailData?.booking_status === 'open' &&
              $permission(['warehouse'])
            "
            color="secondary"
            no-caps
            @click="openModalPublishWR(detailData?.id)"
            >Posting WR No</q-btn
          >
          <q-icon
            v-if="detailData?.booking_status === 'closed'"
            name="check"
            color="green"
          ></q-icon>
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
          <q-btn
            v-if="$permission(['warehouse'])"
            color="red"
            no-caps
            @click="openModalDelete(detailData?.id)"
            >Delete</q-btn
          >
        </div>
      </div>

      <q-tabs v-model="tab" align="left" active-bg-color="primary" active-color="white" no-caps>
        <q-tab
          name="booking"
          label="List PO Numbers"
          style="border-top-right-radius: 8px; border-top-left-radius: 8px; margin-bottom: 12px"
        >
        </q-tab>
        <q-tab
          name="items"
          label="List Item Parts"
          style="border-top-right-radius: 8px; border-top-left-radius: 8px; margin-bottom: 12px"
        />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="booking" style="padding: 0">
          <TabListPo
            :booking-po="bookingPo"
            :is-loading-po="isLoadingPo"
            :total-items="itemBookingList.length"
            @refresh="fetchListPo"
          ></TabListPo>
        </q-tab-panel>

        <q-tab-panel name="items" style="padding: 0">
          <TabListItem
            :item-booking-list="itemBookingList"
            :is-loading-item="isLoadingItem"
          ></TabListItem>
        </q-tab-panel>
      </q-tab-panels>
    </template>

    <div v-else style="margin-top: 32px">
      <SkeletonLoader :num="6"></SkeletonLoader>
    </div>
  </PageCard>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useBookingStore } from 'src/stores/booking'
import { useItemStore } from 'src/stores/item'

import ModalUpdateApproveStatus from 'src/components/booking/ModalUpdateApproveStatus.vue'
import ModalUpdateReceivedDate from 'src/components/booking/ModalUpdateReceivedDate.vue'
import ModalCreateWR from 'src/components/booking/ModalCreateWR.vue'
import ModalPublishWR from 'src/components/booking/ModalPublishWR.vue'
import ModalDeleteBooking from 'src/components/booking/ModalDeleteBooking.vue'
import TabListPo from 'src/components/booking/TabListPo.vue'
import TabListItem from 'src/components/booking/TabListItem.vue'

export default {
  name: 'BookingDetailPage',
  components: { TabListPo, TabListItem },
  setup() {
    const bookingStore = useBookingStore()
    const itemStore = useItemStore()

    const tab = ref('booking')

    const detailData = ref(null as Booking | null)
    const isLoadingDetail = ref(true)

    const bookingPo = ref([] as BookingPo[])
    const isLoadingPo = ref(true)

    const itemBookingList = ref([] as ItemBooking[])
    const isLoadingItem = ref(true)

    return {
      bookingStore,
      itemStore,
      detailData,
      isLoadingDetail,
      tab,
      isLoadingPo,
      bookingPo,
      itemBookingList,
      isLoadingItem,
    }
  },

  mounted() {
    this.fetchData()
    this.fetchListPo()
    this.fetchListItem()
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

      this.bookingStore
        .getListBookingPo(Number(this.$route.params.id))
        .then((res) => {
          this.bookingPo = res
        })
        .finally(() => {
          this.isLoadingPo = false
        })
    },

    fetchListItem(): void {
      this.isLoadingItem = true

      const params: ParamItemBookingList = {}

      this.itemStore
        .getItemBookingList(Number(this.$route.params.id as string), params)
        .then((res) => {
          this.itemBookingList = res
        })
        .finally(() => {
          this.isLoadingItem = false
        })
    },

    openModalDelete(id: number | undefined): void {
      this.$q
        .dialog({
          component: ModalDeleteBooking,
          componentProps: {
            id: id,
          },
        })
        .onOk(() => {
          this.$router.push('/bookings')
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

    canUpdateReceivedDate(): boolean {
      if (this.bookingPo.length === 0) return false

      return this.bookingPo.every((po) => po.status === 'completed')
    },
  },
}
</script>
