export interface Permit {
    id: string;
    carRegistration: string;
    validFrom: Date ;
    validTo: Date | null;
    price: number;
    firstname: string;
    lastname: string;
    email: string;
    city: string;
    street: string;
    houseNumber: string | null;
    permitDuration: string;
    paymentMethod: string;
    variableSymbol: string | null;
    userId: string | null;
    zones: Array<string> ;
}


export const PermitService = {
    async getParkingPermits(carRegistration?: string) : Promise<Permit[]> {
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
    
    async getPermit(id: string) {
        const response = await fetch(`/api/permits/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    },
    async addPermit(permitData : Permit) {
        const response = await fetch("/api/permits", {
            method: "POST",
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

    async updatePermit(id: string, carRegistration: string) {
        const response = await fetch(`/api/permits/${id}`, {
            method: "PUT",
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

