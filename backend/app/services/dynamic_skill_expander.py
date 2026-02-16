import re
from typing import List

TECH_PATTERN = r"\b[A-Za-z][A-Za-z0-9\+\#\.]{2,}\b"

COMMON_STOPWORDS = {
    "experience", "years", "team", "role", "candidate",
    "development", "software", "engineer", "project",
    "required", "preferred", "knowledge", "strong",
    "looking", "with", "for", "and", "across", "based",
    "hands", "world", "solutions", "analysis", "systems",
    "management", "research", "evaluation", "applied"
}

COMMON_ENGLISH = {
    "the", "this", "that", "from", "into", "using",
    "will", "should", "must", "have", "has", "had",
    "are", "was", "were", "been", "being"
}


def extract_dynamic_skills(text: str) -> List[str]:
    tokens = re.findall(TECH_PATTERN, text)

    cleaned = []

    for token in tokens:
        lower = token.lower()

        if (
            lower not in COMMON_STOPWORDS
            and lower not in COMMON_ENGLISH
            and not lower.isdigit()
            and len(lower) > 3
        ):
            cleaned.append(lower)

    return list(set(cleaned))
