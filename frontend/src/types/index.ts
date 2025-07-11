export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  company: string;
  raw_message: string;
  created_at: string;
  updated_at: string | null;
  crm_attempts: CRMAttempt[];
}

export interface CRMAttempt {
  id: number;
  lead_id: number;
  success: boolean;
  attempt_number: number;
  error_message: string | null;
  created_at: string;
}

export interface Event {
  id: number;
  event_type: string;
  event_id: string;
  user_id: number;
  payload: string | null;
  status: string;
  created_at: string;
}

export interface DashboardStats {
  total_leads: number;
  successful_crm_saves: number;
  failed_crm_saves: number;
  leads_per_time: Record<string, number>;
  events_per_type: Record<string, number>;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AgentConfig {
  crm_max_retries: number;
  crm_retry_delay: number;
}

export interface AgentConfigUpdate {
  crm_max_retries?: number;
  crm_retry_delay?: number;
}
