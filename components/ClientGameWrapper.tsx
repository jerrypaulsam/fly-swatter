'use client';

import { useState } from 'react';
import MosquitoGame from './MosquitoGame';
import AdUnit from './AdUnit';
import { saveScore, getLeaderboard } from '../app/actions';

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
        // --- FIX: Force TypeScript to accept the data ---
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
        <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg border-2 border-green-500 mt-6 mx-4">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 modal-overlay">
          <div className="bg-white p-6 rounded-xl max-w-md w-full flex flex-col items-center text-center m-4">
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

      {/* LEADERBOARD MODAL */}
      {showLeaderboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 modal-overlay backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden m-4 flex flex-col max-h-[80vh]">
                <div className="p-4 bg-green-600 text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold">🏆 Hall of Fame</h2> &nbsp;&nbsp;
                    <button onClick={() => setShowLeaderboard(false)} className="text-2xl leading-none">&times;</button>
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                    {loadingLeaderboard ? (
                        <div className="flex justify-center p-8"><div className="loader"></div></div> 
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-sm">
                                <tr>
                                    <th className="p-2">#</th>
                                    <th className="p-2">Name</th>
                                    <th className="p-2 text-right">Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {leaderboardData.map((e, i) => (
                                    <tr key={e.id}>
                                        <td className="p-3">#{i+1}</td>
                                        <td className="p-3 font-medium">{e.username}</td>
                                        <td className="p-3 text-right font-bold text-green-700">{e.score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
      )}
    </>
  );
}