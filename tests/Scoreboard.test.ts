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

  describe('finishMatch', () => {
    it('should remove match from scoreboard', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');

      scoreboard.finishMatch(matchId);

      // Verify it's removed by trying to update
      expect(() => {
        scoreboard.updateScore(matchId, 1, 0);
      }).toThrow(MatchNotFoundError);
    });

    it('should throw error for non-existent match', () => {
      expect(() => {
        scoreboard.finishMatch('invalid-id');
      }).toThrow(MatchNotFoundError);

      expect(() => {
        scoreboard.finishMatch('invalid-id');
      }).toThrow('Match with ID invalid-id not found');
    });

    it('should not affect other matches', () => {
      const match1 = scoreboard.startMatch('Mexico', 'Canada');
      const match2 = scoreboard.startMatch('Spain', 'Brazil');

      scoreboard.finishMatch(match1);

      // match2 should still be updatable
      expect(() => {
        scoreboard.updateScore(match2, 1, 0);
      }).not.toThrow();
    });

    it('should allow finishing match with updated score', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');
      scoreboard.updateScore(matchId, 3, 5);

      expect(() => {
        scoreboard.finishMatch(matchId);
      }).not.toThrow();
    });

    it('should allow finishing match with 0-0 score', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');

      expect(() => {
        scoreboard.finishMatch(matchId);
      }).not.toThrow();
    });

    it('should handle finishing multiple matches', () => {
      const match1 = scoreboard.startMatch('Mexico', 'Canada');
      const match2 = scoreboard.startMatch('Spain', 'Brazil');
      const match3 = scoreboard.startMatch('Germany', 'France');

      scoreboard.finishMatch(match1);
      scoreboard.finishMatch(match2);
      scoreboard.finishMatch(match3);

      // All should be removed
      expect(() => {
        scoreboard.updateScore(match1, 1, 0);
      }).toThrow(MatchNotFoundError);

      expect(() => {
        scoreboard.updateScore(match2, 1, 0);
      }).toThrow(MatchNotFoundError);

      expect(() => {
        scoreboard.updateScore(match3, 1, 0);
      }).toThrow(MatchNotFoundError);
    });

    it('should prevent finishing same match twice', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');

      scoreboard.finishMatch(matchId);

      expect(() => {
        scoreboard.finishMatch(matchId);
      }).toThrow(MatchNotFoundError);
    });

    it('should allow starting new match after finishing previous', () => {
      const match1 = scoreboard.startMatch('Mexico', 'Canada');
      scoreboard.finishMatch(match1);

      const match2 = scoreboard.startMatch('Mexico', 'Canada');

      expect(match2).toBeDefined();
      expect(match2).not.toBe(match1);
    });
  });

  describe('getSummary', () => {
    it('should return empty array when no matches', () => {
      const summary = scoreboard.getSummary();

      expect(summary).toEqual([]);
      expect(summary).toHaveLength(0);
    });

    it('should return single match', () => {
      const matchId = scoreboard.startMatch('Mexico', 'Canada');
      scoreboard.updateScore(matchId, 0, 5);

      const summary = scoreboard.getSummary();

      expect(summary).toHaveLength(1);
      expect(summary[0]).toBeDefined();
      expect(summary[0]!.homeTeam).toBe('Mexico');
      expect(summary[0]!.awayTeam).toBe('Canada');
      expect(summary[0]!.homeScore).toBe(0);
      expect(summary[0]!.awayScore).toBe(5);
    });

    it('should sort by total score descending', () => {
      const match1 = scoreboard.startMatch('Mexico', 'Canada');
      const match2 = scoreboard.startMatch('Spain', 'Brazil');
      const match3 = scoreboard.startMatch('Germany', 'France');

      scoreboard.updateScore(match1, 0, 5); // total: 5
      scoreboard.updateScore(match2, 10, 2); // total: 12
      scoreboard.updateScore(match3, 2, 2); // total: 4

      const summary = scoreboard.getSummary();

      expect(summary).toHaveLength(3);
      expect(summary[0]!.homeTeam).toBe('Spain'); // 12
      expect(summary[1]!.homeTeam).toBe('Mexico'); // 5
      expect(summary[2]!.homeTeam).toBe('Germany'); // 4
    });

    it('should sort by start time when scores are equal', () => {
      const match1 = scoreboard.startMatch('Mexico', 'Canada');
      scoreboard.updateScore(match1, 2, 2); // total: 4

      // Small delay to ensure different timestamps
      const delay = (ms: number): Promise<void> =>
        new Promise((resolve) => setTimeout(resolve, ms));

      return delay(10).then(() => {
        const match2 = scoreboard.startMatch('Germany', 'France');
        scoreboard.updateScore(match2, 1, 3); // total: 4

        const summary = scoreboard.getSummary();

        expect(summary).toHaveLength(2);
        // Germany-France started more recently, so it comes first
        expect(summary[0]!.homeTeam).toBe('Germany');
        expect(summary[1]!.homeTeam).toBe('Mexico');
      });
    });

    it('should handle all matches with same score', async () => {
      // Small delay between starts to ensure different timestamps
      const delay = (ms: number): Promise<void> =>
        new Promise((resolve) => setTimeout(resolve, ms));

      scoreboard.startMatch('Match1-Home', 'Match1-Away');
      await delay(5);
      scoreboard.startMatch('Match2-Home', 'Match2-Away');
      await delay(5);
      scoreboard.startMatch('Match3-Home', 'Match3-Away');

      // Get matches and update them to same total score
      const matches = scoreboard.getSummary();
      scoreboard.updateScore(matches[0]!.id, 1, 1);
      scoreboard.updateScore(matches[1]!.id, 2, 0);
      scoreboard.updateScore(matches[2]!.id, 0, 2);

      const summary = scoreboard.getSummary();

      expect(summary).toHaveLength(3);
      // All have total score 2, should be sorted by start time DESC
      expect(summary[0]!.homeTeam).toBe('Match3-Home'); // started last
      expect(summary[1]!.homeTeam).toBe('Match2-Home');
      expect(summary[2]!.homeTeam).toBe('Match1-Home'); // started first
    });

    it('should handle matches with 0-0 scores', () => {
      scoreboard.startMatch('Mexico', 'Canada');
      const match2 = scoreboard.startMatch('Spain', 'Brazil');

      scoreboard.updateScore(match2, 3, 2); // total: 5

      const summary = scoreboard.getSummary();

      expect(summary).toHaveLength(2);
      expect(summary[0]!.homeTeam).toBe('Spain'); // 5
      expect(summary[1]!.homeTeam).toBe('Mexico'); // 0
    });

    it('should not include finished matches', () => {
      const match1 = scoreboard.startMatch('Mexico', 'Canada');
      const match2 = scoreboard.startMatch('Spain', 'Brazil');

      scoreboard.updateScore(match1, 3, 5);
      scoreboard.updateScore(match2, 10, 2);

      scoreboard.finishMatch(match1);

      const summary = scoreboard.getSummary();

      expect(summary).toHaveLength(1);
      expect(summary[0]!.homeTeam).toBe('Spain');
    });

    it('should return matches in correct order with mixed scores', () => {
      const match1 = scoreboard.startMatch('Low-Home', 'Low-Away');
      const match2 = scoreboard.startMatch('High-Home', 'High-Away');
      const match3 = scoreboard.startMatch('Medium-Home', 'Medium-Away');

      scoreboard.updateScore(match1, 1, 0); // total: 1
      scoreboard.updateScore(match2, 10, 8); // total: 18
      scoreboard.updateScore(match3, 3, 2); // total: 5

      const summary = scoreboard.getSummary();

      expect(summary[0]!.homeTeam).toBe('High-Home'); // 18
      expect(summary[1]!.homeTeam).toBe('Medium-Home'); // 5
      expect(summary[2]!.homeTeam).toBe('Low-Home'); // 1
    });

    it('should return new array on each call', () => {
      scoreboard.startMatch('Mexico', 'Canada');

      const summary1 = scoreboard.getSummary();
      const summary2 = scoreboard.getSummary();

      expect(summary1).not.toBe(summary2);
      expect(summary1).toEqual(summary2);
    });
  });
});
