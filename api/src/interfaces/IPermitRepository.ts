import { AddPermitRequest, PermitResponse } from "../schemas/permitSchema";

/**
 * Interface defining the contract for permit repository implementations
 * This allows for interchangeable storage backends (SharePoint, Azure Tables, etc.)
 */
export interface IPermitRepository {
    /**
     * Retrieves a permit by its ID
     * @param permitId - The unique identifier of the permit
     * @returns Promise resolving to PermitDto or null if not found
     */
    getPermitById(permitId: number): Promise<PermitResponse | null>;

    /**
     * Adds a new permit to storage
     * @param permitData - The permit data to store
     * @returns Promise resolving to the created permit's ID
     */
    addPermit(permitData: Partial<AddPermitRequest>): Promise<{ id: number }>;

    /**
     * Retrieves permits, optionally filtered by car registration
     * @param carRegistration - Optional filter by car registration number
     * @returns Promise resolving to array of permits
     */
    getPermits(carRegistration?: string): Promise<PermitResponse[]>;
}
