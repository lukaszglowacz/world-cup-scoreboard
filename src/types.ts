/**
 * Represents a football match score
 */
export interface Score {
  /** Home team score */
  home: number;
  /** Away team score */
  away: number;
}

/**
 * Represents a live football match
 */
export interface Match {
  /** Unique identifier for the match */
  readonly id: string;

  /** Home team name */
  readonly homeTeam: string;

  /** Away team name */
  readonly awayTeam: string;

  /** Current home team score */
  homeScore: number;

  /** Current away team score */
  awayScore: number;

  /** Timestamp when match started (for sorting) */
  readonly startTime: number;
}
