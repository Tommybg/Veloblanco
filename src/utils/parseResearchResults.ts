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