function SeniorityPanel({ result }) {
  const experiencePenalty = result.analysis?.experience_penalty || 0;
  const seniorityPenalty = result.analysis?.seniority_penalty || 0;

  const totalPenalty = experiencePenalty + seniorityPenalty;

  let message = "";
  let color = "";

  if (totalPenalty === 0) {
    message = "Your experience level aligns well with the role.";
    color = "text-green-400";
  } else if (totalPenalty <= 10) {
    message = "Your experience level is slightly below the role requirements.";
    color = "text-yellow-400";
  } else {
    message =
      "Your experience level does not meet the required seniority for this role.";
    color = "text-red-400";
  }

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8">
      <h3 className="text-xl font-semibold mb-4">Seniority Alignment</h3>
      <p className={color}>{message}</p>
    </div>
  );
}

export default SeniorityPanel;
