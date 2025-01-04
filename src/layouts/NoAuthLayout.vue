<template>
  <div
    style="
      width: 100%;
      height: 100vh;
      background-color: var(--app-primary);
      display: flex;
      justify-content: center;
      align-items: center;
    "
  >
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  name: 'NoAuthLayout',
}
</script>
