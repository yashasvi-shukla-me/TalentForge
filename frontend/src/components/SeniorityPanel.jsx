function SeniorityPanel({ result }) {
  const analysis = result?.analysis;

  if (!analysis) return null;

  const experiencePenalty = analysis.experience_penalty || 0;
  const seniorityPenalty = analysis.seniority_penalty || 0;

  const totalPenalty = experiencePenalty + seniorityPenalty;

  if (totalPenalty === 0) {
    return (
      <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-8">
        <h2 className="text-lg text-green-400 font-semibold mb-4">
          Seniority Alignment
        </h2>
        <p className="text-slate-300">
          Your experience level aligns well with the job requirement.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-orange-500/30 rounded-2xl p-8">
      <h2 className="text-lg text-orange-400 font-semibold mb-6">
        Seniority & Experience Impact
      </h2>

      <div className="space-y-4 text-sm text-slate-300">
        {experiencePenalty > 0 && (
          <p>
            Experience gap detected. Score reduced by{" "}
            <span className="text-red-400 font-semibold">
              {experiencePenalty}%
            </span>{" "}
            due to insufficient years of experience.
          </p>
        )}

        {seniorityPenalty > 0 && (
          <p>
            Seniority mismatch penalty applied:{" "}
            <span className="text-red-400 font-semibold">
              {seniorityPenalty}%
            </span>
          </p>
        )}

        <p className="text-slate-400">
          Aligning experience level with job expectations increases shortlisting
          probability.
        </p>
      </div>
    </div>
  );
}

export default SeniorityPanel;
