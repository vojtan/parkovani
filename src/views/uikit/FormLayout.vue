<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { computed, ref, onMounted } from "vue";
import * as yup from "yup";
import { useUserStore } from "../../stores/user";
import { ZoneService, Zone } from "@/service/ZoneService";
import { PermitService } from "@/service/PermitService";

const userStore = useUserStore();

const schema = yup.object({
    carRegistration: yup
        .string()
        .required("Zadejte SPZ")
        .matches(
            /^[a-zA-Z0-9]{1,10}$/,
            "SPZ je v nesprávném formátu (max 10 znaků) a může obsahovat pouze písmena a číslice",
        ),
    selectedZones: yup.array().min(1, "Vyberte alespoň jednu zónu"),
    email: yup
        .string()
        .required("Zadejte e-mail")
        .email("Zadejte platný e-mail"),
    firstName: yup.string().required("Zadejte jméno"),
    lastName: yup.string().required("Zadejte příjmení"),
    city: yup.string().required("Zadejte město"),
    street: yup.string().required("Zadejte adresu"),
});

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const zones = ref<Zone[]>([]);
const { handleSubmit, errors } = useForm({
    validationSchema: schema,
    initialValues: {
        carRegistration: "",
        selectedZones: [],
        email: userStore.email || "",
        firstName: userStore.firstName || "",
        lastName: userStore.lastName || "",
        street: userStore.street || "",
        city: userStore.city || "",
        streetNumber: userStore.streetNumber || "",
        startDate: tomorrow,
    },
});

onMounted(async () => {
    zones.value = ZoneService.getZones();
});

const { value: carRegistration } = useField<string>("carRegistration");
const { value: selectedZones } = useField<Zone[]>("selectedZones", []);
const { value: email } = useField<string>("email");
const { value: firstName } = useField<string>("firstName");
const { value: lastName } = useField<string>("lastName");
const { value: city } = useField<string>("city");
const { value: street } = useField<string>("street");
const { value: streetNumber } = useField<string>("streetNumber");
const { value: startDate } = useField<Date>("startDate");
let selectedDuration = ref("1year");
let selectePayment = ref("online"); // Default payment method
const showDialog = ref(false); // New ref for dialog visibility

// Calculate tomorrow for min date on Calendar

