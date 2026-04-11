from __future__ import annotations

from typing import Dict, List, Tuple
import re
from statistics import mean

from .roaster import LifestyleRoaster


CATEGORY_COLORS = {
    "Impulse-Buying": "#ff2d95",
    "Survival-Green": "#24f08c",
    "Subscription-Blue": "#2b8cff",
    "Uncertain": "#94a3b8",
}


def normalize_recurring_key(clean_description: str) -> str:
    key = re.sub(r"\b\d+\b", "", clean_description.lower())
    key = re.sub(r"[^a-z0-9 ]+", " ", key)
    return re.sub(r"\s+", " ", key).strip()


def detect_recurring_items(
    transactions: List[Dict[str, str]],
) -> Tuple[List[Dict[str, float]], Dict[str, bool]]:
    groups: Dict[str, List[Dict[str, str]]] = {}
    for tx in transactions:
        key = normalize_recurring_key(tx["clean_description"])
        if not key:
            continue
        groups.setdefault(key, []).append(tx)

    recurring_items: List[Dict[str, float]] = []
    recurring_keys: Dict[str, bool] = {}

    for key, items in groups.items():
        if len(items) < 2:
            continue
        amounts = [float(item["amount"]) for item in items]
        avg_amount = mean(amounts)
        if avg_amount == 0:
            continue
        variance = mean([(amount - avg_amount) ** 2 for amount in amounts])
        variance_ratio = (variance ** 0.5) / avg_amount if avg_amount else 0

        is_recurring = len(items) >= 3 or variance_ratio <= 0.15
        if not is_recurring:
            continue

        recurring_keys[key] = True
        recurring_items.append(
            {
                "name": key.upper()[:48],
                "count": len(items),
                "average_amount": avg_amount,
                "total_amount": sum(amounts),
            }
        )

    recurring_items.sort(key=lambda item: item["total_amount"], reverse=True)
    return recurring_items, recurring_keys


def analyze_transactions(
    transactions: List[Dict[str, str]],
    roaster: LifestyleRoaster,
) -> Dict[str, object]:
    # 7-Step Pipeline: ingest -> clean -> embed/classify -> recurring detect -> aggregate -> roast
    processed: List[Dict[str, object]] = []

    skip_keywords = [
        "opening balance", "closing balance", "total deposit", "total withdrawal",
        "paycheck", "direct deposit"
    ]

    for tx in transactions:
        cleaned = roaster.clean_transaction(tx.get("description", ""))
        
        if any(skip in cleaned.lower() for skip in skip_keywords):
            continue
            
        category, similarity = roaster.classify_transaction(cleaned)
        processed.append(
            {
                "date": tx.get("date", ""),
                "description": tx.get("description", ""),
                "clean_description": cleaned,
                "amount": float(tx.get("amount", 0)),
                "category": category,
                "similarity": similarity,
                "is_recurring": False,
            }
        )

    recurring_items, recurring_keys = detect_recurring_items(processed)
    for tx in processed:
        key = normalize_recurring_key(tx["clean_description"])
        tx["is_recurring"] = key in recurring_keys

    total_spent = sum(tx["amount"] for tx in processed)
    totals: Dict[str, Dict[str, float]] = {
        "Impulse-Buying": {"amount": 0.0, "count": 0},
        "Survival-Green": {"amount": 0.0, "count": 0},
        "Subscription-Blue": {"amount": 0.0, "count": 0},
        "Uncertain": {"amount": 0.0, "count": 0},
    }

    for tx in processed:
        category = tx["category"]
        if category not in totals:
            continue
        totals[category]["amount"] += float(tx["amount"])
        totals[category]["count"] += 1

    breakdown = []
    for name, data in totals.items():
        amount = data["amount"]
        percentage = (amount / total_spent * 100) if total_spent else 0.0
        breakdown.append(
            {
                "id": f"{name.lower().replace(' ', '-')}",
                "name": name,
                "amount": amount,
                "percentage": percentage,
                "count": int(data["count"]),
                "color": CATEGORY_COLORS.get(name, "#6b7280"),
            }
        )
    roast = roaster.generate_roast(breakdown, recurring_items, processed)
    return {
        "total_spent": total_spent,
        "breakdown": breakdown,
        "transactions": processed,
        "recurring_items": recurring_items,
        "roast": {
            "diagnosis": roast.diagnosis,
            "leak": roast.leak,
            "recommendations": roast.recommendations,
        },
    }
