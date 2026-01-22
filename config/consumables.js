// Consumables configuration
export const CONSUMABLE_CONFIG = {
  lucky_charm: {
    id: 'lucky_charm',
    name: '幸运符',
    price: 50,
    successBonus: 10 // +10% success rate
  }
};

// Get consumable by ID
export const getConsumableById = (id) => CONSUMABLE_CONFIG[id];

