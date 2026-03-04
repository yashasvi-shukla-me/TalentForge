import { useState, useRef, useEffect } from "react";
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

  // Controls whether we are on the landing page or the analyzer page
  const [hasStarted, setHasStarted] = useState(false);
  const resultsRef = useRef(null);

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  // Minimal JD templates per role
  const JD_TEMPLATES = {
    backend_engineer: `We are looking for a Backend Engineer to design and build scalable APIs and services.

Responsibilities:
- Design and implement RESTful APIs using Python and FastAPI (or similar frameworks)
- Work with relational and NoSQL databases (PostgreSQL, MongoDB, Redis)
- Own end-to-end features from design to production

Requirements:
- 2–4 years of backend development experience
- Strong skills in Python, SQL, and API design
- Experience with cloud platforms (AWS / GCP / Azure) and CI/CD workflows`,

    frontend_engineer: `We are looking for a Frontend Engineer to build modern, responsive web experiences.

Responsibilities:
- Build user interfaces with React, Next.js or similar frameworks
- Collaborate with designers to implement pixel-perfect components
- Optimize performance and accessibility across devices

Requirements:
- 2–4 years of frontend experience
- Strong skills in JavaScript/TypeScript, React, and CSS
- Experience with design systems and component libraries`,

    fullstack_engineer: `We are hiring a Full Stack Engineer to build end-to-end product features.

Responsibilities:
- Develop frontend interfaces using React or Next.js
- Build and maintain backend services and APIs
- Work with databases and cloud infrastructure

Requirements:
- 3–5 years of full stack experience
- Strong skills in JavaScript/TypeScript, React, and at least one backend framework
- Solid understanding of databases, REST APIs, and deployment`,

    ml_engineer: `We are looking for an ML Engineer to build and deploy machine learning models into production.

Responsibilities:
- Design, train, and evaluate ML models for real-world problems
- Build data pipelines and model serving APIs
- Collaborate with product and engineering teams on experimentation

Requirements:
- 2–5 years of experience in ML / Data Science
- Strong skills in Python, PyTorch or TensorFlow, and scikit-learn
- Experience with NLP, recommendation systems, or related domains`,

    data_engineer: `We are hiring a Data Engineer to build reliable data pipelines and analytics infrastructure.

Responsibilities:
- Design and maintain ETL/ELT pipelines
- Work with data warehouses (e.g., Snowflake, BigQuery, Redshift)
- Partner with analysts and ML engineers to provide clean, reliable data

Requirements:
- 2–5 years of experience in data engineering
- Strong SQL and Python skills
- Experience with distributed data processing (Spark, dbt, Airflow is a plus)`,

    devops_engineer: `We are looking for a DevOps Engineer to improve reliability, scalability, and developer productivity.

Responsibilities:
- Design and maintain CI/CD pipelines
- Manage cloud infrastructure using IaC tools (Terraform, CloudFormation)
- Monitor system health, performance, and security

Requirements:
- 3+ years of DevOps / SRE experience
- Strong experience with Docker, Kubernetes, and cloud platforms
- Familiarity with observability tools (Prometheus, Grafana, etc.)`,
  };

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
    <div className="min-h-screen bg-[#020617] text-gray-100">
      {loading && <LoadingOverlay />}

      {/* LANDING PAGE */}
      {!hasStarted && (
        <div className="h-screen px-6 py-10 flex items-center overflow-hidden">
          <div className="max-w-6xl w-full mx-auto grid md:grid-cols-[1.1fr,0.9fr] gap-12 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-cyan-500/30 bg-cyan-500/5">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 shadow-lg shadow-cyan-500/40">
                  <div className="w-7 h-7 border-2 border-white/80 rounded-lg rotate-6" />
                  <div className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-[#020617] border-2 border-cyan-300" />
                </div>
                <span className="text-sm tracking-wide text-cyan-200 uppercase">
                  TalentForge AI Resume Intelligence
                </span>
              </div>

              <div className="space-y-4 text-left">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                  <span className="text-slate-100">Talent</span>
                  <span className="text-cyan-400">Forge</span>
                </h1>
                <p className="text-base md:text-lg text-slate-300 max-w-xl">
                  Analyze your resume with AI, uncover skill gaps, and see how likely
                  you are to get shortlisted for your dream role.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                <button
                  onClick={() => setHasStarted(true)}
                  className="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold text-lg shadow-lg shadow-blue-500/30 hover:scale-105 hover:shadow-blue-500/50 transition-transform duration-200"
                >
                  Analyze your resume
                </button>
                <p className="text-xs md:text-sm text-slate-400">
                  No sign-up required. Powered by AI-driven ATS and skill gap analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-300 mt-4">
                <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl px-4 py-3">
                  <p className="font-semibold text-cyan-300">ATS Match Score</p>
                  <p className="text-xs mt-1 text-slate-400">
                    Understand how your resume ranks for a specific job description.
                  </p>
                </div>
                <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl px-4 py-3">
                  <p className="font-semibold text-blue-300">Skill Gap Insights</p>
                  <p className="text-xs mt-1 text-slate-400">
                    See which skills to add or emphasize to stand out.
                  </p>
                </div>
                <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl px-4 py-3">
                  <p className="font-semibold text-indigo-300">Shortlist Probability</p>
                  <p className="text-xs mt-1 text-slate-400">
                    Get an estimated chance of clearing recruiter screening.
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl shadow-cyan-500/20 px-6 py-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-2 w-20 rounded-full bg-slate-700" />
                  <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                  </div>
                </div>
                <div className="space-y-4 text-left">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    AI Resume Insight Preview
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-300">ATS Match Score</p>
                    <p className="text-lg font-semibold text-cyan-400">82%</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-cyan-400 to-blue-500" />
                  </div>
                  <p className="text-xs text-slate-400">
                    “Strengthen your experience with cloud-native services and CI/CD pipelines
                    to move from a good to a standout profile.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANALYZER PAGE (existing UI) */}
      {hasStarted && (
        <div className="max-w-6xl mx-auto px-6 py-15 space-y-10">
          {/* HERO */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mx-auto md:mx-0">
                <span className="text-slate-100">Talent</span>
                <span className="text-cyan-400">Forge</span>
              </h1>

              <button
                type="button"
                onClick={() => setHasStarted(false)}
                className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:border-cyan-400 hover:text-cyan-200 transition-colors"
              >
                <span className="text-lg">←</span>
                Back to overview
              </button>
            </div>

            <p className="text-sm text-slate-400 text-left">
              Step 1 · Provide your resume and job description. Step 2 · TalentForge analyzes fit, skills, and shortlist probability.
            </p>

            <p className="text-xs text-slate-500 text-left">
              TalentForge runs fully client-initiated requests and does not store your resume or job description.
            </p>
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

              {!resumeText && (
                <p className="text-xs text-slate-400">
                  Upload a recent PDF resume (1–3 pages). We&apos;ll extract skills and key signals.
                </p>
              )}

              {resumeText && (
                <p className="text-green-400 text-sm">
                  Resume parsed successfully
                </p>
              )}
            </div>

            {/* Job Description Card */}
            <div className="bg-[#111827] rounded-2xl p-8 border border-gray-800 shadow-xl space-y-4">
              <h2 className="text-xl font-semibold flex items-center justify-between">
                <span>Job Specification</span>
                <button
                  type="button"
                  className="text-[11px] px-2 py-1 rounded-lg border border-slate-600 text-slate-300 hover:border-cyan-400 hover:text-cyan-200 transition-colors"
                  onClick={() => {
                    const template =
                      JD_TEMPLATES[jobRole] || JD_TEMPLATES.backend_engineer;
                    setJobDescription(template);
                  }}
                >
                  Use sample JD
                </button>
              </h2>

              <textarea
                className="w-full h-40 bg-[#0F172A] border border-gray-700 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Paste job description..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    handleAnalyze();
                  }
                }}
              />

              {!jobDescription && (
                <p className="text-xs text-slate-400">
                  Paste the full job description from LinkedIn, a careers page, or a JD PDF, or insert a sample JD.
                </p>
              )}

              <select
                className="w-full bg-gray-800 border border-gray-600 rounded p-3 focus:outline-none focus:border-blue-500 transition"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>

              <p className="text-xs text-slate-400">
                This helps tailor the analysis, penalties, and suggestions to your target role.
              </p>
            </div>
          </section>

          {/* ACTION BUTTON */}
          <section className="flex flex-col items-center gap-2">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-12 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 font-semibold text-lg text-white shadow-lg shadow-blue-500/20 hover:scale-105 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50"
            >
              {loading
                ? "Analyzing..."
                : result
                  ? "Re-run analysis"
                  : "Run AI Analysis"}
            </button>

            <p className="text-xs text-slate-400">
              {loading
                ? "Warming up the TalentForge engine (first run on free hosting can take a few seconds)..."
                : "Analysis usually completes in a few seconds. First run may be slightly slower on free hosting."}
            </p>
          </section>

          {error && (
            <div className="flex justify-center">
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-6 py-3 rounded-xl text-sm flex items-center gap-4">
                <span>{error}</span>
                <button
                  type="button"
                  className="text-xs underline underline-offset-2 text-red-300 hover:text-red-100"
                  onClick={handleAnalyze}
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* RESULTS DASHBOARD */}
          {result?.analysis && (
            <section ref={resultsRef} className="space-y-6 mt-8">
              {/* Storytelling header */}
              <div className="bg-slate-900/70 border border-slate-700 rounded-2xl px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Step 2 · AI insights
                  </p>
                  <p className="text-lg font-semibold text-slate-100 mt-1">
                    Your TalentForge match:{" "}
                    <span className="text-cyan-400">
                      {result.analysis?.final_ats_score ?? result.analysis?.ats_score ?? "—"}
                      /100
                    </span>
                  </p>
                  <p className="text-sm mt-1">
                    {(() => {
                      const raw = result.analysis?.application_status;
                      const label =
                        typeof raw === "object" ? raw?.label : raw;
                      const statusColor =
                        label === "Perfect Match" || label === "Strong Match"
                          ? "text-green-400"
                          : label === "Moderate Match"
                            ? "text-yellow-400"
                            : label === "Low Match"
                              ? "text-amber-400"
                              : "text-red-400";
                      return label
                        ? (
                            <>
                              Overall assessment:{" "}
                              <span className={statusColor}>{label}</span>.
                            </>
                          )
                        : "Overall assessment combines skills, experience, and semantic similarity.";
                    })()}
                  </p>
                </div>
                <div className="text-sm text-slate-300">
                  <p>
                    Shortlist probability:{" "}
                    <span className="font-semibold text-emerald-400">
                      {Math.round(
                        (result.shortlist_prediction?.probability ?? 0) * 100,
                      )}
                      %
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Focus on closing a few high-impact skill gaps to move into a stronger band.
                  </p>
                </div>
              </div>

              {/* Collapsible detailed sections */}
              <details className="bg-[#020617] border border-slate-800 rounded-2xl px-5 py-4" open>
                <summary className="text-sm font-semibold text-slate-100 cursor-pointer list-none flex items-center justify-between">
                  <span>Overview & key scores</span>
                  <span className="text-xs text-slate-400 ml-2">(recommended)</span>
                </summary>
                <div className="mt-4">
                  <ScoreCards result={result} />
                </div>
              </details>

              <details className="bg-[#020617] border border-slate-800 rounded-2xl px-5 py-4" open>
                <summary className="text-sm font-semibold text-slate-100 cursor-pointer list-none">
                  Skill coverage & gaps
                </summary>
                <div className="mt-4 space-y-8">
                  <SkillMatrix result={result} />
                  <CategoryStrength result={result} />
                </div>
              </details>

              <details className="bg-[#020617] border border-slate-800 rounded-2xl px-5 py-4">
                <summary className="text-sm font-semibold text-slate-100 cursor-pointer list-none flex items-center justify-between">
                  <span>Scenario simulation & seniority signals</span>
                  <span className="text-xs text-slate-400 ml-2">(click to expand)</span>
                </summary>
                <div className="mt-4 space-y-8">
                  <SimulationPanel result={result} />
                  <SeniorityPanel result={result} />
                </div>
              </details>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
