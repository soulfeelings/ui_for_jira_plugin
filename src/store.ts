import { create } from "zustand";

import { MeshStandardMaterial } from "three";
import { randInt } from "three/src/math/MathUtils.js";
import PocketBase from "pocketbase";
import { User, Character } from "./apiTypes";

const pocketBaseUrl = import.meta.env?.VITE_POCKETBASE_URL;
if (!pocketBaseUrl) {
  throw new Error("VITE_POCKETBASE_URL is required");
}

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

export const pb = new PocketBase(pocketBaseUrl);


interface Category {
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

interface Asset {
  id: string;
  name: string;
  group: string;
  lockedGroups?: string[];
}

interface Customization {
  [key: string]: {
    asset: Asset | null;
    color: string;
  };
}

interface LockedGroups {
  [key: string]: Array<{
    name: string;
    categoryName: string;
  }>;
}

interface ConfiguratorStore {
  initialDataLoaded: boolean;
  fetchInitial: () => Promise<void>;
  character: Character;
  loadingCharacter: boolean;
  updateCharacter: (character: Character) => Promise<void>;
  user: User;
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
  fetchInitialData: () => Promise<void>;
  setCurrentCategory: (category: Category) => void;
  changeAsset: (category: string, asset: Asset | null) => void;
  randomize: () => void;
  applyLockedAssets: () => void;
  loadingName: boolean;
  saveName: (name: string) => Promise<void>;
}


export const useConfiguratorStore = create<ConfiguratorStore>((set, get) => ({
  initialDataLoaded: false,
  fetchInitial: async () => {
    set({
      initialDataLoaded: false
    })
    try {
      await get().fetchInitialData()
    } catch (error) {
      console.error(error)
    } finally {
      set({
        initialDataLoaded: true
      })
    }
  },
  character: {
    id: '',
    name: '',
    createdAt: '',
  },
  loadingCharacter: false,
  updateCharacter: async (character: Character) => {
    const newCharacter = await pb.collection('characters').update<Character>(character.id, character);
    set({ character: newCharacter })
  },
  user: {
    id: '',
    email: '',
    name: '',
    avatar: '',
    jira_id: '',
    createdAt: '',
    updatedAt: '',
  },
  updateUser: async (user: User) => {
    const newUser = await pb.collection('users').update(user.id, user);
    set({
      user: {
        ...get().user,
        ...newUser
      }
    })
  },
  loadingUser: false,

  loading: true,
  mode: UI_MODES.CUSTOMIZE,
  setMode: (mode: typeof UI_MODES[keyof typeof UI_MODES]) => {
    set({ mode });
    if (mode === UI_MODES.CUSTOMIZE) {
      set({ pose: PHOTO_POSES.Idle });
    }
  },
  pose: PHOTO_POSES.Idle,
  setPose: (pose: typeof PHOTO_POSES[keyof typeof PHOTO_POSES]) => set({ pose }),
  categories: [],
  currentCategory: null,
  assets: [],
  lockedGroups: {},
  skin: new MeshStandardMaterial({ color: 0xf5c6a5, roughness: 1 }),
  customization: {},
  download: () => { },
  setDownload: (download: () => void) => set({ download }),
  screenshot: () => { },
  setScreenshot: (screenshot: () => void) => set({ screenshot }),
  updateColor: (color: string) => {
    set((state) => ({
      customization: {
        ...state.customization,
        [state.currentCategory?.name || '']: {
          ...state.customization[state.currentCategory?.name || ''],
          color,
        },
      },
    }));
    if (get().currentCategory?.name === "Head") {
      get().updateSkin(color);
    }
  },
  updateSkin: (color) => {
    get().skin.color.set(color);
  },
  fetchInitialData: async () => {
    // you can also fetch all records at once via getFullList
    const user = await pb.collection("users").authWithPassword('test@test.com', 'testtest');
    // const categories = await pb.collection("category").getFullList();
    // const assets = await pb.collection("assets").getFullList();
    console.log('user', user);
    // console.log('categories', categories);
    // console.log('assets', assets);


    // const customization = await pb.collection("character_customization").getOne();
    // const customization = {};
    // categories.forEach((category) => {
    //   category.assets = assets.filter((asset) => asset.group === category.id);
    //   customization[category.name] = {
    //     color: category.expand?.colorPalette?.colors?.[0] || "",
    //   };
    //   if (category.startingAsset) {
    //     customization[category.name].asset = category.assets.find(
    //       (asset) => asset.id === category.startingAsset
    //     );
    //   }
    // });

    set({
      categories: [],
      currentCategory: null,
      assets: [],
      customization: {},
      loading: false,
    });
    get().applyLockedAssets();
  },
  setCurrentCategory: (category: Category | null) => set({ currentCategory: category }),
  changeAsset: (category: string, asset: Asset | null) => {
    set((state) => ({
      customization: {
        ...state.customization,
        [category]: {
          ...state.customization[category],
          asset,
        },
      },
    }));
    get().applyLockedAssets();
  },
  randomize: () => {
    // const customization = {};
    // get().categories.forEach((category) => {
    //   let randomAsset = category.assets[randInt(0, category.assets.length - 1)];
    //   if (category.removable) {
    //     if (randInt(0, category.assets.length - 1) === 0) {
    //       randomAsset = { id: };
    //     }
    //   }
    //   const randomColor =
    //     category.expand?.colorPalette?.colors?.[
    //     randInt(0, category.expand.colorPalette.colors.length - 1)
    //     ];
    //   customization[category.name] = {
    //     asset: randomAsset,
    //     color: randomColor,
    //   };
    //   if (category.name === "Head") {
    //     get().updateSkin(randomColor);
    //   }
    // });
    // set({ customization });
    // get().applyLockedAssets();
  },

  applyLockedAssets: () => {
    // const customization = get().customization;
    // const categories = get().categories;
    // const lockedGroups = {};

    // Object.values(customization).forEach((category) => {
    //   if (category.asset?.lockedGroups) {
    //     category.asset.lockedGroups.forEach((group) => {
    //       const categoryName = categories.find(
    //         (category) => category.id === group
    //       ).name;
    //       if (!lockedGroups[categoryName]) {
    //         lockedGroups[categoryName] = [];
    //       }
    //       const lockingAssetCategoryName = categories.find(
    //         (cat) => cat.id === category.asset.group
    //       ).name;
    //       lockedGroups[categoryName].push({
    //         name: category.asset.name,
    //         categoryName: lockingAssetCategoryName,
    //       });
    //     });
    //   }
    // });

    // set({ lockedGroups });
  },
  loadingName: false,
  saveName: async (name) => {
    set({ loadingName: true });
    const data = {
      name,
    }
    try {
      await pb.collection('characters').create(data);
    } catch (error) {
      console.error(error)
    } finally {
      set({ loadingName: false });
    }
  },
}));

console.log(useConfiguratorStore.getState())
// useConfiguratorStore.getState().fetchInitial()
