# Quick Start Guide

## Installation & Run

```bash
# Install dependencies
npm install

# Start server
npm start
```

Server will run on `http://localhost:3000`

## API Testing Examples

### 1. Get Game State
```bash
curl http://localhost:3000/api/game/state
```

### 2. Purchase Bait
```bash
curl -X POST http://localhost:3000/api/game/shop/bait \
  -H "Content-Type: application/json" \
  -d '{"baitId": "plant", "quantity": 10}'
```

### 3. Purchase Boat
```bash
curl -X POST http://localhost:3000/api/game/shop/boat \
  -H "Content-Type: application/json" \
  -d '{"boatId": "small"}'
```

### 4. Check Fishing Risk
```bash
curl -X POST http://localhost:3000/api/game/fishing/check-risk \
  -H "Content-Type: application/json" \
  -d '{
    "environmentId": "stream",
    "fishId": "small_fish",
    "baitId": "plant",
    "useConsumable": false
  }'
```

### 5. Attempt Fishing
```bash
curl -X POST http://localhost:3000/api/game/fishing/attempt \
  -H "Content-Type: application/json" \
  -d '{
    "environmentId": "stream",
    "fishId": "small_fish",
    "baitId": "plant",
    "useConsumable": false
  }'
```

### 6. Get Settlement
```bash
curl http://localhost:3000/api/game/settlement
```

### 7. End Game
```bash
curl -X POST http://localhost:3000/api/game/end-game \
  -H "Content-Type: application/json" \
  -d '{"reason": "player_choice"}'
```

## Game Flow Example

1. **Start**: Game state initialized with 500 money, no boat
2. **Buy Bait**: Purchase plant bait for fishing
3. **Buy Boat**: Purchase small boat to access lake
4. **Fish**: Attempt to catch fish in accessible environments
5. **Progress**: Upgrade boat, catch better fish, unlock achievements
6. **Deep Sea**: Purchase large boat, enter deep sea (5% failure risk)
7. **End**: Catch giant squid (complete) or cthulhu (ultimate), or end manually

## Important Notes

- All game state is persisted to `data/game_state.json`
- Deep sea entry with non-large boat = immediate game over
- Large boat in deep sea = 5% failure chance (game over)
- Bay capsize: Medium boat + difficulty 5+ fish + success <40% = capsize (lose bait/fish, continue)
- Fishing failure always consumes 1 bait
- Live fish can be used as bait (stored in liveFishInventory)

