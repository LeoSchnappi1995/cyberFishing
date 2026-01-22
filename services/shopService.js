import { getGameState, updateGameState } from './gameState.js';
import { getBoatById } from '../config/boat.js';
import { getBaitById } from '../config/bait.js';
import { getConsumableById } from '../config/consumables.js';

/**
 * Purchase a boat
 */
export const purchaseBoat = async (boatId) => {
  const state = getGameState();
  
  if (state.gameOver) {
    return { success: false, error: 'Game is over' };
  }
  
  const boat = getBoatById(boatId);
  if (!boat) {
    return { success: false, error: 'Invalid boat ID' };
  }
  
  if (state.money < boat.price) {
    return { success: false, error: 'Insufficient funds' };
  }
  
  // Check if already owns this boat or better
  const boatOrder = ['none', 'small', 'medium', 'large'];
  const currentBoatIndex = boatOrder.indexOf(state.boat);
  const newBoatIndex = boatOrder.indexOf(boatId);
  
  if (newBoatIndex <= currentBoatIndex) {
    return { success: false, error: 'Already own this boat or better' };
  }
  
  await updateGameState({
    money: state.money - boat.price,
    boat: boatId
  });
  
  return {
    success: true,
    boat: boatId,
    remainingMoney: state.money - boat.price
  };
};

/**
 * Purchase bait
 */
export const purchaseBait = async (baitId, quantity = 1) => {
  const state = getGameState();
  
  if (state.gameOver) {
    return { success: false, error: 'Game is over' };
  }
  
  const bait = getBaitById(baitId);
  if (!bait || !bait.purchasable) {
    return { success: false, error: 'Invalid or unpurchasable bait' };
  }
  
  const totalCost = bait.price * quantity;
  if (state.money < totalCost) {
    return { success: false, error: 'Insufficient funds' };
  }
  
  await updateGameState({
    money: state.money - totalCost,
    baitInventory: {
      ...state.baitInventory,
      [baitId]: (state.baitInventory[baitId] || 0) + quantity
    }
  });
  
  return {
    success: true,
    baitId,
    quantity,
    remainingMoney: state.money - totalCost
  };
};

/**
 * Purchase consumable
 */
export const purchaseConsumable = async (consumableId, quantity = 1) => {
  const state = getGameState();
  
  if (state.gameOver) {
    return { success: false, error: 'Game is over' };
  }
  
  const consumable = getConsumableById(consumableId);
  if (!consumable) {
    return { success: false, error: 'Invalid consumable' };
  }
  
  const totalCost = consumable.price * quantity;
  if (state.money < totalCost) {
    return { success: false, error: 'Insufficient funds' };
  }
  
  const consumables = state.consumables || {};
  
  await updateGameState({
    money: state.money - totalCost,
    consumables: {
      ...consumables,
      [consumableId]: (consumables[consumableId] || 0) + quantity
    }
  });
  
  return {
    success: true,
    consumableId,
    quantity,
    remainingMoney: state.money - totalCost
  };
};

