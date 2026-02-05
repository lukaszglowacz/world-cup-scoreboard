import { MatchFactory } from '../src/MatchFactory';
import { MatchValidationError } from '../src/errors';

describe('MatchFactory', () => {
  describe('createMatch', () => {
    it('should create match with 0-0 score', () => {
      const match = MatchFactory.createMatch('Poland', 'Germany');

      expect(match.homeTeam).toBe('Poland');
      expect(match.awayTeam).toBe('Germany');
      expect(match.homeScore).toBe(0);
      expect(match.awayScore).toBe(0);
    });

    it('should generate unique match ID', () => {
      const match1 = MatchFactory.createMatch('Poland', 'Germany');
      const match2 = MatchFactory.createMatch('Spain', 'Brazil');

      expect(match1.id).not.toBe(match2.id);
      expect(match1.id).toBeDefined();
      expect(match2.id).toBeDefined();
    });

    it('should set start time', () => {
      const before = Date.now();
      const match = MatchFactory.createMatch('Poland', 'Germany');
      const after = Date.now();

      expect(match.startTime).toBeGreaterThanOrEqual(before);
      expect(match.startTime).toBeLessThanOrEqual(after);
    });

    it('should trim team names', () => {
      const match = MatchFactory.createMatch('  Poland  ', '  Germany  ');

      expect(match.homeTeam).toBe('Poland');
      expect(match.awayTeam).toBe('Germany');
    });

    it('should create matches with readonly properties', () => {
      const match = MatchFactory.createMatch('Poland', 'Germany');

      expect(match.id).toBeDefined();
      expect(match.homeTeam).toBe('Poland');
      expect(match.startTime).toBeGreaterThan(0);
    });

    it('should throw error for empty home team', () => {
      expect(() => {
        MatchFactory.createMatch('', 'Germany');
      }).toThrow(MatchValidationError);

      expect(() => {
        MatchFactory.createMatch('', 'Germany');
      }).toThrow('Home team name cannot be empty');
    });

    it('should throw error for empty away team', () => {
      expect(() => {
        MatchFactory.createMatch('Poland', '');
      }).toThrow(MatchValidationError);

      expect(() => {
        MatchFactory.createMatch('Poland', '');
      }).toThrow('Away team name cannot be empty');
    });

    it('should throw error for whitespace-only home team', () => {
      expect(() => {
        MatchFactory.createMatch('   ', 'Germany');
      }).toThrow(MatchValidationError);

      expect(() => {
        MatchFactory.createMatch('   ', 'Germany');
      }).toThrow('Home team name cannot be empty');
    });

    it('should throw error for whitespace-only away team', () => {
      expect(() => {
        MatchFactory.createMatch('Poland', '   ');
      }).toThrow(MatchValidationError);

      expect(() => {
        MatchFactory.createMatch('Poland', '   ');
      }).toThrow('Away team name cannot be empty');
    });

    it('should throw error when teams are the same', () => {
      expect(() => {
        MatchFactory.createMatch('Poland', 'Poland');
      }).toThrow(MatchValidationError);

      expect(() => {
        MatchFactory.createMatch('Poland', 'Poland');
      }).toThrow('Home team and away team must be different');
    });

    it('should throw error when teams are same (case insensitive)', () => {
      expect(() => {
        MatchFactory.createMatch('Poland', 'POLAND');
      }).toThrow(MatchValidationError);

      expect(() => {
        MatchFactory.createMatch('Poland', 'poland');
      }).toThrow('Home team and away team must be different');
    });

    it('should throw error when teams are same with whitespace', () => {
      expect(() => {
        MatchFactory.createMatch('  Poland  ', 'POLAND');
      }).toThrow(MatchValidationError);
    });

    it('should allow different teams with similar names', () => {
      const match = MatchFactory.createMatch('Poland', 'Poland U21');

      expect(match.homeTeam).toBe('Poland');
      expect(match.awayTeam).toBe('Poland U21');
    });

    it('should generate ID with correct format', () => {
      const match = MatchFactory.createMatch('Poland', 'Germany');

      // ID format: timestamp-randomstring
      expect(match.id).toMatch(/^\d+-[a-z0-9]+$/);
    });
  });
});
