# 🤖 TalentForge - AI Resume Intelligence Platform

TalentForge is a full-stack AI-powered Resume Intelligence and ATS-style analysis platform.  
It evaluates how well a resume matches a given job description, computes a role-aware ATS score, and provides actionable feedback to improve job fit.

The system is designed with real-world constraints in mind, including explainability, scalability, and graceful degradation on low-memory infrastructure.

---

## 🚀 Live Demo

- **Frontend (Vercel):** https://talentforge-one.vercel.app/
- **Backend (Render):** https://ai-resume-intelligence-1kzv.onrender.com

---

## ✨ Key Features

- 📄 **Resume PDF Upload**
  - Upload resumes in PDF format
  - Server-side text extraction and parsing

- 🧠 **Skill Extraction & Categorization**
  - Programming Languages
  - Databases
  - ML / AI
  - Cloud & DevOps

- 📊 **ATS-Style Resume Scoring**
  - Role-based weighted scoring
  - Backend Engineer / ML Engineer / Frontend Engineer roles
  - Transparent and explainable scoring logic

- 🔍 **Skill Gap Analysis**
  - Matched skills
  - Missing skills
  - Category-wise evaluation

- 📝 **Actionable Feedback**
  - Clear recommendations on what skills to add or highlight
  - Human-readable feedback instead of black-box scores

- ⚙️ **Production-Ready Architecture**
  - Clean API separation
  - Frontend-backend decoupling
  - Graceful handling of infrastructure constraints

---

## 🧩 Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Deployed on Vercel

### Backend

- FastAPI
- Python
- pdfplumber (PDF parsing)
- Pydantic (request/response validation)
- Deployed on Render

---

## 📐 ATS Scoring Logic (High-Level)

1. Extract skills from:
   - Resume
   - Job Description
2. Categorize skills into predefined domains
3. Apply **role-based weights**:
   - Backend Engineer
   - ML Engineer
   - Frontend Engineer
4. Compute weighted match percentage
5. Generate explainable feedback based on missing skills

This approach mirrors how real ATS systems prioritize skills differently based on role.

---

## 🧠 Semantic Matching (Design Note)

The system includes optional **semantic skill matching** using transformer-based embeddings.

- Semantic matching is **feature-flagged**
- Disabled by default on low-memory deployments
- Can be enabled on higher-memory infrastructure without code changes

This design allows the system to:

- Remain stable on free-tier infrastructure
- Scale intelligently when resources allow

---

## 🛡️ Graceful Degradation Strategy

On constrained infrastructure:

- Exact skill matching is used
- ATS scoring remains correct and explainable
- No silent failures or incorrect scores

This reflects real-world engineering tradeoffs rather than toy implementations.

---

## 🧪 Local Development

### Backend

```bash
cd backend
python -m venv resume_env
source resume_env/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📄 License

This project is for educational and portfolio purposes.

## 👤 Author

Yashasvi Shukla

M.Tech (Computer Science)
Full-Stack & AI-focused Developer

## ⭐ Why This Project Matters

TalentForge is not a tutorial project.
It demonstrates:

- End-to-end system design
- Real deployment constraints
- Explainable AI principles
- Production-grade decision making

This makes it suitable for interviews and real-world discussions, not just demos.
