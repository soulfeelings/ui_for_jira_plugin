import { create } from "zustand";

import { MeshStandardMaterial } from "three";
import PocketBase from "pocketbase";
import {
  User,
  Character,
  UserCharacterExpandedCharacter,
  Level,
  UserLevel,
  UserXp,
} from "./apiTypes";
import {
  PHOTO_POSES,
  UI_MODES,
  Asset,
  CategoryExpandedDefaultAsset,
  Customization,
  LockedGroups,
  UserCharacterCustomization,
} from "./store_types";

const pocketBaseUrl = import.meta.env?.VITE_POCKETBASE_URL;
if (!pocketBaseUrl) {
  throw new Error("VITE_POCKETBASE_URL is required");
}

export const pb = new PocketBase(pocketBaseUrl);

// pb.authStore.onChange((token, model) => {
//   debugger;
//   if (token && model) {
//     localStorage.setItem(
//       "pocketbase_auth",
//       JSON.stringify({ token, record: model })
//     );
//   } else {
//     localStorage.removeItem("pocketbase_auth");
//   }
// }, true);

export const useConfiguratorStore = create<ConfiguratorStore>((set, get) => ({
  // initial data
  initialDataLoadedStatus: "need_auth",
  character: null,
  user: null,
  user_character_id: null,
  user_level: null,
  user_xp: null,
  levels: [],
  categories: [],
  isMobile: window.innerWidth < 768,
  selectedAsset: null,
  userCharacterCustomization: null,
  mode: UI_MODES.SHOP,
  pose: PHOTO_POSES.Idle,
  currentCategory: null,
  assets: [],
  lockedGroups: {},
  skin: new MeshStandardMaterial({ color: 0xf5c6a5, roughness: 1 }),
  cantAffordSelectedItem: false,

  // loading states
  loading: false,
  loadingCharacter: false,
  loadingUser: false,
  loadingCategories: false,
  loadingLevels: false,
  loadingUserLevel: false,
  loadingUserXp: false,
  loadingAssets: false,
  loadingUserCharacterCustomization: false,
  loadingName: false,
  loadingCreateCharacter: false,

  // setters
  setCurrentCategory: (category: CategoryExpandedDefaultAsset) =>
    set({ currentCategory: category }),
  setUserCharacterCustomization: (customization: UserCharacterCustomization) =>
    set({ userCharacterCustomization: customization }),
  setUserLevel: (level: UserLevel) => set({ user_level: level }),
  setUserXp: (xp: UserXp) => set({ user_xp: xp }),
  setLevels: (levels: Level[]) => set({ levels }),
  setIsMobile: (isMobile: boolean) => set({ isMobile }),
  setAssets: (assets: Asset[]) => set({ assets }),
  setSelectedAsset: (asset: Asset | null) => set({ selectedAsset: asset }),
  setCantAffordSelectedItem: (cantAffordSelectedItem: boolean) =>
    set({ cantAffordSelectedItem }),

  // controller methods
  fetchLevels: async () => {
    set({ loadingLevels: true });
    try {
      const levels = await pb.collection("user_levels").getFullList<Level>({
        sort: "level",
      });
      set({ levels });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingLevels: false });
    }
  },
  fetchInitialData: async () => {
    set({
      initialDataLoadedStatus: "loading",
    });
    try {
      // await new Promise(resolve => setTimeout(resolve, 2000));
      const user = await get().fetchUser();

      if (!user) {
        set({
          initialDataLoadedStatus: "need_auth",
        });
        return;
      }

      try {
        await get().fetchUserCharacter(user.id);
      } catch (error) {
        set({
          initialDataLoadedStatus: "need_character",
        });
        return;
      }

      const userCharacterId = get().user_character_id;
      if (userCharacterId) {
        console.log("userCharacterId", userCharacterId);

        await Promise.all([
          get().fetchCategories(),
          get().fetchUserCharacterCustomization(userCharacterId),
          get().fetchAssets(),
          get().fetchLevels(),
          get().fetchUserLevel(),
          get().fetchUserXp(),
        ]);

        const userCharacterCustomization = get().userCharacterCustomization;
        if (!userCharacterCustomization && userCharacterId) {
          const categories = get().categories;
          await get().createUserCharacterCustomization(
            userCharacterId,
            categories.reduce(
              (acc, category) => ({
                ...acc,
                [category.name]: {
                  asset: category.expand.default_asset_id,
                  color: "#000000",
                },
              }),
              {}
            )
          );
        }
      }
      set({
        initialDataLoadedStatus: "loaded",
      });
    } catch (error) {
      console.error(error);
    }
  },
  fetchUserLevel: async () => {
    set({ loadingUserLevel: true });
    try {
      const userLevel = await pb
        .collection("user_level")
        .getFirstListItem<UserLevel>(`user_id="${get().user?.id}"`);
      set({ user_level: userLevel });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingUserLevel: false });
    }
  },
  fetchUserXp: async () => {
    set({ loadingUserXp: true });
    try {
      const userXp = await pb
        .collection("user_xp")
        .getFirstListItem<UserXp>(`user_id="${get().user?.id}"`);
      set({ user_xp: userXp });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingUserXp: false });
    }
  },
  updateUserXp: async (newXp: number) => {
    const userXpId = get().user_xp?.id;
    if (!userXpId) {
      throw new Error("User XP ID not found");
    }
    set({ loadingUserXp: true });
    try {
      const userXp = await pb
        .collection("user_xp")
        .update<UserXp>(userXpId, { xp: newXp });
      set({ user_xp: userXp });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingUserXp: false });
    }
  },

  fetchCategories: async () => {
    set({ loadingCategories: true });
    try {
      const records = await pb
        .collection("category")
        .getFullList<CategoryExpandedDefaultAsset>({
          sort: "-created",
          expand: "default_asset_id",
        });

      set({ categories: records });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingCategories: false });
    }
  },
  fetchUserCharacter: async (user_id: string) => {
    const userCharacter = await pb
      .collection("user_character")
      .getFirstListItem<UserCharacterExpandedCharacter>(
        `user_id="${user_id}"`,
        {
          expand: "character_id",
        }
      );

    set({
      character: userCharacter.expand.character_id,
      user_character_id: userCharacter.id,
    });
  },

  updateCharacter: async (character: Character) => {
    const newCharacter = await pb
      .collection("characters")
      .update<Character>(character.id, character);
    set({ character: newCharacter });
  },

  setMode: (mode: (typeof UI_MODES)[keyof typeof UI_MODES]) => {
    set({ mode });
    if (mode === UI_MODES.CUSTOMIZE) {
      set({ pose: PHOTO_POSES.Idle });
    }
  },
  updateSkin: (color: string) => {
    get().skin.color.set(color);
  },
  fetchUser: async () => {
    set({ loadingUser: true });
    let user: User | undefined;
    try {
      if (pb.authStore.isValid) {
        const response = await pb.collection("users").authRefresh<User>();
        user = response.record;
      }
      set({ user });
    } catch (error) {
      console.error(error);
      pb.authStore.clear();
    } finally {
      set({ loadingUser: false });
    }
    return user;
  },
  logout: () => {
    pb.authStore.clear();
    window.location.reload();
  },

  saveName: async (name) => {
    set({ loadingName: true });
    const data = {
      name,
    };
    try {
      await pb.collection("characters").create(data);
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingName: false });
    }
  },
  createCharacter: async (name: string) => {
    set({ loadingCreateCharacter: true });

    try {
      const authData = pb.authStore.model;
      if (!authData?.id) {
        throw new Error("User not authenticated");
      }

      const hardCodedCharacter = await pb
        .collection("characters")
        .getOne("z5s1a3a7508ec28");

      const character = await pb
        .collection("user_character")
        .create<UserCharacterExpandedCharacter>(
          {
            user_id: authData.id,
            character_id: hardCodedCharacter.id,
            name,
          },
          {
            expand: "character_id",
          }
        );

      set({ character: character.expand.character_id });

      await pb.collection("user_level").create({
        user_id: authData.id,
        level: 1,
      });

      await pb.collection("user_xp").create({
        user_id: authData.id,
        xp: 0,
      });
    } catch (error) {
      console.error("Create character error:", error);
      throw error;
    } finally {
      set({ loadingCreateCharacter: false });
    }
  },
  fetchAssets: async () => {
    set({ loadingAssets: true });
    try {
      const assets = await pb.collection("assets").getFullList<Asset>({
        sort: "-created",
      });

      set({ assets });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingAssets: false });
    }
  },
  fetchUserCharacterCustomization: async (user_character_id: string) => {
    set({ loadingUserCharacterCustomization: true });
    try {
      const customization = await pb
        .collection("character_customization_json")
        .getFirstListItem<UserCharacterCustomization>(
          `user_character_id="${user_character_id}"`
        );
      set({ userCharacterCustomization: customization });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingUserCharacterCustomization: false });
    }
  },
  updateUserCharacterCustomization: async (
    user_character_id: string,
    customization: Customization
  ) => {
    set({ loadingUserCharacterCustomization: true });
    try {
      const userXp = get().user_xp;
      const selectedAsset = get().selectedAsset;
      if (!userXp || !selectedAsset) {
        throw new Error("User XP or selected asset not found");
      }
      if (userXp.xp < selectedAsset.price) {
        set({ cantAffordSelectedItem: true });
        alert("User cant afford this item");
        return;
      }

      const restUserXp = userXp.xp - selectedAsset.price;
      if (restUserXp !== 0) {
        await get().updateUserXp(restUserXp);
      }

      const updated = await pb
        .collection("character_customization_json")
        .update<UserCharacterCustomization>(user_character_id, {
          customization: JSON.stringify(customization),
        });
      set({ userCharacterCustomization: { ...updated } });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingUserCharacterCustomization: false });
    }
  },
  createUserCharacterCustomization: async (
    user_character_id: string,
    customization: Customization
  ) => {
    set({ loadingUserCharacterCustomization: true });
    try {
      const created = await pb
        .collection("character_customization_json")
        .create<UserCharacterCustomization>({
          user_character_id,
          customization: JSON.stringify(customization),
        });
      set({ userCharacterCustomization: { ...created } });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingUserCharacterCustomization: false });
    }
  },
}));

