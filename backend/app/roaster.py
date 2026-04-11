from __future__ import annotations

from dataclasses import dataclass
import re
import threading
from typing import Dict, List, Tuple

import numpy as np
from sentence_transformers import SentenceTransformer
from transformers import pipeline


NOISE_PATTERNS = [
    r"\bPOS\s*DEBIT\b",
    r"\bPOS\b",
    r"\bDEBIT\b",
    r"\bPH\b",
    r"\bREF(?:ERENCE)?\b\s*#?\s*\d+",
    r"\bTRX\b\s*#?\s*\d+",
    r"\bTXN\b\s*#?\s*\d+",
    r"\bAUTH\b\s*#?\s*\d+",
    r"\b\d{8,}\b",
]

SUBSCRIPTION_HINTS = [
    "subscription",
    "monthly",
    "netflix",
    "spotify",
    "youtube premium",
    "prime",
    "icloud",
    "adobe",
    "gym membership",
    "google one",
    "microsoft",
    "apple music",
    "disney",
]

SURVIVAL_HINTS = [
    "grocery",
    "supermarket",
    "rent",
    "utility",
    "electric",
    "water",
    "internet",
    "bill payment",
    "medicine",
    "pharmacy",
    "hospital",
    "clinic",
    "insurance",
    "tuition",
    "school",
    "meralco",
    "maynilad",
    "pldt",
    "globe",
]

IMPULSE_HINTS = [
    "food delivery",
    "grabfood",
    "foodpanda",
    "coffee",
    "milk tea",
    "shopping",
    "lazada",
    "shopee",
    "entertainment",
    "games",
    "steam",
    "movie",
    "concert",
]


@dataclass
class RoastFindings:
    diagnosis: str
    leak: str
    recommendations: List[str]


