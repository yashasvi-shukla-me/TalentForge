function SkillMatrix({ result }) {
  const matched = result.analysis.matched_skills || {};
  const missing = result.analysis.missing_skills || {};

  const hasMatched = Object.keys(matched).length > 0;
  const hasMissing = Object.keys(missing).length > 0;

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 space-y-10">
      <h3 className="text-xl font-semibold">Skill Alignment</h3>

      {/* MATCHED SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-green-400 font-medium">Matched Skills</p>
          {hasMatched && (
            <span className="text-xs text-gray-500">
              {Object.values(matched).flat().length} total
            </span>
          )}
        </div>

        {!hasMatched ? (
          <p className="text-gray-500 text-sm">No matched skills detected.</p>
        ) : (
          Object.entries(matched).map(([category, skills]) => (
            <div
              key={category}
              className="bg-[#0F172A] border border-gray-700 rounded-xl p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <p className="capitalize text-gray-300 text-sm font-medium">
                  {category.replace("_", " ")}
                </p>
                <span className="text-xs text-gray-500">
                  {skills.length} skills
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MISSING SECTION */}
      {hasMissing && (
        <div className="space-y-6 pt-6 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <p className="text-red-400 font-medium">Missing Skills</p>
            <span className="text-xs text-gray-500">
              {Object.values(missing).flat().length} total
            </span>
          </div>

          {Object.entries(missing).map(([category, skills]) => (
            <div
              key={category}
              className="bg-[#0F172A] border border-gray-700 rounded-xl p-4 space-y-3"
            >
              <p className="capitalize text-gray-300 text-sm font-medium">
                {category.replace("_", " ")}
              </p>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SkillMatrix;
