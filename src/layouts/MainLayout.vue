<template>
  <q-layout view="lHh lpR lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-space></q-space>

        <q-btn-dropdown color="white" flat icon="account_circle" size="lg">
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
              src="/src/assets/pama-logo.png"
              alt="Pama Logo"
              spinner-color="white"
              fit="contain"
              height="32px"
            />
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="home" />
          </q-item-section>

          <q-item-section>Menu</q-item-section>
        </q-item>
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
import { ref } from 'vue'

export default {
  name: 'MainLayout',
  setup() {
    const userStore = useUserStore()
    const authStore = useAuthStore()

    const leftDrawerOpen = ref(false)

    return {
      userStore,
      authStore,
      leftDrawerOpen,
    }
  },

  methods: {
    toggleLeftDrawer(): void {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
  },
}
</script>
