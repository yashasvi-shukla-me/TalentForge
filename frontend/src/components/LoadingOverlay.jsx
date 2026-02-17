import { useEffect, useState } from "react";

const steps = [
  "Parsing resume structure...",
  "Extracting technical skills...",
  "Running semantic similarity...",
  "Evaluating experience alignment...",
  "Calculating ATS score...",
  "Predicting shortlist probability...",
];

function LoadingOverlay() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="text-gray-300 text-lg">{steps[index]}</p>
    </div>
  );
}

export default LoadingOverlay;
