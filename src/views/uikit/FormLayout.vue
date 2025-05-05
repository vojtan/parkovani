<script setup>
import { useField, useForm } from "vee-validate";
import { computed, ref } from "vue";
import * as yup from "yup";
import { useUserStore } from "../../stores/user";

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
    street: yup.string().required("Zadejte adresu"),
});

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const { handleSubmit, errors } = useForm({
    validationSchema: schema,
    initialValues: {
        carRegistration: "",
        selectedZones: [],
        email: userStore.email || "",
        firstName: userStore.firstName || "",
        lastName: userStore.lastName || "",
        street: userStore.street || "",
        startDate: tomorrow,
    },
});

const { value: carRegistration } = useField("carRegistration");
const { value: selectedZones } = useField("selectedZones", []);
const { value: email } = useField("email");
const { value: firstName } = useField("firstName");
const { value: lastName } = useField("lastName");
const { value: street } = useField("street");
const { value: startDate } = useField("startDate", tomorrow);
let selectedDuration = ref("1year");
let selectePayment = ref("online"); // Default payment method

// Calculate tomorrow for min date on Calendar

// Form submission handler
const onSubmit = handleSubmit((values) => {
    // Update user store with form values
    userStore.updateUserInfo({
        firstName: values.firstName,
        lastName: values.lastName,
        street: values.street,
        email: values.email,
    });

    alert("Form submitted successfully!");
    // Handle form submission
    console.log(values);
});

const isHomeZone = (zone) => {
    if (zone === "Děčín") {
        return true;
    }
    return false;
};

const totalPrice = computed(() => {
    let result = 0;
    selectedZones.value.forEach((zone) => {
        const homeZone = isHomeZone(zone);

        if (selectedDuration.value === "3months") {
            result += homeZone ? 375 : 600;
        } else if (selectedDuration.value === "1year") {
            result += homeZone ? 1500 : 2400;
        }
    });
    if (selectedDuration.value.length === 2) {
        if (selectedDuration.value === "3months") {
            result = 975;
        } else if (selectedDuration.value === "1year") {
            result = 3900;
        }
    }
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
                        <label
                            for="name1"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"
                            >Jméno</label
                        >
                        <div class="col-span-12 md:col-span-10">
                            <InputText
                                disabled=""
                                id="name1"
                                type="text"
                                v-model="firstName"
                            />
                            <small v-if="errors.firstName" class="p-error">{{
                                errors.firstName
                            }}</small>
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2 mt-4">
                        <label
                            for="name2"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"
                            >Příjmení</label
                        >
                        <div class="col-span-12 md:col-span-10">
                            <InputText
                                disabled
                                id="name2"
                                type="text"
                                v-model="lastName"
                            />
                            <small v-if="errors.lastName" class="p-error">{{
                                errors.lastName
                            }}</small>
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2 mt-4">
                        <label
                            for="street"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"
                            >Adresa</label
                        >
                        <div class="col-span-12 md:col-span-10">
                            <InputText
                                disabled
                                id="street"
                                type="text"
                                v-model="street"
                            />
                            <small v-if="errors.street" class="p-error">{{
                                errors.street
                            }}</small>
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2 mt-4">
                        <label
                            for="email"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"
                            >E-mail</label
                        >
                        <div class="col-span-12 md:col-span-10">
                            <InputText
                                id="email"
                                type="email"
                                v-model="email"
                                placeholder="example@domain.com"
                            />
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
                        <label
                            for="name3"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"
                            >SPZ</label
                        >
                        <div class="col-span-12 md:col-span-10">
                            <InputText
                                id="name3"
                                v-model="carRegistration"
                                type="text"
                                placeholder=""
                            />
                            <small
                                v-if="errors.carRegistration"
                                class="p-error"
                                >{{ errors.carRegistration }}</small
                            >
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2 mt-4">
                        <label
                            for="startDate"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"
                            >Začátek oprávnění</label
                        >
                        <div class="col-span-12 md:col-span-10">
                            <Calendar
                                id="startDate"
                                v-model="startDate"
                                :minDate="tomorrow"
                                dateFormat="dd.mm.yy"
                                placeholder="Vyberte datum začátku oprávnění"
                                showIcon
                            />
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2 mt-4">
                        <label
                            for="zones"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"
                            >Zóny</label
                        >
                        <div
                            class="col-span-12 md:col-span-10 flex flex-wrap gap-4"
                        >
                            <div class="flex items-center">
                                <Checkbox
                                    id="decin"
                                    name="zones"
                                    value="Děčín"
                                    v-model="selectedZones"
                                />
                                <label for="zone2" class="ml-2">Děčín</label>
                            </div>
                            <div class="flex items-center">
                                <Checkbox
                                    id="podmokly"
                                    name="zones"
                                    value="Podmokly"
                                    v-model="selectedZones"
                                />
                                <label for="zone1" class="ml-2">Podmokly</label>
                            </div>
                            <div>
                                <small
                                    v-if="errors.selectedZones"
                                    class="p-error ml-2"
                                    >{{ errors.selectedZones }}</small
                                >
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2 mt-4">
                        <label
                            for="duration"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"
                            >Délka oprávnění</label
                        >
                        <div
                            class="col-span-12 md:col-span-10 flex flex-wrap gap-4"
                        >
                            <div class="flex items-center">
                                <RadioButton
                                    id="duration1"
                                    name="duration"
                                    v-model="selectedDuration"
                                    value="3months"
                                />
                                <label for="duration1" class="ml-2"
                                    >3 měsíce</label
                                >
                            </div>
                            <div class="flex items-center">
                                <RadioButton
                                    id="duration3"
                                    name="duration"
                                    v-model="selectedDuration"
                                    value="1year"
                                />
                                <label for="duration3" class="ml-2"
                                    >1 rok</label
                                >
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2 mt-4">
                        <label
                            for="note"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"
                            >Cena</label
                        >
                        <div class="col-span-12 md:col-span-10">
                            {{ totalPrice }} Kč
                            <small class="ml-2">Celková cena</small>
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2 mt-4">
                        <label
                            for="duration"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"
                            >Způsob platby</label
                        >
                        <div
                            class="col-span-12 md:col-span-10 flex flex-wrap gap-4"
                        >
                            <div class="flex items-center">
                                <RadioButton
                                    id="online"
                                    name="online"
                                    v-model="selectePayment"
                                    value="online"
                                />
                                <label for="online" class="ml-2"
                                    >Online (platební karta, QR platba)</label
                                >
                            </div>
                            <div class="flex items-center">
                                <RadioButton
                                    id="offline"
                                    name="offline"
                                    v-model="selectePayment"
                                    value="offline"
                                />
                                <label for="duration3" class="ml-2"
                                    >Převodem, osobně</label
                                >
                            </div>
                        </div>
                    </div>
                    <div class="flex mt-4">
                        <div class="flex">
                            <Button
                                type="submit"
                                label="Odeslat s povinností zaplatit"
                                class="w-auto"
                                :disabled="
                                    Object.keys(errors).length > 0 ||
                                    !selectedZones.length === 0
                                "
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </Fluid>
</template>
