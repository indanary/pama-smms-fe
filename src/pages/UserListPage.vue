<template>
  <PageCard title="User List">
    <div style="display: flex; justify-content: space-between; align-items: center">
      <q-btn label="Add User" color="primary" no-caps @click="openModalAdd"></q-btn>
    </div>

    <q-table
      :rows="userList"
      :columns="tableColumns"
      :loading="isLoadingFetchList"
      :pagination="tablePaginations"
      :rows-per-page-options="tablePaginations.recordPerPage"
      row-key="id"
      style="margin-top: 16px"
      table-header-style="background: var(--app-primary); color: white"
      flat
      @request="onRequest"
    >
      <template v-slot:body="props">
        <q-tr :props="props" style="cursor: pointer">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.name === 'role'"> {{ getUserRole(props.row.role) }} </template>

            <template v-else-if="col.name === 'is_active'">
              <div style="display: flex; align-items: center; gap: 4px">
                <q-toggle
                  v-model="props.row.is_active"
                  @update:model-value="($event) => updateStatusUser($event, props.row.id)"
                />
                <span>{{ props.row.is_active === 0 ? 'Inactive' : 'Active' }}</span>
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
      {
        name: 'is_active',
        required: true,
        label: 'Status',
        field: 'is_active',
        align: 'center',
      },
    ]
    const isLoadingFetchList = ref(true)
    const tablePaginations = reactive({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
      recordPerPage: [10, 25, 50],
    })
    const params: ParamUserList = reactive({
      page: tablePaginations.page,
      limit: tablePaginations.rowsPerPage,
    })

    return {
      userStore,
      userList,
      tableColumns,
      isLoadingFetchList,
      getUserRole,
      tablePaginations,
      params,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData(): void {
      this.isLoadingFetchList = true

      this.userStore
        .getUserList(this.params)
        .then((res) => {
          this.userList = res.data.map((data) => ({ ...data, is_active: data.is_active === 1 }))

          this.tablePaginations.page = res.page
          this.tablePaginations.rowsPerPage = res.limit
          this.tablePaginations.rowsNumber = res.totalPages
        })
        .finally(() => {
          this.isLoadingFetchList = false
        })
    },

    updateStatusUser(value: boolean, id: number): void {
      const payload: PayloadUpdateStatusUser = {
        is_active: value,
      }

      this.userStore.updateStatusUser(id, payload).then(() => {
        this.fetchData()
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
