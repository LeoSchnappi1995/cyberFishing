import { getGameState, updateGameState } from './gameState.js';

/**
 * Check and unlock achievements based on game events
 */
export const checkAchievements = async (event, data = {}) => {
  const state = getGameState();
  const achievements = [...state.achievements];
  let newAchievements = [];
  
  // Check bay adventurer
  if (event === 'enter_bay' && !achievements.includes('bay_adventurer')) {
    achievements.push('bay_adventurer');
    newAchievements.push('bay_adventurer');
  }
  
  // Check deep sea explorer
  if (event === 'enter_deep_sea' && !achievements.includes('deep_sea_explorer')) {
    achievements.push('deep_sea_explorer');
    newAchievements.push('deep_sea_explorer');
  }
  
  // Update deep sea stage on first entry
  let deepSeaStage = state.deepSeaStage;
  if (event === 'enter_deep_sea' && deepSeaStage === 'none') {
    deepSeaStage = 'exploring';
  }
  
  const updates = {};
  if (newAchievements.length > 0) {
    updates.achievements = achievements;
  }
  if (deepSeaStage !== state.deepSeaStage) {
    updates.deepSeaStage = deepSeaStage;
  }
  
  if (Object.keys(updates).length > 0) {
    await updateGameState(updates);
  }
  
  return newAchievements;
};

