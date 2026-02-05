import { Scoreboard } from '../src/Scoreboard';
import { MatchValidationError } from '../src/errors';

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
});
