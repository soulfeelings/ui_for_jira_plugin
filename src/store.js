import { create } from "zustand";

import { MeshStandardMaterial } from "three";
import { randInt } from "three/src/math/MathUtils.js";
// import PocketBase from "pocketbase";

// const pocketBaseUrl = import.meta.env.VITE_POCKETBASE_URL;
// if (!pocketBaseUrl) {
//   throw new Error("VITE_POCKETBASE_URL is required");
// }

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

// mock
class PocketBase {
  url;
  tempResultPromise;
  mockData = {
    character: {
      name: '',
    },
    user: {
      points: 0,
      currentLevel: 0,
      nextLevel: 1,
      nextLevelPoints: 1000,
    }
  };

  files = {
    getUrl(_, url) {
      return '/assets/' + url;
    }
  }

  constructor(url) {
    this.url = url;
    if (window.localStorage.getItem('mockData')) {
      this.mockData = JSON.parse(window.localStorage.getItem('mockData'));
    }

    /**
     * Comands examples
     * window.dispatchEvent(new CustomEvent("mockevent", { detail: { type: "taskIsDone", value: 120  } }))
     */
    window.addEventListener('mockevent', async (event) => {
      const data = event.detail
      switch (data.type) {
        case 'taskIsDone':
          const points = data.value
          const newPoints = useConfiguratorStore.getState().user.points + points
          await useConfiguratorStore.getState().updateUser({
            points: newPoints
          });
          this.mockData.user.points = newPoints
          break;
        default:
          break;
      }
    })
  }

  collection(name) {
    switch (name) {
      case 'CustomizationGroups':
        this.tempResultPromise = import('./mock/CustomizationGroups.json')
        return this;
      case 'CustomizationAssets':
        this.tempResultPromise = import('./mock/CustomizationAssets.json')
        return this;
      default:
        return this;
    }
  }

  async getFullList() {
    return await this.tempResultPromise.then(response => response.items);
  }

  async getCharacter() {
    return await new Promise(res => {
      setTimeout(() => {
        res(this.mockData.character)
      }, 1000)
    });
  }

  async saveCharacter(character) {
    return await new Promise(res => {
      setTimeout(() => {
        this.mockData.character = { ...this.mockData.character, ...character };
        res(this.mockData.character);
      }, 1000)
    });
  }

  async getUser() {
    return await new Promise(res => {
      setTimeout(() => {
        res(this.mockData.user)
      }, 1000)
    });
  }

  async saveUser(user) {
    return await new Promise(res => {
      setTimeout(() => {
        this.mockData.user = { ...this.mockData.user, ...user };
        res(this.mockData.user)
      }, 1000)
    });
  }
}

export const pb = new PocketBase();

export const useConfiguratorStore = create((set, get) => ({
  initialDataLoaded: false,
  fetchInitial: async () => {
    set({
      initialDataLoaded: false
    })
    try {
      await Promise.all([
        get().fetchUser(),
        get().fetchCharacter(),
        get().fetchCategories()
      ]);
    } catch (error) {
      console.error(error)
    } finally {
      set({
        initialDataLoaded: true
      })
    }
  },
  character: {
    name: null,
  },
  loadingCharacter: false,
  updateCharacter: async (character) => {
    const newCharacter = await pb.saveCharacter(character);
    set({ character: newCharacter })
  },
  user: {
    points: null,
    currentLevel: null,
    nextLevel: null,
    nextLevelPoints: null,
  },
  updateUser: async (user) => {
    debugger
    const newUser = await pb.saveUser(user);
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
  setMode: (mode) => {
    set({ mode });
    if (mode === UI_MODES.CUSTOMIZE) {
      set({ pose: PHOTO_POSES.Idle });
    }
  },
  pose: PHOTO_POSES.Idle,
  setPose: (pose) => set({ pose }),
  categories: [],
  currentCategory: null,
  assets: [],
  lockedGroups: {},
  skin: new MeshStandardMaterial({ color: 0xf5c6a5, roughness: 1 }),
  customization: {},
  download: () => {},
  setDownload: (download) => set({ download }),
  screenshot: () => {},
  setScreenshot: (screenshot) => set({ screenshot }),
  updateColor: (color) => {
    set((state) => ({
      customization: {
        ...state.customization,
        [state.currentCategory.name]: {
          ...state.customization[state.currentCategory.name],
          color,
        },
      },
    }));
    if (get().currentCategory.name === "Head") {
      get().updateSkin(color);
    }
  },
  updateSkin: (color) => {
    get().skin.color.set(color);
  },
  fetchCategories: async () => {
    // you can also fetch all records at once via getFullList
    const categories = await pb.collection("CustomizationGroups").getFullList({
      sort: "+position",
      expand: "colorPalette,cameraPlacement",
    });
    const assets = await pb.collection("CustomizationAssets").getFullList({
      sort: "-created",
    });
    const customization = {};
    categories.forEach((category) => {
      category.assets = assets.filter((asset) => asset.group === category.id);
      customization[category.name] = {
        color: category.expand?.colorPalette?.colors?.[0] || "",
      };
      if (category.startingAsset) {
        customization[category.name].asset = category.assets.find(
          (asset) => asset.id === category.startingAsset
        );
      }
    });

    set({
      categories,
      currentCategory: categories[0],
      assets,
      customization,
      loading: false,
    });
    get().applyLockedAssets();
  },
  setCurrentCategory: (category) => set({ currentCategory: category }),
  changeAsset: (category, asset) => {
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
    const customization = {};
    get().categories.forEach((category) => {
      let randomAsset = category.assets[randInt(0, category.assets.length - 1)];
      if (category.removable) {
        if (randInt(0, category.assets.length - 1) === 0) {
          randomAsset = null;
        }
      }
      const randomColor =
        category.expand?.colorPalette?.colors?.[
          randInt(0, category.expand.colorPalette.colors.length - 1)
        ];
      customization[category.name] = {
        asset: randomAsset,
        color: randomColor,
      };
      if (category.name === "Head") {
        get().updateSkin(randomColor);
      }
    });
    set({ customization });
    get().applyLockedAssets();
  },

  applyLockedAssets: () => {
    const customization = get().customization;
    const categories = get().categories;
    const lockedGroups = {};

    Object.values(customization).forEach((category) => {
      if (category.asset?.lockedGroups) {
        category.asset.lockedGroups.forEach((group) => {
          const categoryName = categories.find(
            (category) => category.id === group
          ).name;
          if (!lockedGroups[categoryName]) {
            lockedGroups[categoryName] = [];
          }
          const lockingAssetCategoryName = categories.find(
            (cat) => cat.id === category.asset.group
          ).name;
          lockedGroups[categoryName].push({
            name: category.asset.name,
            categoryName: lockingAssetCategoryName,
          });
        });
      }
    });

    set({ lockedGroups });
  },
  fetchUser: async () => {
    set({
      loadingUser: true
    })
    const user = await pb.getUser();
    set({
      user: user,
      loadingUser: false
    })
  },
  fetchCharacter: async () => {
    set({
      loadingCharacter: true
    })
    const character = await pb.getCharacter();
    set({
      character: character,
      loadingCharacter: false
    })
  }
}));

console.log(useConfiguratorStore.getState())
useConfiguratorStore.getState().fetchInitial()
