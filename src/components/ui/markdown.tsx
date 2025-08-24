import React from 'react';

interface MarkdownProps {
  content: string;
  className?: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content, className = '' }) => {
  if (!content) return null;

  const processMarkdown = (text: string) => {
    // Limpiar el texto antes de procesar
    let cleanedText = text;
    
    // Remover dos puntos del inicio si están solos
    cleanedText = cleanedText.replace(/^:\s*/, '');
    
    // Limpiar espacios extra y saltos de línea
    cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
    
    // Dividir en párrafos (por doble salto de línea)
    const paragraphs = cleanedText.split(/\n\s*\n/);
    
    return paragraphs.map((paragraph, pIndex) => {
      if (paragraph.trim() === '') {
        return <br key={`p-${pIndex}`} />;
      }

      // Dividir cada párrafo en líneas para procesar
      const lines = paragraph.split('\n');
      
      return (
        <p key={`p-${pIndex}`} className="text-foreground leading-relaxed mb-4 text-justify">
          {lines.map((line, lIndex) => {
            const lineKey = `l-${pIndex}-${lIndex}`;
            
            // Línea vacía
            if (line.trim() === '') {
              return null;
            }

            // Títulos
            if (line.startsWith('# ')) {
              return (
                <h1 key={lineKey} className="text-2xl font-bold text-foreground mt-6 mb-3 text-left">
                  {line.replace('# ', '')}
                </h1>
              );
            }

            if (line.startsWith('## ')) {
              return (
                <h2 key={lineKey} className="text-xl font-bold text-foreground mt-5 mb-2 text-left">
                  {line.replace('## ', '')}
                </h2>
              );
            }

            if (line.startsWith('### ')) {
              return (
                <h3 key={lineKey} className="text-lg font-semibold text-foreground mt-4 mb-2 text-left">
                  {line.replace('### ', '')}
                </h3>
              );
            }

            if (line.startsWith('#### ')) {
              return (
                <h4 key={lineKey} className="text-base font-semibold text-foreground mt-3 mb-2 text-left">
                  {line.replace('#### ', '')}
                </h4>
              );
            }

            // Listas numeradas
            if (/^\d+\.\s/.test(line)) {
              return (
                <div key={lineKey} className="flex items-start space-x-2 my-1 text-left">
                  <span className="text-primary font-medium min-w-[1.5rem]">
                    {line.match(/^\d+\./)?.[0]}
                  </span>
                  <span className="text-foreground">
                    {processInlineMarkdown(line.replace(/^\d+\.\s/, ''))}
                  </span>
                </div>
              );
            }

            // Listas con viñetas
            if (line.startsWith('- ') || line.startsWith('* ')) {
              return (
                <div key={lineKey} className="flex items-start space-x-2 my-1 text-left">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-foreground">
                    {processInlineMarkdown(line.replace(/^[-*]\s/, ''))}
                  </span>
                </div>
              );
            }

            // Referencias de fuentes [8], [9], etc. - CONVERTIR EN HIPERVÍNCULOS
            if (line.includes('[') && /\d+\]/.test(line)) {
              return (
                <span key={lineKey} className="text-foreground">
                  {processSourceReferences(line)}
                </span>
              );
            }

            // Texto normal con markdown inline
            return (
              <span key={lineKey} className="text-foreground">
                {processInlineMarkdown(line)}
              </span>
            );
          })}
        </p>
      );
    });
  };

  // Función para procesar markdown inline (negrita, cursiva, código, enlaces)
  const processInlineMarkdown = (text: string) => {
    // Procesar enlaces primero
    if (text.includes('[') && text.includes('](') && text.includes(')')) {
      return processLinks(text);
    }
    
    // Procesar negrita
    if (text.includes('**')) {
      return processBold(text);
    }
    
    // Procesar cursiva
    if (text.includes('*') && !text.includes('**')) {
      return processItalic(text);
    }
    
    // Procesar código inline
    if (text.includes('`')) {
      return processCode(text);
    }
    
    // Texto normal
    return text;
  };

  // Función para procesar enlaces [texto](url)
  const processLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    const parts = [];
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      parts.push(
        <a
          key={`link-${match.index}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          {match[1]}
        </a>
      );
      
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Función para procesar negrita **texto**
  const processBold = (text: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    const parts = [];
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      parts.push(
        <strong key={`bold-${match.index}`} className="font-bold">
          {match[1]}
        </strong>
      );
      
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Función para procesar cursiva *texto*
  const processItalic = (text: string) => {
    const italicRegex = /\*([^*]+)\*/g;
    let lastIndex = 0;
    const parts = [];
    let match;

    while ((match = italicRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      parts.push(
        <em key={`italic-${match.index}`} className="italic">
          {match[1]}
        </em>
      );
      
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Función para procesar código inline `código`
  const processCode = (text: string) => {
    const codeRegex = /`([^`]+)`/g;
    let lastIndex = 0;
    const parts = [];
    let match;

    while ((match = codeRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      parts.push(
        <code key={`code-${match.index}`} className="bg-accent px-1 py-0.5 rounded text-sm font-mono">
          {match[1]}
        </code>
      );
      
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Función para procesar referencias de fuentes
  const processSourceReferences = (text: string) => {
    const referenceRegex = /\[(\d+)\]/g;
    let lastIndex = 0;
    const parts = [];
    let match;

    while ((match = referenceRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      // Crear hipervínculo a la fuente
      const sourceNumber = parseInt(match[1]);
      parts.push(
        <a
          key={`ref-${match.index}`}
          href={`#source-${sourceNumber}`}
          className="inline-flex items-center justify-center w-5 h-5 bg-primary/20 text-primary text-xs font-bold rounded-full hover:bg-primary/30 transition-colors mx-1"
          title={`Ver fuente ${sourceNumber}`}
        >
          {sourceNumber}
        </a>
      );
      
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div className={`markdown-content ${className}`}>
      {processMarkdown(content)}
    </div>
  );
};