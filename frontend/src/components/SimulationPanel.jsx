function SimulationPanel({ result }) {
  const feedback = result.feedback || [];

  if (!Array.isArray(feedback) || feedback.length === 0) return null;

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 space-y-6">
      <h3 className="text-xl font-semibold">AI Improvement Plan</h3>

      <ul className="space-y-3 text-gray-300">
        {feedback.map((item, index) => (
          <li
            key={index}
            className="p-4 bg-[#0F172A] border border-gray-700 rounded-xl"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SimulationPanel;
