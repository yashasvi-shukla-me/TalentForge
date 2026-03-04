import io
from urllib import request
import pdfplumber
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


# self defined modules
from app.utils.text_cleaning import clean_text
from app.services.section_parser import extract_sections
from app.services.skill_extractor import extract_skills
from app.services.skill_gap_analyzer import analyze_skill_gap
from app.services.feedback_generator import generate_feedback
from app.services.document_similarity import compute_document_similarity
from app.services.role_inference import infer_job_role
from app.services.experience_analyzer import (
    classify_seniority,
    estimate_resume_seniority,
    extract_required_experience,
    extract_resume_experience,
)
from app.services.shortlist_predictor import predict_shortlist_probability



class ResumeRequest(BaseModel):
    resume_text: str
    job_description: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://talentforge-one.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def root():
    return {"message": "AI Resume Intelligence API is running"}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "TalentForge AI",
        "semantic_enabled": False,
    }


# Versioned aliases
@app.get("/v1")
def root_v1():
    return root()


@app.get("/v1/health")
def health_v1():
    return health()



@app.post("/analyze")
def analyze_resume(request: ResumeRequest):
    return {
        "received_resume_text": request.resume_text,
        "received_job_description": request.job_description
    }

def _parse_resume_pdf(file: UploadFile) -> dict:
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "MISSING_FILE",
                "message": "No resume file was provided.",
            },
        )

    if file.content_type not in ("application/pdf", "application/x-pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "INVALID_FILE_TYPE",
                "message": "Only PDF resumes are supported.",
            },
        )

    try:
        contents = file.file.read()

        with pdfplumber.open(io.BytesIO(contents)) as pdf:
            pages_text = []
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text)
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "code": "RESUME_PARSE_ERROR",
                "message": "Failed to parse the uploaded resume PDF.",
                "error": str(exc),
            },
        )

    raw_text = "\n".join(pages_text)
    cleaned_text = clean_text(raw_text)

    sections = extract_sections(cleaned_text)
    skills = extract_skills(sections, cleaned_text)

    return {
        "filename": file.filename,
        "detected_sections": list(sections.keys()),
        "extracted_skills": skills,
        "cleaned_text": cleaned_text,
    }


@app.post("/upload-resume")
def upload_resume(file: UploadFile = File(...)):
    return _parse_resume_pdf(file)


@app.post("/v1/upload-resume")
def upload_resume_v1(file: UploadFile = File(...)):
    return _parse_resume_pdf(file)




class ATSMatchRequest(BaseModel):
    resume_text: str
    job_description: str
    job_role: str | None = None




def _run_ats_match(request: ATSMatchRequest) -> dict:
    if not request.resume_text or not request.job_description:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "MISSING_FIELDS",
                "message": "Both resume_text and job_description are required.",
            },
        )

    try:
        # Extract skills
        resume_skills = extract_skills({}, request.resume_text, mode="resume")
        jd_skills = extract_skills({}, request.job_description, mode="jd")

        # Auto-infer role if not provided
        job_role = request.job_role
        if not job_role:
            job_role = infer_job_role(jd_skills)

        # Skill-based analysis
        analysis = analyze_skill_gap(
            resume_skills=resume_skills,
            jd_skills=jd_skills,
            job_role=job_role,
        )

        # -------------------------------
        # EXPERIENCE + SENIORITY LOGIC
        # -------------------------------

        required_years = extract_required_experience(request.job_description)
        resume_years = extract_resume_experience(request.resume_text)

        jd_seniority = classify_seniority(request.job_description)
        resume_seniority = estimate_resume_seniority(resume_years)

        seniority_penalty = 0
        if jd_seniority == "senior" and resume_seniority in ["junior", "mid"]:
            seniority_penalty = 15
        elif jd_seniority == "mid" and resume_seniority == "junior":
            seniority_penalty = 8

        experience_penalty = 0

        if required_years:
            if resume_years is None:
                resume_years = 0

            if resume_years < required_years:
                gap = required_years - resume_years
                experience_penalty = gap * 5

        total_penalty = experience_penalty + seniority_penalty

        # -------------------------------
        # SEMANTIC SIMILARITY
        # -------------------------------

        semantic_similarity = compute_document_similarity(
            resume_text=request.resume_text,
            job_description=request.job_description,
        )

        # -------------------------------
        # FINAL HYBRID SCORE
        # -------------------------------

        base_skill_score = analysis["ats_score"]

        hybrid_score = min(
            100,
            base_skill_score + semantic_similarity * 10,
        )
        hybrid_score = round(hybrid_score, 2)

        adjusted_score = round(max(hybrid_score - total_penalty, 0), 2)

        # -------------------------------
        # RECLASSIFY USING ADJUSTED SCORE
        # -------------------------------

        from app.services.skill_gap_analyzer import classify_application_readiness

        application_status = classify_application_readiness(adjusted_score)

        # -------------------------------
        # SHORTLIST PREDICTION
        # -------------------------------

        shortlist_prediction = predict_shortlist_probability(
            final_score=adjusted_score,
            semantic_similarity=semantic_similarity,
            critical_missing=analysis["critical_missing"],
        )

        # -------------------------------
        # UPDATE ANALYSIS OBJECT
        # -------------------------------

        analysis.update(
            {
                "application_status": application_status,
                "semantic_similarity": semantic_similarity,
                "hybrid_score": hybrid_score,
                "adjusted_score": adjusted_score,
                "experience_penalty": experience_penalty,
                "seniority_penalty": seniority_penalty,
            }
        )

        # -------------------------------
        # FEEDBACK (NOW USES ADJUSTED SCORE)
        # -------------------------------

        feedback = generate_feedback(
            ats_score=adjusted_score,
            missing_skills=analysis["missing_skills"],
            critical_missing=analysis["critical_missing"],
            optional_missing=analysis["optional_missing"],
            application_status=application_status,
            shortlist_prediction=shortlist_prediction,
            improvement_plan=analysis.get("improvement_plan"),
            skill_impact=analysis.get("skill_impact", {}),
        )

        return {
            "resume_skills": resume_skills,
            "job_description_skills": jd_skills,
            "shortlist_prediction": shortlist_prediction,
            "inferred_role": job_role,
            "analysis": {
                **analysis,
                "semantic_similarity": semantic_similarity,
                "final_ats_score": adjusted_score,
            },
            "feedback": feedback,
        }
    except HTTPException:
        # Re-raise structured HTTP errors as-is
        raise
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "code": "ATS_MATCH_ERROR",
                "message": "Unexpected error while running ATS match.",
                "error": str(exc),
            },
        )


@app.post("/ats-match")
def ats_match(request: ATSMatchRequest):
    return _run_ats_match(request)


@app.post("/v1/ats-match")
def ats_match_v1(request: ATSMatchRequest):
    return _run_ats_match(request)
