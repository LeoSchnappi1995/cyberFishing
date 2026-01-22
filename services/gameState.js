import { loadGameState, saveGameState, getDefaultGameState } from '../utils/persistence.js';

let gameState = null;

// Initialize game state
export const initializeGameState = async () => {
  const saved = await loadGameState();
  if (saved) {
    gameState = saved;
    // Update game time
    const timeDiff = Math.floor((Date.now() - saved.lastUpdateTime) / 1000);
    gameState.gameTime += timeDiff;
    gameState.lastUpdateTime = Date.now();
  } else {
    gameState = getDefaultGameState();
    await saveGameState(gameState);
  }
  return gameState;
};

// Get current game state
export const getGameState = () => {
  return gameState ? { ...gameState } : null;
};

// Update game state
export const updateGameState = async (updates) => {
  if (!gameState) {
    gameState = await initializeGameState();
  }
  
  gameState = {
    ...gameState,
    ...updates,
    lastUpdateTime: Date.now()
  };
  
  await saveGameState(gameState);
  return gameState;
};

// Reset game state
export const resetGameState = async () => {
  gameState = getDefaultGameState();
  await saveGameState(gameState);
  return gameState;
};

