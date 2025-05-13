<template>
    <div>
        <div v-if="userStore.userId" class="user-profile bg-surface-50 dark:bg-surface-800 p-4 rounded-lg mb-4">
            <div class="text-xl font-bold mb-2">User Information</div>
            <div class="user-profile__info">
                <div class="mb-2"><strong>User ID:</strong> {{ userStore.userId }}</div>                <div class="mb-2"><strong>Name:</strong> {{ userStore.fullName }}</div>
                <div class="mb-2"><strong>Email:</strong> {{ userStore.email }}</div>
                <div class="mb-2"><strong>Address:</strong> {{ userStore.street }} {{ userStore.houseNumber }}, {{ userStore.city }}</div>
                <div v-if="userStore.dateOfBirth" class="mb-2"><strong>Date of Birth:</strong> {{ userStore.dateOfBirth }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<style scoped>
.user-profile {
    border: 1px solid var(--surface-border);
}
</style>
