import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSolution } from '../../lib/apiClient';
import { AIResponse } from '../../lib/types';

export default function Solution() {
  const [solution, setSolution] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      loadSolution(id as string);
    }
  }, [id]);

  const loadSolution = async (requestId: string) => {
    try {
      const data = await getSolution(requestId);
      setSolution(data);
    } catch (err) {
      setError('Failed to load solution');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !solution) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
            <p className="text-gray-500">{error || 'Solution not found'}</p>
            <button
              onClick={() => router.push('/submit')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Submit New Problem
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">AI Solution</h2>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>Confidence: {(solution.confidence_score * 100).toFixed(1)}%</span>
            <span className="mx-2">•</span>
            <span>{new Date(solution.created_at).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">
              {solution.response_text}
            </div>
          </div>
          
          {solution.sources && solution.sources.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Sources</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {solution.sources.map((source, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">{source.filename}</span>
                          {source.page && <span className="ml-1">- Page {source.page}</span>}
                          <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                            {source.type}
                          </span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => router.push('/submit')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Submit Another Problem
            </button>
            <button
              onClick={() => router.push('/history')}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}