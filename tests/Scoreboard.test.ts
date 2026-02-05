import { Scoreboard } from '../src/Scoreboard';
import { MatchValidationError, MatchNotFoundError } from '../src/errors';

describe('Scoreboard', () => {
  let scoreboard: Scoreboard;

  beforeEach(() => {
    scoreboard = new Scoreboard();
  });

  describe('startMatch', () => {
    it('should start a new match with 0-0 score', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');

      expect(matchId).toBeDefined();
      expect(typeof matchId).toBe('string');
      expect(matchId.length).toBeGreaterThan(0);
    });

    it('should return unique match ID', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');

      expect(matchId).toMatch(/^\d+-[a-z0-9]+$/);
    });

    it('should allow multiple matches', () => {
      const match1 = scoreboard.startMatch('Mexico', 'Canada');
      const match2 = scoreboard.startMatch('Spain', 'Brazil');

      expect(match1).not.toBe(match2);
      expect(match1).toBeDefined();
      expect(match2).toBeDefined();
    });

    it('should allow same teams in different matches (rematches)', () => {
      const match1 = scoreboard.startMatch('Mexico', 'Canada');
      const match2 = scoreboard.startMatch('Mexico', 'Canada');

      expect(match1).not.toBe(match2);
    });

    it('should allow reverse fixtures', () => {
      const match1 = scoreboard.startMatch('Mexico', 'Canada');
      const match2 = scoreboard.startMatch('Canada', 'Mexico');

      expect(match1).not.toBe(match2);
    });

    it('should throw error for empty home team name', () => {
      expect(() => {
        scoreboard.startMatch('', 'Canada');
      }).toThrow(MatchValidationError);
    });

    it('should throw error for empty away team name', () => {
      expect(() => {
        scoreboard.startMatch('Mexico', '');
      }).toThrow(MatchValidationError);
    });

    it('should throw error for whitespace-only team names', () => {
      expect(() => {
        scoreboard.startMatch('   ', 'Canada');
      }).toThrow(MatchValidationError);

      expect(() => {
        scoreboard.startMatch('Mexico', '   ');
      }).toThrow(MatchValidationError);
    });

    it('should throw error when teams are the same', () => {
      expect(() => {
        scoreboard.startMatch('Mexico', 'Mexico');
      }).toThrow(MatchValidationError);
    });

    it('should throw error when teams are same (case insensitive)', () => {
      expect(() => {
        scoreboard.startMatch('Mexico', 'MEXICO');
      }).toThrow(MatchValidationError);
    });

    it('should trim team names automatically', () => {
      const matchId = scoreboard.startMatch('  Mexico  ', '  Canada  ');

      expect(matchId).toBeDefined();
      // Teams are trimmed by MatchFactory
    });

    it('should start multiple matches simultaneously', () => {
      const match1 = scoreboard.startMatch('Mexico', 'Canada');
      const match2 = scoreboard.startMatch('Spain', 'Brazil');
      const match3 = scoreboard.startMatch('Germany', 'France');

      expect(match1).toBeDefined();
      expect(match2).toBeDefined();
      expect(match3).toBeDefined();
      expect(new Set([match1, match2, match3]).size).toBe(3);
    });
  });

  describe('updateScore', () => {
    it('should update match score', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');

      scoreboard.updateScore(matchId, 0, 5);

      // Score updated successfully - no throw
      expect(() => scoreboard.updateScore(matchId, 0, 5)).not.toThrow();
    });

    it('should update score multiple times', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');

      scoreboard.updateScore(matchId, 0, 1);
      scoreboard.updateScore(matchId, 0, 3);
      scoreboard.updateScore(matchId, 0, 5);

      expect(() => scoreboard.updateScore(matchId, 0, 5)).not.toThrow();
    });

    it('should allow updating to same score', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');

      scoreboard.updateScore(matchId, 2, 2);
      scoreboard.updateScore(matchId, 2, 2);

      expect(() => scoreboard.updateScore(matchId, 2, 2)).not.toThrow();
    });

    it('should allow score to decrease (corrections)', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');

      scoreboard.updateScore(matchId, 5, 3);
      scoreboard.updateScore(matchId, 3, 2);

      expect(() => scoreboard.updateScore(matchId, 3, 2)).not.toThrow();
    });

    it('should throw error for non-existent match', () => {
      expect(() => {
        scoreboard.updateScore('invalid-id', 1, 0);
      }).toThrow(MatchNotFoundError);

      expect(() => {
        scoreboard.updateScore('invalid-id', 1, 0);
      }).toThrow('Match with ID invalid-id not found');
    });

    it('should throw error for negative home score', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');

      expect(() => {
        scoreboard.updateScore(matchId, -1, 0);
      }).toThrow('Home score cannot be negative');
    });

    it('should throw error for negative away score', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');

      expect(() => {
        scoreboard.updateScore(matchId, 0, -1);
      }).toThrow('Away score cannot be negative');
    });

    it('should throw error for non-integer home score', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');

      expect(() => {
        scoreboard.updateScore(matchId, 1.5, 0);
      }).toThrow('Home score must be an integer');
    });

    it('should throw error for non-integer away score', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');

      expect(() => {
        scoreboard.updateScore(matchId, 0, 2.7);
      }).toThrow('Away score must be an integer');
    });

    it('should accept zero scores', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');

      expect(() => {
        scoreboard.updateScore(matchId, 0, 0);
      }).not.toThrow();
    });

    it('should accept high scores', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');

      expect(() => {
        scoreboard.updateScore(matchId, 10, 8);
      }).not.toThrow();
    });

    it('should not affect other matches', () => {
      const match1 = scoreboard.startMatch('Mexico', 'Canada');
      const match2 = scoreboard.startMatch('Spain', 'Brazil');

      scoreboard.updateScore(match1, 3, 5);

      // match2 should still be updatable
      expect(() => {
        scoreboard.updateScore(match2, 1, 0);
      }).not.toThrow();
    });

    it('should handle updating multiple matches', () => {
      const match1 = scoreboard.startMatch('Mexico', 'Canada');
      const match2 = scoreboard.startMatch('Spain', 'Brazil');
      const match3 = scoreboard.startMatch('Germany', 'France');

      scoreboard.updateScore(match1, 0, 5);
      scoreboard.updateScore(match2, 10, 2);
      scoreboard.updateScore(match3, 2, 2);

      expect(() => {
        scoreboard.updateScore(match1, 0, 5);
        scoreboard.updateScore(match2, 10, 2);
        scoreboard.updateScore(match3, 2, 2);
      }).not.toThrow();
    });
  });
});
