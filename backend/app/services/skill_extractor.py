import re
from typing import Dict, List, Set

from app.services.dynamic_skill_expander import extract_dynamic_skills


SKILL_VOCABULARY: Dict[str, List[str]] = {
    "programming_languages": [
        "python",
        "java",
        "c++",
        "c",
        "javascript",
        "typescript",
        "go"
    ],
    "ml_ai": [
        "machine learning",
        "deep learning",
        "neural networks",
        "tensorflow",
        "pytorch",
        "scikit-learn",
        "nlp",
        "computer vision"
    ],
    "databases": [
        "sql",
        "mysql",
        "postgresql",
        "mongodb",
        "redis"
    ],
    "cloud_devops": [
        "aws",
        "azure",
        "gcp",
        "docker",
        "kubernetes",
        "ci/cd"
    ]
}


def normalize_text(text: str) -> str:
    return text.lower()


def extract_skills(
    sections: Dict[str, str],
    full_text: str,
    mode: str = "resume"
) -> Dict[str, Dict[str, Dict]]:
    
    extracted: Dict[str, Dict[str, Dict]] = {}

    search_text = sections.get("skills", full_text)
    normalized_text = normalize_text(search_text)

    for category, skills in SKILL_VOCABULARY.items():
        extracted[category] = {}

        for skill in skills:
            pattern = r"\b" + re.escape(skill) + r"\b"
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
