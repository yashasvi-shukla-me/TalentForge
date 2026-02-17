from typing import Dict, List
from backend.app.services.skill_gap_analyzer import ROLE_BASED_WEIGHTS


def infer_job_role(jd_skills: Dict[str, List[str]]) -> str:
    """
    Infer the most likely job role based on extracted JD skills
    using weighted category scoring.
    """

    role_scores = {
        "backend_engineer": 0.0,
        "frontend_engineer": 0.0,
        "ml_engineer": 0.0
    }

    for category, skills in jd_skills.items():
        for role, weights in ROLE_BASED_WEIGHTS.items():
            weight = weights.get(category, 0)
            role_scores[role] += len(skills) * weight

    inferred_role = max(role_scores, key=role_scores.get)

    return inferred_role
