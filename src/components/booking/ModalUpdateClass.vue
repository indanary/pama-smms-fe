<template>
  <q-dialog persistent ref="dialogRef">
    <q-card style="width: 1000px">
      <q-card-section>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 18px; font-weight: 500">Modal Update Class </span>
          <q-btn icon="close" size="sm" dense @click="onDialogCancel"></q-btn>
        </div>
      </q-card-section>

      <q-card-section style="max-height: 60vh" class="scroll">
        <q-form greedy ref="formRef" style="display: flex; flex-direction: column; gap: 20px">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span class="app-input-required">Class</span>
            <q-input
              v-model="formState.class"
              type="text"
              filled
              dense
              outlined
              placeholder="Input class"
              @update:model-value="convertToUppercase('class')"
              :rules="[new ItemRules().validateRequired]"
            ></q-input>
          </div>
        </q-form>
      </q-card-section>

      <q-card-section>
        <div style="display: flex; justify-content: end; align-items: center; gap: 8px">
          <q-btn no-caps label="Cancel" @click="onDialogCancel" :disable="isLoadingUpdate"></q-btn>
          <q-btn
            no-caps
            label="Update"
            color="primary"
            @click="onUpdateItem"
            :loading="isLoadingUpdate"
          ></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { reactive, ref } from 'vue'
import { useItemStore } from 'src/stores/item'
import { ItemRules } from 'app/utils/item.util.js'

export default {
  name: 'ModalUpdateClass',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()
    const itemStore = useItemStore()

    const formState = reactive({
      class: '',
    })
    const isLoadingUpdate = ref(false)

    return {
      ItemRules,
      dialogRef,
      onDialogCancel,
      onDialogOK,
      itemStore,
      formState,
      isLoadingUpdate,
    }
  },
  methods: {
    onUpdateItem(): void {
      this.isLoadingUpdate = true

      const payload: PayloadUpdateItem = {
        class: this.formState.class,
      }

      this.itemStore
        .updateItem(this.id, payload)
        .then(() => {
          this.onDialogOK()
        })
        .finally(() => {
          this.isLoadingUpdate = false
        })
    },

    convertToUppercase(val: 'class'): void {
      const value = this.formState[val]

      this.formState[val] = value.toUpperCase() as never
    },
  },
}
</script>
