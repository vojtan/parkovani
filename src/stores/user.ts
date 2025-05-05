import { defineStore } from "pinia";

// Define the interface for the user state
interface UserState {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    email: string;
}

// Define the interface for user info update parameters
interface UserInfoUpdate {
    firstName?: string;
    lastName?: string;
    street?: string;
    city?: string;
    email?: string;
}

export const useUserStore = defineStore("user", {
    state: (): UserState => ({
        firstName: "Vojtěch",
        lastName: "Nádvorník",
        street: "Zámecká",
        city: "Děčín",
        email: "vojtech.nadvornik@live.com",
    }),

    getters: {
        fullName: (state: UserState): string =>
            `${state.firstName} ${state.lastName}`,
        fullAddress: (state: UserState): string =>
            `${state.street}, ${state.city}`,
    },

    actions: {
        updateUserInfo(userInfo: UserInfoUpdate): void {
            this.firstName = userInfo.firstName || this.firstName;
            this.lastName = userInfo.lastName || this.lastName;
            this.street = userInfo.street || this.street;
            this.city = userInfo.city || this.city;
            this.email = userInfo.email || this.email;
        },

        clearUserInfo(): void {
            this.firstName = "";
            this.lastName = "";
            this.street = "";
            this.city = "";
            this.email = "";
        },
    },
});
