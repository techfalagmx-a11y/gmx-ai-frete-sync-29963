import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface ShipmentTimerProps {
  deadline?: string;
  className?: string;
}

export const ShipmentTimer = ({ deadline, className = "" }: ShipmentTimerProps) => {
  const [timeElapsed, setTimeElapsed] = useState("");

  useEffect(() => {
    if (!deadline) {
      setTimeElapsed("");
      return;
    }

    const calculateTime = () => {
      const deadlineTime = parseDeadlineTime(deadline);
      if (!deadlineTime) {
        setTimeElapsed(deadline);
        return;
      }

      const now = new Date();
      const diff = now.getTime() - deadlineTime.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeElapsed(`Há ${days}d ${hours % 24}h`);
      } else if (hours > 0) {
        setTimeElapsed(`Há ${hours}h ${minutes}m`);
      } else {
        setTimeElapsed(`Há ${minutes}m`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);

    return () => clearInterval(interval);
  }, [deadline]);

  if (!deadline || !timeElapsed) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1 text-xs ${className}`}>
      <Clock className="h-3 w-3" />
      <span className="font-medium">{timeElapsed}</span>
    </div>
  );
};

function parseDeadlineTime(deadline: string): Date | null {
  if (!deadline || typeof deadline !== 'string') {
    return null;
  }

  const now = new Date();
  
  if (deadline.includes("min")) {
    const minutes = parseInt(deadline.match(/\d+/)?.[0] || "0");
    return new Date(now.getTime() - minutes * 60 * 1000);
  }
  
  if (deadline.includes("h") && !deadline.includes("Há")) {
    const hours = parseInt(deadline.match(/\d+/)?.[0] || "0");
    return new Date(now.getTime() - hours * 60 * 60 * 1000);
  }

  if (deadline.includes("Há") && deadline.includes("h")) {
    const hours = parseInt(deadline.match(/\d+/)?.[0] || "0");
    return new Date(now.getTime() - hours * 60 * 60 * 1000);
  }
  
  return null;
}
