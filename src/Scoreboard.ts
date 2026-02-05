import { Match } from './types';
import { MatchFactory } from './MatchFactory';

/**
 * Live Football World Cup Scoreboard
 * Manages ongoing matches with in-memory storage
 */
export class Scoreboard {
  /**
   * In-memory storage for ongoing matches
   * Uses Map for O(1) lookup, update, and delete operations
   */
  private readonly matches: Map<string, Match> = new Map();

  /**
   * Starts a new match with 0-0 score
   * @param homeTeam - Home team name
   * @param awayTeam - Away team name
   * @returns Match ID for future operations
   * @throws {MatchValidationError} if team names are invalid
   */
  public startMatch(homeTeam: string, awayTeam: string): string {
    const match = MatchFactory.createMatch(homeTeam, awayTeam);
    this.matches.set(match.id, match);
    return match.id;
  }
}
