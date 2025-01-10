<template>
  <div style="display: flex; align-items: center; gap: 16px">
    <span style="width: 25%; font-weight: 500">{{ label }}</span>
    <div style="width: 50%">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DetailItem',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
}
</script>
