import { useConfiguratorStore } from "@/store";
import { useMemo } from "react";

export const useCanAffordSelected = () => {
    const userXp = useConfiguratorStore((state) => state.user_xp);
    const selectedAsset = useConfiguratorStore((state) => state.selectedAsset);

    return useMemo(() => {
        if (!selectedAsset) {
            return true;
        }

        if (!userXp) {
            return false;
        }

        return userXp.xp > selectedAsset.price;
    }, [userXp, selectedAsset]);
}
