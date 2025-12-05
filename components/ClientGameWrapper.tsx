'use client';

import { useState } from 'react';
import MosquitoGame from './MosquitoGame';
import AdUnit from './AdUnit';
import { saveScore, getLeaderboard } from '../app/actions';
import Link from 'next/link';

// Define the shape of a leaderboard entry
type LeaderboardEntry = {
  id: number;
  username: string;
  score: number;
};

export default function ClientGameWrapper() {
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  const handleGameOver = (score: number) => setFinalScore(score);

  const openLeaderboard = async () => {
    setShowLeaderboard(true);
    setLoadingLeaderboard(true);

    try {
      const data = await getLeaderboard();
      setLeaderboardData(data as any);
    } catch (e) {
      console.error("Failed to load leaderboard", e);
    }

    setLoadingLeaderboard(false);
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSaving(true);
    // Mimic 3s ad watch
    await Promise.all([
      new Promise(resolve => setTimeout(resolve, 3000)),
      saveScore(formData)
    ]);
    setIsSaving(false);
    setFinalScore(null);
    openLeaderboard(); // Show results after saving
  };

  return (
    <>
      {finalScore === null ? (
        <MosquitoGame onGameOver={handleGameOver} onOpenScoreboard={openLeaderboard} />
      ) : (
        /* GAME OVER SCREEN */
        <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg border-2 border-green-500 mt-6 mx-4 relative z-50">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Time's Up!</h2>
          <p className="text-xl mb-4">You swatted <span className="text-red-600 font-bold text-3xl">{finalScore}</span> mosquitoes.</p>

          {/* AD SLOT: Game Over */}
          <div className="w-full flex justify-center mb-4 bg-gray-50 border p-2">
            <span className="text-xs text-gray-400 block mb-1">Ad</span>
            <AdUnit slotId="YOUR_GAME_OVER_AD_ID" format="rectangle" />
          </div>

          <form action={handleSubmit} className="flex flex-col gap-3 w-full">
            <input type="hidden" name="score" value={finalScore} />
            <input
              type="text"
              name="username"
              placeholder="Enter Your Name"
              required
              className="p-3 border border-gray-300 rounded-lg w-full"
              maxLength={15}
            />

            <button type="submit" className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-md w-full">
              Save Score & Check Rank
            </button>

            <button type="button" onClick={() => setFinalScore(null)} className="text-gray-500 text-sm hover:underline mt-2">
              Skip & Play Again
            </button>
          </form>
        </div>
      )}

      {/* SAVING OVERLAY */}
      {isSaving && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 modal-overlay">
          <div className="bg-white p-6 rounded-xl max-w-md w-full flex flex-col items-center text-center m-4 relative z-[1001]" style={{ backgroundColor: '#ffffff' }}>
            <h3 className="text-xl font-bold mb-2">Saving Score...</h3>
            <div className="loader mb-6"></div>

            {/* AD SLOT: Saving */}
            <div className="w-[300px] h-[250px] bg-gray-100 flex items-center justify-center border relative">
              <span className="absolute top-1 right-2 text-xs text-gray-400">Ad</span>
              <AdUnit slotId="YOUR_SAVING_AD_ID" format="rectangle" />
            </div>
            <p className="mt-4 text-xs text-gray-500">Please wait a moment...</p>
          </div>
        </div>
      )}

      {/* LEADERBOARD MODAL - FIXED FOR MOBILE */}
      {showLeaderboard && (
        // 1. Added 'p-4' to prevent touching screen edges
        // 2. Used 'items-center' + 'justify-center' to center it
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 modal-overlay backdrop-blur-sm p-4">

          <div
            // 3. Changed max-h to 85dvh (Dynamic Viewport Height) to fit mobile screens perfectly
            // 4. Added 'flex flex-col' so the inner content scrolls, not the whole box
            className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-300 relative z-[1000]"
            style={{ backgroundColor: '#ffffff', maxHeight: '85dvh' }}
          >
            {/* Header (Fixed at top of modal) */}
            <div className="p-4 bg-green-600 text-white flex justify-between items-center z-[1001] shadow-md flex-shrink-0">
              <h2 className="text-xl font-bold">🏆 Hall of Fame</h2>
              <button
                onClick={() => setShowLeaderboard(false)}
                className="text-3xl leading-none hover:text-green-200 font-bold px-2"
              >
                &times;
              </button>
            </div>

            {/* Scrollable Body (flex-1 ensures it takes remaining space) */}
            <div className="overflow-y-auto flex-1 bg-white relative z-[1000]" style={{ backgroundColor: '#ffffff' }}>
              {loadingLeaderboard ? (
                <div className="flex justify-center p-8 bg-white"><div className="loader"></div></div>
              ) : (
                <table className="w-full text-left border-collapse bg-white">
                  <thead className="bg-gray-100 text-gray-600 text-sm sticky top-0 shadow-sm z-10">
                    <tr>
                      <th className="p-3 border-b border-gray-200">#</th>
                      <th className="p-3 border-b border-gray-200">Name</th>
                      <th className="p-3 border-b border-gray-200 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leaderboardData.map((e, i) => (
                      <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-3 text-gray-500 font-bold">
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                        </td>
                        <td className="p-3 font-medium text-gray-800">{e.username}</td>
                        <td className="p-3 text-right font-bold text-green-700 font-mono text-lg">{e.score}</td>
                      </tr>
                    ))}
                    {leaderboardData.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-gray-400 bg-white">
                          No scores yet. Be the first!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer (Fixed at bottom of modal) */}
            <div className="p-2 bg-gray-100 border-t border-gray-200 flex justify-center z-[1001] relative flex-shrink-0" style={{ backgroundColor: '#f3f4f6' }}>
              {/* <Link href={"https://www.shopdibz.com/download-app"} target='_blank'>
                <img src="/Download_Shopdibz_App.webp" height={50} />
              </Link> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}