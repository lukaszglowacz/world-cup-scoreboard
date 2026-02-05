import { Match } from './types';
import { MatchFactory } from './MatchFactory';
import { ScoreValidator } from './ScoreValidator';
import { MatchNotFoundError } from './errors';

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

  /**
   * Updates the score of an ongoing match
   * @param matchId - Unique match identifier
   * @param homeScore - Absolute home team score
   * @param awayScore - Absolute away team score
   * @throws {MatchNotFoundError} if match doesn't exist
   * @throws {InvalidScoreError} if scores are invalid
   */
  public updateScore(matchId: string, homeScore: number, awayScore: number): void {
    const match = this.matches.get(matchId);

    if (!match) {
      throw new MatchNotFoundError(`Match with ID ${matchId} not found`);
    }

    ScoreValidator.validateScore(homeScore, awayScore);

    match.homeScore = homeScore;
    match.awayScore = awayScore;
  }

  /**
   * Finishes a match and removes it from the scoreboard
   * @param matchId - Unique match identifier
   * @throws {MatchNotFoundError} if match doesn't exist
   */
  public finishMatch(matchId: string): void {
    const match = this.matches.get(matchId);

    if (!match) {
      throw new MatchNotFoundError(`Match with ID ${matchId} not found`);
    }

    this.matches.delete(matchId);
  }

  /**
   * Returns summary of all ongoing matches
   * Sorted by: 1) total score DESC, 2) start time DESC (most recent first)
   * @returns Array of matches in progress
   */
  public getSummary(): Match[] {
    return Array.from(this.matches.values()).sort((a, b) => {
      const totalA = ScoreValidator.calculateTotalScore(a.homeScore, a.awayScore);
      const totalB = ScoreValidator.calculateTotalScore(b.homeScore, b.awayScore);

      // Primary sort: total score descending (higher scores first)
      if (totalA !== totalB) {
        return totalB - totalA;
      }

      // Secondary sort: start time descending (most recent first)
      return b.startTime - a.startTime;
    });
  }
}
