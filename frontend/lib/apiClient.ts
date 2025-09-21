import { supabase } from './supabaseClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Auth functions
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

// PDF functions
export const uploadPDF = async (formData: FormData) => {
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${session?.access_token}`
    }
  });
  return await response.json();
};

export const getPDFs = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch(`${API_BASE_URL}/pdfs`, {
    headers: {
      'Authorization': `Bearer ${session?.access_token}`
    }
  });
  return await response.json();
};

export const deletePDF = async (id: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch(`${API_BASE_URL}/pdfs/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${session?.access_token}`
    }
  });
  return await response.json();
};

// Maintenance functions
export const submitProblem = async (pdfIds: string[], prompt: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch(`${API_BASE_URL}/submit-problem`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    },
    body: JSON.stringify({
      user_id: user.id,
      pdf_ids: pdfIds,
      prompt,
    }),
  });
  return await response.json();
};

export const getSolution = async (requestId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch(`${API_BASE_URL}/solution/${requestId}`, {
    headers: {
      'Authorization': `Bearer ${session?.access_token}`
    }
  });
  return await response.json();
};

export const getHistory = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch(`${API_BASE_URL}/history/${user.id}`, {
    headers: {
      'Authorization': `Bearer ${session?.access_token}`
    }
  });
  return await response.json();
};