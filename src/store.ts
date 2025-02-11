import { create } from "zustand";

import { MeshStandardMaterial } from "three";
import PocketBase from "pocketbase";
import { User, Character, UserCharacterExpandedCharacter, Level, UserLevel, UserXp } from "./apiTypes";
import { ConfiguratorStore, PHOTO_POSES, UI_MODES, Asset, CategoryExpandedDefaultAsset, Customization } from "./store_types";


const pocketBaseUrl = import.meta.env?.VITE_POCKETBASE_URL;
if (!pocketBaseUrl) {
  throw new Error("VITE_POCKETBASE_URL is required");
}

export const pb = new PocketBase(pocketBaseUrl);


export const useConfiguratorStore = create<ConfiguratorStore>((set, get) => ({
  // initial data
  initialDataLoaded: false,
  character: null,
  user: null,
  user_level: null,
  user_xp: null,
  levels: [],
  categories: [],

  // loading states
  loading: false,
  loadingCharacter: false,
  loadingUser: false,
  loadingCategories: false,
  loadingLevels: false,
  loadingUserLevel: false,
  loadingUserXp: false,

  // setters
  setCurrentCategory: (category: CategoryExpandedDefaultAsset) => set({ currentCategory: category }),
  setCustomization: (customization: Customization) => set({ customization }),
  setUserLevel: (level: UserLevel) => set({ user_level: level }),
  setUserXp: (xp: UserXp) => set({ user_xp: xp }),
  setLevels: (levels: Level[]) => set({ levels }),

  // controller methods
  fetchLevels: async () => {
    set({ loadingLevels: true });
    try {
      const levels = await pb.collection('user_levels').getFullList<Level>({
        sort: 'level'
      });
      set({ levels });
    } catch (error) {
      console.error(error)
    } finally {
      set({ loadingLevels: false });
    }
  },
  fetchInitialData: async () => {
    set({
      initialDataLoaded: false
    })
    try {
      // await new Promise(resolve => setTimeout(resolve, 2000));
      const user = await get().fetchUser()
      console.log('user', user);
      if (user) {
        await get().fetchUserCharacter(user.id)
        const character = get().character
        if (character) {
          console.log('character', character);
          await Promise.all([
            get().fetchCategories(),
            get().fetchLevels(),
            get().fetchUserLevel(),
            get().fetchUserXp()
          ]);
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      set({
        initialDataLoaded: true
      })
    }
  },
  fetchUserLevel: async () => {
    set({ loadingUserLevel: true });
    try {
      const userLevel = await pb.collection('user_level').getFirstListItem<UserLevel>(`user_id="${get().user?.id}"`);
      set({ user_level: userLevel });
    } catch (error) {
      console.error(error)
    } finally {
      set({ loadingUserLevel: false });
    }
  },
  fetchUserXp: async () => {
    set({ loadingUserXp: true });
    try {
      const userXp = await pb.collection('user_xp').getFirstListItem<UserXp>(`user_id="${get().user?.id}"`);
      set({ user_xp: userXp });
    } catch (error) {
      console.error(error)
    } finally {
      set({ loadingUserXp: false });
    }
  },

  fetchCategories: async () => {
    set({ loadingCategories: true });
    try {
      const records = await pb.collection('category').getFullList<CategoryExpandedDefaultAsset>({
        sort: '-created',
        expand: 'default_asset_id'
      });

      set({ categories: records });
      get().setCustomization(records.reduce((acc, category) => ({
        ...acc,
        [category.name]: {
          asset: category.expand.default_asset_id,
          color: '#000000'
        }
      }), {}))
    } catch (error) {
      console.error(error)
    } finally {
      set({ loadingCategories: false });
    }
  },
  fetchUserCharacter: async (user_id: string) => {
    const userCharacter = await pb.collection("user_character").getFirstListItem<UserCharacterExpandedCharacter>(`user_id="${user_id}"`, {
      expand: 'character_id'
    });

    set({ character: userCharacter.expand.character_id });
  },

  updateCharacter: async (character: Character) => {
    const newCharacter = await pb.collection('characters').update<Character>(character.id, character);
    set({ character: newCharacter })
  },

  updateUser: async () => {
    // const newUser = await pb.collection('users').update(user.id, user);
    // set({
    //   user: {
    //     ...get().user,
    //     ...newUser
    //   }
    // })
  },

  mode: UI_MODES.LEVEL,
  setMode: (mode: typeof UI_MODES[keyof typeof UI_MODES]) => {
    set({ mode });
    if (mode === UI_MODES.CUSTOMIZE) {
      set({ pose: PHOTO_POSES.Idle });
    }
  },
  pose: PHOTO_POSES.Idle,
  setPose: (pose: typeof PHOTO_POSES[keyof typeof PHOTO_POSES]) => set({ pose }),
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
  fetchUser: async () => {
    set({ userLoading: true });
    let user: User | undefined;
    try {
      const respone = await pb.collection("users").authWithPassword<User>('test@test.com', 'testtest');
      user = respone.record;
      console.log('user', user);
      set({ user });
    } catch (error) {
      console.error(error)
    } finally {
      set({ userLoading: false });
    }

    return user;
  },
  userLoading: false,
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
  createCharacterLoading: false,
  createCharacter: async (name: string) => {
    set({ createCharacterLoading: true });

    try {
      const user = get().user;
      if (!user) {
        throw new Error('User not found or not loaded');
      }
      const hardCodedCharacter = await pb.collection('characters').getOne('z5s1a3a7508ec28');
      const character = await pb.collection('user_character').create<UserCharacterExpandedCharacter>({
        user_id: user.id,
        character_id: hardCodedCharacter.id,
        name,
      }, {
        expand: 'character_id'
      });

      set({ character: character.expand.character_id });
      await pb.collection('user_level').create({
        user_id: user.id,
        level: 1,
      });
      await pb.collection('user_xp').create({
        user_id: user.id,
        xp: 0,
      });
    } catch (error) {
      console.error(error)
    } finally {
      set({ createCharacterLoading: false });
    }
  },
}));

console.log(useConfiguratorStore.getState())
useConfiguratorStore.getState().fetchInitialData()
