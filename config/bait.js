// Bait configuration
export const BAIT_CONFIG = {
  plant: {
    id: 'plant',
    name: '植物性饵料',
    type: 'plant',
    purchasable: true,
    storable: true,
    price: 5,
    successBonus: 0
  },
  dead_fish: {
    id: 'dead_fish',
    name: '鱼块（死鱼）',
    type: 'dead_fish',
    purchasable: true,
    storable: true,
    price: 15,
    successBonus: 0
  }
  // Live fish are not in config - they come from caught fish
};

// Get all purchasable bait IDs
export const getPurchasableBaitIds = () => {
  return Object.values(BAIT_CONFIG)
    .filter(bait => bait.purchasable)
    .map(bait => bait.id);
};

// Get bait by ID
export const getBaitById = (id) => BAIT_CONFIG[id];

