<template>
  <PageCard title="Booking Detail" back-path="/bookings">
    <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 32px">
      <DetailItem label="Booking ID">
        <span>BOOKSM{{ detailData?.id }}</span>
      </DetailItem>

      <DetailItem label="Approved Status">
        <div style="display: flex; align-items: center; gap: 8px">
          <q-icon
            :name="detailData?.approved_status === 0 ? 'close' : 'check'"
            :color="detailData?.approved_status === 0 ? 'red' : 'green'"
          ></q-icon>
          <q-btn v-if="detailData?.approved_status === 0" color="secondary" no-caps>Update</q-btn>
        </div>
      </DetailItem>

      <DetailItem label="Description">
        <span>{{ detailData?.description }}</span>
      </DetailItem>

      <DetailItem label="PO Numbers">
        <span v-if="detailData?.po_numbers">
          {{ detailData?.po_numbers }}
        </span>
        <q-btn v-else color="secondary" no-caps>Update</q-btn>
      </DetailItem>

      <DetailItem label="Booking Status">
        <span>{{ detailData?.booking_status === 'open' ? 'Open' : 'Close' }}</span>
      </DetailItem>

      <DetailItem label="Received Date">
        <span v-if="detailData?.received_date">
          {{ detailData?.received_date }}
        </span>
        <q-btn v-else color="secondary" no-caps>Update</q-btn>
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

      <div style="display: flex; align-items: center; gap: 8px">
        <!-- <q-btn color="secondary" no-caps>Edit</q-btn> -->
        <q-btn color="red" no-caps @click="openModalDelete(detailData?.id)">Delete</q-btn>
      </div>
    </div>
  </PageCard>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useBookingStore } from 'src/stores/booking'

export default {
  name: 'BookingDetailPage',
  setup() {
    const bookingStore = useBookingStore()

    const detailData = ref(null as Booking | null)

    return {
      bookingStore,
      detailData,
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    fetchData(): void {
      this.bookingStore.getBookingDetail(Number(this.$route.params.id)).then((res) => {
        this.detailData = res
      })
    },

    openModalDelete(id: number | undefined): void {
      console.log(id, 'id')
    },
  },
}
</script>
