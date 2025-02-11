import { useConfiguratorStore } from "@/store";

export interface LevelProgressProps {
    name: string;
    level: number;
    points: number;
    maxPoints: number;
}

export const LevelComponent = () => {
    const { character, user_level, user_xp, levels, loadingUserLevel, loadingUserXp, loadingLevels } = useConfiguratorStore();

    const nextLevel = levels?.[user_level?.level ?? 0 + 1];
    const progressPercentage = (user_xp?.xp ?? 0 / (nextLevel?.xp_required ?? 0)) * 100;

    return (
        <div className="bg-[#F5F0E7] p-6 rounded-xl shadow-md w-96">
            {loadingUserLevel || loadingUserXp || loadingLevels ? (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-bold text-[#7D4B22]">Hello, {character?.name}</h2>
                    <div className="mt-4 text-[#7D6B54]">
                        <p><span className="font-semibold">Character name:</span> <span className="text-black">{character?.name}</span></p>
                        <p><span className="font-semibold">Current level:</span> <span className="text-black">{user_level?.level}</span></p>
                        <p><span className="font-semibold">Current points:</span> <span className="text-black">{user_xp?.xp} Point</span></p>
                    </div>
                    <div className="mt-4">
                        <p className="font-semibold">Points {user_xp?.xp}/{nextLevel?.xp_required}</p>
                        <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-green-400" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                    <p className="mt-4 text-[#7D6B54]">Start next level need <span className="font-semibold text-black">{nextLevel?.xp_required} Point</span></p>
                </>
            )}
        </div>

    );
}
