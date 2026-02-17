import { useEffect, useState } from "react";

function RadialProgress({ value, size = 150, strokeWidth = 14 }) {
  const [progress, setProgress] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animate number count-up
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = value / steps;

    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(interval);
      }
      setProgress(start);
    }, stepTime);

    return () => clearInterval(interval);
  }, [value]);

  const offset = circumference - (progress / 100) * circumference;

  // Dynamic color based on score
  const getColor = () => {
    if (value >= 70) return "#22c55e"; // green
    if (value >= 40) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          stroke="#1f2937"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Animated progress circle */}
        <circle
          stroke={getColor()}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: "stroke-dashoffset 0.3s linear",
          }}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold">{progress.toFixed(2)}%</span>
        <span className="text-xs text-gray-400 mt-1">ATS Score</span>
      </div>
    </div>
  );
}

export default RadialProgress;
