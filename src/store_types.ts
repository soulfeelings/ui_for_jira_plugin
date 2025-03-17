export const PHOTO_POSES = {
  Idle: 'Idle',
  Chill: 'Chill',
  Cool: 'Cool',
  Punch: 'Punch',
  Ninja: 'Ninja',
  King: 'King',
  Busy: 'Busy',
};

export const UI_MODES = {
  PHOTO: 'photo',
  CUSTOMIZE: 'customize',
  LEVEL: 'level',
  SHOP: 'shop',
};

export interface CategoryExpandedDefaultAsset {
  id: string;
  name: string;
  default_asset_id: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  cameraPlacementJSON: {
    start: { x: number; y: number; z: number };
    target: { x: number; y: number; z: number };
  };
  expand: {
    default_asset_id: {
      id: string;
      name: string;
      group: string;
      lockedGroups?: string[];
    };
  };
}

export interface Asset {
  id: string;
  name: string;
  image: string;
  file: string;
  category_id: string;
  price: number;
  default_color_id: string;
  createdAt: string;
  updatedAt: string;
  expand?: {
    default_color?: {
      id: string;
      name: string;
    };
  };
}

export interface Color {
  id: string;
  name: string;
  hex_value: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customization {
  [key: string]: {
    asset: Asset | null;
    color: string;
  };
}

export interface LockedGroups {
  [key: string]: Array<{
    name: string;
    categoryName: string;
  }>;
}

export interface ApiUserCharacterCustomization {
  id: string;
  user_character_id: string;
  customization: string; // a json field
  created: string;
  updated: string;
}

export interface UserCharacterCustomization {
  id: string;
  user_character_id: string;
  customization: Customization;
  created: string;
  updated: string;
}
