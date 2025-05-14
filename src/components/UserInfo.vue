<template>
  <div class="card flex flex-col gap-4 w-full">
    <div class="card-header">
      <h2 class="text-xl">Vaše kontaktní údaje</h2>
    </div>
    <div class="card-body">
      <div class="grid grid-cols-12 gap-2">
        <label for="name1" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Jméno</label>
        <div class="col-span-12 md:col-span-10">
          <Field v-model="firstName" id="firstName" name="firstName" :as="InputText" :class="{ 'p-invalid': errors.firstName }" />
          <small v-if="errors.firstName" class="p-error">{{ errors.firstName }}</small>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 mt-4">
        <label for="name2" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Příjmení</label>
        <div class="col-span-12 md:col-span-10">
          <Field v-model="lastName" id="lastName" name="lastName" :as="InputText" :class="{ 'p-invalid': errors.lastName }" />
          <small v-if="errors.lastName" class="p-error">{{ errors.lastName }}</small>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 mt-4">
        <label for="name2" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Město</label>
        <div class="col-span-12 md:col-span-10">
          <Field v-model="city" id="city" name="city" :as="InputText" :class="{ 'p-invalid': errors.city }" />
          <small v-if="errors.city" class="p-error">{{ errors.city }}</small>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 mt-4">
        <label for="street" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Ulice</label>
        <div class="col-span-12 md:col-span-10">
          <Field v-model="street" id="street" name="street" :as="InputText" :class="{ 'p-invalid': errors.street }" />
          <small v-if="errors.street" class="p-error">{{ errors.street }}</small>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 mt-4">
        <label for="houseNumber" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Číslo popisné</label>
        <div class="col-span-12 md:col-span-10">
          <Field v-model="houseNumber" id="houseNumber" name="houseNumber" :as="InputText" :class="{ 'p-invalid': errors.houseNumber }" />
          <small v-if="errors.houseNumber" class="p-error">{{ errors.houseNumber }}</small>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 mt-4">
        <label for="email" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">E-mail</label>
        <div class="col-span-12 md:col-span-10">
          <Field v-model="email" id="email" name="email" :as="InputText" :class="{ 'p-invalid': errors.email }" />
          <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate';
import InputText from 'primevue/inputtext';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { onMounted, PropType } from 'vue';

const userStore = useUserStore();
const { firstName, lastName, city, street, houseNumber, email } = storeToRefs(userStore);

onMounted(async () => {
    userStore.loadFromXml('/src/assets/sampleuser.xml');
});

const props = defineProps({
  errors: {
    type: Object as PropType<Partial<Record<string, string>>>,
    required: true,
  },
});
</script>