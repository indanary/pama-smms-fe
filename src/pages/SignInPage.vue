<template>
  <div
    style="
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    "
  >
    <q-card style="width: 450px; padding: 24px">
      <q-card-section>
        <q-img
          src="/src/assets/pama-logo.png"
          alt="Pama Logo"
          spinner-color="white"
          fit="contain"
          height="48px"
        />
      </q-card-section>

      <q-card-section>
        <div style="display: flex; flex-direction: column; gap: 8px">
          <span style="font-size: 32px; font-weight: 500">Log in</span>
          <span>Welcome to Pama Improvement Dashboard</span>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form ref="formRef" style="display: flex; flex-direction: column; gap: 20px">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span>Email</span>
            <q-input v-model="formState.email" type="email" filled dense outlined></q-input>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px">
            <span>Password</span>
            <q-input
              v-model="formState.password"
              :type="isPassword ? 'password' : 'text'"
              filled
              dense
              outlined
            >
              <template v-slot:append>
                <q-icon
                  :name="isPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPassword = !isPassword"
                />
              </template>
            </q-input>
          </div>

          <q-btn color="primary" label="Log in" no-caps />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { reactive, ref } from 'vue'

export default {
  name: 'SignInPage',
  setup() {
    const formState = reactive({
      email: '',
      password: '',
    })
    const isPassword = ref(true)

    return {
      formState,
      isPassword,
    }
  },
}
</script>
