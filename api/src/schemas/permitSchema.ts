import { z } from 'zod';

export const PermitSchema = z.object({
    validFrom: z.string().min(1, 'Valid from date is required'),
    validTo: z.string().min(1, 'Valid to date is required'),
    price: z.number().positive('Price must be a positive number'),
    firstname: z.string().min(1, 'First name is required'),
    lastname: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    city: z.string().optional(),
    street: z.string().optional(),
    houseNumber: z.string().optional(),
    permitDuration: z.enum(["quarter", "year"], {
        errorMap: () => ({ message: 'Permit duration must be either "quarter" or "year"' })
    }).optional(),
    paymentMethod: z.string().optional(),
    carRegistration: z.string().optional(),
    userId: z.string().optional(),
    zones: z.array(
        z.enum(["Děčín", "Podmokly"], {
            errorMap: () => ({ message: 'Zone must be either "Děčín" or "Podmokly"' })
        })
    ).optional(),
});

export type PermitData = z.infer<typeof PermitSchema>;
