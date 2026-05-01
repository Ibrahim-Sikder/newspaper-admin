"use client";
import { useEffect, useState } from "react";

const DateAndTime = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const getCurrentDateTime = () => {
      const now = new Date();

      const formattedDate = now.toLocaleDateString("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const formattedTime = now.toLocaleTimeString("bn-BD", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });

      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    };

    const interval = setInterval(getCurrentDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div>
        <p className="text-sm font-semibold">{currentDate}</p>
      </div>
      <div>
        <p className="text-sm font-medium">{currentTime}</p>
      </div>
    </div>
  );
};

export default DateAndTime;
