from typing import Dict, List, Set


CATEGORY_WEIGHTS = {
    "programming_languages": 3.0,
    "ml_ai": 3.0,
    "databases": 2.0,
    "cloud_devops": 2.0
}


def analyze_skill_gap(
    resume_skills: Dict[str, List[str]],
    jd_skills: Dict[str, List[str]]
) -> Dict:
    
    # Weighted ATS-style skill gap analysis
    # Compares resume skills against job description skills
    

    matched_skills: Dict[str, List[str]] = {}
    missing_skills: Dict[str, List[str]] = {}

    weighted_required = 0.0
    weighted_matched = 0.0

    for category, required_skills in jd_skills.items():
        required_set: Set[str] = set(required_skills)
        resume_set: Set[str] = set(resume_skills.get(category, []))

        matched = sorted(list(required_set & resume_set))
        missing = sorted(list(required_set - resume_set))

        weight = CATEGORY_WEIGHTS.get(category, 1.0)

        if matched:
            matched_skills[category] = matched
            weighted_matched += len(matched) * weight

        if missing:
            missing_skills[category] = missing

        weighted_required += len(required_set) * weight

    ats_score = 0.0
    if weighted_required > 0:
        ats_score = round(
            (weighted_matched / weighted_required) * 100, 2
        )

    return {
        "ats_score": ats_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "weighting_strategy": "category-based"
    }