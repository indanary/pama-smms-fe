<template>
  <q-dialog persistent ref="dialogRef">
    <q-card style="width: 1000px">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Add User </span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section style="max-height: 60vh" class="scroll">
        <q-form greedy ref="formRef" style="display: flex; flex-direction: column; gap: 8px">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Name</span>
            <q-input
              v-model="formState.name"
              type="text"
              filled
              dense
              outlined
              placeholder="Input name"
              :rules="[new UserRules().validateRequired]"
            ></q-input>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Email</span>
            <q-input
              v-model="formState.email"
              type="email"
              filled
              dense
              outlined
              placeholder="Input email"
              :rules="[new UserRules().validateEmail]"
            ></q-input>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Password</span>
            <q-input
              v-model="formState.password"
              type="password"
              filled
              dense
              outlined
              placeholder="Input password"
              :rules="[new UserRules().validatePassword]"
            ></q-input>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Role</span>
            <q-select
              v-model="formState.role"
              type="text"
              filled
              dense
              outlined
              use-input
              map-options
              :placeholder="formState.role !== '' ? '' : 'Select role'"
              :options="roleOptions"
              option-label="name"
              option-value="value"
              :rules="[new UserRules().validateRequired]"
            ></q-select>
          </div>
        </q-form>
      </q-card-section>

      <q-card-section>
        <div style="display: flex; justify-content: end; align-items: center; gap: 8px">
          <q-btn no-caps label="Cancel" @click="onDialogCancel" :disable="isLoadingAdd"></q-btn>
          <q-btn
            no-caps
            label="Add"
            color="primary"
            @click="onAddUser"
            :loading="isLoadingAdd"
          ></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent, type QForm } from 'quasar'
import { reactive, ref } from 'vue'
import { useUserStore } from 'src/stores/user'
import { UserRules } from 'app/utils/user.util.js'

export default {
  name: 'ModalAddUser',
  setup() {
    const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()

    const userStore = useUserStore()

    const formState = reactive<FormUser>({
      name: '',
      email: '',
      password: '',
      role: '',
    })
    const isLoadingAdd = ref(false)
    const roleOptions = ref([
      { value: 'super_admin', name: 'Super Admin' },
      { value: 'admin', name: 'Admin' },
      { value: 'planner', name: 'Planner' },
      { value: 'inventory', name: 'Inventory' },
      { value: 'purchasing', name: 'Purchasing' },
      { value: 'warehouse', name: 'Warehouse' },
    ])

    return {
      dialogRef,
      onDialogCancel,
      onDialogOK,
      userStore,
      formState,
      isLoadingAdd,
      UserRules,
      roleOptions,
    }
  },
  methods: {
    onAddUser(): void {
      ;(this.$refs.formRef as QForm).validate().then((isValid) => {
        if (!isValid) return

        this.isLoadingAdd = true

        const payload: PayloadAddUser = {
          name: this.formState.name,
          email: this.formState.email,
          role: this.formState.role,
          password: this.formState.password,
        }

        this.userStore
          .addUser(payload)
          .then(() => {
            this.onDialogOK()
          })
          .finally(() => {
            this.isLoadingAdd = false
          })
      })
    },
  },
}
</script>
