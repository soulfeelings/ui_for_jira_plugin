
import { Level, User, UserLevel, UserXp } from "./apiTypes";
import { Character } from "./apiTypes";
import { MeshStandardMaterial } from "three";
export const PHOTO_POSES = {
    Idle: "Idle",
    Chill: "Chill",
    Cool: "Cool",
    Punch: "Punch",
    Ninja: "Ninja",
    King: "King",
    Busy: "Busy",
};

export const UI_MODES = {
    PHOTO: "photo",
    CUSTOMIZE: "customize",
    LEVEL: "level",
};


export interface CategoryExpandedDefaultAsset {
    id: string;
    name: string;
    default_asset_id: string;
    createdAt: string;
    updatedAt: string;
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

export interface ConfiguratorStore {
    // initial data
    initialDataLoaded: boolean;
    character: Character | null;
    user: User | null;
    user_level: UserLevel | null;
    user_xp: UserXp | null;
    levels: Level[] | null;
    categories: CategoryExpandedDefaultAsset[];

    // loading states
    loading: boolean;
    loadingCharacter: boolean;
    loadingUser: boolean;
    loadingCategories: boolean;
    loadingLevels: boolean;
    loadingUserLevel: boolean;
    loadingUserXp: boolean;

    // controller methods
    fetchInitialData: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    fetchLevels: () => Promise<void>;
    fetchUserLevel: () => Promise<void>;
    fetchUserXp: () => Promise<void>;

    // setters
    setCurrentCategory: (category: CategoryExpandedDefaultAsset) => void;
    setCustomization: (customization: Customization) => void;

    updateCharacter: (character: Character) => Promise<void>;
    updateUser: (user: User) => Promise<void>;
    mode: typeof UI_MODES[keyof typeof UI_MODES];
    setMode: (mode: typeof UI_MODES[keyof typeof UI_MODES]) => void;
    pose: typeof PHOTO_POSES[keyof typeof PHOTO_POSES];
    setPose: (pose: typeof PHOTO_POSES[keyof typeof PHOTO_POSES]) => void;
    currentCategory: CategoryExpandedDefaultAsset | null;
    assets: Asset[];
    lockedGroups: LockedGroups;
    skin: MeshStandardMaterial;
    customization: Customization;
    download: () => void;
    setDownload: (download: () => void) => void;
    screenshot: () => void;
    setScreenshot: (screenshot: () => void) => void;
    updateColor: (color: string) => void;
    updateSkin: (color: string) => void;
    fetchUser: () => Promise<User | undefined>;
    userLoading: boolean;
    changeAsset: (category: string, asset: Asset | null) => void;
    randomize: () => void;
    applyLockedAssets: () => void;
    loadingName: boolean;
    saveName: (name: string) => Promise<void>;
    createCharacter: (name: string) => Promise<void>;
    createCharacterLoading: boolean;
    fetchUserCharacter: (user_id: string) => Promise<void>;
}