import {
  Scoreboard,
  ScoreboardError,
  MatchValidationError,
  MatchNotFoundError,
  InvalidScoreError,
} from '../src/index';

describe('Public API Exports', () => {
  it('should export Scoreboard class', () => {
    expect(Scoreboard).toBeDefined();
    expect(typeof Scoreboard).toBe('function');
  });

  it('should export error classes', () => {
    expect(ScoreboardError).toBeDefined();
    expect(MatchValidationError).toBeDefined();
    expect(MatchNotFoundError).toBeDefined();
    expect(InvalidScoreError).toBeDefined();
  });

  it('should allow creating Scoreboard instance', () => {
    const scoreboard = new Scoreboard();
    expect(scoreboard).toBeInstanceOf(Scoreboard);
  });

  it('should allow using exported Scoreboard', () => {
    const scoreboard = new Scoreboard();
    const matchId = scoreboard.startMatch('Poland', 'Germany');

    expect(matchId).toBeDefined();
    expect(typeof matchId).toBe('string');
  });

  it('should allow catching exported errors', () => {
    const scoreboard = new Scoreboard();

    try {
      scoreboard.startMatch('Poland', 'Poland');
      fail('Should have thrown MatchValidationError');
    } catch (error) {
      expect(error).toBeInstanceOf(MatchValidationError);
      expect(error).toBeInstanceOf(ScoreboardError);
    }
  });
});
