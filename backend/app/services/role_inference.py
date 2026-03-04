from typing import Dict, List
from app.services.skill_gap_analyzer import ROLE_BASED_WEIGHTS


def infer_job_role(jd_skills: Dict[str, List[str]]) -> str:
    """
    Infer the most likely job role based on extracted JD skills
    using weighted category scoring.
    """

    # Initialize scores dynamically from ROLE_BASED_WEIGHTS so new roles stay in sync.
    role_scores = {role: 0.0 for role in ROLE_BASED_WEIGHTS.keys()}

    for category, skills in jd_skills.items():
        for role, weights in ROLE_BASED_WEIGHTS.items():
            weight = weights.get(category, 0)
            role_scores[role] += len(skills) * weight

    inferred_role = max(role_scores, key=role_scores.get)

    return inferred_role
