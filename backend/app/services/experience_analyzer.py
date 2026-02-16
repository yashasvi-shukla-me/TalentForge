import re
from typing import Optional


def extract_required_experience(jd_text: str) -> Optional[int]:
    pattern = r"(\d+)\+?\s*(years|yrs)"
    matches = re.findall(pattern, jd_text.lower())

    if matches:
        years = [int(m[0]) for m in matches]
        return max(years)

    return None


def extract_resume_experience(resume_text: str) -> Optional[int]:
    pattern = r"(\d+)\+?\s*(years|yrs)"
    matches = re.findall(pattern, resume_text.lower())

    if matches:
        years = [int(m[0]) for m in matches]
        return max(years)

    return None

def classify_seniority(text: str) -> str:
    text = text.lower()

    if "senior" in text or "lead" in text or "principal" in text:
        return "senior"

    if "mid" in text or "3+" in text or "4+" in text:
        return "mid"

    if "junior" in text or "entry" in text or "fresher" in text:
        return "junior"

    return "unspecified"

def estimate_resume_seniority(resume_years: int | None) -> str:
    if not resume_years:
        return "unknown"

    if resume_years >= 5:
        return "senior"
    elif resume_years >= 2:
        return "mid"
    else:
        return "junior"
