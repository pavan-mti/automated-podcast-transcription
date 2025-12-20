import { Link } from 'react-router-dom';
import { Clock, Calendar, FileAudio, ChevronRight } from 'lucide-react';

const PodcastCard = ({ podcast }) => {
  const { id, title, duration, date, segmentCount, status } = podcast;

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Link to={`/podcast/${id}`} className="block">
      <div className="card-elevated p-6 group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
              <FileAudio className="h-6 w-6 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(duration)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(date)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-4">
                <span className={`badge ${
                  status === 'completed' 
                    ? 'badge-success' 
                    : status === 'processing' 
                      ? 'badge-primary' 
                      : 'badge-accent'
                }`}>
                  {status === 'completed' ? 'Completed' : status === 'processing' ? 'Processing' : 'Pending'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {segmentCount} segments
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-2 rounded-lg bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PodcastCard;
