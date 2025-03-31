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
      </div>
    </div>
  );
}
