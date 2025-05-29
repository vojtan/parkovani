import { z } from 'zod';
export const PermitSchema = z.object({
    validFrom: z.coerce.date(),
    price: z.number().positive('Price must be a positive number'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    city: z.string(),
    street: z.string(),
    houseNumber: z.string(),
    permitDuration: z.enum(["quarter", "year"], {
        errorMap: () => ({ message: 'Permit duration must be either "quarter" or "year"' })
    }),
    paymentMethod: z.string(),
    carRegistration: z.string().min(1, 'Car registration is required'),
    userId: z.string(),
    zones: z.array(z.enum(["Děčín", "Podmokly"], {
        errorMap: () => ({ message: 'Zone must be either "Děčín" or "Podmokly"' })
    })),
});
//# sourceMappingURL=permitschema.js.map