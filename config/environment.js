// Environment configuration
export const ENVIRONMENT_CONFIG = {
  stream: {
    id: 'stream',
    name: '溪流',
    unlockCondition: 'default',
    hasCapsizeRisk: false
  },
  river: {
    id: 'river',
    name: '江边',
    unlockCondition: 'default',
    hasCapsizeRisk: false
  },
  lake: {
    id: 'lake',
    name: '湖泊',
    unlockCondition: 'small_boat',
    hasCapsizeRisk: false
  },
  bay: {
    id: 'bay',
    name: '海湾',
    unlockCondition: 'medium_boat',
    hasCapsizeRisk: true
  },
  deep_sea: {
    id: 'deep_sea',
    name: '深海',
    unlockCondition: 'large_boat',
    hasCapsizeRisk: true
  }
};

// Get environment by ID
export const getEnvironmentById = (id) => ENVIRONMENT_CONFIG[id];

// Get all environment IDs
export const getAllEnvironmentIds = () => Object.keys(ENVIRONMENT_CONFIG);

