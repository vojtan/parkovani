import { HttpRequest, InvocationContext } from "@azure/functions";
import { addPermit } from "../functions/addPermit";
import { PermitData } from "../schemas/permitSchema";
import { IPermitRepository } from "../interfaces/IPermitRepository";
import { DIContainer } from "../di/container";
import { TYPES } from "../di/types";
import { ConfigurationError } from "../errors/customErrors";

// Mock the DIContainer
jest.mock("../di/container");
const mockDIContainer = DIContainer as jest.Mocked<typeof DIContainer>;

describe("addPermit function", () => {
  let mockRequest: Partial<HttpRequest>;
  let mockContext: Partial<InvocationContext>;
  let mockPermitRepository: jest.Mocked<IPermitRepository>;
  let mockContainer: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();    // Mock request
    mockRequest = {
      method: "POST",
      url: "https://test.com/api/permits"
    };

    // Mock context
    mockContext = {
      log: jest.fn(),
      invocationId: "test-invocation-id"
    };

    // Mock permit repository
    mockPermitRepository = {
      addPermit: jest.fn(),
      getPermitById: jest.fn(),
      getPermits: jest.fn()
    };

    // Mock container
    mockContainer = {
      get: jest.fn().mockReturnValue(mockPermitRepository)
    };

    // Mock DIContainer.getContainer()
    mockDIContainer.getContainer = jest.fn().mockReturnValue(mockContainer);
  });

  describe("successful permit creation", () => {
    it("should successfully add a permit and return 201 status", async () => {
      // Arrange
      const validPermitData: PermitData = {
        validFrom: "2025-01-01",
        validTo: "2025-12-31",
        price: 1200,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        city: "Prague",
        street: "Main Street",
        houseNumber: "123",
        permitDuration: "year",
        paymentMethod: "credit_card",
        carRegistration: "ABC123",
        userId: "user123",
        zones: ["Děčín"]
      };

      const mockAddPermitResponse = { id: 12345 };
      mockPermitRepository.addPermit.mockResolvedValue(mockAddPermitResponse);

      // Act
      const result = await addPermit(
        mockRequest as HttpRequest,
        mockContext as InvocationContext,
        validPermitData
      );

      // Assert
      expect(result.status).toBe(201);
      expect(result.headers).toEqual({
        "Content-Type": "application/json"
      });
      
      const responseBody = JSON.parse(result.body as string);
      expect(responseBody).toEqual({
        message: "Permit added successfully",
        id: 12345
      });

      expect(mockDIContainer.getContainer).toHaveBeenCalledTimes(1);
      expect(mockContainer.get).toHaveBeenCalledWith(TYPES.PermitRepository);
      expect(mockPermitRepository.addPermit).toHaveBeenCalledWith(validPermitData);
    });

    it("should handle minimal required permit data", async () => {
      // Arrange
      const minimalPermitData: PermitData = {
        validFrom: "2025-06-01",
        validTo: "2025-09-01",
        price: 300,
        firstname: "Jane",
        lastname: "Smith",
        email: "jane.smith@example.com"
      };

      const mockAddPermitResponse = { id: 67890 };
      mockPermitRepository.addPermit.mockResolvedValue(mockAddPermitResponse);

      // Act
      const result = await addPermit(
        mockRequest as HttpRequest,
        mockContext as InvocationContext,
        minimalPermitData
      );

      // Assert
      expect(result.status).toBe(201);
      const responseBody = JSON.parse(result.body as string);
      expect(responseBody.id).toBe(67890);
      expect(mockPermitRepository.addPermit).toHaveBeenCalledWith(minimalPermitData);
    });

    it("should handle permit data with optional zones", async () => {
      // Arrange
      const permitDataWithZones: PermitData = {
        validFrom: "2025-07-01",
        validTo: "2025-10-01",
        price: 450,
        firstname: "Bob",
        lastname: "Johnson",
        email: "bob.johnson@example.com",
        zones: ["Děčín", "Podmokly"]
      };

      const mockAddPermitResponse = { id: 11111 };
      mockPermitRepository.addPermit.mockResolvedValue(mockAddPermitResponse);

      // Act
      const result = await addPermit(
        mockRequest as HttpRequest,
        mockContext as InvocationContext,
        permitDataWithZones
      );

      // Assert
      expect(result.status).toBe(201);
      expect(mockPermitRepository.addPermit).toHaveBeenCalledWith(permitDataWithZones);
    });
  });

  describe("error handling", () => {
    it("should handle repository errors and return 500 status", async () => {
      // Arrange
      const validPermitData: PermitData = {
        validFrom: "2025-01-01",
        validTo: "2025-12-31",
        price: 1200,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com"
      };

      const repositoryError = new Error("Database connection failed");
      mockPermitRepository.addPermit.mockRejectedValue(repositoryError);

      // Act
      const result = await addPermit(
        mockRequest as HttpRequest,
        mockContext as InvocationContext,
        validPermitData
      );

      // Assert
      expect(result.status).toBe(500);
      const responseBody = JSON.parse(result.body as string);
      expect(responseBody).toEqual({
        error: "Database connection failed"
      });
      expect(mockContext.log).toHaveBeenCalledWith('Error:', repositoryError);
    });

    it("should handle configuration errors and return specific error message", async () => {
      // Arrange
      const validPermitData: PermitData = {
        validFrom: "2025-01-01",
        validTo: "2025-12-31",
        price: 1200,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com"
      };

      const configError = new ConfigurationError("Missing SharePoint configuration");
      mockPermitRepository.addPermit.mockRejectedValue(configError);

      // Act
      const result = await addPermit(
        mockRequest as HttpRequest,
        mockContext as InvocationContext,
        validPermitData
      );

      // Assert
      expect(result.status).toBe(500);
      const responseBody = JSON.parse(result.body as string);
      expect(responseBody).toEqual({
        error: "Configuration error: Missing SharePoint configuration"
      });
    });

    it("should handle DI container errors", async () => {
      // Arrange
      const validPermitData: PermitData = {
        validFrom: "2025-01-01",
        validTo: "2025-12-31",
        price: 1200,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com"
      };

      const containerError = new Error("Failed to resolve dependency");
      mockDIContainer.getContainer.mockImplementation(() => {
        throw containerError;
      });

      // Act
      const result = await addPermit(
        mockRequest as HttpRequest,
        mockContext as InvocationContext,
        validPermitData
      );

      // Assert
      expect(result.status).toBe(500);
      const responseBody = JSON.parse(result.body as string);
      expect(responseBody).toEqual({
        error: "Failed to resolve dependency"
      });
    });

    it("should handle unknown errors with default message", async () => {
      // Arrange
      const validPermitData: PermitData = {
        validFrom: "2025-01-01",
        validTo: "2025-12-31",
        price: 1200,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com"
      };

      // Error without message property
      const unknownError = { code: "UNKNOWN_ERROR" };
      mockPermitRepository.addPermit.mockRejectedValue(unknownError);

      // Act
      const result = await addPermit(
        mockRequest as HttpRequest,
        mockContext as InvocationContext,
        validPermitData
      );

      // Assert
      expect(result.status).toBe(500);
      const responseBody = JSON.parse(result.body as string);
      expect(responseBody).toEqual({
        error: "An error occurred while adding the permit"
      });
    });
  });

  describe("dependency injection", () => {
    it("should properly resolve PermitRepository from DI container", async () => {
      // Arrange
      const validPermitData: PermitData = {
        validFrom: "2025-01-01",
        validTo: "2025-12-31",
        price: 1200,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com"
      };

      mockPermitRepository.addPermit.mockResolvedValue({ id: 123 });

      // Act
      await addPermit(
        mockRequest as HttpRequest,
        mockContext as InvocationContext,
        validPermitData
      );

      // Assert
      expect(mockDIContainer.getContainer).toHaveBeenCalledTimes(1);
      expect(mockContainer.get).toHaveBeenCalledWith(TYPES.PermitRepository);
      expect(mockContainer.get).toHaveBeenCalledTimes(1);
    });

    it("should handle repository returning different ID types", async () => {
      // Arrange
      const validPermitData: PermitData = {
        validFrom: "2025-01-01",
        validTo: "2025-12-31",
        price: 1200,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com"
      };

      // Test with string ID (edge case)
      const mockResponse = { id: "abc-123" as any };
      mockPermitRepository.addPermit.mockResolvedValue(mockResponse);

      // Act
      const result = await addPermit(
        mockRequest as HttpRequest,
        mockContext as InvocationContext,
        validPermitData
      );

      // Assert
      expect(result.status).toBe(201);
      const responseBody = JSON.parse(result.body as string);
      expect(responseBody.id).toBe("abc-123");
    });
  });
});
