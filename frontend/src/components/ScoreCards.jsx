function ScoreCards({ result }) {
  if (!result?.analysis) return null;

  const finalScore =
    result.analysis.final_ats_score ??
    result.analysis.adjusted_score ??
    result.analysis.ats_score ??
    0;

  const shortlist = result.shortlist_prediction || {};
  const status = result.analysis.application_status || {};

  function getScoreColor(score) {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  }

  function getConfidenceColor(level) {
    if (level === "High") return "text-green-400";
    if (level === "Medium") return "text-yellow-400";
    return "text-red-400";
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* FINAL SCORE */}
      <div className="bg-linear-to-br from-gray-900 to-gray-800 border border-blue-500/30 rounded-2xl p-8 text-center shadow-lg hover:border-blue-500/50 transition">
        <p className="text-slate-400 text-sm tracking-wide">FINAL ATS SCORE</p>
        <p className={`text-6xl font-bold mt-4 ${getScoreColor(finalScore)}`}>
          {finalScore}%
        </p>
      </div>

      {/* SHORTLIST */}
      <div className="bg-linear-to-br from-gray-900 to-gray-800 border border-purple-500/30 rounded-2xl p-8 text-center shadow-lg hover:border-purple-500/50 transition">
        <p className="text-slate-400 text-sm tracking-wide">
          SHORTLIST PROBABILITY
        </p>
        <p className="text-6xl font-bold mt-4 text-purple-400">
          {shortlist.probability_percent ?? 0}%
        </p>
        <p
          className={`text-sm mt-3 ${getConfidenceColor(
            shortlist.confidence_level,
          )}`}
        >
          Confidence: {shortlist.confidence_level || "Low"}
        </p>
      </div>

      {/* STATUS */}
      <div className="bg-linear-to-br from-gray-900 to-gray-800 border border-green-500/30 rounded-2xl p-8 text-center shadow-lg hover:border-green-500/50 transition">
        <p className="text-slate-400 text-sm tracking-wide">
          APPLICATION STATUS
        </p>
        <p
          className={`text-2xl font-semibold mt-4 ${getScoreColor(finalScore)}`}
        >
          {status.label || "Unknown"}
        </p>
        <p className="text-xs text-slate-400 mt-3">
          {status.recommendation || ""}
        </p>
      </div>
    </div>
  );
}

export default ScoreCards;
