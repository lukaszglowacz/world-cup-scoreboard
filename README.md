# ⚽ World Cup Scoreboard Library

A simple, type-safe in-memory scoreboard library for tracking live football matches during the World Cup.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com/lukaszglowacz/world-cup-scoreboard)
[![Tests](https://img.shields.io/badge/tests-105%20passed-success)](https://github.com/lukaszglowacz/world-cup-scoreboard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-lukaszglowacz%2Fworld--cup--scoreboard-blue?logo=github)](https://github.com/lukaszglowacz/world-cup-scoreboard)

## 📋 Features

- ✅ Start new matches with automatic 0-0 initialization
- ✅ Update match scores with validation
- ✅ Finish matches and remove from scoreboard
- ✅ Get sorted summary of ongoing matches
- ✅ Type-safe API with TypeScript
- ✅ 100% test coverage (105 tests)
- ✅ Custom error types for better error handling
- ✅ Zero dependencies (in-memory storage)

## 🚀 Installation
```bash
npm install world-cup-scoreboard
```

## 📖 Usage
```typescript
import { Scoreboard } from 'world-cup-scoreboard';

// Create scoreboard instance
const scoreboard = new Scoreboard();

// Start a new match
const matchId = scoreboard.startMatch('Mexico', 'Canada');

// Update the score
scoreboard.updateScore(matchId, 0, 5);

// Get summary of all ongoing matches
const summary = scoreboard.getSummary();
console.log(summary);
// Output:
// [
//   {
//     id: '1234-abc',
//     homeTeam: 'Mexico',
//     awayTeam: 'Canada',
//     homeScore: 0,
//     awayScore: 5,
//     startTime: 1234567890
//   }
// ]

// Finish the match
scoreboard.finishMatch(matchId);
```

## 📚 API Reference

### `Scoreboard`

Main class for managing the scoreboard.

#### `startMatch(homeTeam: string, awayTeam: string): string`

Starts a new match with 0-0 score.

**Parameters:**
- `homeTeam` - Name of the home team (non-empty string)
- `awayTeam` - Name of the away team (non-empty string, different from home team)

**Returns:** Unique match identifier (string)

**Throws:**
- `MatchValidationError` - If team names are invalid or identical

**Example:**
```typescript
const matchId = scoreboard.startMatch('Spain', 'Brazil');
```

---

#### `updateScore(matchId: string, homeScore: number, awayScore: number): void`

Updates the score of an ongoing match.

**Parameters:**
- `matchId` - Unique match identifier
- `homeScore` - Absolute home team score (non-negative integer)
- `awayScore` - Absolute away team score (non-negative integer)

**Throws:**
- `MatchNotFoundError` - If match doesn't exist
- `InvalidScoreError` - If scores are negative or non-integer

**Example:**
```typescript
scoreboard.updateScore(matchId, 10, 2);
```

---

#### `finishMatch(matchId: string): void`

Finishes a match and removes it from the scoreboard.

**Parameters:**
- `matchId` - Unique match identifier

**Throws:**
- `MatchNotFoundError` - If match doesn't exist

**Example:**
```typescript
scoreboard.finishMatch(matchId);
```

---

#### `getSummary(): Match[]`

Returns a summary of all ongoing matches, sorted by:
1. **Total score** (descending - higher scores first)
2. **Start time** (descending - most recent first)

**Returns:** Array of `Match` objects

**Example:**
```typescript
const summary = scoreboard.getSummary();
summary.forEach(match => {
  console.log(`${match.homeTeam} ${match.homeScore} - ${match.awayTeam} ${match.awayScore}`);
});
```

---

### Types
```typescript
interface Match {
  readonly id: string;
  readonly homeTeam: string;
  readonly awayTeam: string;
  homeScore: number;
  awayScore: number;
  readonly startTime: number;
}

interface Score {
  home: number;
  away: number;
}
```

---

### Custom Errors
```typescript
class ScoreboardError extends Error           // Base error class
class MatchValidationError extends ScoreboardError
class MatchNotFoundError extends ScoreboardError
class InvalidScoreError extends ScoreboardError
```

**Usage:**
```typescript
import { MatchValidationError } from 'world-cup-scoreboard';

try {
  scoreboard.startMatch('Poland', 'Poland'); // Same team twice
} catch (error) {
  if (error instanceof MatchValidationError) {
    console.error('Validation failed:', error.message);
  }
}
```

## 🏗️ Design Decisions

### 1. **UUID for Match Identification**
Matches are identified by unique IDs (timestamp + random string) rather than team names. This allows:
- Multiple matches between the same teams
- Reliable match tracking
- No conflicts with team name changes

### 2. **Map Storage for O(1) Operations**
Uses `Map<string, Match>` for O(1) lookup, update, and delete operations.

### 3. **Immutable Timestamps**
Match start times are immutable to ensure reliable secondary sorting.

### 4. **Factory Pattern**
`MatchFactory` encapsulates match creation logic and validation.

### 5. **Value Objects**
`ScoreValidator` provides score validation and calculation as a separate concern.

### 6. **Custom Error Types**
Specific error types (`MatchValidationError`, `MatchNotFoundError`, `InvalidScoreError`) provide better error handling and debugging.

## 🧪 Testing
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

**Test Coverage: 100%**
- ✅ 105 tests passing
- ✅ Unit tests for all components
- ✅ Integration tests for complete scenarios
- ✅ Edge case validation

## 🎯 Assumptions

1. **Team Names:**
   - Must be non-empty strings
   - Whitespace is trimmed automatically
   - Home and away teams must be different (case-insensitive)

2. **Scores:**
   - Must be non-negative integers
   - Updates use absolute scores (not incremental)
   - No maximum score limit

3. **Match Uniqueness:**
   - Same teams can play multiple matches simultaneously
   - Each match has a unique ID

4. **Sorting:**
   - Primary: Total score descending (higher scores first)
   - Secondary: Start time descending (most recent first)

5. **Storage:**
   - In-memory only (no persistence)
   - Data is lost when process terminates

## 📝 Example Scenario

From the task requirements:
```typescript
const scoreboard = new Scoreboard();

// Start matches in order
const mexico = scoreboard.startMatch('Mexico', 'Canada');
const spain = scoreboard.startMatch('Spain', 'Brazil');
const germany = scoreboard.startMatch('Germany', 'France');
const uruguay = scoreboard.startMatch('Uruguay', 'Italy');
const argentina = scoreboard.startMatch('Argentina', 'Australia');

// Update scores
scoreboard.updateScore(mexico, 0, 5);
scoreboard.updateScore(spain, 10, 2);
scoreboard.updateScore(germany, 2, 2);
scoreboard.updateScore(uruguay, 6, 6);
scoreboard.updateScore(argentina, 3, 1);

// Get summary
const summary = scoreboard.getSummary();

// Expected order:
// 1. Uruguay 6 - Italy 6       (total: 12, started 4th)
// 2. Spain 10 - Brazil 2       (total: 12, started 2nd)
// 3. Mexico 0 - Canada 5       (total: 5)
// 4. Argentina 3 - Australia 1 (total: 4, started 5th)
// 5. Germany 2 - France 2      (total: 4, started 3rd)
```

## 🛠️ Development
```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Lint
npm run lint

# Format
npm run format
```

## 📦 Build
```bash
npm run build
```

Produces compiled JavaScript and TypeScript declarations in `dist/`:
- `index.js` + `index.d.ts` - Main exports
- `Scoreboard.js` + `Scoreboard.d.ts` - Scoreboard class
- `errors.js` + `errors.d.ts` - Custom errors
- And more...

## 🏆 Code Quality

- **TypeScript** strict mode with no `any` types
- **ESLint** with TypeScript support
- **Prettier** for consistent formatting
- **Jest** for comprehensive testing
- **100% test coverage** (branches, functions, lines, statements)

## 📄 License

MIT © Łukasz Głowacz

## 🙏 Acknowledgments

Coding exercise for **Sportradar - Live Odds Services**

---

## 📝 Implementation Notes

### Development Approach

This library was developed using **Test-Driven Development (TDD)**:
1. Write failing test
2. Implement minimal code to pass
3. Refactor while keeping tests green
4. Repeat

### Architecture Decisions

**SOLID Principles Applied:**
- **S**ingle Responsibility: Each class has one clear purpose
- **O**pen/Closed: Extensible through inheritance (custom errors)
- **L**iskov Substitution: Error hierarchy is substitutable
- **I**nterface Segregation: Minimal, focused interfaces
- **D**ependency Inversion: Depends on abstractions (interfaces)

**Design Patterns:**
- **Factory Method**: `MatchFactory` for object creation
- **Value Object**: `ScoreValidator` for score operations
- **Repository Pattern**: `Scoreboard` as match repository

### Quality Metrics

- **Test Coverage**: 100% (lines, branches, functions, statements)
- **Code Smells**: 0 (via ESLint)
- **TypeScript**: Strict mode with no `any` types
- **Commits**: Incremental commits following conventional commits

### Trade-offs

**Chose Simplicity Over:**
- Persistence layer (in-memory only)
- Event sourcing (direct state mutation)
- Microservices (single library)
- Database integration (collections only)

**Why?**
Task requirements explicitly requested:
> "Keep it simple... Just a simple library implementation"

### Future Enhancements (Out of Scope)

If this were a production system, consider:
- Event-driven architecture for real-time updates
- Redis/MongoDB for persistent storage
- WebSocket server for live score streaming
- REST API wrapper
- React component library for UI
- CI/CD pipeline with GitHub Actions
- Performance monitoring
- Rate limiting

However, these would be **over-engineering** for the current requirements.

---

**Note:** This is a simple library implementation focused on clean code, SOLID principles, and comprehensive testing. It uses in-memory storage and is not designed for production use with persistence requirements.

---

## ✅ Project Status

**Completed** - All requirements implemented with 100% test coverage.

**Developed by:** Łukasz Głowacz  
**Exercise for:** Sportradar - Live Odds Services  
**Completion Date:** February 2025  

**Commit History:** 22 commits showing incremental TDD progression  
**Final Metrics:**
- ✅ 105 tests passing
- ✅ 100% code coverage
- ✅ 0 lint errors
- ✅ Full TypeScript strict mode
- ✅ Complete documentation