import RadialProgress from "./RadialProgress";

function MetricCard({ title, value, subtitle, color }) {
  return (
    <div
      className="bg-[#111827] border border-gray-800 
      rounded-2xl p-8 text-center shadow-lg 
      hover:border-blue-500/40 transition-all duration-300"
    >
      <p className="text-gray-400 text-sm mb-3">{title}</p>
      <h2 className={`text-5xl font-bold ${color}`}>{value}</h2>
      {subtitle && <p className="text-gray-500 mt-2 text-sm">{subtitle}</p>}
    </div>
  );
}

function ScoreCards({ result }) {
  const score = result.analysis.final_ats_score || 0;
  const shortlist = result.shortlist_prediction?.probability_percent || 0;

  const statusRaw = result.analysis.application_status;
  const status = typeof statusRaw === "object" ? statusRaw.label : statusRaw;

  const recommendation =
    typeof statusRaw === "object" ? statusRaw.recommendation : null;

  // Match backend labels: Perfect Match, Strong Match, Moderate Match, Low Match, Very Weak Match
  const statusColor =
    status === "Perfect Match" || status === "Strong Match"
      ? "text-green-400"
      : status === "Moderate Match"
        ? "text-yellow-400"
        : status === "Low Match"
          ? "text-amber-400"
          : "text-red-400";

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* ATS RADIAL CARD */}
      <div
        className="bg-[#111827] border border-gray-800 
      rounded-2xl p-8 shadow-lg 
      hover:border-blue-500/40 transition-all duration-300 
      flex flex-col items-center justify-center"
      >
        <RadialProgress value={score} />
      </div>

      {/* SHORTLIST CARD */}
      <MetricCard
        title="Shortlist Probability"
        value={`${shortlist.toFixed(2)}%`}
        subtitle={`Confidence: ${result.shortlist_prediction?.confidence_level}`}
        color="text-cyan-400"
      />

      {/* STATUS CARD */}
      <MetricCard
        title="Application Status"
        value={status}
        subtitle={recommendation}
        color={statusColor}
      />
    </div>
  );
}

export default ScoreCards;
