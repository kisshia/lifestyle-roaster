from __future__ import annotations

import csv
import io
import re
from typing import Dict, List

import pandas as pd


def decode_bytes(file_bytes: bytes) -> str:
    for encoding in ("utf-8", "utf-8-sig", "cp1252", "latin-1"):
        try:
            return file_bytes.decode(encoding)
        except UnicodeDecodeError:
            continue
    return file_bytes.decode("utf-8", errors="ignore")


def detect_delimiter(sample: str) -> str:
    try:
        return csv.Sniffer().sniff(sample).delimiter
    except csv.Error:
        return ","


def parse_csv_text(text: str) -> List[Dict[str, str]]:
    sample = text.split("\n", maxsplit=5)[0:5]
    delimiter = detect_delimiter("\n".join(sample))

    df = pd.read_csv(io.StringIO(text), delimiter=delimiter, engine="python")
    if df.empty:
        return []

    normalized_columns = {col.lower().strip(): col for col in df.columns}

    def find_column(candidates: List[str]) -> str | None:
        for candidate in candidates:
            if candidate in normalized_columns:
                return normalized_columns[candidate]
        return None

    date_col = find_column(["date", "timestamp", "time"])
    desc_col = find_column(["description", "details", "merchant", "transaction", "name"])
    amount_col = find_column(["amount", "value", "price", "cost"])

    if not (date_col and desc_col and amount_col):
        # Fallback: assume first three columns
        columns = list(df.columns)
        if len(columns) >= 3:
            date_col, desc_col, amount_col = columns[0], columns[1], columns[2]
        else:
            return []

    transactions: List[Dict[str, str]] = []
    for _, row in df.iterrows():
        date = str(row.get(date_col, "")).strip()
        description = str(row.get(desc_col, "")).strip()
        amount_raw = str(row.get(amount_col, "")).strip()
        if not description:
            continue
        amount = parse_amount(amount_raw)
        if amount is None or amount == 0:
            continue
        transactions.append({
            "date": date,
            "description": description,
            "amount": amount,
        })
    return transactions


def parse_amount(raw: str) -> float | None:
    if raw is None:
        return None
    cleaned = re.sub(r"[^0-9.\-]", "", raw)
    if not cleaned:
        return None
    try:
        return abs(float(cleaned))
    except ValueError:
        return None


def parse_text_lines(text: str) -> List[Dict[str, str]]:
    transactions: List[Dict[str, str]] = []
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    patterns = [
        re.compile(
            r"(?P<date>\d{1,4}[-/\.]\d{1,2}[-/\.]\d{1,4}|[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})\s+"
            r"(?P<description>.+?)\s+"
            r"(?P<amount>[+-]?\s?[?$P]?\s?[\d,]+\.\d{2})"
        ),
        re.compile(
            r"(?P<amount>[+-]?\s?[?$P]?\s?[\d,]+\.\d{2})\s+"
            r"(?P<date>\d{1,4}[-/\.]\d{1,2}[-/\.]\d{1,4}|[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})\s+"
            r"(?P<description>.+)"
        ),
    ]

    for line in lines:
        for pattern in patterns:
            match = pattern.search(line)
            if not match:
                continue
            date = match.group("date").strip()
            description = match.group("description").strip()
            amount = parse_amount(match.group("amount"))
            if amount is None or amount == 0:
                continue
            transactions.append({
                "date": date,
                "description": description,
                "amount": amount,
            })
            break

    return transactions


def looks_like_csv(text: str) -> bool:
    header = text.split("\n", maxsplit=1)[0].lower()
    return "," in header and any(key in header for key in ["date", "description", "amount"])


def parse_transactions(file_bytes: bytes, filename: str | None = None) -> List[Dict[str, str]]:
    text = decode_bytes(file_bytes)
    extension = (filename or "").lower()

    if extension.endswith(".csv") or looks_like_csv(text):
        return parse_csv_text(text)

    # Treat as plain text with transaction lines
    transactions = parse_text_lines(text)
    if not transactions and "," in text:
        return parse_csv_text(text)
    return transactions
