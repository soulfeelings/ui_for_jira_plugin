import { useEffect } from "react";
import { useConfiguratorStore } from "../store.ts";
import { PHOTO_POSES, UI_MODES } from "../store_types.ts";
import { LevelComponent } from "./LevelComponent.tsx";
import { ShopButton } from "./ShopButton.tsx";
import { ArrowBackButton } from "./ArrowBackButton.tsx";
import { Shop } from "./Shop.tsx";
const PosesBox = () => {
  const curPose = useConfiguratorStore((state) => state.pose);
  const setPose = useConfiguratorStore((state) => state.setPose);
  return (
    <div className="pointer-events-auto md:rounded-t-lg bg-gradient-to-br from-black/30 to-indigo-900/20  backdrop-blur-sm drop-shadow-md flex p-6 gap-3 overflow-x-auto noscrollbar">
      {Object.keys(PHOTO_POSES).map((pose) => (
        <button
          className={`transition-colors duration-200 font-medium flex-shrink-0 border-b ${curPose === PHOTO_POSES[pose]
            ? "text-white shadow-purple-100 border-b-white"
            : "text-gray-200 hover:text-gray-100 border-b-transparent"
            }
       `}
          onClick={() => setPose(PHOTO_POSES[pose])}
        >
          {pose}
        </button>
      ))}
    </div>
  );
};

const AssetsBox = () => {
  const {
    categories,
    loadingCategories,
    currentCategory,
    setCurrentCategory,
    changeAsset,
    updateUserCharacterCustomization,
    lockedGroups,
  } = useConfiguratorStore();

  return (
    <div className="md:rounded-t-lg bg-gradient-to-br from-black/30 to-indigo-900/20  backdrop-blur-sm drop-shadow-md flex flex-col py-6 gap-3 overflow-hidden ">
      <div className="flex items-center gap-8 pointer-events-auto noscrollbar overflow-x-auto px-6 pb-2">
        {loadingCategories ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-t-transparent border-b-transparent border-r-transparent border-l-transparent border-4 animate-spin rounded-full" />
          </div>
        ) : (
          categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setCurrentCategory(category)}
              className={`transition-colors duration-200 font-medium flex-shrink-0 border-b ${currentCategory?.name === category.name
                ? "text-white shadow-purple-100 border-b-white"
                : "text-gray-200 hover:text-gray-100 border-b-transparent"
                }`}
            >
              {category.name}
            </button>
          ))
        )}
      </div>
      {/* {lockedGroups[currentCategory?.name] && (
        <p className="text-red-400 px-6">
          Asset is hidden by{" "}
          {lockedGroups[currentCategory.name]
            .map((asset) => `${asset.name} (${asset.categoryName})`)
            .join(", ")}
        </p>
      )} */}
      <div className="flex gap-2 overflow-x-auto noscrollbar px-6">
        {/* {currentCategory?.removable && (
          <button
            onClick={() => changeAsset(currentCategory.name, null)}
            className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden pointer-events-auto hover:opacity-100 transition-all border-2 duration-300
              bg-gradient-to-tr
              ${!customization[currentCategory.name].asset
                ? "border-white from-white/20 to-white/30"
                : "from-black/70 to-black/20 border-black"
              }`}
          >
            <div className="w-full h-full flex items-center justify-center bg-black/40 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
          </button>
        )} */}
        {/* {currentCategory?.assets.map((asset, index) => (
          <button
            key={asset.thumbnail + index}
            onClick={() => changeAsset(currentCategory.name, asset)}
            className={`w-20 h-20 relative flex-shrink-0 rounded-xl overflow-hidden pointer-events-auto hover:opacity-100 transition-all border-2 duration-300
              bg-gradient-to-tr
              ${customization[currentCategory.name]?.asset?.id === asset.id
                ? "border-white from-white/20 to-white/30"
                : "from-black/70 to-black/20 border-black"
              }`}
          >
            <img
              className="object-cover w-full h-full"
              src={pb.files.getUrl(asset, asset.thumbnail)}
            />
          </button>
        ))} */}
      </div>
    </div>
  );
};


export const UI = () => {
  // const currentCategory = useConfiguratorStore(
  //   (state) => state.currentCategory
  // );
  // const customization = useConfiguratorStore((state) => state.customization);
  const mode = useConfiguratorStore((state) => state.mode);
  const setMode = useConfiguratorStore((state) => state.setMode);
  const loading = useConfiguratorStore((state) => state.loading);
  const isMobile = useConfiguratorStore((state) => state.isMobile);
  // const user = useConfiguratorStore((state) => state.user);

  return (
    <main className="pointer-events-none fixed z-10 inset-0 select-none">
      <div className="mx-auto h-full max-w-screen-xl w-full flex flex-col justify-between">
        <div className={`fixed ${isMobile ? "top-10 left-[50%] -translate-x-1/2" : "top-1/2 -translate-y-1/2 right-16"}`}>
          {mode === UI_MODES.SHOP ? <Shop /> : <LevelComponent />}
        </div>
        {mode !== UI_MODES.SHOP && <div className="fixed top-5 right-5">
          <ShopButton onClick={() => { setMode(UI_MODES.SHOP) }} />
        </div>}
        {mode !== UI_MODES.LEVEL &&
          <ArrowBackButton onClick={() => { setMode(UI_MODES.LEVEL) }} />
        }
        <div className="md:px-10 flex flex-col">
          {/* {mode === UI_MODES.CUSTOMIZE && (
            <>
              {currentCategory?.colorPalette &&
                customization[currentCategory.name] && <ColorPicker />}
              <AssetsBox />
            </>
          )} */}
          {mode === UI_MODES.PHOTO && <PosesBox />}
        </div>
      </div >
    </main >
  );
};

// const ColorPicker = () => {
//   const updateColor = useConfiguratorStore((state) => state.updateColor);
//   const currentCategory = useConfiguratorStore(
//     (state) => state.currentCategory
//   );
//   const handleColorChange = (color) => {
//     updateColor(color);
//   };
//   const customization = useConfiguratorStore((state) => state.customization);

//   if (!customization[currentCategory.name]?.asset) {
//     return null;
//   }
//   return (
//     <div className="pointer-events-auto relative flex gap-2 max-w-full overflow-x-auto backdrop-blur-sm py-2 drop-shadow-md noscrollbar px-2 md:px-0">
//       {currentCategory.expand?.colorPalette?.colors.map((color, index) => (
//         <button
//           key={`${index}-${color}`}
//           className={`w-10 h-10 p-1.5 drop-shadow-md bg-black/20 shrink-0 rounded-lg overflow-hidden transition-all duration-300 border-2
//              ${customization[currentCategory.name].color === color
//               ? "border-white"
//               : "border-transparent"
//             }
//           `}
//           onClick={() => handleColorChange(color)}
//         >
//           <div
//             className="w-full h-full rounded-md"
//             style={{ backgroundColor: color }}
//           />
//         </button>
//       ))}
//     </div>
//   );
// };