useConfiguratorStore.getState().fetchInitialData();

const debounce = (func: () => void, delay: number) => {
  let timeout: number;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  };
};
const checkIsMobileDebounced = debounce(() => {
  useConfiguratorStore.getState().setIsMobile(window.innerWidth < 768);
}, 100);

window.addEventListener("resize", checkIsMobileDebounced);

export interface ConfiguratorStore {
  [x: string]: any;
  // initial data
  initialDataLoadedStatus?:
    | "need_auth"
    | "need_character"
    | "loaded"
    | "loading";
  character: Character | null;
  user_character_id: string | null;
  user: User | null;
  user_level: UserLevel | null;
  user_xp: UserXp | null;
  levels: Level[] | null;
  categories: CategoryExpandedDefaultAsset[];
  isMobile: boolean;
  assets: Asset[];
  selectedAsset: Asset | null;
  userCharacterCustomization: UserCharacterCustomization | null;
  pose: (typeof PHOTO_POSES)[keyof typeof PHOTO_POSES];
  currentCategory: CategoryExpandedDefaultAsset | null;
  lockedGroups: LockedGroups;
  skin: MeshStandardMaterial;
  mode: (typeof UI_MODES)[keyof typeof UI_MODES];
  cantAffordSelectedItem: boolean;

  // loading states
  loading: boolean;
  loadingCharacter: boolean;
  loadingUser: boolean;
  loadingCategories: boolean;
  loadingLevels: boolean;
  loadingUserLevel: boolean;
  loadingUserXp: boolean;
  loadingAssets: boolean;
  loadingUserCharacterCustomization: boolean;
  loadingName: boolean;
  loadingCreateCharacter: boolean;

