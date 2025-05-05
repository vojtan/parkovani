import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
    state: () => ({
        firstName: "Vojtěch",
        lastName: "Nádvorník",
        street: "Zámecká",
        city: "Děčín",
        email: "vojtech.nadvornik@live.com",
    }),
    getters: {
        fullName: (state) => `${state.firstName} ${state.lastName}`,
        fullAddress: (state) => `${state.street}, ${state.city}`,
    },
    actions: {
        updateUserInfo(userInfo) {
            this.firstName = userInfo.firstName || this.firstName;
            this.lastName = userInfo.lastName || this.lastName;
            this.street = userInfo.street || this.street;
            this.city = userInfo.city || this.city;
            this.email = userInfo.email || this.email;
        },
        clearUserInfo() {
            this.firstName = "";
            this.lastName = "";
            this.street = "";
            this.city = "";
            this.email = "";
        },
    },
});
//# sourceMappingURL=user.js.map