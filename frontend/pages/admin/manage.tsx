import { useState, useEffect } from 'react';
import { getPDFs, deletePDF } from '../../lib/apiClient';
import { PDFDocument } from '../../lib/types';
import { useRouter } from 'next/router';

export default function ManageManuals() {
  const [pdfs, setPdfs] = useState<PDFDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    setDeleting(id);
    try {
      await deletePDF(id);
      setPdfs(pdfs.filter(pdf => pdf.id !== id));
    } catch (err) {
      setError('Failed to delete PDF');
      console.error(err);
    } finally {
      setDeleting(null);
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

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Manage Manuals</h2>
          <button
            onClick={() => router.push('/admin/upload')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Upload Manual
          </button>
        </div>
        
        <div className="p-6">
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
          
          {pdfs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No manuals</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by uploading a device manual.</p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/admin/upload')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Upload Manual
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {pdfs.map((pdf) => (
                  <li key={pdf.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-md flex items-center justify-center">
                            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-indigo-600 truncate">{pdf.filename}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="capitalize">{pdf.split_status}</span>
                              {pdf.split_chunks > 0 && (
                                <span className="ml-2">({pdf.split_chunks} chunk{pdf.split_chunks !== 1 ? 's' : ''})</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-4">
                            {new Date(pdf.created_at).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handleDelete(pdf.id, pdf.filename)}
                            disabled={deleting === pdf.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            {deleting === pdf.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}