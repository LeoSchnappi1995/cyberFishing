import { getGameState, updateGameState } from './gameState.js';
import { getAllFishIds, getFishById } from '../config/fish.js';
import { getAchievementById } from '../config/achievements.js';

/**
 * Get game settlement data
 */
export const getSettlement = () => {
  const state = getGameState();
  
  if (!state) {
    return null;
  }
  
  // Calculate total fish species caught
  const caughtFishCount = Object.keys(state.caughtFish || {}).length;
  const totalFishCount = getAllFishIds().length;
  
  // Find rarest fish (highest difficulty)
  let rarestFish = null;
  let maxDifficulty = 0;
  for (const fishId in state.caughtFish) {
    const fish = getFishById(fishId);
    if (fish && fish.difficulty > maxDifficulty) {
      maxDifficulty = fish.difficulty;
      rarestFish = {
        id: fish.id,
        name: fish.name,
        difficulty: fish.difficulty
      };
    }
  }
  
  // Find maximum single fish value
  let maxValue = 0;
  let maxValueFish = null;
  for (const fishId in state.caughtFish) {
    const fish = getFishById(fishId);
    if (fish) {
      const record = state.caughtFish[fishId];
      const estimatedValue = fish.basePrice * (1 + record.maxWeight / 10);
      if (estimatedValue > maxValue) {
        maxValue = estimatedValue;
        maxValueFish = {
          id: fish.id,
          name: fish.name,
          value: Math.floor(estimatedValue)
        };
      }
    }
  }
  
  // Get all achievements with names
  const achievementList = (state.achievements || []).map(id => {
    const achievement = getAchievementById(id);
    return {
      id,
      name: achievement ? achievement.name : id
    };
  });
  
  // Calculate total game time
  const currentTime = Date.now();
  const timeDiff = Math.floor((currentTime - state.lastUpdateTime) / 1000);
  const totalGameTime = state.gameTime + timeDiff;
  
  return {
    achievements: achievementList,
    fishSpeciesCaught: caughtFishCount,
    totalFishSpecies: totalFishCount,
    rarestFish,
    maxValueFish,
    totalGameTime: totalGameTime,
    deathCount: state.deathCount || 0,
    finalMoney: state.money,
    deepSeaStage: state.deepSeaStage
  };
};

/**
 * End game and get settlement
 */
export const endGame = async (reason = 'player_choice') => {
  const state = getGameState();
  
  if (state.gameOver) {
    return getSettlement();
  }
  
  await updateGameState({
    gameOver: true,
    gameOverReason: reason
  });
  
  return getSettlement();
};

