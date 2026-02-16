import math


def predict_shortlist_probability(
    final_score: float,
    semantic_similarity: float,
    critical_missing: list
) -> dict:

    # Base probability from final score
    probability = final_score * 0.75

    # Boost if semantic similarity is strong
    if semantic_similarity > 0.5:
        probability += 10
    elif semantic_similarity > 0.3:
        probability += 5

    # Penalize if critical skills missing
    if critical_missing:
        probability -= 15

    probability = max(min(round(probability, 2), 95), 5)

    # Confidence estimation
    if semantic_similarity > 0.6:
        confidence = "High"
    elif semantic_similarity > 0.3:
        confidence = "Medium"
    else:
        confidence = "Low"

    return {
        "probability_percent": probability,
        "confidence_level": confidence
    }
