from __future__ import annotations

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .parsing import parse_transactions
from .pipeline import analyze_transactions
from .roaster import LifestyleRoaster

app = FastAPI(title="Lifestyle Roaster API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

roaster = LifestyleRoaster()


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)) -> dict:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing file name.")

    content = await file.read()
    transactions = parse_transactions(content, file.filename)
    if not transactions:
        raise HTTPException(status_code=400, detail="No valid transactions found in file.")

    return analyze_transactions(transactions, roaster)
