import { useState, useRef } from 'react';
import { Upload, FileAudio, X, Loader2 } from 'lucide-react';

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const acceptedFormats = ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp4'];
  const acceptedExtensions = '.mp3,.wav,.m4a';

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && acceptedFormats.includes(droppedFile.type)) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // ✅ UPDATED: real backend upload (no fake delay)
  const handleUpload = async () => {
    if (file && onUpload) {
      try {
        setIsUploading(true);
        await onUpload(file); // waits for backend response
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`upload-zone ${isDragging ? 'active' : ''} ${
          file ? 'border-success bg-success/5' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedExtensions}
          onChange={handleFileSelect}
          className="hidden"
        />

        {!file ? (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-1">
                Drop your audio file here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge badge-primary">MP3</span>
              <span className="badge badge-primary">WAV</span>
              <span className="badge badge-primary">M4A</span>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-between gap-4 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <FileAudio className="h-6 w-6 text-success" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {file && (
        <div className="mt-6 flex justify-center animate-fade-in">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="btn-primary flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Upload & Process
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
