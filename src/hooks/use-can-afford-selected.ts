import { useConfiguratorStore } from "@/store";
import { useMemo } from "react";

export const useCanAffordSelected = () => {
    const userXp = useConfiguratorStore((state) => state.user_xp);
    const selectedAsset = useConfiguratorStore((state) => state.selectedAsset);

    return useMemo(() => {
        if (!userXp || !selectedAsset) {
            return false;
        }

        return userXp.xp > selectedAsset.price;
    }, [userXp, selectedAsset]);
}
