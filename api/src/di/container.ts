import "reflect-metadata";
import { Container } from "inversify";
import { IPermitRepository } from "../interfaces/IPermitRepository";
import { SharePointPermitRepository } from "../repositories/SharePointPermitRepository";
import { TYPES } from "./types";

/**
 * Configures and creates the DI container based on environment variables
 * Supports multiple storage providers: sharepoint, azuretable
 */
class DIContainer {
    private static instance: Container;

    /**
     * Gets or creates the singleton DI container instance
     * @returns Configured Inversify container
     */
    public static getContainer(): Container {
        if (!DIContainer.instance) {
            DIContainer.instance = DIContainer.createContainer();
        }
        return DIContainer.instance;
    }

    /**
     * Creates and configures the DI container based on STORAGE_PROVIDER environment variable
     * @returns Configured Inversify container
     */
    private static createContainer(): Container {
        const container = new Container();

        // Determine storage provider from environment
        const storageProvider = process.env.STORAGE_PROVIDER?.toLowerCase() || 'sharepoint';

        // Register the appropriate repository implementation
        switch (storageProvider) {
            case 'sharepoint':
                container.bind<IPermitRepository>(TYPES.PermitRepository)
                    .to(SharePointPermitRepository)
                    .inRequestScope();
                console.log('DI Container: Registered SharePoint permit repository');
                break;
            default:
                throw new Error(
                    `Unsupported storage provider: ${storageProvider}. ` +
                    `Supported providers: sharepoint, azuretable`
                );
        }

        return container;
    }

    /**
     * Resets the container (useful for testing)
     */
    public static reset(): void {
        DIContainer.instance = DIContainer.createContainer();
    }
}

export { DIContainer };
