<script setup lang="ts">
import { ref } from "vue";
import * as yup from "yup";
import { PermitService } from "@/service/PermitService";
import { storeToRefs } from 'pinia'
import { Form } from 'vee-validate';
import Button from "primevue/button";
import UserInfo from "@/components/UserInfo.vue";
import PermitInfo from "@/components/PermitInfo.vue";

import { usePermitStore } from "@/stores/permitStore";
import { useUserStore } from "../../stores/user";

const userStore = useUserStore();
const permitStore = usePermitStore();
const { carRegistration, selectedZones, totalPrice, endDate, startDate, selectedDuration, selectedPayment } = storeToRefs(permitStore);
const {
    email,
    firstName,
    lastName,
    city,
    street,
    houseNumber,
    userId

} = storeToRefs(userStore);

const validationSchema = yup.object().shape({
    firstName: yup.string().required('Zadejte jméno'),
    carRegistration: yup
        .string()
        .required("Zadejte SPZ")
        .matches(
            /^[a-zA-Z0-9]{1,10}$/,
            "SPZ je v nesprávném formátu (max 10 znaků) a může obsahovat pouze písmena a číslice",
        ).test('exists', 'Tato SPZ již má platné oprávnění.', async (value) => {
            if (!value) return true;
            try {
                const permits = await PermitService.getParkingPermits(value.trim());
                return permits.length === 0;
            } catch (e) {
                return false;
            }
        }),
    selectedZones: yup.array().min(1, "Vyberte alespoň jednu zónu"),
    email: yup
        .string()
        .required("Zadejte e-mail")
        .email("Zadejte platný e-mail"),
    lastName: yup.string().required("Zadejte příjmení"),
    city: yup.string().required("Zadejte město"),
    street: yup.string().required("Zadejte ulici"),
});



const showDialog = ref(false);

const onSubmit = async (values: any) => {
    showDialog.value = true;

    var result = await PermitService.addPermit({
        carRegistration: carRegistration.value,
        validFrom: startDate.value,
        price: totalPrice.value,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        city: city.value,
        street: street.value,
        houseNumber: houseNumber.value,
        permitDuration: selectedDuration.value,
        paymentMethod: selectedPayment.value,
        userId: userId.value,
        zones: selectedZones.value.map((zone) => zone.name)
    });

    setTimeout(async () => {
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
};



</script>

<template>
    <Form :validation-schema="validationSchema" v-slot="{ errors }" @submit="onSubmit" class="card">
        <div class="flex mt-8">
            <div class="flex items-center gap-2">
                <h1 class="text-3xl ml-4">Nová žádost o parkovací oprávnění</h1>
            </div>
        </div>
        <UserInfo :errors="errors" />
        <PermitInfo :errors="errors" />

        <div class="flex mt-8">
            <div class="flex items-center gap-2">
                <Button type="submit" label="Odeslat s povinností zaplatit" class="w-auto"
                    :disabled="Object.keys(errors).length > 0 || selectedZones.length === 0"></Button>
                <Button label="Zpět" icon="pi pi-arrow-left" outlined class="mr-2" @click="$router.push('/')" />
            </div>
        </div>
    </Form>

    <Dialog v-model:visible="showDialog" :closable="false" :modal="true" header="Zpracování">
        <div class="flex flex-column align-items-center">
            <ProgressSpinner style="width:50px;height:50px" strokeWidth="8" fill="var(--surface-ground)"
                animationDuration=".5s" />
            <span class="mt-3">Probíhá schválení žádosti. Po schválení žádosti budete přesměrováni na platební
                bránu, kde budete moct zaplatit.</span>
        </div>
    </Dialog>
</template>
