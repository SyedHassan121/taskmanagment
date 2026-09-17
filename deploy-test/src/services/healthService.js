import { apiClient } from './apiClient';

export const healthService = {
  checkHealth: async () => {
    return await apiClient('/health');
  },
};
