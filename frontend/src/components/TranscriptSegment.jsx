import { Clock, Tag } from 'lucide-react';

const TranscriptSegment = ({ segment, index }) => {
  const { text, startTime, endTime, summary, keywords = [] } = segment;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="card-elevated p-6 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-sm font-medium">
            Segment {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="font-mono">{formatTime(startTime)} - {formatTime(endTime)}</span>
        </div>
      </div>

      {/* Transcript Text */}
      <div className="mb-4">
        <p className="text-foreground leading-relaxed">{text}</p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4 p-4 rounded-lg bg-muted/50 border border-border">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Summary</h4>
          <p className="text-sm text-foreground">{summary}</p>
        </div>
      )}

      {/* Keywords */}
      {keywords.length > 0 && (
        <div className="flex items-start gap-2">
          <Tag className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, keywordIndex) => (
              <span 
                key={keywordIndex} 
                className="badge badge-accent"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptSegment;
