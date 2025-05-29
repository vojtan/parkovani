export const ZoneService = {
    getData() {
        return [
            {
                pricePerYear: 4000,
                pricePerQuarter: 1200,
                pricePerYearWithDiscount: 1500,
                pricePerQuarterWithDiscount: 500,
                name: "Děčín",
                adresses: [
                    { street: "Zámecká", numbers: ["1087"] },
                    { street: "Tyršova", numbers: [] },
                    { street: "Karla Čapka", numbers: [] },
                    { street: "Labská", numbers: [] },
                ],
            },
            {
                pricePerYear: 4000,
                pricePerQuarter: 1200,
                pricePerYearWithDiscount: 1500,
                pricePerQuarterWithDiscount: 500,
                name: "Podmokly",
                adresses: [
                    {
                        street: "Teplická",
                        numbers: [
                            "377/86",
                            "376/84",
                            "372/76",
                            "832/74",
                            "372/72",
                            "370/70",
                        ],
                    },
                    { street: "Chelčického", numbers: [] },
                    { street: "Jeronýmova", numbers: [] },
                    { street: "Máchovo náměstí", numbers: [] },
                    { street: "Divišova", numbers: [] },
                    { street: "Raisova", numbers: [] },
                    { street: "Prokopa Holého", numbers: [] },
                ],
            },
        ];
    },
    getZones: () => {
        return ZoneService.getData();
    },
};
//# sourceMappingURL=ZoneService.js.map