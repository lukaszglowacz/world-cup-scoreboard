import { InvalidScoreError } from './errors';

/**
 * Validates and calculates match scores
 */
export class ScoreValidator {
  /**
   * Validates score values
   * @param homeScore - Home team score
   * @param awayScore - Away team score
   * @throws {InvalidScoreError} if validation fails
   */
  public static validateScore(homeScore: number, awayScore: number): void {
    if (!Number.isInteger(homeScore)) {
      throw new InvalidScoreError('Home score must be an integer');
    }

    if (!Number.isInteger(awayScore)) {
      throw new InvalidScoreError('Away score must be an integer');
    }

    if (homeScore < 0) {
      throw new InvalidScoreError('Home score cannot be negative');
    }

    if (awayScore < 0) {
      throw new InvalidScoreError('Away score cannot be negative');
    }
  }

  /**
   * Calculates total score of a match
   * @param homeScore - Home team score
   * @param awayScore - Away team score
   * @returns Total score (sum of both teams)
   */
  public static calculateTotalScore(homeScore: number, awayScore: number): number {
    return homeScore + awayScore;
  }
}
