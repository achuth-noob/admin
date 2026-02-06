import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { 
  AdminUser, 
  ModelPricing, 
  GpuPricing, 
  ModelWithPricingRequest, 
  GpuPricingRequest, 
  UpdateGpuPricingRequest,
  GetModelsResponse,
  ApiResponse,
  ModelProvider
} from './types';

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', // Update with your actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Authorization header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add super-admin-key if needed (based on your backend implementation)
      // This might need to be handled differently if it's a sensitive key, 
      // typically admin keys shouldn't be exposed in frontend logic if they are "super admin" keys.
      // However, looking at your backend code, it expects 'super_admin_key' query param for some admin routes.
      // If this key is static and shared, it should be in env. 
      // If it's the user's token, the backend might need refactoring or we assume 'token' implies admin access.
      const superAdminKey = process.env.NEXT_PUBLIC_SUPER_ADMIN_KEY;
      if (superAdminKey && config.params) {
         config.params['super_admin_key'] = superAdminKey;
      } else if (superAdminKey) {
         config.params = { ...config.params, super_admin_key: superAdminKey };
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AdminApi = {
  // Admin User Management
  getAdminDetails: async (): Promise<AdminUser[]> => {
    const response = await api.get<ApiResponse<{ data: AdminUser[] }>>('/admin/get-admin-details');
    return response.data.dataResponse.data;
  },

  // Model Management
  getAllModels: async (): Promise<ModelProvider[]> => {
    const response = await api.get<GetModelsResponse>('/admin/get-models');
    return response.data.models_available;
  },

  getModelPricing: async (providerName: string): Promise<ModelPricing[]> => {
    const response = await api.get<ApiResponse<ModelPricing[]>>('/admin/get-model-pricing', {
      params: { model_provider_name: providerName }
    });
    return response.data.dataResponse;
  },

  addModelPricing: async (modelId: string, data: ModelWithPricingRequest): Promise<void> => {
    await api.post('/admin/insert-model-pricing', data, {
      params: { model_id: modelId }
    });
  },

  updateModelPricing: async (modelId: string, data: ModelWithPricingRequest): Promise<void> => {
    await api.put('/admin/update-model-pricing', data, {
      params: { model_id: modelId }
    });
  },

  deleteModelPricing: async (modelId: string, providerName: string): Promise<void> => {
    await api.delete('/admin/delete-model-pricing', {
      params: { model_id: modelId, provider_name: providerName }
    });
  },

  // GPU Pricing Management
  getGpuPricingList: async (providerName: string): Promise<GpuPricing[]> => {
    const response = await api.get<GpuPricing[]>('/admin/get-gpu-pricing-list', {
       params: { gpu_provider_name: providerName }
    });
    // The backend returns the list directly based on the inspected code
    return response.data;
  },

  getGpuPricing: async (gpuId: string): Promise<GpuPricing> => {
    const response = await api.get<GpuPricing>('/admin/get-gpu-pricing', {
      params: { gpu_id: gpuId }
    });
    return response.data;
  },

  addGpuPricing: async (data: GpuPricingRequest): Promise<void> => {
    await api.post('/admin/insert-gpu-pricing', data);
  },
  
  // Note: The backend endpoint name was `gpu_pricing_models` mapped to `/admin/gpu-pricing` 
  // but there is also `/admin/insert-gpu-pricing`. 
  // Based on your backend code `gpu_pricing_models` also inserts but expects different body structure possibly?
  // I'll stick to `insert-gpu-pricing` as it seems more standard.

  updateGpuPricing: async (data: UpdateGpuPricingRequest): Promise<void> => {
    await api.put('/admin/update-gpu-pricing', data);
  },

  deleteGpuPricing: async (gpuId: string): Promise<void> => {
    await api.delete('/admin/delete-gpu-pricing', {
      params: { gpu_id: gpuId }
    });
  },
  
  syncGpuPricingFromApis: async (): Promise<any> => {
      const response = await api.post('/admin/insert-gpu-pricing-from-apis');
      return response.data.dataResponse;
  }
};
