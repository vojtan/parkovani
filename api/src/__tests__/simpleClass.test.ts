import { SimpleClass } from '../simpleClass';

describe('SimpleClass', () => {
  let simpleClass: SimpleClass;

  beforeEach(() => {
    simpleClass = new SimpleClass();
  });

  describe('multiply method', () => {
    it('should multiply two positive numbers correctly', () => {
      // Arrange
      const a = 5;
      const b = 3;
      const expected = 15;

      // Act
      const result = simpleClass.multiply(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    it('should multiply positive and negative numbers correctly', () => {
      // Arrange
      const a = 5;
      const b = -3;
      const expected = -15;

      // Act
      const result = simpleClass.multiply(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    it('should multiply two negative numbers correctly', () => {
      // Arrange
      const a = -4;
      const b = -6;
      const expected = 24;

      // Act
      const result = simpleClass.multiply(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    it('should return zero when multiplying by zero', () => {
      // Arrange
      const a = 10;
      const b = 0;
      const expected = 0;

      // Act
      const result = simpleClass.multiply(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    it('should return zero when zero is the first operand', () => {
      // Arrange
      const a = 0;
      const b = 15;
      const expected = 0;

      // Act
      const result = simpleClass.multiply(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle decimal numbers correctly', () => {
      // Arrange
      const a = 2.5;
      const b = 4;
      const expected = 10;

      // Act
      const result = simpleClass.multiply(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle two decimal numbers correctly', () => {
      // Arrange
      const a = 1.5;
      const b = 2.5;
      const expected = 3.75;

      // Act
      const result = simpleClass.multiply(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle very large numbers', () => {
      // Arrange
      const a = 999999;
      const b = 1000000;
      const expected = 999999000000;

      // Act
      const result = simpleClass.multiply(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle very small decimal numbers', () => {
      // Arrange
      const a = 0.001;
      const b = 0.002;
      const expected = 0.000002;

      // Act
      const result = simpleClass.multiply(a, b);

      // Assert
      expect(result).toBeCloseTo(expected, 6);
    });

    it('should maintain mathematical properties (commutative)', () => {
      // Arrange
      const a = 7;
      const b = 9;

      // Act
      const result1 = simpleClass.multiply(a, b);
      const result2 = simpleClass.multiply(b, a);

      // Assert
      expect(result1).toBe(result2);
      expect(result1).toBe(63);
    });
  });
});
