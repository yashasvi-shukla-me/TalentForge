# 🤖 TalentForge – AI Resume Intelligence Platform

TalentForge is a full‑stack AI-powered resume intelligence and ATS-style analysis platform.  
It evaluates how well a resume matches a given job description, computes a role‑aware ATS score, and provides concrete, human‑readable feedback to improve job fit.

The system is designed around **explainability**, **realistic deployment constraints** (free tiers, cold starts, limited memory), and a clean separation between frontend and backend.

---

## 🚀 Live demo

- **Frontend (Vercel)**: `https://talentforge-one.vercel.app/`
- **Backend API (Render)**: `https://ai-resume-intelligence-1kzv.onrender.com`

> The backend runs on Render’s free tier. If the service has been idle, the **first request may take a few seconds** while the server cold‑starts. Subsequent requests are much faster.

---

## Key capabilities

- **Resume PDF upload**
  - Upload a PDF resume.
  - Backend extracts text using `pdfplumber` and performs cleaning and sectioning.

- **Job description aware analysis**
  - Paste any real job description (or use built‑in templates per role on the frontend).
  - System aligns resume skills and experience against that specific JD, not a generic profile.

- **ATS-style scoring**
  - Role‑aware ATS score on a 0–100 scale.
  - Combines:
    - Explicit skill match.
    - Experience and seniority alignment.
    - Optional semantic document similarity.

- **Skill gap and match insights**
  - Detects:
    - Matched skills.
    - Missing and critical‑missing skills.
    - Category‑wise coverage (backend, frontend, data, ML, cloud, DevOps, etc.).

- **Shortlist probability & narrative feedback**
  - Predicts a shortlist probability band.
  - Generates human‑readable feedback and an improvement plan, not just a raw number.

- **Modern UX**
  - Dedicated landing page with a clear CTA (“Analyze your resume”).
  - Guided two‑step flow:
    - Step 1: Provide resume + JD + target role.
    - Step 2: View ATS score, skill gaps, and suggestions.

---

## 🧩 Tech stack

### Frontend

- React (Vite)
- Tailwind‑style utility classes
- Deployed on **Vercel**

Key files:

- `frontend/src/App.jsx` – landing page, analyzer flow, storytelling header.
- `frontend/src/api/atsApi.js` – API integration with the FastAPI backend.
- `frontend/src/components/*` – visualization components:
  - `ScoreCards`, `SkillMatrix`, `CategoryStrength`, `SimulationPanel`, `SeniorityPanel`, `RadialProgress`.

### Backend

- Python 3.12
- FastAPI + Uvicorn
- pdfplumber / pdfminer.six – PDF parsing
- Pydantic v2 – request/response models
- Sentence‑Transformers / Transformers (optional semantic similarity)
- Deployed on **Render** as a Web Service

Key modules:

- `backend/app/main.py` – FastAPI app, routes, CORS.
- `backend/app/services/*` – ATS engine, experience analysis, semantic similarity, feedback.
- `backend/app/utils/text_cleaning.py` – text cleaning / normalization.

---

## API overview

Base URL (Render): `https://ai-resume-intelligence-1kzv.onrender.com`

### `GET /`

Health‑style root endpoint.

**Response**

```json
{ "message": "AI Resume Intelligence API is running" }
```

### `GET /health`

Lightweight health check used by uptime monitoring and the frontend.

### `POST /upload-resume`

Accepts a PDF resume and returns:

- Cleaned text.
- Detected sections.
- Extracted skills by category.

### `POST /ats-match`

Main analysis endpoint.

**Request body**

```json
{
  "resume_text": "string",
  "job_description": "string",
  "job_role": "backend_engineer | frontend_engineer | fullstack_engineer | ml_engineer | data_engineer | devops_engineer | cloud_engineer | software_engineer | null"
}
```

**Response (high‑level)**

- `resume_skills` / `job_description_skills`
- `analysis`
  - ATS scores (base + hybrid + adjusted).
  - Skill gap breakdown.
  - Experience / seniority penalties.
  - `application_status` (Perfect / Strong / Moderate / Low / Very Weak Match).
- `shortlist_prediction`
  - Probability and confidence band.
- `feedback`
  - Narrative guidance and improvement plan.

---

## ATS scoring and reasoning

High‑level flow:

1. **Extract skills**
   - From resume and JD using a curated skill vocabulary and normalization (e.g., mapping `React.js`, `ReactJS` → `react`).
2. **Categorize and weight**
   - Skills mapped into categories (programming languages, frontend frameworks, backend frameworks, ML/AI, databases, cloud, DevOps, etc.).
   - Role‑specific weight tables (`ROLE_BASED_WEIGHTS`) prioritize relevant categories (e.g., backend vs. ML).
3. **Compute ATS score**
   - Category coverage × role weights → base ATS score.
4. **Experience and seniority adjustment**
   - Extract required experience from the JD and estimated years from the resume.
   - Classify JD and resume seniority (junior / mid / senior).
   - Apply penalties for gaps in years or seniority mismatch.
5. **Semantic similarity (optional)**
   - Compute transformer‑based similarity between resume and JD text.
   - Blend with skill‑based score to form a hybrid score.
6. **Application readiness classification**
   - Map adjusted score to:
     - Perfect Match
     - Strong Match
     - Moderate Match
     - Low Match
     - Very Weak Match
   - Each label includes a recommended action.

The frontend mirrors this logic with clear visual cues and consistent color mapping (green / yellow / amber / red) so the story is understandable at a glance.

---

## Semantic matching and graceful degradation

The backend is written to run on both **free‑tier** and **higher‑memory** infrastructure:

- Semantic (embedding‑based) similarity is **optional** and can be disabled when memory is tight.
- Even without semantic matching:
  - Exact skill matching remains correct and explainable.
  - ATS scores are still coherent and deterministic.
- This avoids silent failures or misleading scores when running on small machines.

---

## Local development

### Backend

```bash
cd backend
python -m venv resume_env
source resume_env/bin/activate  # Windows: resume_env\Scripts\activate
pip install -r requirements.txt

# Run FastAPI locally
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI runs on `http://localhost:5173` and is configured (via CORS) to talk to:

- `http://127.0.0.1:8000` in local development (when configured accordingly).
- The Render backend in production.

---

## Deployment notes

### Render (backend)

- Service type: **Web Service**.
- Recommended start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

- Health endpoints:
  - `/` and `/health` both return lightweight JSON and are safe for uptime monitors.
- Free tier behaviour:
  - Service **sleeps when idle** and can take ~30–90 seconds to wake on the first request.
  - TalentForge’s frontend surfaces a friendly “warming up” message to set user expectations.

### Vercel (frontend)

- Framework preset: **Vite + React**.
- Optional environment variable:
  - `VITE_API_BASE_URL` – override default backend base URL if needed.

---

## Why this project matters ⭐

TalentForge is built as a **portfolio‑grade**, discussion‑ready project rather than a toy tutorial:

- Demonstrates end‑to‑end system design (frontend, API, scoring engine, feedback).
- Handles real‑world deployment constraints (free tiers, cold starts, memory).
- Emphasizes **explainable AI**, not just high scores.
- Provides a strong base to discuss trade‑offs in interviews and technical conversations.

---

## Author

**Yashasvi Shukla**  
M.Tech (Computer Science) – Full‑Stack & AI‑focused Developer

---

## License

This project is intended for educational and portfolio use.  
If you are interested in using it commercially, please contact the author.
