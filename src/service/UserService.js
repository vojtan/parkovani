import { useUserStore } from '../stores/user';
export class UserService {
    /**
     * Load user information from an XML file
     * @param {string} xmlPath - Path to the XML file
     */
    static async loadUserFromXml(xmlPath) {
        const userStore = useUserStore();
        await userStore.loadFromXml(xmlPath);
    }
    /**
     * Get current user data in a format suitable for API requests
     * @returns {UserDto} User data transfer object
     */
    static getCurrentUser() {
        const userStore = useUserStore();
        return {
            userId: userStore.userId,
            firstName: userStore.firstName,
            lastName: userStore.lastName,
            email: userStore.email,
            address: {
                street: userStore.street,
                houseNumber: userStore.houseNumber,
                city: userStore.city
            },
            dateOfBirth: userStore.dateOfBirth
        };
    }
    /**
     * Get user data formatted for permit application
     * @returns {object} User data for permit application
     */
    static getUserForPermitApplication() {
        const user = this.getCurrentUser();
        return {
            firstname: user.firstName,
            lastname: user.lastName,
            email: user.email,
            street: user.address.street,
            housenumber: user.address.houseNumber,
            city: user.address.city
        };
    }
    /**
     * Extract address components from a base64 encoded XML address
     * @param {string} base64Address - Base64 encoded XML address
     * @returns {Object} Address components
     */
    static parseAddressFromBase64(base64Address) {
        try {
            const decodedData = atob(base64Address);
            const parser = new DOMParser();
            const doc = parser.parseFromString(`<root>${decodedData}</root>`, "text/xml");
            const city = doc.querySelector("eidas\\:PostName, PostName")?.textContent || "";
            const street = doc.querySelector("eidas\\:Thoroughfare, Thoroughfare")?.textContent || "";
            const houseNumber = doc.querySelector("eidas\\:LocatorDesignator, LocatorDesignator")?.textContent || "";
            return { city, street, houseNumber: houseNumber };
        }
        catch (error) {
            console.error("Error parsing address from base64:", error);
            return { city: "", street: "", houseNumber: "" };
        }
    }
    /**
     * Parse TRadresaID from base64 encoded XML
     * @param {string} base64TRadresaID - Base64 encoded XML TRadresaID
     * @returns {Object} Address components from TRadresaID
     */
    static parseTRadresaID(base64TRadresaID) {
        try {
            const decodedData = atob(base64TRadresaID);
            const parser = new DOMParser();
            const doc = parser.parseFromString(decodedData, "text/xml");
            // Extract address info from TRadresaID
            const houseNumber = doc.querySelector("cisloDomovni")?.textContent || "";
            // In a real implementation, you would likely need to look up city and street names
            // based on the codes in the XML. This is a simplified approach.
            const obecKod = doc.querySelector("obecKod")?.textContent || "";
            const uliceKod = doc.querySelector("uliceKod")?.textContent || "";
            return {
                street: uliceKod || "Unknown Street",
                city: obecKod || "Unknown City",
                houseNumber: houseNumber
            };
        }
        catch (error) {
            console.error("Error parsing TRadresaID:", error);
            return { street: "", city: "", houseNumber: "" };
        }
    }
}
//# sourceMappingURL=UserService.js.map