// Achievement/Title configuration
export const ACHIEVEMENT_CONFIG = {
  beginner_angler: {
    id: 'beginner_angler',
    name: '初心钓手',
    unlockCondition: 'game_start'
  },
  bay_adventurer: {
    id: 'bay_adventurer',
    name: '海湾冒险者',
    unlockCondition: 'enter_bay'
  },
  deep_sea_explorer: {
    id: 'deep_sea_explorer',
    name: '深海探路者',
    unlockCondition: 'enter_deep_sea'
  },
  deep_sea_conqueror: {
    id: 'deep_sea_conqueror',
    name: '深海征服者',
    unlockCondition: 'catch_giant_squid'
  },
  deep_sea_hunter: {
    id: 'deep_sea_hunter',
    name: '深海猎人',
    unlockCondition: 'catch_sperm_whale'
  },
  forbidden_touch: {
    id: 'forbidden_touch',
    name: '禁忌之触',
    unlockCondition: 'catch_cthulhu'
  }
};

// Get achievement by ID
export const getAchievementById = (id) => ACHIEVEMENT_CONFIG[id];

