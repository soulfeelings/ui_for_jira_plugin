import { useCanAffordSelected } from "@/hooks/use-can-afford-selected";
import { useConfiguratorStore } from "@/store";


export const BuyButton = () => {
    const selectedAsset = useConfiguratorStore((state) => state.selectedAsset);
    const currentCategory = useConfiguratorStore((state) => state.currentCategory);
    const userCharacterCustomization = useConfiguratorStore((state) => state.userCharacterCustomization);
    const updateUserCharacterCustomization = useConfiguratorStore((state) => state.updateUserCharacterCustomization);
    const cantAffordSelectedItem = useCanAffordSelected()


    const handleBuy = () => {
        if (selectedAsset && userCharacterCustomization) {
            updateUserCharacterCustomization(userCharacterCustomization.id, {
                ...(userCharacterCustomization.customization || {}),
                [currentCategory?.name || '']: {
                    ...(userCharacterCustomization.customization?.[currentCategory?.name || ''] || {}),
                    asset: selectedAsset
                }
            });
        }
    };

    return (
        <button
            onClick={handleBuy}
            disabled={!cantAffordSelectedItem}
            className="disabled:opacity-50 flex-shrink-0 pointer-events-auto bg-yellow-500 text-white py-2 px-4 rounded-lg w-full hover:bg-yellow-600"
        >
            Buy
        </button>
    );
};