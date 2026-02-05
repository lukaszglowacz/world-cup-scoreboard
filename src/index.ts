/**
 * World Cup Scoreboard Library
 *
 * A simple in-memory scoreboard for tracking live football matches.
 *
 * @example
 * ```typescript
 * import { Scoreboard } from 'world-cup-scoreboard';
 *
 * const scoreboard = new Scoreboard();
 * const matchId = scoreboard.startMatch('Mexico', 'Canada');
 * scoreboard.updateScore(matchId, 0, 5);
 * const summary = scoreboard.getSummary();
 * scoreboard.finishMatch(matchId);
 * ```
 *
 * @packageDocumentation
 */

// Main Scoreboard class
export { Scoreboard } from './Scoreboard';

// Types for TypeScript consumers
export type { Match, Score } from './types';

// Custom errors for error handling
export {
  ScoreboardError,
  MatchValidationError,
  MatchNotFoundError,
  InvalidScoreError,
} from './errors';
