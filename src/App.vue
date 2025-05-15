<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { setToastInstance } from './service/ToastService'

const toast = ref(null)
onMounted(async () => {
  setToastInstance(toast.value)
})

</script>

<template>
    <router-view />
    <Toast ref="toast" />

</template>

<style scoped></style>
