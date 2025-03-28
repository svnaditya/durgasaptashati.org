"use client";

import { useRef, useEffect, useState } from "react";

export default function Audio() {

  const [completed, setCompleted] = useState(false);
  const [count, setCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const email = "durga@gmail.com";
  const url = `https://firestore.googleapis.com/v1/projects/saptashati1008/databases/(default)/documents/navarna/${email}`;

  useEffect(() => {
    async function fetchUserCount() {
      try {
        const response = await fetch(url);
        const data = await response.json();
        const currentCount = parseInt(data.fields?.count?.integerValue || "0");
        setCount(currentCount);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    }
    fetchUserCount();
  }, []);

  const handleAudioComplete = async () => {
    setCompleted(true);
    if (audioRef.current) {
      audioRef.current?.play();
    }
    try {
      // Step 1: Get current count
      const getResponse = await fetch(url);
      const getData = await getResponse.json();
      let currentCount = getData.fields?.count?.integerValue || 0;
      currentCount = parseInt(currentCount) + 18; // Add 18
      setCount(currentCount)
      // Step 2: Update Firestore
      const updateResponse = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: { count: { integerValue: currentCount } },
        }),
      });

      const updateData = await updateResponse.json();
      console.log("Firestore Updated:", updateData);
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col m-4 bg-[#B9D7EA]">
        <h1 className="text-1xl text-[#393E46] font-bold m-4">ನಿಮ್ಮ ಈಮೇಲ್ ಐಡಿ : <span className="text-[#EC5228]">{email}</span> <br/> <br/>ನೀವು <span className="text-[#EC5228]">{count}</span> ಬಾರಿ ನವಾರ್ಣ ಮಂತ್ರ ಜಪ ಮಾಡಿದ್ದೀರಿ</h1>
      </div>
      <div className="flex flex-col items-center justify-center m-4 pt-4 pb-4 bg-[#F7FBFC]">
        <audio ref={audioRef} autoPlay controls onEnded={handleAudioComplete} className="w-full max-w-md">
          <source src="./navarna.mp3" type="audio/mpeg" />
        </audio>      
      </div>
      <div className="flex flex-col m-4 bg-[#B9D7EA]">
        <h1 className="text-1xl text-[#393E46] font-bold m-4"><span className="text-[#EC5228]">ಕೆಲವು ನಿಯಮಗಳು :</span> 
        <br/>
        <br/>
        1. ಆಡಿಯೋ ಅನ್ನು ಕೇಳುತ್ತಾ ಜೊತೆಗೆ ಜಪವನ್ನು ಮಾಡಬೇಕು.
        <br/>
        2. ಆಡಿಯೋ ಅನ್ನು ಸ್ಕಿಪ್ ಮಾಡಬಾರದು.
        <br/>
        3. ಮಧ್ಯ ಫೋನ್ ಬಂದರೆ, ಆಡಿಯೋ ಪಾಜ್ ಮಾಡಿ, ಮತ್ತೆ ಮುಂದುವರೆಸಬೇಕು.
        </h1>
      </div>
      <div className="flex flex-col m-4 bg-[#F7FBFC]">
        <h1 className="text-1xl text-[#EC5228] font-bold">ನಮ್ಮ ಮುಂದಿನ ಕಾರ್ಯಕ್ರಮದ ವಿವರ :</h1>
      </div>
      <div className="flex items-center justify-center m-4 bg-[#3F72AF]">
        <img src="./footer.jpg" />
      </div>
    </>
  );
}
