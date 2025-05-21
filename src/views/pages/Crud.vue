<script setup>
import { PermitService } from "@/service/PermitService";
import { FilterMatchMode } from "@primevue/core/api";
import { onMounted, ref } from "vue";
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';
import { Form } from 'vee-validate';
import * as yup from "yup";
import { Field } from 'vee-validate';
const toast = useToast();
import { usePermitStore } from '@/stores/permitStore';

import { useRouter } from 'vue-router'; 
import Button from 'primevue/button';
const router = useRouter(); 
const permitStore = usePermitStore();

const { setPermitData } = permitStore;
onMounted(() => {
    PermitService.getParkingPermits().then((data) => (products.value = data));
});

const dt = ref();
const products = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const showCarRegDialog = ref(false);
const carRegistration = ref('');
const selectedRow = ref(null);

function openCarRegDialog(row) {
    selectedRow.value = row;
    carRegistration.value = row.carregistration;
    showCarRegDialog.value = true;
}

const validationSchema = yup.object().shape({
    carRegistration: yup
        .string()
        .required("Zadejte SPZ")
        .matches(
            /^[a-zA-Z0-9]{1,10}$/,
            "SPZ je v nesprávném formátu (max 10 znaků) a může obsahovat pouze písmena a číslice",
        )
        .test('exists', 'Tato SPZ již má platné oprávnění.', async (value) => {
            if (!value) return true;
            try {
                const permits = await PermitService.getParkingPermits(value.trim());
                return permits.length === 0;
            } catch (e) {
                return false;
            }
        }),

});

async function saveCarReg() {
    if (selectedRow.value) {
        await PermitService.updatePermit(selectedRow.value.id, carRegistration.value)
        selectedRow.value.carregistration = carRegistration.value;
        toast.add({
            severity: 'success',
            summary: 'Úspěch',
            detail: 'Poznávací značka byla úspěšně aktualizována',
            life: 5000
        });
        showCarRegDialog.value = false;
    } else {
        showCarRegDialog.value = false;
    }
}



const toStatus = (status) => {
    switch (status) {
        case "paid":
            return "Aktivní";
        case "submitted":
            return "Čeká na zaplacení";
        default:
            return status;
    }
};

function copyPermit(row) {
    setPermitData(row.carregistration, row.validFrom, row.selectedZones, row.permitDuration);
    router.push('/edit')
}

</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Podat novou žádost" icon="pi pi-plus" severity="info" class="mr-2"
                        @click="$router.push('/edit')" />
                </template>
            </Toolbar>

            <DataTable ref="dt" :value="products" dataKey="id" :rows="10">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Vaše parkovací oprávnění</h4>
                    </div>
                </template>

                <Column field="carregistration" header="SPZ" sortable style="min-width: 10rem">
                    <template #body="slotProps">
                        {{ slotProps.data.carregistration }}
                    </template>
                </Column>
                <Column field="validFrom" header="Platnost od" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        {{ new Date(slotProps.data.validFrom).toLocaleDateString() }}
                    </template>
                </Column>
                <Column field="validTo" header="Platnost do" sortable style="min-width: 16rem">
                    <template #body="slotProps">
                        {{ new Date(slotProps.data.validTo).toLocaleDateString() }}
                    </template>
                </Column>
                <Column field="price" header="Cena" sortable style="min-width: 8rem">
                </Column>
                <Column field="status" header="Stav" sortable style="min-width: 10rem">
                    <template #body="slotProps">
                        {{ toStatus(slotProps.data.status) }}
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button @click="copyPermit(slotProps.data)" class="mr-2" 
                            :disabled="new Date(slotProps.data.validTo) > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)">Prodloužit
                            platnost</Button>
                        <Button class="mr-2" @click="openCarRegDialog(slotProps.data)">Změnit poznávací značku</Button>
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="showCarRegDialog" header="Změnit poznávací značku" :modal="true" :closable="true">
            <div class="flex flex-col gap-4">
                <Form :validation-schema="validationSchema" v-slot="{ errors, isValidating, isSubmitting }" @submit="saveCarReg" class="card">
                    <div class="grid grid-cols-12 gap-2">
                        <label for="name3" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Nová
                            poznávací
                            značka</label>
                        <div class="col-span-12 md:col-span-10">
                            <Field v-model="carRegistration" id="carRegistration" name="carRegistration" :as="InputText"
                                :class="{ 'p-invalid': errors.carRegistration }" />
                            <small v-if="errors.carRegistration" class="p-error">{{ errors.carRegistration }}</small>
                        </div>
                    </div>
                    <div class="flex gap-2 mt-4">
                        <Button type="submit" label="Uložit" :as="Button"
                            :disabled=" isSubmitting || isValidating || Object.keys(errors).length > 0 " />
                        <Button label="Zrušit" @click="showCarRegDialog = false" severity="secondary" />
                    </div>
                </Form>
            </div>
        </Dialog>
    </div>
</template>
