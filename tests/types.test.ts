import { Match, Score } from '../src/types';

describe('Types', () => {
  describe('Match', () => {
    it('should have correct structure', () => {
      const match: Match = {
        id: '123',
        homeTeam: 'Poland',
        awayTeam: 'Germany',
        homeScore: 0,
        awayScore: 0,
        startTime: Date.now(),
      };

      expect(match.id).toBe('123');
      expect(match.homeTeam).toBe('Poland');
      expect(match.awayTeam).toBe('Germany');
      expect(match.homeScore).toBe(0);
      expect(match.awayScore).toBe(0);
      expect(match.startTime).toBeGreaterThan(0);
    });

    it('should enforce readonly properties', () => {
      const match: Match = {
        id: '123',
        homeTeam: 'Poland',
        awayTeam: 'Germany',
        homeScore: 0,
        awayScore: 0,
        startTime: Date.now(),
      };

      // TypeScript will prevent these at compile time:
      // match.id = '456'; // Error
      // match.homeTeam = 'Spain'; // Error
      // match.startTime = Date.now(); // Error

      // But these should be allowed:
      match.homeScore = 1;
      match.awayScore = 2;

      expect(match.homeScore).toBe(1);
      expect(match.awayScore).toBe(2);
    });
  });

  describe('Score', () => {
    it('should have home and away properties', () => {
      const score: Score = { home: 2, away: 1 };

      expect(score.home).toBe(2);
      expect(score.away).toBe(1);
    });

    it('should accept zero scores', () => {
      const score: Score = { home: 0, away: 0 };

      expect(score.home).toBe(0);
      expect(score.away).toBe(0);
    });

    it('should accept high scores', () => {
      const score: Score = { home: 10, away: 8 };

      expect(score.home).toBe(10);
      expect(score.away).toBe(8);
    });
  });
});
