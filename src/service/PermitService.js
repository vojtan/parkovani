export const PermitService = {
    async getParkingPermits(carRegistration) {
        var requestUrl = "/api/permits";
        if (carRegistration) {
            requestUrl += `?carRegistration=${carRegistration}`;
        }
        const response = await fetch(requestUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    },
    async getPermit(id) {
        const response = await fetch(`/api/permits/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    },
    async addPermit(permitData) {
        const response = await fetch("/api/permits", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(permitData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    },
    async updatePermit(id, carRegistration) {
        const response = await fetch(`/api/permits/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ carRegistration })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    }
};
//# sourceMappingURL=PermitService.js.map