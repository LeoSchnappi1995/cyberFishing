import { getFishById } from '../config/fish.js';
import { getBaitById } from '../config/bait.js';

/**
 * Calculate fishing success rate
 * @param {Object} fish - Fish configuration
 * @param {string} baitId - Bait ID
 * @param {boolean} useConsumable - Whether using lucky charm
 * @returns {number} Success rate (0-100)
 */
export const calculateSuccessRate = (fish, baitId, useConsumable = false) => {
  // Base success rate
  let successRate = 60;
  
  // Rod level is always 1 (no upgrade system)
  const rodLevel = 1;
  
  // Adjustment based on difficulty
  const adjustment = (fish.difficulty - rodLevel) * 15;
  successRate -= adjustment;
  
  // Bait bonus
  if (baitId === 'plant' || baitId === 'dead_fish') {
    // Plant and dead fish have no bonus
    successRate += 0;
  } else {
    // Live fish gives +20%
    successRate += 20;
  }
  
  // Consumable bonus
  if (useConsumable) {
    successRate += 10;
  }
  
  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, successRate));
};

/**
 * Check capsize risk
 * @param {string} environmentId - Environment ID
 * @param {string} boatId - Boat ID
 * @param {Object} fish - Fish configuration
 * @param {number} successRate - Calculated success rate
 * @returns {Object} Risk information
 */
export const checkCapsizeRisk = (environmentId, boatId, fish, successRate) => {
  // Only bay and deep_sea have capsize risk
  if (environmentId !== 'bay' && environmentId !== 'deep_sea') {
    return { risk: false };
  }
  
  // Bay capsize rules
  if (environmentId === 'bay') {
    // Only medium boat can capsize in bay
    if (boatId === 'medium' && fish.difficulty >= 5 && successRate < 40) {
      return {
        risk: true,
        shouldCapsize: true,
        message: 'High risk of capsize: Medium boat, difficulty 5+ fish, success rate < 40%'
      };
    }
  }
  
  // Deep sea capsize is handled separately (game over)
  if (environmentId === 'deep_sea') {
    if (boatId !== 'large') {
      return {
        risk: true,
        shouldCapsize: true,
        message: 'Cannot enter deep sea without large boat'
      };
    }
    // 5% failure chance for large boat in deep sea
    return {
      risk: true,
      shouldCapsize: false, // Handled separately
      message: 'Deep sea fishing with large boat has 5% failure risk'
    };
  }
  
  return { risk: false };
};

