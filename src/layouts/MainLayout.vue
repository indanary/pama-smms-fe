<template>
  <q-layout view="lHh lpR lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-space></q-space>

        <q-btn
          :loading="isLoadingFetchNotification"
          color="white"
          flat
          icon="notifications"
          size="md"
          :class="unreadNotifCount > 0 ? 'notif' : ''"
        >
          <q-menu anchor="bottom left">
            <q-list separator style="min-width: 280px">
              <q-item style="display: flex; align-items: center; justify-content: space-between">
                <q-item-section style="font-weight: 600"
                  >Notifications ({{ unreadNotifCount }} Unread)</q-item-section
                >
                <q-btn
                  flat
                  dense
                  no-caps
                  @click="onClickSeeAllNotif"
                  color="primary"
                  label="See all"
                ></q-btn>
              </q-item>

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
          </q-menu>
        </q-btn>

        <q-btn-dropdown color="white" flat icon="account_circle" size="md">
          <q-list>
            <q-item style="cursor: default">
              <q-item-section>
                <q-item-label style="font-weight: 500">{{
                  userStore.userProfile?.name
                }}</q-item-label>
                <q-item-label caption>{{ userStore.userProfile?.role }} </q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="authStore.logout">
              <q-item-section>
                <q-item-label style="font-weight: 500">Log out </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <!-- img logo -->
        <q-item v-ripple="false">
          <q-item-section>
            <q-img
              src="/pama-logo.png"
              alt="Pama Logo"
              spinner-color="white"
              fit="contain"
              height="32px"
            />
          </q-item-section>
        </q-item>

        <template v-for="menu in SidebarMenuList" :key="menu.name">
          <q-item
            v-if="!menu.children && checkMenuPermission(menu.permission)"
            clickable
            v-ripple
            @click="onClickMenu(menu.route ?? '')"
          >
            <q-item-section avatar>
              <q-icon color="primary" :name="menu.icon" />
            </q-item-section>

            <q-item-section style="font-weight: 500">
              {{ menu.name }}
            </q-item-section>
          </q-item>

          <q-expansion-item
            v-if="menu.children && checkParentMenuPermission(menu)"
            :icon="menu.icon"
            :label="menu.name"
            style="font-weight: 500"
          >
            <q-item
              v-for="child in menu.children"
              :key="child.name"
              clickable
              v-ripple
              @click="onClickMenu(child.route ?? '')"
            >
              <q-item-section avatar style="margin-left: 24px">
                <q-icon color="primary" :name="child.icon" />
              </q-item-section>

              <q-item-section style="font-weight: 500">
                {{ child.name }}
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <div style="min-height: calc(100vh - 50px); padding: 32px; background-color: #f6f6f6">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { useUserStore } from 'src/stores/user'
import { useAuthStore } from 'src/stores/auth'
import { useNotificationStore } from 'src/stores/notification'
import { ref } from 'vue'
import { SidebarMenuList } from 'app/data/menu-list'

export default {
  name: 'MainLayout',
  setup() {
    const userStore = useUserStore()
    const authStore = useAuthStore()
    const notificationStore = useNotificationStore()

    const leftDrawerOpen = ref(false)
    const isLoadingFetchNotification = ref(true)
    const unreadNotifCount = ref(0)
    const notificationList = ref([] as NotificationUser[])

    return {
      userStore,
      authStore,
      notificationStore,
      leftDrawerOpen,
      SidebarMenuList,
      isLoadingFetchNotification,
      unreadNotifCount,
      notificationList,
    }
  },

  mounted() {
    this.fetchNotification()
  },

  methods: {
    toggleLeftDrawer(): void {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },

    onClickMenu(path: string): void {
      this.$router.push(path)
    },

    checkMenuPermission(permission: string[] | undefined): boolean {
      if (!permission) return true

      return permission.includes(this.userStore.userProfile?.role ?? '')
    },

    checkParentMenuPermission(parentMenu: SidebarMenu): boolean {
      if (!parentMenu.children) return false

      const childrenPermission = parentMenu.children.map((c) =>
        this.checkMenuPermission(c.permission),
      )
      const isMenuAvailable = childrenPermission.some((p) => p === true)

      return isMenuAvailable
    },

    fetchNotification(): void {
      this.isLoadingFetchNotification = true

      this.notificationStore
        .getNotificationList()
        .then((res) => {
          this.notificationList = res

          this.unreadNotifCount = this.notificationList.filter(
            (notif) => notif.is_read === 0,
          ).length
        })
        .finally(() => {
          this.isLoadingFetchNotification = false
        })
    },

    onClickNotif(id: number, bookingId: number): void {
      this.notificationStore
        .readNotification(id)
        .then(() => {
          window.open(`/bookings/${bookingId}`, '_blank')
        })
        .finally(() => {
          this.fetchNotification()
        })
    },

    onClickSeeAllNotif(): void {
      this.$router.push('/notifications')
    },
  },
}
</script>

<style lang="scss">
.notif {
  position: relative;
}

.notif::after {
  content: '';
  position: absolute;
  top: 4px;
  right: 14px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: red;
}
</style>
