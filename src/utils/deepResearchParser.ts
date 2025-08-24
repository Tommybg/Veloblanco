export interface ParsedDeepResearch {
  title: string;
  abstract: string;
  neutralityScore: number;
  ideologicalDistribution: {
    left: number;
    center: number;
    right: number;
  };
  sources: Array<{
    name: string;
    url: string;
    category: string;
    stance?: string;
    rating?: number;
  }>;
  perspectives: {
    left: {
      title: string;
      summary: string;
      keywords: string[];
    };
    center: {
      title: string;
      summary: string;
      keywords: string[];
    };
    right: {
      title: string;
      summary: string;
      keywords: string[];
    };
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

export function parseDeepResearchResponse(answer: string): ParsedDeepResearch {
  // Default values
  const defaultResult: ParsedDeepResearch = {
    title: "Análisis de Investigación",
    abstract: "Resumen del análisis de investigación.",
    neutralityScore: 85,
    ideologicalDistribution: { left: 25, center: 50, right: 25 },
    sources: [],
    perspectives: {
      left: {
        title: "Perspectiva Progresista",
        summary: "Resumen generado automáticamente a partir del análisis.",
        keywords: ["progresista"]
      },
      center: {
        title: "Perspectiva Neutral",
        summary: "Resumen generado automáticamente a partir del análisis.",
        keywords: ["neutral"]
      },
      right: {
        title: "Perspectiva Conservadora",
        summary: "Resumen generado automáticamente a partir del análisis.",
        keywords: ["conservador"]
      }
    },
    transparency: {
      sourcesProcessed: 0,
      analysisTime: 0,
      sourceBreakdown: {
        newsOutlets: 0,
        academic: 0,
        government: 0,
        other: 0
      }
    }
  };

  try {
    // Extract title (first H1 or first line)
    const titleMatch = answer.match(/^#\s*(.+)$/m) || answer.match(/^(.+)$/m);
    if (titleMatch) {
      defaultResult.title = titleMatch[1].trim();
    }

    // Extract abstract (between ## Abstract and next section)
    const abstractMatch = answer.match(/## Abstract\s*\n+([\s\S]*?)(?=\n## |$)/i);
    if (abstractMatch) {
      defaultResult.abstract = abstractMatch[1].trim();
    }

    // Extract neutrality score
    const neutralityMatch = answer.match(/Neutrality Score:\s*(\d+)%/i);
    if (neutralityMatch) {
      defaultResult.neutralityScore = parseInt(neutralityMatch[1]);
    }

    // Extract ideological distribution
    const leftMatch = answer.match(/Left:\s*(\d+)%/i);
    const centerMatch = answer.match(/Center:\s*(\d+)%/i);
    const rightMatch = answer.match(/Right:\s*(\d+)%/i);
    
    if (leftMatch && centerMatch && rightMatch) {
      defaultResult.ideologicalDistribution = {
        left: parseInt(leftMatch[1]),
        center: parseInt(centerMatch[1]),
        right: parseInt(rightMatch[1])
      };
    }

    // Extract sources from references section
    const referencesMatch = answer.match(/### References?\s*\n+([\s\S]*?)(?=\n---|$)/i);
    if (referencesMatch) {
      const referencesText = referencesMatch[1];
      const sourceLines = referencesText.split('\n').filter(line => line.trim());
      
      defaultResult.sources = sourceLines.map((line, index) => {
        // Extract URL from markdown link
        const urlMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (urlMatch) {
          const name = urlMatch[1].trim();
          const url = urlMatch[2].trim();
          
          // Try to extract category from the line
          let category = "Other";
          if (line.includes("– Center")) category = "Center";
          else if (line.includes("– Left")) category = "Left";
          else if (line.includes("– Right")) category = "Right";
          
          return { name, url, category };
        }
        
        // Fallback for lines without markdown links
        return {
          name: line.trim() || `Source ${index + 1}`,
          url: "#",
          category: "Other"
        };
      });
    }

    // Extract 360° Comparative Analysis - multiple pattern matching approaches
    const comparativeMatch = answer.match(/## 360° Comparative Analysis\s*\n+([\s\S]*?)(?=\n## |$)/i);
    if (comparativeMatch) {
      const comparativeText = comparativeMatch[1];
      console.log('Found comparative analysis section:', comparativeText.substring(0, 200) + '...');
      
      // Multiple pattern matching strategies for each perspective
      
      // LEFT PERSPECTIVE - try multiple patterns
      let leftSummary = '';
      const leftPatterns = [
        /\*\*Left Perspective\*\*:\s*([\s\S]*?)(?=\*\*Center Perspective\*\*|\*\*Right Perspective\*\*|\n\n## |$)/i,
        /Left Perspective:\s*([\s\S]*?)(?=Center Perspective:|Right Perspective:|\n\n## |$)/i,
        /Left:\s*([\s\S]*?)(?=Center:|Right:|\n\n## |$)/i,
        /Progresista:\s*([\s\S]*?)(?=Neutral:|Conservador:|\n\n## |$)/i,
        /Progressive:\s*([\s\S]*?)(?=Neutral:|Conservative:|\n\n## |$)/i,
        /Izquierda:\s*([\s\S]*?)(?=Centro:|Derecha:|\n\n## |$)/i
      ];
      
      for (const pattern of leftPatterns) {
        const match = comparativeText.match(pattern);
        if (match && match[1].trim().length > 10) {
          leftSummary = match[1].trim();
          console.log('Found left perspective with pattern:', pattern);
          break;
        }
      }
      
      if (leftSummary) {
        defaultResult.perspectives.left.summary = leftSummary;
        const keywords = extractKeywords(leftSummary);
        if (keywords.length > 0) {
          defaultResult.perspectives.left.keywords = keywords;
        }
      }

      // CENTER PERSPECTIVE - try multiple patterns
      let centerSummary = '';
      const centerPatterns = [
        /\*\*Center Perspective\*\*:\s*([\s\S]*?)(?=\*\*Left Perspective\*\*|\*\*Right Perspective\*\*|\n\n## |$)/i,
        /Center Perspective:\s*([\s\S]*?)(?=Left Perspective:|Right Perspective:|\n\n## |$)/i,
        /Center:\s*([\s\S]*?)(?=Left:|Right:|\n\n## |$)/i,
        /Neutral:\s*([\s\S]*?)(?=Progresista:|Conservador:|\n\n## |$)/i,
        /Neutral:\s*([\s\S]*?)(?=Progressive:|Conservative:|\n\n## |$)/i,
        /Centro:\s*([\s\S]*?)(?=Izquierda:|Derecha:|\n\n## |$)/i
      ];
      
      for (const pattern of centerPatterns) {
        const match = comparativeText.match(pattern);
        if (match && match[1].trim().length > 10) {
          centerSummary = match[1].trim();
          console.log('Found center perspective with pattern:', pattern);
          break;
        }
      }
      
      if (centerSummary) {
        defaultResult.perspectives.center.summary = centerSummary;
        const keywords = extractKeywords(centerSummary);
        if (keywords.length > 0) {
          defaultResult.perspectives.center.keywords = keywords;
        }
      }

      // RIGHT PERSPECTIVE - try multiple patterns
      let rightSummary = '';
      const rightPatterns = [
        /\*\*Right Perspective\*\*:\s*([\s\S]*?)(?=\*\*Left Perspective\*\*|\*\*Center Perspective\*\*|\n\n## |$)/i,
        /Right Perspective:\s*([\s\S]*?)(?=Left Perspective:|Center Perspective:|\n\n## |$)/i,
        /Right:\s*([\s\S]*?)(?=Left:|Center:|\n\n## |$)/i,
        /Conservador:\s*([\s\S]*?)(?=Progresista:|Neutral:|\n\n## |$)/i,
        /Conservative:\s*([\s\S]*?)(?=Progressive:|Neutral:|\n\n## |$)/i,
        /Derecha:\s*([\s\S]*?)(?=Izquierda:|Centro:|\n\n## |$)/i
      ];
      
      for (const pattern of rightPatterns) {
        const match = comparativeText.match(pattern);
        if (match && match[1].trim().length > 10) {
          rightSummary = match[1].trim();
          console.log('Found right perspective with pattern:', pattern);
          break;
        }
      }
      
      if (rightSummary) {
        defaultResult.perspectives.right.summary = rightSummary;
        const keywords = extractKeywords(rightSummary);
        if (keywords.length > 0) {
          defaultResult.perspectives.right.keywords = keywords;
        }
      }
      
      // Log what we found
      console.log('Extracted perspectives:', {
        left: leftSummary ? 'Found' : 'Not found',
        center: centerSummary ? 'Found' : 'Not found',
        right: rightSummary ? 'Found' : 'Not found'
      });
    }

    // Extract transparency metrics - improved pattern matching
    const sourcesProcessedMatch = answer.match(/Sources Processed:\s*(\d+)/i);
    if (sourcesProcessedMatch) {
      defaultResult.transparency.sourcesProcessed = parseInt(sourcesProcessedMatch[1]);
    }

    const analysisTimeMatch = answer.match(/Analysis Time:\s*(\d+)\s*seconds?/i);
    if (analysisTimeMatch) {
      defaultResult.transparency.analysisTime = parseInt(analysisTimeMatch[1]);
    }

    // Extract source breakdown from table - improved pattern matching
    const sourceBreakdownMatch = answer.match(/\|\s*News Outlets\s*\|\s*(\d+)\s*\|/i);
    if (sourceBreakdownMatch) {
      defaultResult.transparency.sourceBreakdown.newsOutlets = parseInt(sourceBreakdownMatch[1]);
    }

    const academicMatch = answer.match(/\|\s*Academic\s*\|\s*(\d+)\s*\|/i);
    if (academicMatch) {
      defaultResult.transparency.sourceBreakdown.academic = parseInt(academicMatch[1]);
    }

    const governmentMatch = answer.match(/\|\s*Government\s*\|\s*(\d+)\s*\|/i);
    if (governmentMatch) {
      defaultResult.transparency.sourceBreakdown.government = parseInt(governmentMatch[1]);
    }

    const otherMatch = answer.match(/\|\s*Other\s*\|\s*(\d+)\s*\|/i);
    if (otherMatch) {
      defaultResult.transparency.sourceBreakdown.other = parseInt(otherMatch[1]);
    }

    // Fallback: if we couldn't extract from table, try to extract from text
    if (!defaultResult.transparency.sourceBreakdown.newsOutlets) {
      const newsOutletsMatch = answer.match(/News Outlets:\s*(\d+)/i);
      if (newsOutletsMatch) {
        defaultResult.transparency.sourceBreakdown.newsOutlets = parseInt(newsOutletsMatch[1]);
      }
    }

    if (!defaultResult.transparency.sourceBreakdown.academic) {
      const academicTextMatch = answer.match(/Academic:\s*(\d+)/i);
      if (academicTextMatch) {
        defaultResult.transparency.sourceBreakdown.academic = parseInt(academicTextMatch[1]);
      }
    }

    if (!defaultResult.transparency.sourceBreakdown.government) {
      const governmentTextMatch = answer.match(/Government:\s*(\d+)/i);
      if (governmentTextMatch) {
        defaultResult.transparency.sourceBreakdown.government = parseInt(governmentTextMatch[1]);
      }
    }

    if (!defaultResult.transparency.sourceBreakdown.other) {
      const otherTextMatch = answer.match(/Other:\s*(\d+)/i);
      if (otherTextMatch) {
        defaultResult.transparency.sourceBreakdown.other = parseInt(otherTextMatch[1]);
      }
    }

  } catch (error) {
    console.error('Error parsing deep research response:', error);
  }

  return defaultResult;
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction - look for capitalized phrases and technical terms
  const keywords: string[] = [];
  
  // Look for phrases in quotes or brackets
  const quotedMatch = text.match(/["""]([^"""]+)["""]/g);
  if (quotedMatch) {
    keywords.push(...quotedMatch.map(k => k.replace(/["""]/g, '')));
  }

  // Look for technical terms (capitalized words)
  const technicalTerms = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
  if (technicalTerms) {
    keywords.push(...technicalTerms.slice(0, 5)); // Limit to 5 keywords
  }

  // Remove duplicates and common words
  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const uniqueKeywords = [...new Set(keywords)]
    .filter(k => !commonWords.includes(k.toLowerCase()))
    .slice(0, 4); // Limit to 4 keywords

  return uniqueKeywords.length > 0 ? uniqueKeywords : ['análisis'];
}
