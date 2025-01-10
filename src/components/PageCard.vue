<template>
  <q-card style="min-height: 80vh; padding: 24px">
    <div style="display: flex; align-items: center; gap: 8px">
      <q-btn v-if="backPath" icon="arrow_back" dense flat @click="goBack"></q-btn>
      <span style="font-size: 24px; font-weight: 500">
        {{ title }}
      </span>
    </div>
    <div style="margin-top: 12px">
      <slot />
    </div>
  </q-card>
</template>

<script lang="ts">
export default {
  name: 'PageCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    backPath: {
      type: String,
      required: false,
    },
  },
  methods: {
    goBack(): void {
      if (!this.backPath) return

      this.$router.push(this.backPath)
    },
  },
}
</script>
