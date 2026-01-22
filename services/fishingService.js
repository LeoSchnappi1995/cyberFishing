import { getFishById } from '../config/fish.js';
import { getBaitById } from '../config/bait.js';
import { canBoatAccessEnvironment } from '../config/boat.js';
import { getEnvironmentById } from '../config/environment.js';
import { getGameState, updateGameState } from './gameState.js';
import { calculateSuccessRate, checkCapsizeRisk } from '../utils/fishingUtils.js';

/**
 * Attempt to catch a fish
 * @param {string} environmentId - Environment to fish in
 * @param {string} fishId - Target fish ID
 * @param {string} baitId - Bait ID (can be 'plant', 'dead_fish', or a fish ID for live fish)
 * @param {boolean} useConsumable - Whether to use lucky charm
 * @returns {Promise<Object>} Result object
 */
export const attemptFishing = async (environmentId, fishId, baitId, useConsumable = false) => {
  const state = getGameState();
  
  if (!state || state.gameOver) {
    return { success: false, error: 'Game is over' };
  }
  
  // Validate environment access
  if (!canBoatAccessEnvironment(state.boat, environmentId)) {
    return { success: false, error: 'Current boat cannot access this environment' };
  }
  
  const environment = getEnvironmentById(environmentId);
  const fish = getFishById(fishId);
  
  if (!fish || fish.environment !== environmentId) {
    return { success: false, error: 'Invalid fish for this environment' };
  }
  
  // Handle deep sea entry failure (check BEFORE consuming resources)
  if (environmentId === 'deep_sea') {
    if (state.boat !== 'large') {
      return await handleDeepSeaFailure();
    }
    // Large boat has 5% failure chance on entry
    if (Math.random() < 0.05) {
      return await handleDeepSeaFailure();
    }
  }
  
  // Check bait availability and validity
  const baitCheck = validateBait(baitId, fish, state);
  if (!baitCheck.valid) {
    return { success: false, error: baitCheck.error };
  }
  
  // Check consumable
  if (useConsumable && !state.consumables?.lucky_charm) {
    return { success: false, error: 'No lucky charm available' };
  }
  
  // Calculate success rate
  const successRate = calculateSuccessRate(fish, baitId, useConsumable);
  
  // Check for capsize risk (before fishing attempt)
  const capsizeCheck = checkCapsizeRisk(environmentId, state.boat, fish, successRate);
  
  // Roll for success
  const roll = Math.random() * 100;
  const fishingSuccess = roll < successRate;
  
  // Handle capsize (only for bay, happens on fishing failure)
  if (capsizeCheck.risk && !fishingSuccess && capsizeCheck.shouldCapsize) {
    return await handleCapsize(environmentId, state.boat);
  }
  
  // Consume bait
  await consumeBait(baitId, state);
  
  // Consume consumable if used
  if (useConsumable) {
    await updateGameState({
      consumables: {
        ...(state.consumables || {}),
        lucky_charm: Math.max(0, (state.consumables?.lucky_charm || 0) - 1)
      }
    });
  }
  
  if (fishingSuccess) {
    return await handleFishingSuccess(fish);
  } else {
    return {
      success: false,
      caught: false,
      message: 'Fishing failed',
      successRate
    };
  }
};

/**
 * Validate bait for fishing
 */
const validateBait = (baitId, fish, state) => {
  // Check if it's a live fish bait
  if (fish.requiredBaitType === 'live_fish') {
    // Check if specific bait is required (for deep sea fish)
    if (fish.requiredSpecificBait) {
      if (!fish.requiredSpecificBait.includes(baitId)) {
        return { valid: false, error: `This fish requires specific live fish bait: ${fish.requiredSpecificBait.join(', ')}` };
      }
    }
    
    // Check if we have this live fish
    if (!state.liveFishInventory[baitId] || state.liveFishInventory[baitId] <= 0) {
      return { valid: false, error: 'No live fish bait available' };
    }
    
    return { valid: true };
  }
  
  // Check plant bait
  if (baitId === 'plant') {
    if (fish.type !== 'herbivore') {
      return { valid: false, error: 'Plant bait can only catch herbivore fish' };
    }
    if (!state.baitInventory.plant || state.baitInventory.plant <= 0) {
      return { valid: false, error: 'No plant bait available' };
    }
    return { valid: true };
  }
  
  // Check dead fish bait
  if (baitId === 'dead_fish') {
    if (!state.baitInventory.dead_fish || state.baitInventory.dead_fish <= 0) {
      return { valid: false, error: 'No dead fish bait available' };
    }
    return { valid: true };
  }
  
  return { valid: false, error: 'Invalid bait' };
};