  // controller methods
  fetchInitialData: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchAssets: () => Promise<void>;
  fetchLevels: () => Promise<void>;
  fetchUserLevel: () => Promise<void>;
  fetchUserXp: () => Promise<void>;
  updateUserXp: (newXp: number) => Promise<void>;
  fetchUserCharacterCustomization: (user_character_id: string) => Promise<void>;
  updateUserCharacterCustomization: (
    user_character_id: string,
    customization: Customization
  ) => Promise<void>;
  createUserCharacterCustomization: (
    user_character_id: string,
    customization: Customization
  ) => Promise<void>;
  fetchUser: () => Promise<User | undefined>;
  fetchUserCharacter: (user_id: string) => Promise<void>;
  createCharacter: (name: string) => Promise<void>;
  updateCharacter: (character: Character) => Promise<void>;
  saveName: (name: string) => Promise<void>;

  // setters
  setCurrentCategory: (category: CategoryExpandedDefaultAsset) => void;
  setUserCharacterCustomization: (
    customization: UserCharacterCustomization
  ) => void;
  setIsMobile: (isMobile: boolean) => void;
  setAssets: (assets: Asset[]) => void;
  setSelectedAsset: (asset: Asset | null) => void;
  setMode: (mode: (typeof UI_MODES)[keyof typeof UI_MODES]) => void;
}
