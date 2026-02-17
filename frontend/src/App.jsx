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

  const roles = [
    { label: "Backend Engineer", value: "backend_engineer" },
    { label: "Frontend Engineer", value: "frontend_engineer" },
    { label: "Full Stack Engineer", value: "fullstack_engineer" },
    { label: "ML Engineer", value: "ml_engineer" },
    { label: "Data Engineer", value: "data_engineer" },
    { label: "DevOps Engineer", value: "devops_engineer" },
    { label: "Cloud Engineer", value: "cloud_engineer" },
    { label: "Software Engineer", value: "software_engineer" },
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100">
      {loading && <LoadingOverlay />}

      <div className="max-w-6xl mx-auto px-6 py-15 space-y-12">
        {/* HERO */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            TalentForge AI
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            AI-powered Resume Intelligence platform that analyzes skill gaps,
            predicts shortlist probability, and optimizes your application
            strategy.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <span className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm">
              Resume Intelligence
            </span>
            <span className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-full text-sm">
              Skill Gap Engine
            </span>
            <span className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full text-sm">
              Shortlist Prediction
            </span>
          </div>
        </section>

        {/* INPUT SECTION */}
        <section className="grid md:grid-cols-2 gap-8">
          {/* Resume Card */}
          <div className="bg-[#111827] rounded-2xl p-8 border border-gray-800 shadow-xl space-y-6">
            <h2 className="text-xl font-semibold">Resume Upload</h2>

            <label className="flex items-center justify-center h-32 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 transition">
              <span className="text-gray-400">Click to upload PDF resume</span>

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
              <p className="text-green-400 text-sm">
                Resume parsed successfully
              </p>
            )}
          </div>

          {/* Job Description Card */}
          <div className="bg-[#111827] rounded-2xl p-8 border border-gray-800 shadow-xl space-y-4">
            <h2 className="text-xl font-semibold">Job Specification</h2>

            <textarea
              className="w-full h-40 bg-[#0F172A] border border-gray-700 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Paste job description..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <select
              className="w-full bg-gray-800 border border-gray-600 rounded p-3 
  focus:outline-none focus:border-blue-500 transition"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* ACTION BUTTON */}
        <section className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`px-12 py-4 rounded-2xl bg-gradient-to-r 
      from-blue-500 to-cyan-400 
      font-semibold text-lg text-white
      shadow-lg shadow-blue-500/20
      hover:scale-105 hover:shadow-blue-500/40
      transition-all duration-300
      disabled:opacity-50
      ${!result && !loading ? "animate-pulse" : ""}`}
          >
            {loading ? "Analyzing..." : "Run AI Analysis"}
          </button>
        </section>

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-6 py-3 rounded-xl text-sm">
              {error}
            </div>
          </div>
        )}

        {/* RESULTS DASHBOARD */}
        {result?.analysis && (
          <section className="space-y-16">
            <ScoreCards result={result} />
            <SkillMatrix result={result} />
            <CategoryStrength result={result} />
            <SimulationPanel result={result} />
            <SeniorityPanel result={result} />
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
