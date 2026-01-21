import io
import pdfplumber
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

# self defined modules
from backend.app.utils.text_cleaning import clean_text
from backend.app.services.section_parser import extract_sections
from backend.app.services.skill_extractor import extract_skills
from backend.app.services.skill_gap_analyzer import analyze_skill_gap



class ResumeRequest(BaseModel):
    resume_text: str
    job_description: str

app = FastAPI()


@app.get("/")
def root():
    return {"message": "AI Resume Intelligence API is running"}


@app.post("/analyze")
def analyze_resume(request: ResumeRequest):
    return {
        "received_resume_text": request.resume_text,
        "received_job_description": request.job_description
    }

@app.post("/upload-resume")
def upload_resume(file: UploadFile = File(...)):
    contents = file.file.read()

    with pdfplumber.open(io.BytesIO(contents)) as pdf:
        pages_text = []
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                pages_text.append(text)

    raw_text = "\n".join(pages_text)
    cleaned_text = clean_text(raw_text)

    sections = extract_sections(cleaned_text)
    skills = extract_skills(sections, cleaned_text)

    return {
        "filename": file.filename,
        "detected_sections": list(sections.keys()),
        "extracted_skills": skills
    }


class ATSMatchRequest(BaseModel):
    resume_text: str
    job_description: str



@app.post("/ats-match")
def ats_match(request: ATSMatchRequest):
    resume_skills = extract_skills({}, request.resume_text)
    jd_skills = extract_skills({}, request.job_description)

    analysis = analyze_skill_gap(
        resume_skills=resume_skills,
        jd_skills=jd_skills
    )

    return {
        "resume_skills": resume_skills,
        "job_description_skills": jd_skills,
        "analysis": analysis
    }
