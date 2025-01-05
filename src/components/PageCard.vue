<template>
  <q-card style="min-height: 80vh; padding: 24px">
    <span style="font-size: 24px; font-weight: 500">
      {{ title }}
    </span>
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
  },
}
</script>
