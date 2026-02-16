function SkillMatrix({ analysis }) {
  if (!analysis) return null;

  const matched = analysis.matched_skills || {};
  const missing = analysis.missing_skills || {};

  const categories = Array.from(
    new Set([...Object.keys(matched), ...Object.keys(missing)]),
  );

  if (categories.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 text-center text-slate-400">
        No skill comparison data available.
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
      <h2 className="text-lg text-slate-300 font-semibold mb-6">
        Skill Alignment Matrix
      </h2>

      <div className="space-y-8">
        {categories.map((category) => {
          const matchedSkills = matched[category] || [];
          const missingSkills = missing[category] || [];

          return (
            <div key={category}>
              <p className="text-sm text-slate-400 mb-3 capitalize tracking-wide">
                {category.replace("_", " ")}
              </p>

              <div className="flex flex-wrap gap-3">
                {matchedSkills.map((skill, i) => (
                  <span
                    key={`m-${i}`}
                    className="px-3 py-1 text-sm bg-green-500/10 border border-green-500/40 rounded-lg text-green-400"
                  >
                    {skill}
                  </span>
                ))}

                {missingSkills.map((skill, i) => (
                  <span
                    key={`x-${i}`}
                    className="px-3 py-1 text-sm bg-red-500/10 border border-red-500/40 rounded-lg text-red-400"
                  >
                    {skill}
                  </span>
                ))}

                {matchedSkills.length === 0 && missingSkills.length === 0 && (
                  <span className="text-slate-500 text-sm">
                    No relevant skills detected.
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SkillMatrix;
