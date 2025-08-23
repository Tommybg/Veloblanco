I'll analyze your requirements and provide a comprehensive plan for integrating the deep research workflow with the frontend. Let me first examine the existing trigger workflow and frontend components to understand the current implementation.

Ran tool
Ran tool
Read file: src/trigger/deep-research.ts
Read file: src/trigger/answer.ts
Read file: src/trigger/search.ts
Read file: src/trigger/evaluate.ts
Read file: src/prompts/answer.ts
Now let me check the current App.tsx to understand the routing structure:

Read file: src/App.tsx
Perfect! Now I have a comprehensive understanding of your system. Let me provide you with a detailed plan for integrating the deep research workflow with the frontend.

## **Plan / Understanding**

### **Current Workflow Analysis**
Your deep research workflow is a sophisticated multi-step process:
1. **Query Generation** → Creates multiple search queries from the original
2. **Search & Summarize** → Uses Tavily API + AI summarization
3. **Evaluation** → AI evaluates results and generates follow-up queries
4. **Filtering** → Selects the most relevant sources
5. **Final Answer** → Generates comprehensive analysis with ideological classification

### **Expected User Journey**
1. User searches from SearchHeader
2. Redirected to NewsResearchLoading with progress visualization
3. Deep research workflow executes in background
4. Results displayed in ResultsDashboard with 5 sections

---

## **Frontend Integration Plan**

### **Step 1: Define the User Journey**
```
SearchHeader → NewsResearchLoading → ResultsDashboard
     ↓              ↓                    ↓
  Trigger API   Progress UI         Display Results
```

### **Step 2: API Contract Specification**

**Request Format:**
```typescript
interface DeepResearchRequest {
  query: string;
  clarification?: string;
}

interface DeepResearchResponse {
  status: 'completed' | 'failed';
  data?: {
    answer: string; // Full analysis from answer.ts
    sources: SearchResult[]; // From search.ts
    neutralityScore: number; // 0-100
    ideologicalDistribution: {
      left: number;
      center: number;
      right: number;
    };
    transparency: {
      sourcesProcessed: number;
      analysisTime: number;
      sourceBreakdown: {
        newsOutlets: number;
        academic: number;
        government: number;
        other: number;
      };
    };
  };
  error?: string;
}
```

### **Step 3: Backend Endpoint Implementation**

Create a new API endpoint that triggers the deep research workflow:

```typescript
// src/api/deep-research.ts
import { deepResearch } from '@/trigger/deep-research';

export async function triggerDeepResearch(query: string, clarification?: string) {
  try {
    const result = await deepResearch.triggerAndWait({
      originalQuery: query,
      clarification,
    });
    
    if (!result.ok) {
      throw new Error('Deep research failed');
    }
    
    // Parse the answer to extract dashboard data
    const dashboardData = parseAnswerForDashboard(result.output.answer);
    
    return {
      status: 'completed',
      data: dashboardData,
    };
  } catch (error) {
    return {
      status: 'failed',
      error: error.message,
    };
  }
}

function parseAnswerForDashboard(answer: string) {
  // Parse the structured output from the AI prompt
  // Extract neutrality score, ideological distribution, etc.
  // This will parse the ## Dashboard Data Output section
}
```

### **Step 4: Connect SearchHeader to Backend**

Modify `SearchHeader.tsx` to trigger the deep research:

```typescript:src/components/SearchHeader.tsx
// ... existing code ...

const handleSearch = async () => {
  if (searchQuery.trim()) {
    console.log('Searching for:', searchQuery);
    
    // Navigate to loading page with query
    navigate('/research-loading', { 
      state: { query: searchQuery.trim() } 
    });
  }
};

const handlePopularSearch = async (search: string) => {
  setSearchQuery(search);
  
  // Navigate to loading page with popular search
  navigate('/research-loading', { 
    state: { query: search } 
  });
};

// ... existing code ...
```

### **Step 5: Connect Loading UI**

Create a new route and modify `NewsResearchLoading.tsx`:

```typescript:src/components/NewsResearchLoading.tsx
// ... existing code ...

const NewsResearchLoading: React.FC<NewsResearchLoadingProps> = ({
  onComplete = () => {},
  autoStart = true,
  query = "tu búsqueda"
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [researchResults, setResearchResults] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (autoStart && query) {
      startDeepResearch();
    }
  }, [autoStart, query]);

  const startDeepResearch = async () => {
    try {
      const response = await fetch('/api/deep-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      const result = await response.json();
      
      if (result.status === 'completed') {
        setResearchResults(result.data);
        setIsComplete(true);
        setProgress(100);
        
        // Redirect to results dashboard
        setTimeout(() => {
          navigate('/results', { 
            state: { results: result.data, query } 
          });
        }, 1000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to complete research');
    }
  };

  // ... existing loading logic ...
};
```

