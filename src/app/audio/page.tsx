"use client";

import { useRef, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Play, Pause } from "lucide-react";
import axios from "axios";

export default function Audio() {
  const { data: session } = useSession();
  const router = useRouter();
  const [count, setCount] = useState(0);
  const email = session?.user?.email;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!session) {
      router.push("/signin");
    }
  }, [session, router]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  useEffect(() => {
    if (!session) return;

    async function fetchUserCount() {
      try {
        const response = await axios.post("/api/users/me", {
          email: email,
        });
        const currentCount = response.data.navarnaCount;
        setCount(currentCount);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    }
    fetchUserCount();
  }, [session]);

  const handleAudioComplete = async () => {    
    if (audioRef.current) {
      audioRef.current?.play();
    }
    try {
      const response = await axios.post("/api/users/update", {
        email: email,
      });

      setCount(response.data.navarnaCount);
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl shadow-lg mb-6">
          <h1 className="text-2xl md:text-4xl text-white font-bold text-center py-6 px-4">
            ನವಾರ್ಣ ಮಂತ್ರ ಜಪ ಅಭಿಯಾನ
          </h1>
        </div>

        {/* User Stats Card */}
        <div className="bg-white rounded-xl shadow-md mb-6 p-6 border border-blue-100">
          <div className="space-y-2">
            <p className="text-gray-700 text-lg">
              ನಿಮ್ಮ ಈಮೇಲ್ ಐಡಿ :{" "}
              <span className="text-orange-600 font-semibold">{email}</span>
            </p>
            <p className="text-gray-700 text-lg">
              ನೀವು{" "}
              <span className="text-orange-600 font-semibold">{count}</span>{" "}
              ಬಾರಿ ನವಾರ್ಣ ಮಂತ್ರ ಜಪ ಮಾಡಿದ್ದೀರಿ
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 w-full mb-6">
          {/* Audio Controls */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg shadow-md">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-white text-orange-600 hover:bg-gray-600 transition duration-300 shadow-md"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            {/* Song Title */}
            <span className="font-semibold text-white text-sm sm:text-base">
              Now Playing
            </span>

            {/* Time Display */}
            <div className="flex gap-2 text-xs sm:text-sm font-mono text-black">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Hidden Audio Element */}
          <audio ref={audioRef} onEnded={handleAudioComplete} >
            <source src="./navarana-mantra.mp3" type="audio/mpeg" />
          </audio>
        </div>


        {/* Rules Section */}
        <div className="bg-white rounded-xl shadow-md mb-6 p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-orange-600 mb-4">
            ಕೆಲವು ನಿಯಮಗಳು :
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-orange-600 font-bold mr-2">1.</span>
              ಆಡಿಯೋ ಅನ್ನು ಕೇಳುತ್ತಾ ಜೊತೆಗೆ ಜಪವನ್ನು ಮಾಡಬೇಕು.
            </li>
            {/* <li className="flex items-start">
              <span className="text-orange-600 font-bold mr-2">2.</span>
              ಆಡಿಯೋ ಅನ್ನು ಸ್ಕಿಪ್ ಮಾಡಬಾರದು.
            </li> */}
            <li className="flex items-start">
              <span className="text-orange-600 font-bold mr-2">2.</span>
              ಮಧ್ಯ ಫೋನ್ ಬಂದರೆ, ಆಡಿಯೋ ಪಾಜ್ ಮಾಡಿ, ಮತ್ತೆ ಮುಂದುವರೆಸಬೇಕು.
            </li>
          </ul>
        </div>

        {/* Next Program Section */}
        <div className="bg-white rounded-xl shadow-md mb-6 p-6">
          <h2 className="text-xl font-bold text-orange-600 mb-4">
            ನಮ್ಮ ಮುಂದಿನ ಕಾರ್ಯಕ್ರಮದ ವಿವರ :
          </h2>
          ಕಲಬುರ್ಗಿಯ ಶ್ರೀ ರಾಮಕೃಷ್ಣ ವಿವೇಕಾನಂದ ಆಶ್ರಮದಲ್ಲಿ ನವೆಂಬರ್ ಅಲ್ಲಿ ನಡೆಯುವ ಆಯುತ ಚಂಡೀ ಮಹಾಯಾಗದ ಪೂರ್ವಭಾವಿ ತಯಾರಿಯಾಗಿ ಬೆಂಗಳೂರಿನ ಶ್ರೀ ರಾಜರಾಜೇಶ್ವರಿ ನಗರದ ಕೈಲಾಸ ಆಶ್ರಮ ದೇವಸ್ಥಾನದ ಆವರಣದಲ್ಲಿ ದಿನಾಂಕ <b>31.05.2025 ರಿಂದ 02.06.2025</b> ರ ತನಕ ದಿನಪೂರ್ತಿ ಪಾರಾಯಣ ನೆರವೇರುವುದು.
          ದಯವಿಟ್ಟು ಶ್ರೀ ದುರ್ಗಾ ಸಪ್ತಶತಿಯನ್ನು ಕಲಿತಿರುವಂತವರು ಭಾಗವಹಿಸಬೇಕಾಗಿ ವಿನಂತಿ.  
          <br/><br/>
          ಸಂಪರ್ಕ : ಸ್ವಾಮಿ ಮಹೇಶ್ವರಾನಂದಜಿ
          <br/>
          ನಂ: 9019849144 | 9632322577 
        </div>

        {/* Leaderboard Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="overflow-x-auto">
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}

// Leaderboard Component
function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<{
    totalJapa: number;
    totalUsers: number;
    topUsers: Array<{email: string, navarnaCount: number, rank: number}>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch('/api/analytics/top-users');
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }


  if (!leaderboardData) return null;

  const { totalJapa, totalUsers, topUsers } = leaderboardData;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 shadow-lg transform transition-all">
          <div className="flex items-center space-x-3">
            <div>
              <p className="text-sm font-medium text-gray pb-2">ಒಟ್ಟು ಜಪದ ಸಂಖ್ಯೆ</p>
              <p className="text-2xl font-bold text-white">{totalJapa.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 shadow-lg transform transition-all">
          <div className="flex items-center space-x-3">
            <div>
              <p className="text-sm font-medium text-gray pb-2">ಒಟ್ಟು ಭಾಗವಹಿಸಿದವರು</p>
              <p className="text-2xl font-bold text-white">{totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-0 py-4 border-b border-gray-100">
          <h2 className="text-lg md:text-xl font-bold text-orange-600">
            ಅತಿ ಹೆಚ್ಚು ಜಪ ಮಾಡಿದವರು
          </h2>
        </div>
        
        <div className="w-full">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  ಸ್ಥಾನ
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  ಇಮೇಲ್ ಐಡಿ
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  ಜಪ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topUsers.map((user) => (
                <tr key={user.email} className="hover:bg-gray-50">
                  <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full font-medium bg-gray-100 text-gray-700 text-sm">
                      {user.rank}
                    </span>
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap max-w-[120px] sm:max-w-none truncate">
                    <span className="text-sm text-gray-900">{user.email}</span>
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {user.navarnaCount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
