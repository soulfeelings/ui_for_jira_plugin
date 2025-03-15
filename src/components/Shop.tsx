import { pb, useConfiguratorStore } from "@/store";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { AssetCard, NoAssetCard } from "./AssetCard";
import { useCanAffordSelected } from "@/hooks/use-can-afford-selected";
import { Space } from "./Space";

const throttle = (func: (...args: any[]) => void, limit: number) => {
    let inThrottle: boolean;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

export const Shop: React.FC = () => {
    const categories = useConfiguratorStore((state) => state.categories);
    const assets = useConfiguratorStore((state) => state.assets);
    const [translate, setTranslate] = useState(0);
    const [hideUpButton, setHideUpButton] = useState(false);
    const [hideDownButton, setHideDownButton] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const setCurrentCategory = useConfiguratorStore((state) => state.setCurrentCategory);
    const setSelectedAsset = useConfiguratorStore((state) => state.setSelectedAsset);
    const isMobile = useConfiguratorStore((state) => state.isMobile);
    const userXpPoints = useConfiguratorStore((state) => state.user_xp?.xp);
    const selectedAsset = useConfiguratorStore((state) => state.selectedAsset);
    const currentCategory = useConfiguratorStore((state) => state.currentCategory);
    const userCharacterCustomization = useConfiguratorStore((state) => state.userCharacterCustomization);
    const updateUserCharacterCustomization = useConfiguratorStore((state) => state.updateUserCharacterCustomization);
    const cantAffordSelectedItem = useCanAffordSelected()

    const user = useConfiguratorStore(state => state.user);
    const userAssets = useConfiguratorStore(state => state.userAssets);
    const userAssetsId = useConfiguratorStore(state => state.userAssetsId);
    const fetchUserAssets = useConfiguratorStore(state => state.fetchUserAssets);

    const currentCategoryAssets = assets.filter((asset) => asset.category_id === currentCategory?.id);
    const isAlreadyBought = selectedAsset && userAssets.some(a => a.id === selectedAsset.id);


// С этим работает отнсоительно нормально:
const handleBuy = async () => {
    if (selectedAsset && userCharacterCustomization) {
      try {
        // Добавляем ассет в коллекцию user_assets
        await pb.collection('user_assets').update(userAssetsId, {
          '+assets': selectedAsset.id
        });
        //Обновляем список купленных ассетов
        await fetchUserAssets(user.id);
        // Обновляем локальное состояние
        updateUserCharacterCustomization(userCharacterCustomization.id, {
          ...userCharacterCustomization.customization,
          [currentCategory?.name || '']: {
            ...userCharacterCustomization.customization?.[currentCategory?.name || ''],
            asset: selectedAsset
          }
        });
      } catch (error) {
        console.error('Purchase failed:', error);
      }
    }
  };
    useEffect(() => {
        if (user?.id) {
          fetchUserAssets(user.id);
        }
      }, [user?.id]);
    useEffect(() => {
        if (!currentCategory) {
            setCurrentCategory(categories[0]);
        }
    }, [categories]);

    const scrollContainerHeight = scrollContainerRef.current?.getBoundingClientRect().height ?? 0;

    const throttleScroll = useCallback(throttle((e: WheelEvent) => {
        setTranslate(prev => {
            const next = prev + (e.deltaY * 3);
            if (next > 0) {
                setHideUpButton(false);
                return 0;
            }

            if (next < -(scrollContainerHeight - 400)) {
                setHideDownButton(true);
                return -(scrollContainerHeight - 400);
            }

            setHideDownButton(next < -(scrollContainerHeight - 400));
            setHideUpButton(next > 0);
            return next;
        });
    }, 100), [scrollContainerHeight]);

    return (
        <div className="flex flex-col h-full">
            <div className={`pointer-events-auto relative p-[25px] max-w-lg mx-auto flex flex-col bg-[#DFD1C1]/30 ${isMobile ? "min-w-[300px] min-h-[300px] w-[300px] h-[300px]" : "min-w-[500px] min-h-[500px] w-[500px] h-[500px]"} rounded-[50px]`}>
    {!isMobile && <h1 className="text-2xl font-bold text-center mb-4 color-[#333333] mt-[29px]">{currentCategory?.name}</h1>}
    <div className="flex flex-col gap-2 translate-x-[-100%] flex-shrink-0 absolute top-[25px] left-0">
        {/* button to scroll up */}
        <button 
            className="pointer-events-auto transform transition-transform duration-100 active:scale-110" 
            style={{ opacity: hideUpButton ? 0 : 1, marginLeft: "25px", pointerEvents: hideUpButton ? "none" : "auto" }} 
            onClick={() => setTranslate((prev) => {
                const next = prev - 100;
                setHideDownButton(false);

                if (next < -(scrollContainerHeight - 400)) {
                    setHideUpButton(true);
                    return -(scrollContainerHeight - 400);
                }
                return next;
            })}
        >
            <img src="/assets/up-arrow.png" alt="Up" className="w-8 h-8" />
        </button>
        <div className="overflow-y-hidden h-[400px]" >
            <div ref={scrollContainerRef} onWheel={(e) => {
                // throttle
                throttleScroll(e);
            }} className="flex flex-col gap-2 transition-transform duration-300" style={{ transform: `translateY(${translate}px)` }}>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setCurrentCategory(category)}
                        className={`${isMobile ? "" : "h-[60px] min-h-[60px] w-[80px]"} 
                            p-[15px] rounded 
                            text-[0.5em]
                            relative 
                            ${currentCategory?.id === category.id ? "bg-[#FFBB4E] text-white" : "bg-[#E8E3D9]"} 
                            [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%,10%_50%)]`}
                    >
                        {category.image ? <img src={pb.files.getUrl(category, category.image)} alt={category.name} className="w-full h-full object-contain" /> : category.name}
                    </button>
                ))}
            </div>
        </div>
        {/* button to scroll down */}
        <button 
            className="pointer-events-auto transform transition-transform duration-100 active:scale-110" 
            style={{ opacity: hideDownButton ? 0 : 1, marginLeft: "25px", pointerEvents: hideDownButton ? "none" : "auto" }} 
            onClick={() => setTranslate((prev) => {
                const next = prev + 100;
                setHideUpButton(false);

                if (next > 0) {
                    setHideDownButton(true);
                    return 0;
                }

                return next;
            })}
        >
            <img src="/assets/down-arrow.png" alt="Down" className="w-8 h-8" />
        </button>
    </div>

    <div className="flex flex-wrap gap-[20px] rounded-lg overflow-y-scroll flex-1 p-6">
        <NoAssetCard isSelected={!selectedAsset} onClick={() => setSelectedAsset(null)} />
        {currentCategoryAssets.map((item) => {
    const isEquipped = userCharacterCustomization?.customization?.[currentCategory?.name || '']?.asset?.id === item.id;
    
    return (
        <AssetCard
            key={item.id}
            asset={item}
            isBought={userAssets.some(a => a.id === item.id)}
            isSelected={selectedAsset?.id === item.id}
            isEquipped={isEquipped} // Передаем статус экипировки
            onClick={setSelectedAsset}
            isDisabled={Boolean(userXpPoints && userXpPoints < item.price)}
        />
    );
})}
      </div>
</div>
            <Space height={23} />
            <button
                onClick={handleBuy}
                disabled={!cantAffordSelectedItem}
                className="disabled:opacity-50 flex-shrink-0 pointer-events-auto bg-[#F2C52E] text-white py-2 px-4 rounded-lg w-full h-[96px] shadow-[inset_-1px_-6px_0px_-1px_rgba(97,97,97,0.34)] rounded-[27px] text-[30px] font-extrabold"
            >
                {isAlreadyBought ? 'Надеть' : 'Купить'}
            </button>
        </div>
    );
};
