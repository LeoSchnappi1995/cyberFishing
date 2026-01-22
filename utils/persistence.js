import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const SAVE_FILE = path.join(DATA_DIR, 'game_state.json');

// Ensure data directory exists
export const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
};

// Load game state
export const loadGameState = async () => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SAVE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist, return null
    return null;
  }
};

// Save game state
export const saveGameState = async (gameState) => {
  try {
    await ensureDataDir();
    await fs.writeFile(SAVE_FILE, JSON.stringify(gameState, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving game state:', error);
    return false;
  }
};

// Initialize default game state
export const getDefaultGameState = () => {
  return {
    money: 500,
    boat: 'none',
    baitInventory: {
      plant: 0,
      dead_fish: 0
    },
    liveFishInventory: {}, // { fishId: count }
    caughtFish: {}, // { fishId: { count, firstCaught, maxWeight } }
    achievements: ['beginner_angler'],
    gameStartTime: Date.now(),
    lastUpdateTime: Date.now(),
    gameTime: 0, // Total play time in seconds
    deathCount: 0,
    deepSeaStage: 'none', // none, exploring, completed, ultimate
    gameOver: false,
    gameOverReason: null
  };
};

