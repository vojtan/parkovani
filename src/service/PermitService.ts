export interface Permit {
    validFrom: Date;
    validTo: Date;
    price: number;
}

export const PermitService = {
    async getParkingPermits() {
        const response = await fetch("/api/permits");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
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
    }
};
