import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
    state: () => ({
        userId: "",
        firstName: "",
        lastName: "",
        street: "",
        city: "",
        houseNumber: "",
        email: "",
        dateOfBirth: "",
    }),
    getters: {
        fullName: (state) => `${state.firstName} ${state.lastName}`,
        fullAddress: (state) => `${state.street} ${state.houseNumber}, ${state.city}`,
    },
    actions: {
        updateUserInfo(userInfo) {
            this.userId = userInfo.userId || this.userId;
            this.firstName = userInfo.firstName || this.firstName;
            this.lastName = userInfo.lastName || this.lastName;
            this.street = userInfo.street || this.street;
            this.city = userInfo.city || this.city;
            if (userInfo.houseNumber !== undefined) {
                this.houseNumber = userInfo.houseNumber;
            }
            this.email = userInfo.email || this.email;
            this.dateOfBirth = userInfo.dateOfBirth || this.dateOfBirth;
        },
        async loadFromXml(xmlFilePath) {
            try {
                const response = await fetch(xmlFilePath);
                const xmlText = await response.text();
                // Parse XML
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, "text/xml");
                // Extract user information
                const personIdentifier = this.getXmlAttributeValue(xmlDoc, "PersonIdentifier");
                const firstName = this.getXmlAttributeValue(xmlDoc, "CurrentGivenName");
                const lastName = this.getXmlAttributeValue(xmlDoc, "CurrentFamilyName");
                const dateOfBirth = this.getXmlAttributeValue(xmlDoc, "DateOfBirth");
                const email = this.getXmlAttributeValue(xmlDoc, "eMail");
                // Get address from CurrentAddress (which is base64 encoded)
                const encodedAddress = this.getXmlAttributeValue(xmlDoc, "CurrentAddress");
                let city = "";
                let street = "";
                let houseNumber = null;
                if (encodedAddress) {
                    try {
                        // Extract address fields from base64 encoded address
                        const addressDoc = this.decodeBase64Address(encodedAddress);
                        if (addressDoc) {
                            const postNameElement = addressDoc.querySelector("eidas\\:PostName, PostName");
                            const thoroughfareElement = addressDoc.querySelector("eidas\\:Thoroughfare, Thoroughfare");
                            const locatorElement = addressDoc.querySelector("eidas\\:LocatorDesignator, LocatorDesignator");
                            city = postNameElement
                                ? postNameElement.textContent || ""
                                : "";
                            street = thoroughfareElement
                                ? thoroughfareElement.textContent || ""
                                : "";
                            // Try to extract house number from locator
                            if (locatorElement && locatorElement.textContent) {
                                const locator = locatorElement.textContent;
                                houseNumber = locator;
                            }
                        }
                    }
                    catch (error) {
                        console.error("Error decoding address:", error);
                    }
                }
                // Also try to get house number from tradresaid if available
                const encodedTradresaID = this.getXmlAttributeValue(xmlDoc, "tradresaid");
                if (encodedTradresaID && !houseNumber) {
                    try {
                        const tradresaDoc = this.decodeTradresaID(encodedTradresaID);
                        if (tradresaDoc) {
                            const cisloDomovniElement = tradresaDoc.querySelector("cisloDomovni");
                            if (cisloDomovniElement &&
                                cisloDomovniElement.textContent) {
                                houseNumber =
                                    cisloDomovniElement.textContent;
                            }
                        }
                    }
                    catch (error) {
                        console.error("Error decoding TRadresaID:", error);
                    }
                } // Update user information
                this.updateUserInfo({
                    userId: personIdentifier,
                    firstName,
                    lastName,
                    email,
                    street,
                    city,
                    houseNumber: houseNumber !== null ? houseNumber : undefined,
                    dateOfBirth,
                });
                console.log("User information loaded from XML successfully");
            }
            catch (error) {
                console.error("Error loading user information from XML:", error);
                throw error;
            }
        },
        // Helper method to get attribute value from XML
        getXmlAttributeValue(xmlDoc, attributeName) {
            const selector = `[Name*="${attributeName}"] AttributeValue`;
            const element = xmlDoc.querySelector(selector);
            return element ? element.textContent || "" : "";
        }, // Helper method to decode base64 encoded address
        decodeBase64Address(encodedData) {
            try {
                // Base64 decode
                const decodedData = atob(encodedData);
                // Create a new XML document from the decoded data
                const parser = new DOMParser();
                return parser.parseFromString(`<root>${decodedData}</root>`, "text/xml");
            }
            catch (error) {
                console.error("Error decoding base64 address:", error);
                return null;
            }
        },
        // Helper method to decode TRadresaID (base64 encoded)
        decodeTradresaID(encodedData) {
            try {
                // Base64 decode
                const decodedData = atob(encodedData);
                // Create a new XML document from the decoded data
                const parser = new DOMParser();
                return parser.parseFromString(decodedData, "text/xml");
            }
            catch (error) {
                console.error("Error decoding TRadresaID:", error);
                return null;
            }
        },
    },
});
//# sourceMappingURL=user.js.map