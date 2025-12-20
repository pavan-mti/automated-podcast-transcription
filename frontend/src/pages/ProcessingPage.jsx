import { useNavigate, useLocation } from 'react-router-dom';
import ProcessingSteps from '../components/ProcessingSteps';
import { FileAudio } from 'lucide-react';

const ProcessingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileName = location.state?.fileName || 'podcast-audio.mp3';

  const handleComplete = () => {
    // Navigate to dashboard after processing completes
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16">
      {/* File Info */}
      <div className="flex items-center gap-3 mb-12 p-4 rounded-xl bg-card border border-border animate-fade-in">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileAudio className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Processing file</p>
          <p className="font-medium text-foreground">{fileName}</p>
        </div>
      </div>

      {/* Processing Steps */}
      <ProcessingSteps onComplete={handleComplete} />

      {/* Cancel Option */}
      <button 
        onClick={() => navigate('/')}
        className="mt-12 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancel and return to upload
      </button>
    </div>
  );
};

export default ProcessingPage;
