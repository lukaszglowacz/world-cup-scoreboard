import { Match } from './types';
import { MatchValidationError } from './errors';

/**
 * Factory for creating Match instances with validation
 */
export class MatchFactory {
  /**
   * Creates a new match with initial 0-0 score
   * @param homeTeam - Home team name
   * @param awayTeam - Away team name
   * @returns New Match instance
   * @throws {MatchValidationError} if validation fails
   */
  public static createMatch(homeTeam: string, awayTeam: string): Match {
    this.validateTeamNames(homeTeam, awayTeam);

    return {
      id: this.generateMatchId(),
      homeTeam: homeTeam.trim(),
      awayTeam: awayTeam.trim(),
      homeScore: 0,
      awayScore: 0,
      startTime: Date.now(),
    };
  }

  /**
   * Validates team names
   * @throws {MatchValidationError} if validation fails
   */
  private static validateTeamNames(homeTeam: string, awayTeam: string): void {
    if (!homeTeam || homeTeam.trim().length === 0) {
      throw new MatchValidationError('Home team name cannot be empty');
    }

    if (!awayTeam || awayTeam.trim().length === 0) {
      throw new MatchValidationError('Away team name cannot be empty');
    }

    if (homeTeam.trim().toLowerCase() === awayTeam.trim().toLowerCase()) {
      throw new MatchValidationError('Home team and away team must be different');
    }
  }

  /**
   * Generates unique match identifier
   * @returns Unique match ID
   */
  private static generateMatchId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
