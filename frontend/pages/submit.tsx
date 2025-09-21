import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getPDFs, submitProblem } from '../lib/apiClient';
import { PDFDocument } from '../lib/types';
import { useRouter } from 'next/router';

export default function SubmitProblem() {
  const [pdfs, setPdfs] = useState<PDFDocument[]>([]);
  const [selectedPdfs, setSelectedPdfs] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadPDFs();
  }, []);

  const loadPDFs = async () => {
    try {
      const data = await getPDFs();
      setPdfs(data);
    } catch (err) {
      setError('Failed to load PDF manuals');
      console.error(err);
    }
  };

  const handlePdfToggle = (pdfId: string) => {
    setSelectedPdfs(prev => 
      prev.includes(pdfId) 
        ? prev.filter(id => id !== pdfId)
        : [...prev, pdfId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPdfs.length === 0) {
      setError('Please select at least one manual');
      return;
    }
    
    if (!prompt.trim()) {
      setError('Please describe the problem');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await submitProblem(selectedPdfs, prompt);
      if (result.request && result.response) {
        router.push(`/solution/${result.request.id}`);
      } else {
        throw new Error('Failed to submit problem');
      }
    } catch (err) {
      setError('Failed to submit problem. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Device Problem</h2>
        
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
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Manuals
            </label>
            <div className="border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto">
              {pdfs.length === 0 ? (
                <p className="text-gray-500 text-sm">No manuals available</p>
              ) : (
                <div className="space-y-2">
                  {pdfs.map(pdf => (
                    <div key={pdf.id} className="flex items-center">
                      <input
                        id={`pdf-${pdf.id}`}
                        type="checkbox"
                        checked={selectedPdfs.includes(pdf.id)}
                        onChange={() => handlePdfToggle(pdf.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`pdf-${pdf.id}`} className="ml-3 text-sm text-gray-700">
                        {pdf.filename}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Describe the Problem
            </label>
            <textarea
              id="prompt"
              rows={6}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
              placeholder="Please describe the device error or maintenance issue in detail..."
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Get Solution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}