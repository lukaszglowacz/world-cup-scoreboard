import { Scoreboard } from '../src/Scoreboard';

describe('Scoreboard - Integration Tests', () => {
  describe('Example from requirements', () => {
    it('should match the exact example scenario from task description', async () => {
      const scoreboard = new Scoreboard();

      // Small delay between matches to ensure different timestamps
      const delay = (ms: number): Promise<void> =>
        new Promise((resolve) => setTimeout(resolve, ms));

      // Start matches in specified order
      const mexico = scoreboard.startMatch('Mexico', 'Canada');
      await delay(5);

      const spain = scoreboard.startMatch('Spain', 'Brazil');
      await delay(5);

      const germany = scoreboard.startMatch('Germany', 'France');
      await delay(5);

      const uruguay = scoreboard.startMatch('Uruguay', 'Italy');
      await delay(5);

      const argentina = scoreboard.startMatch('Argentina', 'Australia');

      // Update scores as per requirements
      scoreboard.updateScore(mexico, 0, 5);
      scoreboard.updateScore(spain, 10, 2);
      scoreboard.updateScore(germany, 2, 2);
      scoreboard.updateScore(uruguay, 6, 6);
      scoreboard.updateScore(argentina, 3, 1);

      // Get summary
      const summary = scoreboard.getSummary();

      // Verify correct number of matches
      expect(summary).toHaveLength(5);

      // Expected order from requirements:
      // 1. Uruguay 6 - Italy 6 (total: 12)
      expect(summary[0]!.homeTeam).toBe('Uruguay');
      expect(summary[0]!.awayTeam).toBe('Italy');
      expect(summary[0]!.homeScore).toBe(6);
      expect(summary[0]!.awayScore).toBe(6);

      // 2. Spain 10 - Brazil 2 (total: 12, but started earlier)
      expect(summary[1]!.homeTeam).toBe('Spain');
      expect(summary[1]!.awayTeam).toBe('Brazil');
      expect(summary[1]!.homeScore).toBe(10);
      expect(summary[1]!.awayScore).toBe(2);

      // 3. Mexico 0 - Canada 5 (total: 5)
      expect(summary[2]!.homeTeam).toBe('Mexico');
      expect(summary[2]!.awayTeam).toBe('Canada');
      expect(summary[2]!.homeScore).toBe(0);
      expect(summary[2]!.awayScore).toBe(5);

      // 4. Argentina 3 - Australia 1 (total: 4)
      expect(summary[3]!.homeTeam).toBe('Argentina');
      expect(summary[3]!.awayTeam).toBe('Australia');
      expect(summary[3]!.homeScore).toBe(3);
      expect(summary[3]!.awayScore).toBe(1);

      // 5. Germany 2 - France 2 (total: 4, but started earlier)
      expect(summary[4]!.homeTeam).toBe('Germany');
      expect(summary[4]!.awayTeam).toBe('France');
      expect(summary[4]!.homeScore).toBe(2);
      expect(summary[4]!.awayScore).toBe(2);
    });
  });

  describe('Complex scenarios', () => {
    it('should handle match lifecycle correctly', () => {
      const scoreboard = new Scoreboard();

      const match1 = scoreboard.startMatch('Poland', 'Germany');
      const match2 = scoreboard.startMatch('Spain', 'Brazil');

      scoreboard.updateScore(match1, 2, 0);
      scoreboard.updateScore(match2, 1, 1);

      let summary = scoreboard.getSummary();
      expect(summary).toHaveLength(2);

      scoreboard.finishMatch(match1);

      summary = scoreboard.getSummary();
      expect(summary).toHaveLength(1);
      expect(summary[0]!.homeTeam).toBe('Spain');
    });

    it('should handle all matches finished', () => {
      const scoreboard = new Scoreboard();

      const match1 = scoreboard.startMatch('Poland', 'Germany');
      const match2 = scoreboard.startMatch('Spain', 'Brazil');

      scoreboard.finishMatch(match1);
      scoreboard.finishMatch(match2);

      const summary = scoreboard.getSummary();
      expect(summary).toEqual([]);
    });

    it('should handle dynamic score updates during match', () => {
      const scoreboard = new Scoreboard();

      const match1 = scoreboard.startMatch('Poland', 'Germany');
      const match2 = scoreboard.startMatch('Spain', 'Brazil');

      // Initial scores
      scoreboard.updateScore(match1, 1, 0);
      scoreboard.updateScore(match2, 0, 1);

      let summary = scoreboard.getSummary();
      expect(summary[0]!.homeTeam).toBe('Poland'); // 1 > 1, same total
      expect(summary[1]!.homeTeam).toBe('Spain');

      // Spain scores more
      scoreboard.updateScore(match2, 3, 1);

      summary = scoreboard.getSummary();
      expect(summary[0]!.homeTeam).toBe('Spain'); // 4 > 1
      expect(summary[1]!.homeTeam).toBe('Poland');
    });

    it('should handle empty scoreboard', () => {
      const scoreboard = new Scoreboard();

      const summary = scoreboard.getSummary();
      expect(summary).toEqual([]);
      expect(summary).toHaveLength(0);
    });

    it('should handle single match workflow', () => {
      const scoreboard = new Scoreboard();

      const matchId = scoreboard.startMatch('Poland', 'Germany');

      let summary = scoreboard.getSummary();
      expect(summary).toHaveLength(1);
      expect(summary[0]!.homeScore).toBe(0);
      expect(summary[0]!.awayScore).toBe(0);

      scoreboard.updateScore(matchId, 2, 1);

      summary = scoreboard.getSummary();
      expect(summary[0]!.homeScore).toBe(2);
      expect(summary[0]!.awayScore).toBe(1);

      scoreboard.finishMatch(matchId);

      summary = scoreboard.getSummary();
      expect(summary).toHaveLength(0);
    });
  });
});
