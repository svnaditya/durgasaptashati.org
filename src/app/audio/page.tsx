"use client";

import { useRef, useEffect, useState } from "react";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Audio() {
  const { data: session } = useSession();
  const router = useRouter();
  const [count, setCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const email = "durga@gmail.com";

  useEffect(() => {
    if (!session) {
      router.push("/signin");
    }
  }, [session]);

  if (!session) return null;

  useEffect(() => {
    async function fetchUserCount() {
      try {
        const response = await axios.post("/api/users/me", { 
          email: email
        });
        console.log("logging AT CLIENT",response);
        const currentCount = response.data.count || "0";
        setCount(currentCount);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    }
    fetchUserCount();
  }, []);

  const handleAudioComplete = async () => {
    if (audioRef.current) {
      audioRef.current?.play();
    }
    try {
      const response = await axios.post("/api/users/update", { 
        email: email
      });

      console.log("logging AT CLIENT update method",response);
      setCount(response.data.count);

    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl shadow-lg mb-6">
          <h1 className="text-2xl md:text-4xl text-white font-bold text-center py-6 px-4">
            ನವಾರ್ಣ ಮಂತ್ರ ಜಪ ಅಭಿಯಾನ
          </h1>
        </div>

        {/* User Stats Card */}
        <div className="bg-white rounded-xl shadow-md mb-6 p-6 border border-blue-100">
          <div className="space-y-2">
            <p className="text-gray-700 text-lg">
              ನಿಮ್ಮ ಈಮೇಲ್ ಐಡಿ : <span className="text-orange-600 font-semibold">{email}</span>
            </p>
            <p className="text-gray-700 text-lg">
              ನೀವು <span className="text-orange-600 font-semibold">{count}</span> ಬಾರಿ ನವಾರ್ಣ ಮಂತ್ರ ಜಪ ಮಾಡಿದ್ದೀರಿ
            </p>
          </div>
        </div>

        {/* Audio Player Section */}
        <div className="bg-white rounded-xl shadow-md mb-6 p-6">
          <audio
            ref={audioRef}
            autoPlay
            controls
            onEnded={handleAudioComplete}
            className="w-full focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg"
          >
            <source src="./navarna.mp3" type="audio/mpeg" />
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
            <li className="flex items-start">
              <span className="text-orange-600 font-bold mr-2">2.</span>
              ಆಡಿಯೋ ಅನ್ನು ಸ್ಕಿಪ್ ಮಾಡಬಾರದು.
            </li>
            <li className="flex items-start">
              <span className="text-orange-600 font-bold mr-2">3.</span>
              ಮಧ್ಯ ಫೋನ್ ಬಂದರೆ, ಆಡಿಯೋ ಪಾಜ್ ಮಾಡಿ, ಮತ್ತೆ ಮುಂದುವರೆಸಬೇಕು.
            </li>
          </ul>
        </div>

        {/* Next Program Section */}
        <div className="bg-white rounded-xl shadow-md mb-6 p-6">
          <h2 className="text-xl font-bold text-orange-600 mb-4">
            ನಮ್ಮ ಮುಂದಿನ ಕಾರ್ಯಕ್ರಮದ ವಿವರ :
          </h2>

                  {/* Footer Image */}
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img
            src="./footer.jpg"
            alt="Footer"
            className="w-full h-auto object-cover"
          />
        </div>
        </div>


      </div>
    </div>
  );
}

