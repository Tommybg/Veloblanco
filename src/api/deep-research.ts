import type { DeepResearchRequest, DeepResearchResponse } from "@/types/research";

const API_BASE_URL =
  (import.meta as any)?.env?.VITE_API_BASE_URL ||
  (import.meta as any)?.env?.VITE_API_URL ||
  "http://localhost:3001";

const DEEP_RESEARCH_URL = `${API_BASE_URL}/api/deep-research`;
const HEALTH_URL = `${API_BASE_URL}/api/health`;

export async function triggerDeepResearch(
  query: string,
  clarification?: string
): Promise<DeepResearchResponse> {
  const payload: DeepResearchRequest = { query, clarification };
  const response = await fetch(DEEP_RESEARCH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let msg = `Deep research API error: ${response.status}`;
    try {
      const data = await response.json();
      if (data?.error) msg += ` - ${data.error}`;
    } catch {}
    throw new Error(msg);
  }
  return (await response.json()) as DeepResearchResponse;
}

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(HEALTH_URL);
    if (!res.ok) return false;
    const data = await res.json();
    return data?.status === "ok";
  } catch {
    return false;
  }
}


