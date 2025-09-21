export interface User {
  id: string;
  email: string;
  role: 'admin' | 'technician';
  created_at: string;
}

export interface PDFDocument {
  id: string;
  filename: string;
  file_path: string;
  meta any;
  split_status: 'pending' | 'processing' | 'completed' | 'failed' | 'split';
  split_chunks: number;
  uploaded_by: string;
  created_at: string;
}

export interface MaintenanceRequest {
  id: string;
  user_id: string;
  pdf_ids: string[];
  prompt: string;
  created_at: string;
  ai_responses?: AIResponse[];
}

export interface AIResponse {
  id: string;
  request_id: string;
  response_text: string;
  sources: {
    filename: string;
    page: number;
    type: 'text' | 'table' | 'image';
  }[];
  confidence_score: number;
  created_at: string;
}