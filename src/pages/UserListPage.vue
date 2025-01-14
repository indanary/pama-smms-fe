<template>
  <PageCard title="User List">
    <div style="display: flex; justify-content: space-between; align-items: center">
      <q-btn label="Add User" color="primary" no-caps @click="openModalAdd"></q-btn>
    </div>

    <q-table
      :rows="userList"
      :columns="tableColumns"
      :loading="isLoadingFetchList"
      row-key="id"
      style="margin-top: 16px"
      table-header-style="background: var(--app-primary); color: white"
    >
      <template v-slot:body="props">
        <q-tr :props="props" style="cursor: pointer">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.name === 'role'"> {{ getUserRole(props.row.role) }} </template>

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
import { ref } from 'vue'
import { type QTableColumn } from 'quasar'
import { useUserStore } from 'src/stores/user'
import ModalAddUser from 'src/components/user/ModalAddUser.vue'
import { getUserRole } from 'app/utils/user.util.js'

export default {
  name: 'UserListPage',
  setup() {
    const userStore = useUserStore()

    const userList = ref([] as User[])
    const tableColumns: QTableColumn[] = [
      {
        name: 'name',
        required: true,
        label: 'Name',
        field: 'name',
        align: 'center',
      },
      {
        name: 'email',
        required: true,
        label: 'Email',
        field: 'email',
        align: 'center',
      },
      {
        name: 'role',
        required: true,
        label: 'Role',
        field: 'role',
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
    ]
    const isLoadingFetchList = ref(true)

    return {
      userStore,
      userList,
      tableColumns,
      isLoadingFetchList,
      getUserRole,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData(): void {
      this.isLoadingFetchList = true

      this.userStore
        .getUserList()
        .then((res) => {
          this.userList = res
        })
        .finally(() => {
          this.isLoadingFetchList = false
        })
    },

    openModalAdd(): void {
      this.$q
        .dialog({
          component: ModalAddUser,
        })
        .onOk(() => {
          this.fetchData()
        })
    },
  },
}
</script>
