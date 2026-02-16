from typing import Dict, List


def generate_feedback(
    ats_score: float,
    missing_skills: Dict[str, List[str]],
    critical_missing: List[str],
    optional_missing: List[str],
    application_status: Dict,
    shortlist_prediction: Dict,
    improvement_plan: Dict | None,
    skill_impact: Dict[str, float]
) -> List[str]:

    feedback: List[str] = []

    label = application_status.get("label")
    recommendation = application_status.get("recommendation")

    probability = shortlist_prediction.get("probability_percent")
    confidence = shortlist_prediction.get("confidence_level")

    feedback.append(
        f"Overall Assessment: {label}. {recommendation}"
    )

    feedback.append(
        f"Estimated shortlisting probability: {probability}% "
        f"(Confidence level: {confidence})."
    )

    if critical_missing:
        critical_list = ", ".join(critical_missing)
        feedback.append(
            f"Critical gap detected: {critical_list}. "
            "These should be addressed first to significantly increase match strength."
        )

    if optional_missing:
        optional_list = ", ".join(optional_missing)
        feedback.append(
            f"Additional enhancement opportunities: {optional_list}. "
            "These improve competitiveness but are secondary to critical skills."
        )

    if improvement_plan:
        target = improvement_plan.get("target_score")
        skills_needed = improvement_plan.get("skills_to_reach_next_tier", [])

        if skills_needed:
            primary = skills_needed[0]
            impact = skill_impact.get(primary, 0)

            feedback.append(
                f"To reach the next tier ({target}%+), prioritizing '{primary}' "
                f"could improve your score by approximately {impact}%."
            )

    if ats_score >= 70:
        feedback.append(
            "Your profile is competitive. Emphasize measurable impact and system-level contributions."
        )
    elif ats_score >= 50:
        feedback.append(
            "You are close to strong alignment. Focused improvements could meaningfully raise selection probability."
        )
    else:
        feedback.append(
            "Core skill alignment needs strengthening before applying for optimal results."
        )

    return feedback
