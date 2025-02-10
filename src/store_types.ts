
import { User, UserCharacterExpandedCharacter } from "./apiTypes";
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
};


export interface Category {
    id: string;
    name: string;
    removable?: boolean;
    assets: Asset[];
    expand?: {
        colorPalette?: {
            colors: string[];
        };
    };
}

export interface Asset {
    id: string;
    name: string;
    group: string;
    lockedGroups?: string[];
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

    // methods
    fetchInitialData: () => Promise<void>;
    loadingCharacter: boolean;
    updateCharacter: (character: Character) => Promise<void>;
    updateUser: (user: User) => Promise<void>;
    loadingUser: boolean;
    loading: boolean;
    mode: typeof UI_MODES[keyof typeof UI_MODES];
    setMode: (mode: typeof UI_MODES[keyof typeof UI_MODES]) => void;
    pose: typeof PHOTO_POSES[keyof typeof PHOTO_POSES];
    setPose: (pose: typeof PHOTO_POSES[keyof typeof PHOTO_POSES]) => void;
    categories: Category[];
    currentCategory: Category | null;
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
    setCurrentCategory: (category: Category) => void;
    changeAsset: (category: string, asset: Asset | null) => void;
    randomize: () => void;
    applyLockedAssets: () => void;
    loadingName: boolean;
    saveName: (name: string) => Promise<void>;
    createCharacter: (name: string) => Promise<void>;
    createCharacterLoading: boolean;
    fetchUserCharacter: (user_id: string) => Promise<void>;
}