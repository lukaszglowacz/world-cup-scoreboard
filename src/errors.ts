/**
 * Base error class for scoreboard operations
 */
export abstract class ScoreboardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    // Set the prototype explicitly (needed for extending built-in classes)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when match validation fails
 */
export class MatchValidationError extends ScoreboardError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Thrown when attempting to operate on non-existent match
 */
export class MatchNotFoundError extends ScoreboardError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Thrown when score validation fails
 */
export class InvalidScoreError extends ScoreboardError {
  constructor(message: string) {
    super(message);
  }
}