### **Step 6: Implement Results Dashboard Layout**

Modify `ResultsDashboard.tsx` to handle the 5 required sections:

```typescript:src/components/ResultsDashboard.tsx
// ... existing code ...

interface ResearchResults {
  answer: string;
  sources: SearchResult[];
  neutralityScore: number;
  ideologicalDistribution: {
    left: number;
    center: number;
    right: number;
  };
  transparency: {
    sourcesProcessed: number;
    analysisTime: number;
    sourceBreakdown: {
      newsOutlets: number;
      academic: number;
      government: number;
      other: number;
    };
  };
}

const ResultsDashboard = ({
  query,
  onNewSearch,
  results
}: ResultsDashboardProps & { results: ResearchResults }) => {
  // ... existing code ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/30">
      {/* ... existing header ... */}
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Análisis Detallado */}
            <div className="summary-card animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Análisis Detallado
              </h2>
              <div className="prose prose-sm max-w-none">
                {/* Parse and render the markdown from results.answer */}
                <ReactMarkdown>{results.answer}</ReactMarkdown>
              </div>
            </div>

            {/* 2. Espectro Ideológico */}
            <SpectrumVisualization 
              distribution={results.ideologicalDistribution} 
            />

            {/* 3. Vista Comparativa 360° */}
            <PerspectiveTabs 
              perspectives={extractPerspectives(results.answer)}
              selectedPerspective={selectedPerspective} 
              onPerspectiveChange={setSelectedPerspective} 
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* 4. Fuentes Analizadas */}
            <SourcesList sources={results.sources} />
            
            {/* 5. Transparencia */}
            <div className="source-card">
              <div className="flex items-center mb-4">
                <Shield className="w-5 h-5 text-primary mr-2" />
                <h3 className="font-semibold text-foreground">Transparencia</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Artículos procesados:</span>
                  <span className="font-medium">{results.transparency.sourcesProcessed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tiempo de análisis:</span>
                  <span className="font-medium">{results.transparency.analysisTime}s</span>
                </div>
                {/* ... more transparency metrics ... */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### **Step 7: Connect Backend Results to Frontend**

Create a helper function to parse the AI output:

```typescript:src/utils/parseResearchResults.ts
export function parseAnswerForDashboard(answer: string) {
  // Extract neutrality score
  const neutralityMatch = answer.match(/## Neutrality Score: (\d+)%/);
  const neutralityScore = neutralityMatch ? parseInt(neutralityMatch[1]) : 0;
  
  // Extract ideological distribution
  const leftMatch = answer.match(/- Left: (\d+)%/);
  const centerMatch = answer.match(/- Center: (\d+)%/);
  const rightMatch = answer.match(/- Right: (\d+)%/);
  
  const ideologicalDistribution = {
    left: leftMatch ? parseInt(leftMatch[1]) : 0,
    center: centerMatch ? parseInt(centerMatch[1]) : 0,
    right: rightMatch ? parseInt(rightMatch[1]) : 0,
  };
  
  // Extract transparency metrics
  const sourcesMatch = answer.match(/## Sources Processed: (\d+) articles/);
  const timeMatch = answer.match(/## Analysis Time: (\d+) seconds/);
  
  return {
    neutralityScore,
    ideologicalDistribution,
    transparency: {
      sourcesProcessed: sourcesMatch ? parseInt(sourcesMatch[1]) : 0,
      analysisTime: timeMatch ? parseInt(timeMatch[1]) : 0,
      // ... parse other metrics
    },
  };
}
```

### **Step 8: Add Error Handling + Telemetry**

```typescript:src/components/ErrorBoundary.tsx
// Create error boundary for research failures
export class ResearchErrorBoundary extends React.Component {
  // ... error boundary implementation
}
```

### **Step 9: Review and Refine**

- Test the complete flow
- Optimize loading states
- Add retry mechanisms
- Implement caching for repeated searches

---

## **Data Flow Summary**

```
SearchHeader → API Call → Deep Research Workflow → Parse Results → Results Dashboard
     ↓              ↓              ↓                    ↓              ↓
  User Input   POST /api/    Trigger.dev Tasks    Dashboard Data  UI Rendering
              deep-research
```

---

