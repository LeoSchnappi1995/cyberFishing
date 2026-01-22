// Fish configuration - All fish data
export const FISH_CONFIG = {
  // Stream fish
  small_fish: {
    id: 'small_fish',
    name: '小鱼',
    environment: 'stream',
    difficulty: 1,
    type: 'herbivore', // 植食
    requiredBaitType: 'plant',
    weightRange: { min: 0.1, max: 0.5 },
    basePrice: 10,
    canBeBait: true
  },
  stream_fish: {
    id: 'stream_fish',
    name: '溪鱼',
    environment: 'stream',
    difficulty: 2,
    type: 'herbivore',
    requiredBaitType: 'plant',
    weightRange: { min: 0.3, max: 0.8 },
    basePrice: 25,
    canBeBait: true
  },
  catfish: {
    id: 'catfish',
    name: '鲶鱼',
    environment: 'stream',
    difficulty: 3,
    type: 'carnivore', // 肉食
    requiredBaitType: 'live_fish',
    weightRange: { min: 0.5, max: 2.0 },
    basePrice: 50,
    canBeBait: true
  },
  
  // River fish
  river_carp: {
    id: 'river_carp',
    name: '江鲤',
    environment: 'river',
    difficulty: 2,
    type: 'herbivore',
    requiredBaitType: 'plant',
    weightRange: { min: 0.5, max: 1.5 },
    basePrice: 30,
    canBeBait: true
  },
  river_pike: {
    id: 'river_pike',
    name: '江鲈',
    environment: 'river',
    difficulty: 3,
    type: 'carnivore',
    requiredBaitType: 'live_fish',
    weightRange: { min: 1.0, max: 3.0 },
    basePrice: 60,
    canBeBait: true
  },
  
  // Lake fish
  lake_trout: {
    id: 'lake_trout',
    name: '湖鳟',
    environment: 'lake',
    difficulty: 3,
    type: 'carnivore',
    requiredBaitType: 'live_fish',
    weightRange: { min: 1.5, max: 4.0 },
    basePrice: 80,
    canBeBait: true
  },
  lake_bass: {
    id: 'lake_bass',
    name: '湖鲈',
    environment: 'lake',
    difficulty: 4,
    type: 'carnivore',
    requiredBaitType: 'live_fish',
    weightRange: { min: 2.0, max: 5.0 },
    basePrice: 120,
    canBeBait: true
  },
  
  // Bay fish
  bay_tuna: {
    id: 'bay_tuna',
    name: '海湾金枪鱼',
    environment: 'bay',
    difficulty: 4,
    type: 'carnivore',
    requiredBaitType: 'live_fish',
    weightRange: { min: 5.0, max: 15.0 },
    basePrice: 200,
    canBeBait: true
  },
  bay_shark: {
    id: 'bay_shark',
    name: '大白鲨',
    environment: 'bay',
    difficulty: 5,
    type: 'deep_predator', // 深海掠食
    requiredBaitType: 'live_fish',
    weightRange: { min: 50.0, max: 200.0 },
    basePrice: 500,
    canBeBait: true
  },
  
  // Deep sea fish
  giant_squid: {
    id: 'giant_squid',
    name: '大王乌贼',
    environment: 'deep_sea',
    difficulty: 5,
    type: 'deep_predator',
    requiredBaitType: 'live_fish',
    requiredSpecificBait: ['bay_shark', 'bay_tuna'], // 必须使用指定活鱼
    weightRange: { min: 100.0, max: 300.0 },
    basePrice: 1000,
    canBeBait: true
  },
  sperm_whale: {
    id: 'sperm_whale',
    name: '抹香鲸',
    environment: 'deep_sea',
    difficulty: 5,
    type: 'deep_predator',
    requiredBaitType: 'live_fish',
    requiredSpecificBait: ['giant_squid'],
    weightRange: { min: 500.0, max: 2000.0 },
    basePrice: 2000,
    canBeBait: true
  },
  cthulhu: {
    id: 'cthulhu',
    name: '克苏鲁',
    environment: 'deep_sea',
    difficulty: 6,
    type: 'deep_predator',
    requiredBaitType: 'live_fish',
    requiredSpecificBait: ['sperm_whale'],
    weightRange: { min: 1000.0, max: 5000.0 },
    basePrice: 5000,
    canBeBait: false
  }
};

// Get all fish IDs
export const getAllFishIds = () => Object.keys(FISH_CONFIG);

// Get fish by environment
export const getFishByEnvironment = (environment) => {
  return Object.values(FISH_CONFIG).filter(fish => fish.environment === environment);
};

// Get fish by ID
export const getFishById = (id) => FISH_CONFIG[id];

