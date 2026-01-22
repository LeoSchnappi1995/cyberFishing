// Boat configuration
export const BOAT_CONFIG = {
  none: {
    id: 'none',
    name: '无船',
    price: 0,
    accessibleEnvironments: ['stream', 'river']
  },
  small: {
    id: 'small',
    name: '小船',
    price: 300,
    accessibleEnvironments: ['stream', 'river', 'lake']
  },
  medium: {
    id: 'medium',
    name: '中船',
    price: 600,
    accessibleEnvironments: ['stream', 'river', 'lake', 'bay']
  },
  large: {
    id: 'large',
    name: '大船',
    price: 1200,
    accessibleEnvironments: ['stream', 'river', 'lake', 'bay', 'deep_sea']
  }
};

// Get boat by ID
export const getBoatById = (id) => BOAT_CONFIG[id];

// Check if boat can access environment
export const canBoatAccessEnvironment = (boatId, environment) => {
  const boat = BOAT_CONFIG[boatId];
  if (!boat) return false;
  return boat.accessibleEnvironments.includes(environment);
};

