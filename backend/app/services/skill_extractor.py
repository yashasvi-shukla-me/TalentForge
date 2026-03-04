import re
from typing import Dict, List, Set

from app.services.dynamic_skill_expander import extract_dynamic_skills

SKILL_VOCABULARY: Dict[str, List[str]] = {
    "programming_languages": [
        "python", "java", "c++", "c", "javascript", "typescript", "go", "ruby", "php", "swift", "kotlin", "cpp"
    ],
    "frontend_frameworks": [
        "react", "reactjs", "react.js", "nextjs", "next.js", "vue", "angular"
    ],
    "backend_frameworks": [
        "fastapi", "django", "flask", "express", "spring", "nodejs", "node.js", "API"
    ],
    "ml_ai": [
        "machine learning", "deep learning", "neural networks",
        "tensorflow", "pytorch", "scikit-learn", "nlp", "computer vision", "LLMs", "ML", "AI", "RAG"
    ],
    "databases": [
        "sql", "mysql", "postgresql", "mongodb", "redis", "sequelize", "oracle", "cassandra"
    ],
    "cloud_platforms": [
        "aws", "azure", "gcp", "google cloud", "amazon web services"
    ],
    "devops_tools": [
        "docker", "kubernetes", "ci/cd", "jenkins"
    ],
    "version_control": [
        "git", "github", "gitlab"
    ],
    "authentication": [
        "jwt", "oauth"
    ],
    "architecture": [
        "microservices", "rest", "restful", "system design", "REST API"
    ]
}



def normalize_text(text: str) -> str:
    text = text.replace("react.js", "react")
    text = text.replace("reactjs", "react")
    text = text.replace("github", "git")
    text = text.replace("gitlab", "git")
    text = text.replace("node.js", "nodejs")
    text = text.replace("next.js", "nextjs")

    return text.lower()


def extract_skills(
    sections: Dict[str, str],
    full_text: str,
    mode: str = "resume"
) -> Dict[str, Dict[str, Dict]]:
    
    extracted: Dict[str, Dict[str, Dict]] = {}

    search_text = full_text

    normalized_text = normalize_text(search_text)

    for category, skills in SKILL_VOCABULARY.items():
        extracted[category] = {}

        for skill in skills:
            pattern = r"\b" + re.escape(skill) + r"s?\b"

            matches = re.findall(pattern, normalized_text)

            if matches:
                frequency = len(matches)

                if frequency >= 5:
                    strength = "strong"
                elif frequency >= 2:
                    strength = "moderate"
                else:
                    strength = "weak"

                extracted[category][skill] = {
                    "frequency": frequency,
                    "strength": strength
                }

        if not extracted[category]:
            extracted.pop(category)

    return extracted
