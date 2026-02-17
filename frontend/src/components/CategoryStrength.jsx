function CategoryStrength({ result }) {
  const categories = result.analysis.skill_impact || {};
  const entries = Object.entries(categories);

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 space-y-8">
      <h3 className="text-xl font-semibold">Skill Category Strength</h3>

      {entries.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No skill impact data available for this role.
        </p>
      ) : (
        entries.map(([category, rawValue]) => {
          const value = Math.max(0, Math.min(100, Number(rawValue) || 0));

          return (
            <div key={category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize text-gray-300 font-medium">
                  {category.replace("_", " ")}
                </span>
                <span className="text-gray-400">{value}%</span>
              </div>

              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default CategoryStrength;
