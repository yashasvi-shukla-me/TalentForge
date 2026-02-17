from typing import Dict, List, Set

# Disable semantic matching by default (Render memory limits)
ENABLE_SEMANTIC_MATCHING = False

if ENABLE_SEMANTIC_MATCHING:
    from backend.app.services.semantic_matcher import SemanticMatcher


ROLE_BASED_WEIGHTS = {
    "ml_engineer": {
        "programming_languages": 3.0,
        "ml_ai": 4.0,
        "databases": 2.0,
        "cloud_devops": 2.0
    },
    "backend_engineer": {
        "programming_languages": 4.0,
        "ml_ai": 1.5,
        "databases": 3.0,
        "cloud_devops": 3.0
    },
    "frontend_engineer": {
        "programming_languages": 4.0,
        "ml_ai": 1.0,
        "databases": 1.5,
        "cloud_devops": 1.5
    }
}


CRITICAL_SKILLS = {
    "backend_engineer": {
        "programming_languages": ["java", "python", "go"],
        "databases": ["sql", "postgresql"]
    },
    "ml_engineer": {
        "programming_languages": ["python"],
        "ml_ai": ["machine learning", "deep learning"]
    },
    "frontend_engineer": {
        "programming_languages": ["javascript", "typescript"]
    }
}


def classify_application_readiness(score: float):
    if score >= 85:
        return {"label": "Perfect Match", "recommendation": "High confidence - Apply immediately."}
    elif score >= 70:
        return {"label": "Strong Match", "recommendation": "Apply with minor improvements."}
    elif score >= 50:
        return {"label": "Moderate Match", "recommendation": "Improve missing skills before applying."}
    elif score >= 30:
        return {"label": "Low Match", "recommendation": "Significant improvements required."}
    else:
        return {"label": "Very Weak Match", "recommendation": "Not recommended to apply yet."}


def get_next_threshold(score: float):
    if score < 30:
        return 30
    elif score < 50:
        return 50
    elif score < 70:
        return 70
    elif score < 85:
        return 85
    else:
        return None


def analyze_skill_gap(
    resume_skills: Dict[str, List[str]],
    jd_skills: Dict[str, List[str]],
    job_role: str = "backend_engineer"
) -> Dict:

    matched_skills: Dict[str, List[str]] = {}
    missing_skills: Dict[str, List[str]] = {}

    weighted_required = 0.0
    weighted_matched = 0.0

    role_weights = ROLE_BASED_WEIGHTS.get(job_role, {})

    # -----------------------------
    # Core scoring logic
    # -----------------------------
    for category, required_skills in jd_skills.items():
        required_set: Set[str] = set(required_skills)
        resume_skill_data = resume_skills.get(category, {})
        resume_set: Set[str] = set(resume_skill_data.keys())


        weight = role_weights.get(category, 1.0)

        exact_matched = required_set & resume_set
        missing = required_set - resume_set

        exact_credit = 0.0

        for skill in exact_matched:
            strength = resume_skill_data.get(skill, {}).get("strength", "weak")

            if strength == "strong":
                multiplier = 1.0
            elif strength == "moderate":
                multiplier = 0.7
            else:
                multiplier = 0.4

            exact_credit += weight * multiplier


        semantic_credit = 0.0
        semantically_matched = set()

        if ENABLE_SEMANTIC_MATCHING:
            matcher = SemanticMatcher()
            semantic_matches = matcher.match_skills(
                resume_skills=list(resume_set),
                jd_skills=list(missing)
            )
            for _, jd_skill, score in semantic_matches:
                semantically_matched.add(jd_skill)
                semantic_credit += score * weight

        final_missing = missing - semantically_matched
        all_matched = exact_matched | semantically_matched

        weighted_matched += exact_credit + semantic_credit
        weighted_required += len(required_set) * weight

        if all_matched:
            matched_skills[category] = sorted(all_matched)

        if final_missing:
            missing_skills[category] = sorted(final_missing)

    # -----------------------------
    # ATS Score
    # -----------------------------
    ats_score = 0.0
    if weighted_required > 0:
        ats_score = round((weighted_matched / weighted_required) * 100, 2)

    # -----------------------------
    # Skill Impact Calculation
    # -----------------------------
    skill_impact = {}

    for category, skills in missing_skills.items():
        weight = role_weights.get(category, 1.0)
        total_required_in_category = len(jd_skills.get(category, []))

        if total_required_in_category == 0:
            continue

        per_skill_weight = weight / total_required_in_category

        for skill in skills:
            projected_gain = round((per_skill_weight / weighted_required) * 100, 2)
            skill_impact[skill] = projected_gain

    # -----------------------------
    # Critical vs Optional
    # -----------------------------
    critical_missing: List[str] = []
    optional_missing: List[str] = []

    role_critical = CRITICAL_SKILLS.get(job_role, {})

    for category, skills in missing_skills.items():
        for skill in skills:
            if skill in role_critical.get(category, []):
                critical_missing.append(skill)
            else:
                optional_missing.append(skill)

    # -----------------------------
    # Improvement Plan
    # -----------------------------
    next_threshold = get_next_threshold(ats_score)
    improvement_plan = None

    if next_threshold:
        required_weighted_score = (next_threshold / 100) * weighted_required
        gap = required_weighted_score - weighted_matched

        recommended_focus = []

        sorted_skills = sorted(
            skill_impact.items(),
            key=lambda x: (
                x[0] not in critical_missing,   # Critical first
                -x[1]                           # Then by impact
            )
        )

        for skill, impact in sorted_skills:
            recommended_focus.append(skill)
            gap -= (impact / 100) * weighted_required
            if gap <= 0:
                break

        improvement_plan = {
            "target_score": next_threshold,
            "skills_to_reach_next_tier": recommended_focus
        }

    # -----------------------------
    # Application Status
    # -----------------------------
    application_status = classify_application_readiness(ats_score)

    return {
        "ats_score": ats_score,
        "skill_impact": skill_impact,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "critical_missing": sorted(critical_missing),
        "optional_missing": sorted(optional_missing),
        "improvement_plan": improvement_plan,
        "semantic_matching_enabled": ENABLE_SEMANTIC_MATCHING,
        "weighting_strategy": "role-based",
        "application_status": application_status
    }
