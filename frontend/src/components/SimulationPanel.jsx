function SimulationPanel({ result }) {
  const analysis = result?.analysis;

  if (!analysis) return null;

  const currentScore =
    analysis.final_ats_score ??
    analysis.adjusted_score ??
    analysis.ats_score ??
    0;

  const improvementPlan = analysis.improvement_plan;
  const skillImpact = analysis.skill_impact || {};

  if (
    !improvementPlan ||
    !improvementPlan.skills_to_reach_next_tier ||
    improvementPlan.skills_to_reach_next_tier.length === 0
  ) {
    return null;
  }

  const projectedGain = improvementPlan.skills_to_reach_next_tier.reduce(
    (sum, skill) => sum + (skillImpact[skill] || 0),
    0,
  );

  const projectedScore = Math.min(
    Math.round(currentScore + projectedGain),
    100,
  );

  return (
    <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl p-8">
      <h2 className="text-lg text-cyan-400 font-semibold mb-6">
        Strategic Simulation
      </h2>

      <div className="space-y-6">
        {/* Current vs Projected */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <p className="text-sm text-slate-400">Current Score</p>
            <p className="text-4xl font-bold text-slate-300 mt-2">
              {currentScore}%
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <p className="text-sm text-slate-400">Projected Score</p>
            <p className="text-4xl font-bold text-cyan-400 mt-2">
              {projectedScore}%
            </p>
          </div>
        </div>

        {/* Skills to Add */}
        <div>
          <p className="text-sm text-slate-400 mb-3">
            To reach {improvementPlan.target_score}%+, consider adding:
          </p>

          <div className="flex flex-wrap gap-3">
            {improvementPlan.skills_to_reach_next_tier.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-sm bg-cyan-600/20 border border-cyan-500 rounded text-cyan-300"
              >
                {skill}
                {skillImpact[skill] ? `  (+${skillImpact[skill]}%)` : ""}
              </span>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Simulation based on weighted skill contribution model.
        </p>
      </div>
    </div>
  );
}

export default SimulationPanel;
