import {
  ScoreboardError,
  MatchValidationError,
  MatchNotFoundError,
  InvalidScoreError,
} from '../src/errors';

describe('Custom Errors', () => {
  describe('MatchValidationError', () => {
    it('should be instance of ScoreboardError', () => {
      const error = new MatchValidationError('Test error');

      expect(error).toBeInstanceOf(ScoreboardError);
      expect(error).toBeInstanceOf(Error);
    });

    it('should have correct name', () => {
      const error = new MatchValidationError('Test error');

      expect(error.name).toBe('MatchValidationError');
    });

    it('should preserve error message', () => {
      const error = new MatchValidationError('Test message');

      expect(error.message).toBe('Test message');
    });

    it('should have stack trace', () => {
      const error = new MatchValidationError('Test error');

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('MatchValidationError');
    });

    it('should be catchable as ScoreboardError', () => {
      try {
        throw new MatchValidationError('Test');
      } catch (e) {
        expect(e).toBeInstanceOf(ScoreboardError);
      }
    });

    it('should handle Error.captureStackTrace availability', () => {
      // Save original
      const originalCaptureStackTrace = Error.captureStackTrace;

      // Test without captureStackTrace
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (Error as any).captureStackTrace;
      const errorWithout = new MatchValidationError('Test without capture');
      expect(errorWithout).toBeInstanceOf(Error);

      // Restore
      if (originalCaptureStackTrace) {
        Error.captureStackTrace = originalCaptureStackTrace;
      }

      // Test with captureStackTrace
      const errorWith = new MatchValidationError('Test with capture');
      expect(errorWith).toBeInstanceOf(Error);
      expect(errorWith.stack).toBeDefined();
    });
  });

  describe('MatchNotFoundError', () => {
    it('should be instance of ScoreboardError', () => {
      const error = new MatchNotFoundError('Not found');

      expect(error).toBeInstanceOf(ScoreboardError);
      expect(error).toBeInstanceOf(Error);
    });

    it('should have correct name', () => {
      const error = new MatchNotFoundError('Not found');

      expect(error.name).toBe('MatchNotFoundError');
    });

    it('should preserve error message', () => {
      const error = new MatchNotFoundError('Match not found');

      expect(error.message).toBe('Match not found');
    });

    it('should have stack trace', () => {
      const error = new MatchNotFoundError('Not found');

      expect(error.stack).toBeDefined();
    });
  });

  describe('InvalidScoreError', () => {
    it('should be instance of ScoreboardError', () => {
      const error = new InvalidScoreError('Invalid score');

      expect(error).toBeInstanceOf(ScoreboardError);
      expect(error).toBeInstanceOf(Error);
    });

    it('should have correct name', () => {
      const error = new InvalidScoreError('Invalid score');

      expect(error.name).toBe('InvalidScoreError');
    });

    it('should preserve error message', () => {
      const error = new InvalidScoreError('Score is invalid');

      expect(error.message).toBe('Score is invalid');
    });

    it('should have stack trace', () => {
      const error = new InvalidScoreError('Invalid');

      expect(error.stack).toBeDefined();
    });
  });

  describe('Error hierarchy', () => {
    it('should allow catching all custom errors as ScoreboardError', () => {
      const errors = [
        new MatchValidationError('Validation failed'),
        new MatchNotFoundError('Not found'),
        new InvalidScoreError('Invalid score'),
      ];

      errors.forEach((error) => {
        try {
          throw error;
        } catch (e) {
          expect(e).toBeInstanceOf(ScoreboardError);
        }
      });
    });

    it('should allow specific error type catching', () => {
      try {
        throw new MatchValidationError('Test');
      } catch (e) {
        if (e instanceof MatchValidationError) {
          expect(e.message).toBe('Test');
        } else {
          fail('Should catch MatchValidationError');
        }
      }
    });
  });
});
