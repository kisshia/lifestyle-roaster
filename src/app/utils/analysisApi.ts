export type LifestyleCategory = "Impulse-Buying" | "Survival-Green" | "Subscription-Blue";

export interface BreakdownItem {
  id: string;
  name: LifestyleCategory;
  amount: number;
  percentage: number;
  count: number;
  color: string;
}

export interface RoastFindings {
  diagnosis: string;
  leak: string;
  recommendations: string[];
}

export interface ProcessedTransaction {
  date: string;
  description: string;
  clean_description: string;
  amount: number;
  category: LifestyleCategory;
  similarity: number;
  is_recurring: boolean;
}

export interface RecurringItem {
  name: string;
  count: number;
  average_amount: number;
  total_amount: number;
}

export interface AnalysisResult {
  total_spent: number;
  breakdown: BreakdownItem[];
  transactions: ProcessedTransaction[];
  recurring_items: RecurringItem[];
  roast: RoastFindings;
  currency: string;
}

const DEFAULT_API_URL = "http://localhost:8000";

export async function analyzeFile(file: File): Promise<AnalysisResult> {
  const apiUrl = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL;
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${apiUrl}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let message = "Failed to analyze file.";
    try {
      const payload = await response.json();
      if (payload?.detail) {
        message = payload.detail;
      }
    } catch {
      const text = await response.text();
      if (text) message = text;
    }
    throw new Error(message);
  }

  return (await response.json()) as AnalysisResult;
}
