import { pb, useConfiguratorStore } from "@/store";
import React, { useEffect, useState } from "react";
import { BuyButton } from './BuyButton';
import { AssetCard } from "./AssetCard";

// Тип элемента магазина
interface ShopItem {
    id: number;
    name: string;
    price: number;
    image: string;
}

export const Shop: React.FC = () => {
    const categories = useConfiguratorStore((state) => state.categories);
    const assets = useConfiguratorStore((state) => state.assets);
    const setCurrentCategory = useConfiguratorStore((state) => state.setCurrentCategory);
    const currentCategory = useConfiguratorStore((state) => state.currentCategory);
    const selectedAsset = useConfiguratorStore((state) => state.selectedAsset);
    const setSelectedAsset = useConfiguratorStore((state) => state.setSelectedAsset);
    const isMobile = useConfiguratorStore((state) => state.isMobile);
    const currentCategoryAssets = assets.filter((asset) => asset.category_id === currentCategory?.id);

    useEffect(() => {
        if (!currentCategory) {
            setCurrentCategory(categories[0]);
        }
    }, [categories]);

    return (
        <div className={`pointer-events-auto p-[25px] max-w-lg mx-auto flex flex-col bg-[#DFD1C1] ${isMobile ? "min-w-[300px] min-h-[300px] w-[300px] h-[300px]" : "min-w-[500px] min-h-[500px] w-[500px] h-[500px]"} rounded-[50px]`}>
            {!isMobile && <h1 className="text-2xl font-bold text-center mb-4 color-[#333333]">{currentCategory?.name}</h1>}
            <div className="flex space-x-2 overflow-x-auto flex-shrink-0">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setCurrentCategory(category)}
                        className={`${isMobile ? "" : "h-[60px] min-h-[60px]"} px-3 py-1 rounded ${currentCategory?.id === category.id ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-[20px] rounded-lg overflow-y-scroll flex-1 p-6">
                {currentCategoryAssets.map((item) => (
                    <AssetCard
                        key={item.id}
                        asset={item}
                        isSelected={selectedAsset?.id === item.id}
                        onClick={setSelectedAsset}
                    />
                ))}
                <BuyButton
                    selectedAsset={selectedAsset}
                    currentCategory={currentCategory}
                />
            </div>
        </div>
    );
};
