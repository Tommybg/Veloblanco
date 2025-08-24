import type { DeepResearchRequest, DeepResearchResponse } from "@/types/research";
 
const API_BASE_URL =
  (import.meta as any)?.env?.VITE_API_BASE_URL ||
  (import.meta as any)?.env?.VITE_API_URL ||
  "http://localhost:3001";
 
const DEEP_RESEARCH_URL = `${API_BASE_URL}/api/deep-research`;
const DEEP_RESEARCH_START_URL = `${API_BASE_URL}/api/deep-research-start`;
const DEEP_RESEARCH_STREAM_URL = `${API_BASE_URL}/api/deep-research-stream`;
const DEEP_RESEARCH_RESULT_URL = `${API_BASE_URL}/api/deep-research-result`;
const HEALTH_URL = `${API_BASE_URL}/api/health`;
 
export interface ProgressUpdate {
  type: 'progress' | 'complete' | 'error';
  step?: number;
  message?: string;
  percentage?: number;
  status?: string;
  data?: any;
  error?: string;
}
 
export async function startResearchRun(
  query: string,
  clarification?: string
): Promise<{ runId: string; publicAccessToken?: string }> {
  const payload: DeepResearchRequest = { query, clarification };
  const response = await fetch(DEEP_RESEARCH_START_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let msg = `Deep research start API error: ${response.status}`;
    try {
      const data = await response.json();
      if (data?.error) msg += ` - ${data.error}`;
    } catch {}
    throw new Error(msg);
  }
  const result = await response.json();
  return { runId: result.runId, publicAccessToken: result.publicAccessToken };
}
 
export function subscribeToDeepResearchProgress(
  runId: string,
  onUpdate: (update: ProgressUpdate) => void,
  onComplete: (data: any) => void,
  onError: (error: string) => void
): () => void {
  const eventSource = new EventSource(`${DEEP_RESEARCH_STREAM_URL}/${runId}`);
 
  eventSource.onmessage = (event) => {
    try {
      const update: ProgressUpdate = JSON.parse(event.data);
     
      if (update.type === 'progress') {
        onUpdate(update);
      } else if (update.type === 'complete') {
        onComplete(update.data);
        eventSource.close();
      } else if (update.type === 'error') {
        onError(update.error || 'Unknown error');
        eventSource.close();
      }
    } catch (err) {
      console.error('Error parsing SSE message:', err);
    }
  };
 
  eventSource.onerror = (error) => {
    console.error('SSE error:', error);
    onError('Connection error');
    eventSource.close();
  };
 
  // Return cleanup function
  return () => {
    eventSource.close();
  };
}
 
// Legacy function for backwards compatibility
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
 
// (removed duplicate start function)
 
export async function fetchDeepResearchResult(runId: string): Promise<any> {
  const res = await fetch(`${DEEP_RESEARCH_RESULT_URL}/${runId}`);
  if (!res.ok) throw new Error(`Result fetch error: ${res.status}`);
  return await res.json();
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
 