import math


def predict_shortlist_probability(
    final_score: float,
    semantic_similarity: float,
    critical_missing: list
) -> dict:

    # Logistic curve for more realistic behavior
    probability = 100 / (1 + math.exp(-0.05 * (final_score - 55)))


    # Semantic boost (lightweight)
    probability += semantic_similarity * 10

    if critical_missing:
        probability -= 15

    probability = max(min(round(probability, 2), 95), 5)

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
