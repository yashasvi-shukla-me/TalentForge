from typing import Dict, List, Set

# Disable semantic matching by default (Render memory limits)
ENABLE_SEMANTIC_MATCHING = False

if ENABLE_SEMANTIC_MATCHING:
    # Import kept local to avoid loading heavy models on constrained hosts
    from app.services.semantic_matcher import SemanticMatcher  # type: ignore


# Role weights are expressed in terms of the categories emitted by SKILL_VOCABULARY
# in skill_extractor.py (programming_languages, frontend_frameworks, backend_frameworks,
# ml_ai, databases, cloud_platforms, devops_tools, etc.).
ROLE_BASED_WEIGHTS = {
    "backend_engineer": {
        "programming_languages": 4.0,
        "backend_frameworks": 3.5,
        "databases": 3.0,
        "cloud_platforms": 2.5,
        "devops_tools": 2.0,
        "frontend_frameworks": 1.5,
    },
    "frontend_engineer": {
        "programming_languages": 3.5,
        "frontend_frameworks": 4.0,
        "backend_frameworks": 2.0,
        "databases": 1.5,
        "cloud_platforms": 1.5,
    },
    "ml_engineer": {
        "programming_languages": 3.0,
        "ml_ai": 4.0,
        "databases": 2.5,
        "cloud_platforms": 2.0,
    },
    "fullstack_engineer": {
        "programming_languages": 4.0,
        "backend_frameworks": 3.0,
        "frontend_frameworks": 3.0,
        "databases": 2.5,
        "cloud_platforms": 2.0,
        "devops_tools": 2.0,
    },
    "data_engineer": {
        "programming_languages": 3.0,
        "databases": 4.0,
        "ml_ai": 2.0,
        "cloud_platforms": 3.0,
        "devops_tools": 2.0,
    },
    "devops_engineer": {
        "programming_languages": 2.5,
        "devops_tools": 4.0,
        "cloud_platforms": 4.0,
        "architecture": 2.0,
    },
    "cloud_engineer": {
        "programming_languages": 2.5,
        "cloud_platforms": 4.0,
        "devops_tools": 3.0,
        "architecture": 2.5,
    },
    "software_engineer": {
        "programming_languages": 4.0,
        "backend_frameworks": 3.0,
        "frontend_frameworks": 3.0,
        "databases": 3.0,
        "cloud_platforms": 2.0,
    },
}


CRITICAL_SKILLS = {
    "backend_engineer": {
        "programming_languages": ["java", "python", "go"],
        "backend_frameworks": ["fastapi", "django", "flask", "express"],
        "databases": ["sql", "postgresql"],
    },
    "ml_engineer": {
        "programming_languages": ["python"],
        "ml_ai": ["machine learning", "deep learning", "pytorch", "tensorflow"],
    },
    "frontend_engineer": {
        "programming_languages": ["javascript", "typescript"],
        "frontend_frameworks": ["react", "nextjs", "vue", "angular"],
    },
    "fullstack_engineer": {
        "programming_languages": ["javascript", "typescript", "python"],
        "frontend_frameworks": ["react", "nextjs"],
        "backend_frameworks": ["fastapi", "express"],
        "databases": ["sql", "postgresql"],
    },
    "data_engineer": {
        "programming_languages": ["python"],
        "databases": ["sql", "postgresql", "mysql"],
        "cloud_platforms": ["aws", "gcp", "azure"],
    },
    "devops_engineer": {
        "devops_tools": ["docker", "kubernetes", "ci/cd", "jenkins"],
        "cloud_platforms": ["aws", "gcp", "azure"],
    },
    "cloud_engineer": {
        "cloud_platforms": ["aws", "gcp", "azure"],
        "architecture": ["microservices", "REST API"],
    },
    "software_engineer": {
        "programming_languages": ["java", "python", "javascript", "typescript"],
    },
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
    resume_skills: Dict[str, Dict[str, Dict]],
    jd_skills: Dict[str, Dict[str, Dict]],
    job_role: str = "backend_engineer"
) -> Dict:

    matched_skills: Dict[str, List[str]] = {}
    missing_skills: Dict[str, List[str]] = {}

    total_required = 0
    total_matched = 0
    strength_bonus = 0.0

    # -----------------------------
    # JD-Driven Coverage Logic
    # -----------------------------
    for category, required_skills in jd_skills.items():
        required_set = set(required_skills.keys())
        resume_category = resume_skills.get(category, {})
        resume_set = set(resume_category.keys())

        total_required += len(required_set) * 1.0 

        exact_matched = required_set & resume_set
        missing = required_set - resume_set

        if exact_matched:
            matched_skills[category] = sorted(exact_matched)

        if missing:
            missing_skills[category] = sorted(missing)

        total_matched += len(exact_matched)

        # Strength bonus calculation
        for skill in exact_matched:
            strength = resume_category.get(skill, {}).get("strength", "weak")

            if strength == "strong":
                strength_bonus += 2.0
            elif strength == "moderate":
                strength_bonus += 1.0
            else:
                strength_bonus += 0.25


    # -----------------------------
    # ATS Score Calculation
    # -----------------------------
    if total_required == 0:
        ats_score = 0.0
    else:
        coverage_ratio = total_matched / total_required
        base_score = coverage_ratio * 90
        ats_score = round(min(100, base_score + strength_bonus), 2)

    # -----------------------------
    # Skill Impact Calculation
    # -----------------------------
    skill_impact = {}

    if total_required > 0:
        per_skill_value = 90 / total_required

        for category, skills in missing_skills.items():
            for skill in skills:
                skill_impact[skill] = round(per_skill_value, 2)

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

    if next_threshold and missing_skills:
        sorted_skills = sorted(
            skill_impact.items(),
            key=lambda x: (
                x[0] not in critical_missing,
                -x[1]
            )
        )

        improvement_plan = {
            "target_score": next_threshold,
            "skills_to_reach_next_tier": [skill for skill, _ in sorted_skills]
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
        "scoring_strategy": "jd-coverage-driven",
        "application_status": application_status
    }
