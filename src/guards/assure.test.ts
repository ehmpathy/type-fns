import { getError } from 'test-fns';

import { AssureIsOfTypeRejectionError } from '../wrappers/withAssure';
import { assure } from './assure';

describe('assure', () => {
  // example type guards for testing
  const isString = (input: unknown): input is string =>
    typeof input === 'string';
  const isNumber = (input: unknown): input is number =>
    typeof input === 'number';
  const isPositive = (input: number): input is number => input > 0;
  const isNonEmptyString = (input: string): input is string => input.length > 0;

  describe('happy path', () => {
    it('should return the value when it satisfies a string check', () => {
      const result: string = assure('hello', isString);
      expect(result).toEqual('hello');
    });

    it('should return the value when it satisfies a number check', () => {
      const result: number = assure(42, isNumber);
      expect(result).toEqual(42);
    });

    it('should return the value when it satisfies a narrowing check on already-typed input', () => {
      const result: number = assure(5, isPositive);
      expect(result).toEqual(5);
    });
  });

  describe('rejection boundaries', () => {
    it('should throw when string check receives a number', () => {
      const error = getError(() => assure(123, isString));
      expect(error).toBeInstanceOf(AssureIsOfTypeRejectionError);
      expect(error.message).toContain(
        "input does not satisfy type.check 'isString'",
      );
    });

    it('should throw when number check receives a string', () => {
      const error = getError(() => assure('not a number', isNumber));
      expect(error).toBeInstanceOf(AssureIsOfTypeRejectionError);
      expect(error.message).toContain(
        "input does not satisfy type.check 'isNumber'",
      );
    });

    it('should throw when positive check receives zero', () => {
      const error = getError(() => assure(0, isPositive));
      expect(error).toBeInstanceOf(AssureIsOfTypeRejectionError);
      expect(error.message).toContain(
        "input does not satisfy type.check 'isPositive'",
      );
    });

    it('should throw when positive check receives a negative number', () => {
      const error = getError(() => assure(-1, isPositive));
      expect(error).toBeInstanceOf(AssureIsOfTypeRejectionError);
      expect(error.message).toContain(
        "input does not satisfy type.check 'isPositive'",
      );
    });

    it('should throw when non-empty string check receives an empty string', () => {
      const error = getError(() => assure('', isNonEmptyString));
      expect(error).toBeInstanceOf(AssureIsOfTypeRejectionError);
      expect(error.message).toContain(
        "input does not satisfy type.check 'isNonEmptyString'",
      );
    });
  });

  describe('edge cases', () => {
    it('should handle null input', () => {
      const error = getError(() => assure(null, isString));
      expect(error).toBeInstanceOf(AssureIsOfTypeRejectionError);
      expect(error.message).toContain(
        "input does not satisfy type.check 'isString'",
      );
    });

    it('should handle undefined input and include it in error context', () => {
      const error = getError(() => assure(undefined, isString));
      expect(error).toBeInstanceOf(AssureIsOfTypeRejectionError);
      expect(error.message).toContain(
        "input does not satisfy type.check 'isString'",
      );
    });

    it('should handle falsy values that pass the check', () => {
      const result: number = assure(0, isNumber);
      expect(result).toEqual(0);
    });

    it('should handle empty string that passes a string check', () => {
      const result: string = assure('', isString);
      expect(result).toEqual('');
    });
  });

  describe('custom name option', () => {
    it('should use custom name in error message when provided', () => {
      const error = getError(() =>
        assure('test', isNumber, { name: 'customNumberCheck' }),
      );
      expect(error.message).toContain(
        "input does not satisfy type.check 'customNumberCheck'",
      );
    });

    it('should use function name when custom name is not provided', () => {
      const error = getError(() => assure('test', isNumber));
      expect(error.message).toContain(
        "input does not satisfy type.check 'isNumber'",
      );
    });

    it('should handle anonymous functions gracefully', () => {
      const error = getError(() =>
        assure(
          'test',
          (input: unknown): input is number => typeof input === 'number',
        ),
      );
      expect(error).toBeInstanceOf(AssureIsOfTypeRejectionError);
    });
  });

  describe('type narrowing', () => {
    it('should narrow union types', () => {
      const input: string | number = 'hello';
      const result: string = assure(input, isString); // narrows to string
      // @ts-expect-error - result is string, not number
      const badResult: number = assure(input, isString);
      expect(result).toBeDefined();
      expect(badResult).toBeDefined();
    });

    it('should narrow unknown to specific type', () => {
      const input: unknown = 42;
      const result: number = assure(input, isNumber); // narrows to number
      // @ts-expect-error - result is number, not string
      const badResult: string = assure(input, isNumber);
      expect(result).toBeDefined();
      expect(badResult).toBeDefined();
    });

    it('should work with branded types', () => {
      type UserId = string & { __brand: 'UserId' };
      const isUserId = (input: string): input is UserId =>
        input.startsWith('user_');

      const result: UserId = assure('user_123', isUserId); // narrows to UserId
      // @ts-expect-error - result is UserId, not number
      const badResult: number = assure('user_123', isUserId);
      expect(result).toBeDefined();
      expect(badResult).toBeDefined();

      const error = getError(() => assure('invalid', isUserId));
      expect(error).toBeInstanceOf(AssureIsOfTypeRejectionError);
    });

    it('should work with enum checks', () => {
      enum Status {
        ACTIVE = 'ACTIVE',
        INACTIVE = 'INACTIVE',
      }
      const isStatus = (input: string): input is Status =>
        Object.values(Status).includes(input as Status);

      const result: Status = assure('ACTIVE', isStatus); // narrows to Status
      // @ts-expect-error - result is Status, not number
      const badResult: number = assure('ACTIVE', isStatus);
      expect(result).toBeDefined();
      expect(badResult).toBeDefined();

      const error = getError(() => assure('INVALID', isStatus));
      expect(error).toBeInstanceOf(AssureIsOfTypeRejectionError);
    });
  });
});
