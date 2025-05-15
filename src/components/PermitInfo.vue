<template>
  <div class="flex mt-4">
    <div class="card flex flex-col gap-4 w-full">
      <div class="card-header">
        <h2 class="text-xl">Údaje o oprávnění</h2>
      </div>
      <div class="grid grid-cols-12 gap-2">
        <label for="name3" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">SPZ</label>
        <div class="col-span-12 md:col-span-10">
          <Field v-model="carRegistration" id="carRegistration" name="carRegistration" :as="InputText"
            :class="{ 'p-invalid': errors.carRegistration }" />
          <small v-if="errors.carRegistration" class="p-error">{{ errors.carRegistration }}</small>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-2 mt-4">
        <label for="startDate" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Datum začátku
          oprávnění</label>
        <div class="col-span-12 md:col-span-10">
          <Calendar id="startDate" v-model="startDate" :minDate="tomorrow" dateFormat="dd.mm.yy"
            placeholder="Vyberte datum začátku oprávnění" showIcon />
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 mt-4">
        <label for="endDate" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Datum konce
          oprávnění</label>
        <div class="col-span-12 md:col-span-10">
          {{ endDate?.toLocaleDateString() }}
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 mt-4">
        <label for="zones" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Zóny</label>
        <div class="col-span-12 md:col-span-10 flex flex-wrap gap-4">
          <div v-for="zone in zones" :key="zone.name" class="flex items-center">
            <Checkbox :id="zone.name" :value="zone" v-model="selectedZones" />
            <label :for="zone.name" lass="ml-2">{{ zone.name }}</label>
          </div>
          <div>
            <small v-if="errors.selectedZones" class="p-error ml-2">{{ errors.selectedZones
            }}</small>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 mt-4">
        <label for="duration" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Délka
          oprávnění</label>
        <div class="col-span-12 md:col-span-10 flex flex-wrap gap-4">
          <div class="flex items-center">
            <RadioButton id="duration1" name="duration" v-model="selectedDuration" value="quarter" />
            <label for="duration1" class="ml-2">3 měsíce</label>
          </div>
          <div class="flex items-center">
            <RadioButton id="duration3" name="duration" v-model="selectedDuration" value="year" />
            <label for="duration3" class="ml-2">1 rok</label>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 mt-4">
        <label for="note" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Cena</label>
        <div class="col-span-12 md:col-span-10">
          {{ totalPrice }} Kč
          <small class="ml-2">Celková cena</small>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 mt-4">
        <label for="duration" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Způsob
          platby</label>
        <div class="col-span-12 md:col-span-10 flex flex-wrap gap-4">
          <div class="flex items-center">
            <RadioButton id="online" name="online" v-model="selectedPayment" value="online" />
            <label for="online" class="ml-2">Online (platební karta, QR platba)</label>
          </div>
          <div class="flex items-center">
            <RadioButton id="offline" name="offline" v-model="selectedPayment" value="offline" />
            <label for="duration3" class="ml-2">Převodem, osobně</label>
          </div>
        </div>
      </div>
      <div class="flex mt-4">
        <div class="flex">

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import { onMounted, PropType } from 'vue';

import { computed } from 'vue';
import { usePermitStore } from '@/stores/permitStore';
import { ZoneService, } from "@/service/ZoneService";
import { storeToRefs } from 'pinia';

const permitStore = usePermitStore();
const { carRegistration, totalPrice, endDate, selectedPayment, startDate, selectedDuration, selectedZones, zones } = storeToRefs(permitStore);

onMounted(async () => {
  permitStore.updateZones(await ZoneService.getZones());
});

// Compute tomorrow's date for min date validation
const tomorrow = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
});

const props = defineProps({
  errors: {
    type: Object as PropType<Partial<Record<string, string>>>,
    required: true,
  },
});
</script>