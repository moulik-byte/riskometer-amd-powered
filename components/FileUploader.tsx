'use client';

import { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onFileSelected: (content: string, fileName: string) => void;
  isLoading?: boolean;
  acceptedTypes?: string[];
}

export function FileUploader({
  onFileSelected,
  isLoading = false,
  acceptedTypes = ['.pdf', '.txt', '.docx', '.doc'],
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setFileName(file.name);

    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileSelected(content, file.name);
    };

    if (file.type.includes('text')) {
      reader.readAsText(file);
    } else if (file.type.includes('pdf')) {
      // For PDF files, we'll read as text (simplified)
      reader.readAsText(file);
    } else {
      // For other types, read as text
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`relative transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Card
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-primary/2.5'
        }`}
        onClick={handleClick}
      >
        <div className="space-y-2">
          <div className="text-4xl mb-4 opacity-50">📄</div>
          <h3 className="font-semibold text-foreground">Upload Your Contract</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop or click to select
          </p>
          <p className="text-xs text-muted-foreground">
            Supported: {acceptedTypes.join(', ')}
          </p>
          {fileName && (
            <p className="text-xs text-primary font-medium pt-2">
              Selected: {fileName}
            </p>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileChange(e.target.files[0]);
            }
          }}
          accept={acceptedTypes.join(',')}
          disabled={isLoading}
        />
      </Card>

      {fileName && (
        <Button
          className="mt-4 w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Contract'}
        </Button>
      )}
    </div>
  );
}
