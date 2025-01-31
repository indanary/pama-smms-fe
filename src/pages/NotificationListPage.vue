<template>
  <PageCard :title="`Notifications (${unreadNotifCount} Unread)`">
    <q-scroll-area style="height: 500px">
      <q-list separator style="border-top: 1px; border-bottom: 1px solid #0000001f">
        <template v-if="notificationList.length > 0">
          <q-item
            v-for="(notif, index) in notificationList"
            :key="index"
            clickable
            v-close-popup
            style="display: flex; flex-direction: column"
            :style="{ backgroundColor: notif.is_read === 0 ? '#fcc0c0' : 'white' }"
            @click="onClickNotif(notif.id, notif.booking_id)"
          >
            <span style="font-weight: 500">BOOKSM{{ notif.booking_id }}</span>
            <span style="font-size: 12px">{{ notif.message }}</span>
          </q-item>
        </template>

        <template v-else>
          <q-item>
            <q-item-section>Empty notifications</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-scroll-area>
  </PageCard>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useNotificationStore } from 'src/stores/notification'

export default {
  name: 'NotificationListPage',
  setup() {
    const notificationStore = useNotificationStore()

    const isLoading = ref(true)
    const notificationList = ref([] as NotificationUser[])
    const unreadNotifCount = ref(0)

    return {
      notificationStore,
      isLoading,
      notificationList,
      unreadNotifCount,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData(): void {
      this.isLoading = true

      this.notificationStore
        .getNotificationList()
        .then((res) => {
          this.notificationList = res

          this.unreadNotifCount = this.notificationList.filter(
            (notif) => notif.is_read === 0,
          ).length
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    onClickNotif(id: number, bookingId: number): void {
      this.notificationStore
        .readNotification(id)
        .then(() => {
          window.open(`/bookings/${bookingId}`, '_blank')
        })
        .finally(() => {
          this.fetchData()
        })
    },
  },
}
</script>
