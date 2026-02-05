import { ScoreValidator } from '../src/ScoreValidator';
import { InvalidScoreError } from '../src/errors';

describe('ScoreValidator', () => {
  describe('validateScore', () => {
    it('should accept valid zero scores', () => {
      expect(() => {
        ScoreValidator.validateScore(0, 0);
      }).not.toThrow();
    });

    it('should accept valid positive scores', () => {
      expect(() => {
        ScoreValidator.validateScore(5, 3);
      }).not.toThrow();

      expect(() => {
        ScoreValidator.validateScore(10, 8);
      }).not.toThrow();
    });

    it('should accept large scores', () => {
      expect(() => {
        ScoreValidator.validateScore(100, 99);
      }).not.toThrow();
    });

    it('should throw error for negative home score', () => {
      expect(() => {
        ScoreValidator.validateScore(-1, 0);
      }).toThrow(InvalidScoreError);

      expect(() => {
        ScoreValidator.validateScore(-1, 0);
      }).toThrow('Home score cannot be negative');
    });

    it('should throw error for negative away score', () => {
      expect(() => {
        ScoreValidator.validateScore(0, -1);
      }).toThrow(InvalidScoreError);

      expect(() => {
        ScoreValidator.validateScore(0, -1);
      }).toThrow('Away score cannot be negative');
    });

    it('should throw error for negative both scores', () => {
      expect(() => {
        ScoreValidator.validateScore(-5, -3);
      }).toThrow(InvalidScoreError);
    });

    it('should throw error for non-integer home score', () => {
      expect(() => {
        ScoreValidator.validateScore(1.5, 0);
      }).toThrow(InvalidScoreError);

      expect(() => {
        ScoreValidator.validateScore(1.5, 0);
      }).toThrow('Home score must be an integer');
    });

    it('should throw error for non-integer away score', () => {
      expect(() => {
        ScoreValidator.validateScore(0, 2.7);
      }).toThrow(InvalidScoreError);

      expect(() => {
        ScoreValidator.validateScore(0, 2.7);
      }).toThrow('Away score must be an integer');
    });

    it('should throw error for non-integer both scores', () => {
      expect(() => {
        ScoreValidator.validateScore(1.5, 2.3);
      }).toThrow(InvalidScoreError);
    });

    it('should throw error for NaN home score', () => {
      expect(() => {
        ScoreValidator.validateScore(NaN, 0);
      }).toThrow(InvalidScoreError);
    });

    it('should throw error for NaN away score', () => {
      expect(() => {
        ScoreValidator.validateScore(0, NaN);
      }).toThrow(InvalidScoreError);
    });

    it('should throw error for Infinity', () => {
      expect(() => {
        ScoreValidator.validateScore(Infinity, 0);
      }).toThrow(InvalidScoreError);

      expect(() => {
        ScoreValidator.validateScore(0, Infinity);
      }).toThrow(InvalidScoreError);
    });
  });

  describe('calculateTotalScore', () => {
    it('should calculate total for zero scores', () => {
      expect(ScoreValidator.calculateTotalScore(0, 0)).toBe(0);
    });

    it('should calculate total for positive scores', () => {
      expect(ScoreValidator.calculateTotalScore(3, 2)).toBe(5);
      expect(ScoreValidator.calculateTotalScore(10, 5)).toBe(15);
    });

    it('should calculate total for one-sided matches', () => {
      expect(ScoreValidator.calculateTotalScore(5, 0)).toBe(5);
      expect(ScoreValidator.calculateTotalScore(0, 3)).toBe(3);
    });

    it('should calculate total for high-scoring matches', () => {
      expect(ScoreValidator.calculateTotalScore(10, 8)).toBe(18);
      expect(ScoreValidator.calculateTotalScore(15, 12)).toBe(27);
    });

    it('should handle large numbers correctly', () => {
      expect(ScoreValidator.calculateTotalScore(100, 99)).toBe(199);
    });
  });
});
