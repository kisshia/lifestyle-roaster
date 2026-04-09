
  # E-Wallet Analyzer Prototype

  This is a code bundle for E-Wallet Analyzer Prototype. The original project is available at https://www.figma.com/design/ggb9pAWMZBPe3oypSneY61/E-Wallet-Analyzer-Prototype.

  ## Running the code

  ### Backend (FastAPI)
  1. `cd backend`
  2. `python -m venv .venv`
  3. `./.venv/Scripts/activate` (Windows PowerShell)
  4. `pip install -r requirements.txt`
  5. `uvicorn app.main:app --reload`

  The API runs on `http://localhost:8000` and accepts `POST /analyze` with a file upload.

  ### Frontend (React)
  1. `npm i`
  2. `npm run dev`
  
