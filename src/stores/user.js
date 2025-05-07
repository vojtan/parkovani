import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
    state: () => ({
        firstName: "Vojtěch",
        lastName: "Nádvorník",
        street: "Zámecká",
        city: "Děčín",
        streetNumber: "1087",
        email: "vojtech.nadvornik@live.com",
    }),
    getters: {
        fullName: (state) => `${state.firstName} ${state.lastName}`,
        fullAddress: (state) => `${state.street}, ${state.city}`,
    },
});
