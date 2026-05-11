export type UserRole = 'candidate' | 'instructor' | 'admin'
export type ContentType = 'lesson' | 'annal' | 'tip'
export type PaymentStatus = 'pending' | 'approved' | 'rejected'
export type PaymentMethod = 'orange_money' | 'wave'

export interface Profile {
  id: string; full_name: string | null; email: string; phone: string | null;
  city: string | null; role: UserRole; domain: string | null;
  is_premium: boolean; trial_access: boolean; premium_expiry_date: string | null; created_at: string;
}

export interface Resource {
  id: string; title: string; description: string | null; content_type: ContentType;
  file_url: string | null; thumbnail_url: string | null; is_free: boolean;
  subject_id: string | null; author_id: string | null; created_at: string;
}

export interface Subject { id: string; name: string; cycle_id: string | null; }

export interface Cycle { id: string; name: string; }

export interface Payment {
  id: string; user_id: string; amount: number; method: string; transaction_name: string | null;
  phone: string | null; city: string | null; proof_url: string | null; status: PaymentStatus; created_at: string;
}

export interface NewsArticle { id: string; title: string; content: string; author_id: string | null; created_at: string; }

export interface PlatformStats {
  total_users: number; premium_users: number; total_resources: number;
  total_candidates: number; total_instructors: number; pending_payments: number;
}
