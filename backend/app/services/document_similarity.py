from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def compute_document_similarity(resume_text: str, job_description: str) -> float:
    """
    Compute cosine similarity between resume and job description
    using TF-IDF vectors.
    Returns a value between 0 and 1.
    """

    if not resume_text or not job_description:
        return 0.0

    vectorizer = TfidfVectorizer(stop_words="english")

    vectors = vectorizer.fit_transform([resume_text, job_description])

    similarity_matrix = cosine_similarity(vectors[0:1], vectors[1:2])

    similarity_score = float(similarity_matrix[0][0])

    return round(similarity_score, 3)
