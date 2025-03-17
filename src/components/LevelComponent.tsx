import { useConfiguratorStore } from '@/store';
import { useEffect, useMemo, useState } from 'react';
import { Space } from './Space';

const PROGRESS_BAR_ID = 'progress-bar-xxx';

export interface LevelProgressProps {
  name: string;
  level: number;
  points: number;
  maxPoints: number;
}

export const LevelComponent = () => {
  const [progressPx, setProgressPx] = useState(0);
  const [pointsTillNextLevel, setPointsTillNextLevel] = useState(0);
  const { character, user_level, user_xp, levels, loadingUserLevel, loadingUserXp, loadingLevels } =
    useConfiguratorStore();

  const nextLevel = useMemo(() => {
    const nextLevel = (user_level?.level ?? 0) + 1;
    return levels?.find(level => level.level === nextLevel);
  }, [levels, user_level]);

  const currentLevel = useMemo(() => {
    return levels?.find(level => level.level === user_level?.level);
  }, [levels, user_level]);

  useEffect(() => {
    const progressBar = document.getElementById(PROGRESS_BAR_ID);
    if (!progressBar) {
      return;
    }

    const fullWidth = progressBar.getBoundingClientRect().width;

    const levelDiff = (nextLevel?.xp_required ?? 0) - (currentLevel?.xp_required ?? 0);
    const progressCurrentLevel = (user_xp?.xp ?? 0) - (currentLevel?.xp_required ?? 0);
    setPointsTillNextLevel(levelDiff - progressCurrentLevel);
    const pxPerPoint = fullWidth / levelDiff;

    const progress = progressCurrentLevel * pxPerPoint;

    setProgressPx(Number(progress.toFixed(0)));
  }, [
    user_level?.level,
    user_xp?.xp,
    levels,
    nextLevel,
    currentLevel,
    loadingUserLevel,
    loadingUserXp,
    loadingLevels,
  ]);

  return (
    <div className="bg-[#F5F0E7] p-[44px] rounded-[50px] shadow-md w-[500px] relative">
      <div className="flex items-center justify-evenly absolute top-[-1rem] left-0 w-full">
        <TopRectangle />
        <TopRectangle />
        <TopRectangle />
        <TopRectangle />
        <TopRectangle />
        <TopRectangle />
      </div>

      <div></div>
      <h2 className="text-[44px] font-extrabold text-[#7D4B22]">Hello, {character?.name}</h2>
      <Space height={40} />
      <div className="text-[24px] grid grid-cols-2 gap-[14px] font-bold">
        <span className=" text-[#A18970]">Name:</span>{' '}
        <span className="text-[#333333]">{character?.name}</span>
        <span className="font-bold text-[#A18970]">Current level:</span>{' '}
        <span className="text-[#333333]">{user_level?.level}</span>
        <span className="font-bold text-[#A18970]">Current points:</span>{' '}
        <span className="text-[#333333]">{user_xp?.xp} Point</span>
      </div>
      <Space height={30} />
      <div className="mt-4 text-[24px]">
        <p className="font-semibold text-[#333333]">
          Points {user_xp?.xp}/{nextLevel?.xp_required}
        </p>
        <div
          id={PROGRESS_BAR_ID}
          className="relative w-full h-[24px] bg-[#3F3B38]/25 rounded-full overflow-hidden mt-2 flex items-center justify-evenly"
        >
          <ProgressBarVertical />
          <ProgressBarVertical />
          <ProgressBarVertical />
          <ProgressBarVertical />
          <ProgressBarVertical />
          <ProgressBarVertical />
          <ProgressBarVertical />
          <div
            className="h-full bg-[#A7DA37] absolute left-0 top-0"
            style={{ width: `${progressPx}px` }}
          ></div>
        </div>
      </div>
      <Space height={30} />
      <p className="mt-4 text-[#A18970] font-bold text-[20px]">
        Start next level need{' '}
        <span className="font-semibold text-[#333333]">{pointsTillNextLevel}</span> points more
      </p>
    </div>
  );
};

function ProgressBarVertical() {
  return <div className="h-full bg-[#151515] w-[2px] z-10"></div>;
}

function TopRectangle() {
  return <div className="w-[22px] h-[36px] bg-[#E8DFD8] rounded-[8px]"></div>;
}