// Form submission handler
const onSubmit =  handleSubmit(async (values) => {
    // Show dialog
    showDialog.value = true;
    
    // Update user store with form values
    var result = await PermitService.addPermit({
        carRegistration: carRegistration.value,
        validFrom: startDate.value,
        validTo: endDate.value,
        price: totalPrice.value,
        firstname: firstName.value,
        lastname: lastName.value,
        email: email.value,
        city: city.value,
        street: street.value,
        houseNumber: streetNumber.value,
        permitDuration: selectedDuration.value,
        paymentMethod: selectePayment.value,
        variableSymbol: null,
    });
    
    setTimeout(async () => {
        // Start polling for the permit until variableSymbol is set
        const pollInterval = setInterval(async () => {
            try {
                const permit = await PermitService.getPermit(result.id);
                if (permit.variableSymbol) {
                    clearInterval(pollInterval);
                    showDialog.value = false;
                    window.location.href = `https://platby.mmdecin.cz/zpo/platba?action=ko_def&typvstupu=vs&vstupniIdentifikatorField=${permit.variableSymbol}`;
                }
            } catch (error) {
                console.error("Error polling for permit:", error);
            }
        }, 2000); 
        
        setTimeout(() => {
            clearInterval(pollInterval);
            showDialog.value = false;
            alert("Vyřízení žádosti trvá déle než obvykle. Zkontrolujte stav žádosti později.");
        }, 180000);
    }, 2000);
    
    console.log(values);
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

    return address.numbers.filter(x => x == streetNumber.value).length > 0;
};

const endDate = computed(() => {
    const start = new Date(startDate.value);
    if (selectedDuration.value === "3months") {
        start.setMonth(start.getMonth() + 3);
    } else if (selectedDuration.value === "1year") {
        start.setFullYear(start.getFullYear() + 1);
    }
    return start;
});	

const totalPrice = computed(() => {
    let result = 0;
    selectedZones.value.forEach((zone) => {
        const homeZone = isHomeZone(zone);

        if (selectedDuration.value === "3months") {
            result += homeZone ? zone.pricePerQuarterWithDiscount : zone.pricePerQuarter;
        } else if (selectedDuration.value === "1year") {
            result += homeZone ? zone.pricePerYearWithDiscount : zone.pricePerYear
        }
    });
    return result;
});
</script>

<template>
    <Fluid>
        <div class="flex mt-8">
            <div class="flex items-center gap-2">
                <h1 class="text-3xl ml-4">Nová žádost o parkovací oprávnění</h1>
            </div>
        </div>
        <div class="flex mt-4">
            <div class="card flex flex-col gap-4 w-full">
                <div class="card-header">
                    <h2 class="text-xl">Kontaktní údaje</h2>
                </div>
                <div class="card-body">
                    <div class="grid grid-cols-12 gap-2">
                        <label for="name1"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Jméno</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText  id="name1" type="text" v-model="firstName" />
                            <small v-if="errors.firstName" class="p-error">{{
                                errors.firstName
                            }}</small>
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2 mt-4">
                        <label for="name2"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Příjmení</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText  id="name2" type="text" v-model="lastName" />
                            <small v-if="errors.lastName" class="p-error">{{
                                errors.lastName
                            }}</small>
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2 mt-4">
                        <label for="name2"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Město</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText  id="name2" type="text" v-model="city" />
                            <small v-if="errors.lastName" class="p-error">{{
                                errors.lastName
                            }}</small>
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2 mt-4">
                        <label for="street"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Ulice</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText  id="street" type="text" v-model="street" />
                            <small v-if="errors.street" class="p-error">{{
                                errors.street
                            }}</small>
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2 mt-4">
                        <label for="street" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Číslo
                            popisné</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText  id="streetNumber" type="text" v-model="streetNumber" />
                            <small v-if="errors.streetNumber" class="p-error">{{
                                errors.street
                            }}</small>
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2 mt-4">
                        <label for="email"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">E-mail</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText id="email" type="email" v-model="email" placeholder="example@domain.com" />
                            <small v-if="errors.email" class="p-error">{{
                                errors.email
                            }}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex mt-4">
            <div class="card flex flex-col gap-4 w-full">
                <form @submit.prevent="onSubmit">
                    <div class="grid grid-cols-12 gap-2">
                        <label for="name3" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">SPZ</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText id="name3" v-model="carRegistration" type="text" placeholder="" />
                            <small v-if="errors.carRegistration" class="p-error">{{ errors.carRegistration }}</small>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2 mt-4">
                        <label for="startDate" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Začátek
                            oprávnění</label>
                        <div class="col-span-12 md:col-span-10">
                            <Calendar id="startDate" v-model="startDate" :minDate="tomorrow" dateFormat="dd.mm.yy"
                                placeholder="Vyberte datum začátku oprávnění" showIcon />
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2 mt-4">
                        <label for="endDate" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Konec
                            oprávnění</label>
                        <div class="col-span-12 md:col-span-10">
                            {{ endDate.toLocaleDateString() }}
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2 mt-4">
                        <label for="zones" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Zóny</label>
                        <div class="col-span-12 md:col-span-10 flex flex-wrap gap-4">
                            <div v-for="zone in zones" :key="zone.name" class="flex items-center">
                                <Checkbox :id="zone.name" :value="zone" v-model="selectedZones" />
                                <label :for="zone.name" class="ml-2">{{ zone.name }}</label>
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
                                <RadioButton id="duration1" name="duration" v-model="selectedDuration"
                                    value="3months" />
                                <label for="duration1" class="ml-2">3 měsíce</label>
                            </div>
                            <div class="flex items-center">
                                <RadioButton id="duration3" name="duration" v-model="selectedDuration" value="1year" />
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
                                <RadioButton id="online" name="online" v-model="selectePayment" value="online" />
                                <label for="online" class="ml-2">Online (platební karta, QR platba)</label>
                            </div>
                            <div class="flex items-center">
                                <RadioButton id="offline" name="offline" v-model="selectePayment" value="offline" />
                                <label for="duration3" class="ml-2">Převodem, osobně</label>
                            </div>
                        </div>
                    </div>
                    <div class="flex mt-4">
                        <div class="flex">
                            <Button type="submit" label="Odeslat s povinností zaplatit" class="w-auto" :disabled="Object.keys(errors).length > 0 ||
                                selectedZones.length === 0
                                " />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </Fluid>
    
    <!-- Processing Dialog -->
    <Dialog v-model:visible="showDialog" :closable="false" :modal="true" header="Zpracování">
        <div class="flex flex-column align-items-center">
            <ProgressSpinner style="width:50px;height:50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
            <span class="mt-3">Probíhá schválení žádosti. Po schválení žádosti budete přesměrováni na platební bránu, kde budete moct zaplatit.</span>
        </div>
    </Dialog>
</template>
