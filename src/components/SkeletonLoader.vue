<template>
  <template v-for="(item, index) in num" :key="index">
    <div style="padding-top: 8px; padding-bottom: 8px">
      <q-skeleton type="rect" />
    </div>
  </template>
</template>

<script lang="ts">
export default {
  name: 'SkeletonLoader',
  props: {
    num: {
      type: Number,
      required: false,
      default: 3,
    },
  },
}
</script>
