import {  AddPermitRequest, PermitResponse } from "../../api/src/schemas/permitschema";

export const PermitService = {
    async getParkingPermits(carRegistration?: string): Promise<PermitResponse[]> {
        
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
    async getPermit(id: string) : Promise<PermitResponse> {
        const response = await fetch(`/api/permits/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json() as PermitResponse;
    },
    async addPermit(permitData: AddPermitRequest) {
        const response = await fetch("/api/permits", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(permitData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    },
    async updatePermit(id: number, carRegistration: string) {
        const response = await fetch(`/api/permits/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ carRegistration }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    },
};
