import React, { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { getOptimizedAvatarUrl, getOptimizedProjectUrl, transformCloudinaryUrl } from '../../utils/imageUtils';

interface ImageUploadProps {
  value?: { url: string; publicId: string };
  onChange: (value: { url: string; publicId: string } | null) => void;
  folder?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  folder = 'portfolio',
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [isImgLoaded, setIsImgLoaded] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsImgLoaded(false);
  }, [value?.url]);

  const processFile = async (file: File) => {
    // 5MB limit check
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB limit');
      return;
    }

    // MIME type check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Unsupported file format. Please upload JPEG, PNG, WEBP, or GIF.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    
    // Simulate upload step progress
    const progressTimer = setInterval(() => {
      setUploadProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 150);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(progressTimer);
      setUploadProgress(100);
      
      const { url, publicId } = response.data;
      onChange({ url, publicId });
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      clearInterval(progressTimer);
      console.error('[Upload Component Error]', error);
      const msg = error.response?.data?.message || 'Failed to finish file uploading';
      toast.error(msg);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 300);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const triggerSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Determine low-quality blurred placeholder (LQIP) and final optimized URL
  const isProfile = folder.toLowerCase().includes('avatar') || folder.toLowerCase().includes('profile');
  const lqipUrl = value?.url ? transformCloudinaryUrl(value.url, 'w_50,e_blur:1000,f_auto,q_auto:low') : '';
  const optimizedUrl = value?.url 
    ? (isProfile ? getOptimizedAvatarUrl(value.url, 400) : getOptimizedProjectUrl(value.url, 600, 350))
    : '';

  return (
    <div className={`w-full ${className}`}>
      {value && value.url ? (
        // Preview state
        <div className="relative rounded-lg border border-slate-201 overflow-hidden bg-slate-50 flex items-center justify-center group h-48 sm:h-56">
          {/* Low-Quality Blurred Background Placeholder */}
          {lqipUrl && !isImgLoaded && (
            <img
              src={lqipUrl}
              referrerPolicy="no-referrer"
              alt="Loading placeholder"
              className="absolute inset-0 w-full h-full object-cover blur-md"
            />
          )}
          
          {/* Main Optimized Loaded Image */}
          <img
            src={optimizedUrl || value.url}
            referrerPolicy="no-referrer"
            alt="Asset Preview"
            loading="lazy"
            onLoad={() => setIsImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isImgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          
          <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
            <button
              type="button"
              onClick={triggerSelect}
              className="p-2 bg-white rounded-full hover:bg-slate-100 text-slate-800 transition"
              title="Replace image"
            >
              <Upload size={18} />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-600 rounded-full hover:bg-red-700 text-white transition"
              title="Remove image"
            >
              <X size={18} />
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      ) : (
        // Upload trigger state
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerSelect}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition h-48 sm:h-56 ${
            isDragActive
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-medium text-slate-700">Uploading image...</p>
              <div className="w-40 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-white rounded-full shadow-sm text-slate-400">
                <Upload size={24} />
              </div>
              <p className="text-sm font-medium text-slate-700">
                Drag and drop your image, or{' '}
                <span className="text-blue-600 hover:underline">browse file</span>
              </p>
              <p className="text-xs text-slate-500">
                Supports JPEG, PNG, WEBP, GIF up to 5MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
