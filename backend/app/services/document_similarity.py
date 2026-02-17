from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def compute_document_similarity(resume_text: str, job_description: str) -> float:
    if not resume_text or not job_description:
        return 0.0

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        max_features=5000
    )

    vectors = vectorizer.fit_transform([resume_text, job_description])
    similarity_matrix = cosine_similarity(vectors[0:1], vectors[1:2])

    return round(float(similarity_matrix[0][0]), 3)
