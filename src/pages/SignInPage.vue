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
          src="/pama-logo.png"
          alt="Pama Logo"
          spinner-color="white"
          fit="contain"
          height="48px"
        />
      </q-card-section>

      <q-card-section>
        <div style="display: flex; flex-direction: column; gap: 8px">
          <span style="font-size: 32px; font-weight: 500">Log in</span>
          <span>Welcome to SiBook Dashboard</span>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form greedy ref="formRef" style="display: flex; flex-direction: column; gap: 20px">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span>Email</span>
            <q-input
              v-model="formState.email"
              type="email"
              filled
              dense
              outlined
              :rules="[new AuthRules().validateEmail]"
            ></q-input>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px">
            <span>Password</span>
            <q-input
              v-model="formState.password"
              :type="isPassword ? 'password' : 'text'"
              filled
              dense
              outlined
              :rules="[new AuthRules().validateEmail]"
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

          <q-btn
            color="primary"
            label="Log in"
            no-caps
            :loading="isLoadingLogin"
            @click="onLogin"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { reactive, ref } from 'vue'
import { type QForm } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { AuthRules } from 'app/utils/auth.util.js'

export default {
  name: 'SignInPage',
  setup() {
    const authStore = useAuthStore()

    const formState = reactive<FormLogin>({
      email: '',
      password: '',
    })
    const isPassword = ref(true)
    const isLoadingLogin = ref(false)

    return {
      AuthRules,
      authStore,
      formState,
      isPassword,
      isLoadingLogin,
    }
  },
  methods: {
    onLogin(): void {
      ;(this.$refs.formRef as QForm).validate().then((isValid) => {
        if (!isValid) return

        this.isLoadingLogin = true

        const payload: PayloadLogin = {
          email: this.formState.email,
          password: this.formState.password,
        }

        this.authStore
          .login(payload)
          .then(() => {
            this.$router.push('/')
          })
          .finally(() => {
            this.isLoadingLogin = false
          })
      })
    },
  },
}
</script>
