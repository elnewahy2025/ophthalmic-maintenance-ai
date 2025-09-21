import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import { uploadPDF } from '../../lib/apiClient';

export default function UploadManual() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file');
      return;
    }

    const file = files[0];
    if (file.size > 5 * 1024 * 1024 * 1024) { // 5GB
      setError('File size exceeds 5GB limit');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('filename', file.name);

      const result = await uploadPDF(formData);
      if (result.pdf) {
        router.push('/admin/manage');
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      setError('Failed to upload PDF. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Manual</h2>
        
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
              isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF files only (max 5GB)</p>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900">Selected file:</h3>
              <ul className="mt-1 rounded-md bg-gray-50 px-4 py-2 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>{files[0].name}</span>
                  <span className="text-gray-500">{(files[0].size / (1024 * 1024)).toFixed(2)} MB</span>
                </li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/admin/manage')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Manual'}
          </button>
        </div>
      </div>
    </div>
  );
}