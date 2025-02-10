import { create } from "zustand";

import { MeshStandardMaterial } from "three";
import PocketBase from "pocketbase";
import { User, Character, UserCharacterExpandedCharacter } from "./apiTypes";
import { ConfiguratorStore, PHOTO_POSES, UI_MODES, Category, Asset } from "./store_types";


const pocketBaseUrl = import.meta.env?.VITE_POCKETBASE_URL;
if (!pocketBaseUrl) {
  throw new Error("VITE_POCKETBASE_URL is required");
}

export const pb = new PocketBase(pocketBaseUrl);


export const useConfiguratorStore = create<ConfiguratorStore>((set, get) => ({
  initialDataLoaded: false,
  fetchInitialData: async () => {
    set({
      initialDataLoaded: false
    })
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const user = await get().fetchUser()
      if (user) {
        await get().fetchUserCharacter(user.id)
        const character = get().character
        if (character) {
          console.log('character', character);
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
  updateUser: async () => {
    // const newUser = await pb.collection('users').update(user.id, user);
    // set({
    //   user: {
    //     ...get().user,
    //     ...newUser
    //   }
    // })
  },
  loadingUser: false,
  loading: false, //true,

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
  fetchUserCharacter: async (user_id: string) => {
    const userCharacter = await pb.collection("user_character").getFirstListItem<UserCharacterExpandedCharacter>(`user_id="${user_id}"`, {
      expand: 'character_id'
    });

    set({ character: userCharacter.expand.character_id });
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
    } catch (error) {
      console.error(error)
    } finally {
      set({ createCharacterLoading: false });
    }
  }
}));

console.log(useConfiguratorStore.getState())
useConfiguratorStore.getState().fetchInitialData()
