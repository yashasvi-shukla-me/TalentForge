import { useState } from "react";
import { atsMatch, uploadResume } from "./api/atsApi";

import ScoreCards from "./components/ScoreCards";
import SkillMatrix from "./components/SkillMatrix";
import CategoryStrength from "./components/CategoryStrength";
import SimulationPanel from "./components/SimulationPanel";
import SeniorityPanel from "./components/SeniorityPanel";
import LoadingOverlay from "./components/LoadingOverlay";

function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobRole, setJobRole] = useState("backend_engineer");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyze() {
    if (!resumeText || !jobDescription) {
      setError("Please upload resume and paste job description.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await atsMatch({
        resumeText,
        jobDescription,
        jobRole,
      });

      setResult(data);
    } catch (err) {
      setError(err?.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-slate-100 font-mono">
      {loading && <LoadingOverlay />}

      <div className="max-w-7xl mx-auto p-8 space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-blue-400 tracking-wider">
            TALENTFORGE AI
          </h1>
          <p className="text-slate-400">
            Resume Intelligence · Skill Gap Engine · Shortlist Prediction
          </p>
        </div>

        {/* INPUTS */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 space-y-4">
            <p className="text-blue-400 text-xs tracking-widest">
              MODULE 01 - RESUME INPUT
            </p>

            <label className="flex justify-between items-center border border-gray-600 bg-gray-800 rounded px-4 py-3 cursor-pointer hover:border-blue-500 transition">
              <span>Upload Resume (.pdf)</span>

              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    setLoading(true);
                    const data = await uploadResume(file);

                    const extractedText = Object.values(
                      data?.extracted_skills || {},
                    )
                      .flatMap((category) => Object.keys(category))
                      .join(" ");

                    setResumeText(extractedText);
                  } catch (err) {
                    setError("Resume upload failed.");
                  } finally {
                    setLoading(false);
                  }
                }}
              />
            </label>

            {resumeText && (
              <p className="text-green-400 text-xs">
                Resume parsed successfully
              </p>
            )}
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 space-y-4">
            <p className="text-blue-400 text-xs tracking-widest">
              MODULE 02 - JOB SPECIFICATION
            </p>

            <textarea
              className="w-full h-40 bg-gray-800 border border-gray-600 rounded p-3 focus:outline-none focus:border-blue-500 transition"
              placeholder="Paste job description..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <select
              className="w-full bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500 transition"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            >
              <option value="backend_engineer">Backend Engineer</option>
              <option value="ml_engineer">ML Engineer</option>
              <option value="frontend_engineer">Frontend Engineer</option>
            </select>
          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-10 py-3 border border-blue-500 text-blue-400 rounded hover:bg-blue-500/10 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Run AI Analysis"}
          </button>
        </div>

        {error && <p className="text-red-400 text-center">{error}</p>}

        {/* RESULTS */}
        {result?.analysis && (
          <div className="space-y-10 animate-fadeIn">
            <ScoreCards result={result} />
            <SkillMatrix result={result} />
            <CategoryStrength result={result} />
            <SimulationPanel result={result} />
            <SeniorityPanel result={result} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
