import { useConfiguratorStore } from "@/store";

export interface LevelProgressProps {
    name: string;
    level: number;
    points: number;
    maxPoints: number;
}

export const LevelProgress = ({ name, level, points, maxPoints }: LevelProgressProps) => {
    const progressPercentage = (points / maxPoints) * 100;

    return (
        <div className="bg-[#F5F0E7] p-6 rounded-xl shadow-md w-96">
            <h2 className="text-2xl font-bold text-[#7D4B22]">Hello, {name}</h2>
            <div className="mt-4 text-[#7D6B54]">
                <p><span className="font-semibold">Name:</span> <span className="text-black">{name}</span></p>
                <p><span className="font-semibold">Current level:</span> <span className="text-black">{level}</span></p>
                <p><span className="font-semibold">Current points:</span> <span className="text-black">{points} Point</span></p>
            </div>
            <div className="mt-4">
                <p className="font-semibold">Points {points}/{maxPoints}</p>
                <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-green-400" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>
            <p className="mt-4 text-[#7D6B54]">Start next level need <span className="font-semibold text-black">{maxPoints} Point</span></p>
        </div>
    );
};

export const LevelComponent = () => {
    const { character } = useConfiguratorStore();
    // TODO: get from backend
    const nextLevelPoints = 500;
    const currentLevelPoints = 100;
    const level = 1;

    return <LevelProgress name={character?.name ?? 'Lemsa'} level={level} points={currentLevelPoints} maxPoints={nextLevelPoints} />
}