/**
 * Consume bait after fishing attempt
 */
const consumeBait = async (baitId, state) => {
  if (baitId === 'plant') {
    await updateGameState({
      baitInventory: {
        ...state.baitInventory,
        plant: Math.max(0, state.baitInventory.plant - 1)
      }
    });
  } else if (baitId === 'dead_fish') {
    await updateGameState({
      baitInventory: {
        ...state.baitInventory,
        dead_fish: Math.max(0, state.baitInventory.dead_fish - 1)
      }
    });
  } else {
    // Live fish bait
    await updateGameState({
      liveFishInventory: {
        ...state.liveFishInventory,
        [baitId]: Math.max(0, (state.liveFishInventory[baitId] || 0) - 1)
      }
    });
  }
};

/**
 * Handle successful fishing
 */
const handleFishingSuccess = async (fish) => {
  const state = getGameState();
  
  // Calculate weight and price
  const weight = fish.weightRange.min + 
    Math.random() * (fish.weightRange.max - fish.weightRange.min);
  const price = Math.floor(fish.basePrice * (1 + weight / 10));
  
  // Update caught fish record
  const caughtFish = state.caughtFish || {};
  const fishRecord = caughtFish[fish.id] || { count: 0, firstCaught: Date.now(), maxWeight: 0 };
  
  caughtFish[fish.id] = {
    count: fishRecord.count + 1,
    firstCaught: fishRecord.firstCaught,
    maxWeight: Math.max(fishRecord.maxWeight, weight)
  };
  
  // Add to live fish inventory if it can be used as bait
  const liveFishInventory = { ...state.liveFishInventory };
  if (fish.canBeBait) {
    liveFishInventory[fish.id] = (liveFishInventory[fish.id] || 0) + 1;
  }
  
  // Update achievements
  const achievements = [...state.achievements];
  let newAchievements = [];
  
  if (fish.id === 'giant_squid' && !achievements.includes('deep_sea_conqueror')) {
    achievements.push('deep_sea_conqueror');
    newAchievements.push('deep_sea_conqueror');
  }
  if (fish.id === 'sperm_whale' && !achievements.includes('deep_sea_hunter')) {
    achievements.push('deep_sea_hunter');
    newAchievements.push('deep_sea_hunter');
  }
  if (fish.id === 'cthulhu' && !achievements.includes('forbidden_touch')) {
    achievements.push('forbidden_touch');
    newAchievements.push('forbidden_touch');
  }
  
  // Update deep sea stage
  let deepSeaStage = state.deepSeaStage;
  if (fish.id === 'giant_squid' && deepSeaStage !== 'completed' && deepSeaStage !== 'ultimate') {
    deepSeaStage = 'completed';
  }
  if (fish.id === 'cthulhu') {
    deepSeaStage = 'ultimate';
  }
  
  await updateGameState({
    caughtFish,
    liveFishInventory,
    achievements,
    deepSeaStage
  });
  
  return {
    success: true,
    caught: true,
    fish: {
      id: fish.id,
      name: fish.name,
      weight: Math.round(weight * 100) / 100,
      price
    },
    newAchievements,
    deepSeaStage
  };
};

/**
 * Handle capsize
 */
const handleCapsize = async (environmentId, boatId) => {
  const state = getGameState();
  
  await updateGameState({
    baitInventory: {
      plant: 0,
      dead_fish: 0
    },
    liveFishInventory: {},
    deathCount: (state.deathCount || 0) + 1
  });
  
  return {
    success: false,
    caught: false,
    capsize: true,
    message: 'Boat capsized! All bait and fish lost. Returned to shore.',
    deathCount: (state.deathCount || 0) + 1
  };
};

/**
 * Handle deep sea failure (game over)
 */
const handleDeepSeaFailure = async () => {
  const state = getGameState();
  
  await updateGameState({
    gameOver: true,
    gameOverReason: 'deep_sea_failure',
    deathCount: (state.deathCount || 0) + 1
  });
  
  return {
    success: false,
    caught: false,
    gameOver: true,
    message: 'Deep sea fishing failed. Game over.',
    reason: 'deep_sea_failure'
  };
};

