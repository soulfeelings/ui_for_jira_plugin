import React, { useEffect, useState } from "react";
import { useConfiguratorStore } from "../store";
import { pb } from "../store";
import { Space } from "./Space";
import { motion, AnimatePresence } from "framer-motion";
import { User, UserXp, UserLevel, UserCharacterExpandedCharacter } from "../apiTypes";

interface LeaderboardEntry {
  id: string;
  username: string;
  name: string;
  xp: number;
  level: number;
  rank: number;
  characterName: string;
  avatar?: string;
}
export const Leaderboard: React.FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useConfiguratorStore((state) => state.user);
  useEffect(() => {
    if (isVisible) {
      const fetchLeaderboard = async () => {
        try {
          setLoading(true);
            
          // 1. Получаем всех пользователей без фильтрации
          const users = await pb.collection('users').getFullList<User>({
            sort: '-created',
            $autoCancel: false
          });
          console.log('Users:', users);

          // 2. Получаем XP всех пользователей
          const xpRecords = await pb.collection('user_xp').getFullList<UserXp>({
            $autoCancel: false
          });
          
          console.log('XP records:', xpRecords);
          const xpMap = new Map(xpRecords.map(xp => [xp.user_id, xp.xp]));

          // 3. Получаем уровни всех пользователей
          const levelRecords = await pb.collection('user_level').getFullList<UserLevel>({
            $autoCancel: false
          });
          console.log('Level records:', levelRecords);
          const levelMap = new Map(levelRecords.map(level => [level.user_id, level.level]));

          // 4. Получаем персонажей всех пользователей
          const userCharacters = await pb.collection('user_character').getFullList<UserCharacterExpandedCharacter>({
            expand: 'character_id',
            $autoCancel: false
          });
          console.log('Character records:', userCharacters);
          const characterMap = new Map(userCharacters.map(uc => [uc.user_id, uc]));

          // 5. Собираем финальный список для leaderboard
          const entries = users.map((user) => {
            const xp = xpMap.get(user.id) || 0;
            const level = levelMap.get(user.id) || 1;
            const userCharacter = characterMap.get(user.id);
            

            return {
              id: user.id,
              username: user.name || user.email.split('@')[0],
              name: user.name,
              xp,
              level,
              rank: 0, 
              avatar: user.avatar 
                ? pb.files.getUrl(user, user.avatar)
                : undefined,
            };
          });

          // Сортируем по XP (от большего к меньшему)
          entries.sort((a, b) => b.xp - a.xp);
          
          // Обновляем ранги после сортировки
          const rankedEntries = entries.map((entry, index) => ({
            ...entry,
            rank: index + 1
          }));

          setLeaderboard(rankedEntries);
          console.log('Fetched users:', users.length); // Добавим лог для отладки
        } catch (error) {          console.error("Failed to fetch leaderboard:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchLeaderboard();
      
    }
  }, [isVisible]);

  

  // Находим текущего пользователя в рейтинге
  const currentUser = leaderboard.find((entry) => entry.id === user?.id);
  const currentUserRank = currentUser?.rank || 0;
  const totalUsers = leaderboard.length;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          className="fixed inset-y-0 right-0 w-full max-w-md bg-[#DFD1C1] shadow-xl z-[60] pointer-events-auto overflow-y-auto"
          style={{
            borderTopLeftRadius: "50px",
            borderBottomLeftRadius: "50px",
          }}
        >
          <div className="relative h-full p-6">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 text-2xl font-bold text-[#7F512F] hover:text-[#5a3a21] transition-colors"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold text-center mb-2 text-[#7F512F]">
              Leaderboard
            </h2>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry) => {
                  const isCurrentUser = entry.id === user?.id;
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: entry.rank * 0.03 }}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        isCurrentUser
                          ? "bg-[#FFBB4E] shadow-md"
                          : "bg-white/80 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center min-w-[40px]">
                          <span
                            className={`font-bold ${
                              entry.rank <= 3 ? "text-2xl" : "text-lg"
                            } ${
                              isCurrentUser ? "text-white" : "text-[#7F512F]"
                            }`}
                          >
                            #{entry.rank}
                          </span>
                          {entry.rank <= 3 && (
                            <span className="ml-1 text-lg">
                              {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
                            </span>
                          )}
                        </div>

                        {entry.avatar ? (
                          <img
                            src={entry.avatar}
                            alt={entry.username}
                            className="w-9 h-9 rounded-full object-cover border-2 border-[#7F512F]/50"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#7F512F]/20 flex items-center justify-center border-2 border-[#7F512F]/50">
                            <span className="text-md font-bold text-[#7F512F]">
                              {entry.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-col">
                          <span
                            className={`font-medium truncate max-w-[120px] ${
                              isCurrentUser ? "text-white" : "text-[#333]"
                            }`}
                          >
                            {entry.username}
                          </span>
                          <span className="text-xs text-[#7F512F]/80">
                            {entry.characterName}
                          </span>
                        </div>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <div
                          className={`font-bold ${
                            isCurrentUser ? "text-white" : "text-[#7F512F]"
                          }`}
                        >
                          Lvl {entry.level}
                        </div>
                        <div
                          className={`text-xs ${
                            isCurrentUser ? "text-white/90" : "text-[#7F512F]/80"
                          }`}
                        >
                          {entry.xp.toLocaleString()} XP
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
            <Space height={23} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};