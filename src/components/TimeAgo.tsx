import { useEffect, useState } from "react";

interface TimeAgoProps {
  date?: Date | string;
}

export const TimeAgo = ({ date }: TimeAgoProps) => {
  const [countSeconds, setCountSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      countSeconds;
      setCountSeconds((prev) => prev + 1);
    }, 1000); // Update every 1 second

    // Cleanup function
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures it runs once on mount

  return (
    <div>
      <p>{date ? CreateTimeAgoText(date) : "No date provided"}</p>
    </div>
  );
};

const CreateTimeAgoText = (date: Date | string) => {
  const now = new Date();
  const pastDate = new Date(date);
  const timeDiff = now.getTime() - pastDate.getTime(); //its in milliseconds
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const leftMinutes = minutes % 60;
  const leftSeconds = seconds % 60;
  const hoursLeft = hours % 24;
  const days = Math.floor(hours / 24);

  let timeText = "";

  timeText += days > 0 ? `${days} day${days > 1 ? "s" : ""} ` : "";
  timeText += hoursLeft > 0 ? `${hoursLeft} hour${hoursLeft > 1 ? "s" : ""} ` : "";
  timeText += leftMinutes > 0 ? `${leftMinutes} minute${leftMinutes > 1 ? "s" : ""} ` : "";
  timeText += leftSeconds > 0 ? `${leftSeconds} second${leftSeconds > 1 ? "s" : ""}` : "";

  return timeText;
};