class LifestyleRoaster:
    def __init__(self) -> None:
        self._model_name = "all-MiniLM-L6-v2"
        self._model_lock = threading.Lock()
        self.model: SentenceTransformer | None = None
        self.zs_classifier = None
        self.category_seeds: Dict[str, List[str]] = {
            "Impulse-Buying": [
                "food delivery",
                "coffee and snacks",
                "rideshare convenience",
                "online shopping",
                "fashion and retail",
                "games and entertainment",
                "treats and splurges",
            ],
            "Survival-Green": [
                "groceries and essentials",
                "rent and housing",
                "utilities and bills",
                "medicine and healthcare",
                "education",
                "transportation for work",
            ],
            "Subscription-Blue": [
                "monthly subscription",
                "streaming services",
                "software membership",
                "recurring fee",
                "digital subscription",
            ],
        }
        self.category_embeddings: Dict[str, np.ndarray] = {}

    def _build_category_embeddings(self) -> Dict[str, np.ndarray]:
        category_embeddings: Dict[str, np.ndarray] = {}
        for category, seeds in self.category_seeds.items():
            if self.model is None:
                raise RuntimeError("Model is not initialized.")
            embeddings = self.model.encode(seeds, normalize_embeddings=False)
            category_embeddings[category] = np.mean(embeddings, axis=0)
        return category_embeddings

    def _init_models_background(self) -> None:
        with self._model_lock:
            if self.model is None:
                self.model = SentenceTransformer(self._model_name)
                self.category_embeddings = self._build_category_embeddings()
            if self.zs_classifier is None:
                self.zs_classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    def _ensure_model(self) -> None:
        if self.model is None or self.zs_classifier is None:
            # We explicitly invoke it synchronously if they call _ensure_model and it's missing,
            # or we can rely on a singleton background thread. The user requested background initialization,
            # so we check if thread is alive. Let's just start it if not initialized.
            if not hasattr(self, '_init_thread') or not self._init_thread.is_alive():
                self._init_thread = threading.Thread(target=self._init_models_background)
                self._init_thread.daemon = True
                self._init_thread.start()

    def clean_transaction(self, description: str) -> str:
        if not description:
            return ""
        cleaned = str(description).upper()
        for pattern in NOISE_PATTERNS:
            cleaned = re.sub(pattern, " ", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"[^A-Z0-9 ]+", " ", cleaned)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        return cleaned

    def _cosine_similarity(self, vector_a: np.ndarray, vector_b: np.ndarray) -> float:
        # score = (A dot B) / (||A|| * ||B||)
        denominator = (np.linalg.norm(vector_a) * np.linalg.norm(vector_b)) + 1e-12
        return float(np.dot(vector_a, vector_b) / denominator)

    def classify_transaction(self, cleaned_description: str) -> Tuple[str, float]:
        if not cleaned_description:
            return "Survival-Green", 0.0

        self._ensure_model()
        lowered = cleaned_description.lower()

        # Layer 1: Heuristic Fast-Pass
        for hint in SUBSCRIPTION_HINTS:
            if hint in lowered:
                return "Subscription-Blue", 1.0
        for hint in SURVIVAL_HINTS:
            if hint in lowered:
                return "Survival-Green", 0.9
        for hint in IMPULSE_HINTS:
            if hint in lowered:
                return "Impulse-Buying", 0.85

        # Layer 2: Semantic Zero-Shot
        if self.zs_classifier is not None and self.model is not None:
            candidate_labels = ["Impulse-Buying", "Survival-Green", "Subscription-Blue"]
            zs_result = self.zs_classifier(cleaned_description, candidate_labels=candidate_labels)
            best_label = zs_result["labels"][0]
            best_score = zs_result["scores"][0]

            # Layer 3: Confidence Scoring & ST Validation
            if best_score < 0.38:
                return "Uncertain", best_score

            desc_embedding = self.model.encode([lowered], normalize_embeddings=False)[0]
            st_scores = {
                category: self._cosine_similarity(desc_embedding, embedding)
                for category, embedding in self.category_embeddings.items()
            }
            
            # Prevent hallucination: ensure ST score for the elected category is reasonably high
            if st_scores.get(best_label, 0) < 0.05:
                return "Uncertain", best_score

            return best_label, best_score

        # Fallback if models are still downloading in the background
        if self.model is not None:
            description_embedding = self.model.encode([lowered], normalize_embeddings=False)[0]
            scores = {
                category: self._cosine_similarity(description_embedding, embedding)
                for category, embedding in self.category_embeddings.items()
            }
            best_category = max(scores, key=scores.get)
            return best_category, scores[best_category]
            
        return "Uncertain", 0.0

    def generate_roast(
        self,
        breakdown: List[Dict[str, float]],
        recurring_items: List[Dict[str, float]],
        transactions: List[Dict[str, object]] = None,
    ) -> RoastFindings:
        totals = {item["name"]: item for item in breakdown}
        impulse = totals.get("Impulse-Buying", {"percentage": 0, "amount": 0})
        survival = totals.get("Survival-Green", {"percentage": 0, "amount": 0})
        subscription = totals.get("Subscription-Blue", {"percentage": 0, "amount": 0})

        avg_impulse_conf = 0.0
        if transactions:
            impulse_txs = [tx for tx in transactions if tx.get("category") == "Impulse-Buying"]
            if impulse_txs:
                avg_impulse_conf = float(np.mean([tx.get("similarity", 0) for tx in impulse_txs]))

        diagnosis = (
            "Your spending profile is balanced, but there is room to tighten the bolts."
        )
        if impulse["percentage"] >= 45:
            if avg_impulse_conf >= 0.85:
                diagnosis = (
                    "ABSOLUTE DISASTER. Impulse-Buying is cannibalizing your wealth. You are funding convenience with your future."
                )
            else:
                diagnosis = (
                    "Impulse-Buying dominates your spending. Convenience is winning, and your wallet is losing."
                )
        elif subscription["percentage"] >= 25:
            diagnosis = (
                "Subscription-Blue is bloated. Silent monthly charges are running the show."
            )
        elif survival["percentage"] >= 70:
            diagnosis = (
                "Survival-Green leads the pack. Essentials are heavy, so any inefficiency hurts more."
            )

        if recurring_items:
            top_recurring = sorted(
                recurring_items, key=lambda item: item["total_amount"], reverse=True
            )[0]
            leak = (
                f"Recurring leak detected: {top_recurring['name']} appears {top_recurring['count']} times "
                f"for a total of {top_recurring['total_amount']:.2f}."
            )
        else:
            top_category = max(breakdown, key=lambda item: item["percentage"])
            leak = (
                f"Biggest leak is {top_category['name']} at {top_category['percentage']:.1f}% of spending."
            )

        recommendations: List[str] = []
        if impulse["percentage"] >= 35:
            recommendations.append(
                "Set a weekly impulse cap and batch convenience purchases. Make it harder to tap-to-buy."
            )
        if subscription["percentage"] >= 15:
            recommendations.append(
                "Audit subscriptions this week. Pause any service you have not used in 14 days."
            )
        if survival["percentage"] >= 55:
            recommendations.append(
                "Negotiate or shop around for bills (internet, electricity). A 10% cut compounds quickly."
            )
        if not recommendations:
            recommendations.append(
                "Keep tracking and set a tiny savings target to build momentum without friction."
            )

        return RoastFindings(
            diagnosis=diagnosis,
            leak=leak,
            recommendations=recommendations,
        )
