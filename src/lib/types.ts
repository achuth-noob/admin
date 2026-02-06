export interface AdminUser {
  admin_id: string;
  username: string;
  first_name: string;
  last_name: string;
  active_status: boolean;
}

export interface ModelProvider {
  provider: string;
  model: string;
  owned_by: string;
}

export interface ModelPricing {
  model_id: string;
  provider_name: string;
  model_name: string;
  price_per_million_input_tokens: number;
  price_per_million_output_tokens: number;
  logo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GpuPricing {
  gpu_id: string;
  provider_name: string;
  gpu_name: string;
  region: string;
  cpu_id: string;
  is_available: boolean;
  price_per_hour: number;
}

export interface ModelWithPricingRequest {
  provider_name: string;
  model_name: string;
  price_per_million_input_tokens: number;
  price_per_million_output_tokens: number;
  logo?: string;
}

export interface GpuPricingRequest {
  gpu_id: string;
  provider_name: string;
  cpu_id: string;
  gpu_name: string;
  regions?: string[]; // Used in some endpoints
  region?: string; // Used in others
  price_per_hour: number;
  is_available: boolean;
}

export interface UpdateGpuPricingRequest {
  gpu_id: string;
  provider_name: string;
  cpu_id?: string;
  gpu_name?: string;
  region?: string;
  is_available?: boolean;
  price_per_hour?: number;
}

export interface ApiResponse<T> {
  dataResponse: T;
  message?: string;
}

export interface GetModelsResponse {
  models_available: ModelProvider[];
}

export interface DashboardStats {
  totalModels: number;
  activeGpus: number;
  registeredUsers: number;
}
