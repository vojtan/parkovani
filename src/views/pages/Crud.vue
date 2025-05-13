<script setup>
import { PermitService } from "@/service/PermitService";
import { FilterMatchMode } from "@primevue/core/api";
import { onMounted, ref } from "vue";

onMounted(() => {
    PermitService.getParkingPermits().then((data) => (products.value = data));
});

const dt = ref();
const products = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});


const toStatus = (status) => {
    switch (status) {
        case "paid":
            return "Zaplaceno/Aktivní";
        case "submitted":
            return "Čeká na zaplacení";
        default:
            return status;
    }
};



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

            <DataTable ref="dt" v-model:selection="selectedProducts" :value="products" dataKey="id" 
                :rows="10" >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Vaše parkovací oprávnění</h4>
                    </div>
                </template>

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
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2"
                            @click="editProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>


    </div>
</template>
@/service/PermitService