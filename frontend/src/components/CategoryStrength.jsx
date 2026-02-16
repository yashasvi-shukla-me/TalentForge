function CategoryStrength({ result }) {
  const resumeSkills = result?.resume_skills;

  if (!resumeSkills || Object.keys(resumeSkills).length === 0) {
    return null;
  }

  function getStrengthColor(strength) {
    if (strength === "strong") return "bg-green-500";
    if (strength === "moderate") return "bg-yellow-500";
    return "bg-red-500";
  }

  function getStrengthWidth(strength) {
    if (strength === "strong") return "80%";
    if (strength === "moderate") return "55%";
    return "30%";
  }

  return (
    <div className="bg-gray-900 border border-indigo-500/30 rounded-2xl p-8 hover:border-indigo-500/50 transition">
      <h2 className="text-lg text-indigo-400 font-semibold mb-6">
        Resume Skill Strength Analysis
      </h2>

      <div className="space-y-10">
        {Object.entries(resumeSkills).map(([category, skills]) => (
          <div key={category}>
            <p className="text-sm text-slate-400 mb-4 capitalize tracking-wide">
              {category.replace("_", " ")}
            </p>

            <div className="space-y-4">
              {Object.entries(skills).map(([skill, data]) => (
                <div key={skill}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{skill}</span>
                    <span className="text-slate-400">
                      {data.strength} · {data.frequency} mention
                      {data.frequency > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="w-full bg-gray-700 h-2 rounded">
                    <div
                      className={`h-2 rounded transition-all duration-500 ${getStrengthColor(
                        data.strength,
                      )}`}
                      style={{ width: getStrengthWidth(data.strength) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryStrength;
