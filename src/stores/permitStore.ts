import { defineStore, storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { Zone } from '@/service/ZoneService';
import { useUserStore } from "./user";

const userStore = useUserStore();

const { street, houseNumber, city } = storeToRefs(userStore);

export const usePermitStore = defineStore('permit', () => {

  const tomorrow = ref(new Date());
  tomorrow.value.setDate(tomorrow.value.getDate() + 1);

  const carRegistration = ref('');

  const startDate = ref<Date>(tomorrow.value);
  startDate.value.setDate(startDate.value.getDate() + 1);
  const endDate = computed(() => {
    if (!startDate.value) return null;
    const start = new Date(startDate.value);
    if (selectedDuration.value === 'quarter') {
      start.setMonth(start.getMonth() + 3);
    } else if (selectedDuration.value === 'year') {
      start.setFullYear(start.getFullYear() + 1);
    }
    return start;
  });

  const zones = ref<Zone[]>([]);

  const selectedZones = ref<Zone[]>([]);
  const selectedDuration = ref('year');
  const selectedPayment = ref('online');

  const totalPrice = computed(() => {
    let result = 0;
    if (selectedZones.value) {
        selectedZones.value.forEach((zone) => {
            const homeZone = isHomeZone(zone);

            if (selectedDuration.value === "quarter") {
                result += homeZone ? zone.pricePerQuarterWithDiscount : zone.pricePerQuarter;
            } else if (selectedDuration.value === "year") {
                result += homeZone ? zone.pricePerYearWithDiscount : zone.pricePerYear
            }
        });
    }
    return result;
});


  const isHomeZone = (zone: Zone) => {
    const addresses = zone.adresses.filter(x => x.street == street.value && "Děčín" == city.value);
    if (addresses.length === 0) {
        return false;
    }
    const address = addresses[0];
    if (address.numbers.length === 0) {
        return true;
    }

    return address.numbers.filter(x => x == houseNumber.value).length > 0;
};

  const updateZones = (newZones: Zone[]) => {
    zones.value = newZones;
  };

  return {
    tomorrow,
    carRegistration,
    startDate,
    endDate,
    zones,
    selectedZones,
    selectedDuration,
    totalPrice,
    selectedPayment,
    updateZones,
  };
});