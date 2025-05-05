export const ProductService = {
    getParkingPermits() {
        return Promise.resolve(this.getParkingPermitsData());
    },
    getParkingPermitsData() {
        return [
            {
                id: "1000",
                status: "Vydáno",
                validFrom: new Date(2023, 10, 1),
                validTo: new Date(2024, 10, 1),
                price: 3900,
            },
        ];
    },
};
