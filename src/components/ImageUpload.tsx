'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string;
  externalPreviewUrl?: string | null;
}

export default function ImageUpload({ onFileSelect, imagePreview, externalPreviewUrl }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const mockEvent = {
        target: { files }
      } as React.ChangeEvent<HTMLInputElement>;
      onFileSelect(mockEvent);
    }
  };

  return (
    <div className="w-full">
      <label 
        htmlFor="file-upload" 
        className="cursor-pointer block group"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {imagePreview || externalPreviewUrl ? (
          <div className="relative overflow-hidden rounded-xl bg-slate-100 group-hover:shadow-md transition-all duration-300">
            <Image 
              src={imagePreview || externalPreviewUrl || ''} 
              alt="Dog preview" 
              width={400}
              height={256}
              className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
              <span className="text-white font-semibold text-lg">Change Image</span>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <span className="text-2xl">🔄</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-100 scale-105' 
              : 'border-slate-300 hover:border-indigo-400 bg-gradient-to-br from-slate-50 to-indigo-50 group-hover:from-indigo-50 group-hover:to-purple-50'
          }`}>
            <div className={`text-6xl mb-4 transition-transform duration-300 ${isDragging ? 'scale-125' : 'group-hover:scale-110'}`}>
              {isDragging ? '📥' : '📷'}
            </div>
            <p className="text-slate-600 text-center font-medium mb-2">
              {isDragging ? 'Drop image here' : 'Drag & drop or click to upload'}
            </p>
            <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-indigo-600 shadow-sm group-hover:shadow-md transition-all">
              Choose File
            </span>
            <p className="text-slate-400 text-xs mt-3">JPG, PNG or GIF</p>
          </div>
        )}
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
      />
    </div>
  );
}
