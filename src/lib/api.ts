
// Определяем базовый URL API в зависимости от окружения
const getApiBaseUrl = () => {
  // В продакшене или если бэкенд на том же домене
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  // Для деплоя - используем относительный путь или настроенный URL
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// Utility function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// API request wrapper with auth handling
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      console.error(`API Error ${response.status}:`, errorData);
      throw new Error(errorData.message || `HTTP Error ${response.status}`);
    }

    const data = await response.json();
    console.log(`API Response for ${endpoint}:`, data);
    return data;
  } catch (error: any) {
    console.error(`Network error for ${endpoint}:`, error);
    
    // Проверяем, является ли это CORS ошибкой
    if (error.message.includes('NetworkError') || error.name === 'TypeError') {
      throw new Error('Не удается подключиться к серверу. Проверьте, что бэкенд запущен на порту 5000.');
    }
    
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (credentials: { username: string; password: string }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: { username: string; password: string }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Products API
export const productsAPI = {
  getAll: async (keyword?: string) => {
    const queryParam = keyword ? `?keyword=${encodeURIComponent(keyword)}` : '';
    return apiRequest(`/products${queryParam}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/products/${id}`);
  },

  create: async (productData: any) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id: string, productData: any) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Cart API
export const cartAPI = {
  get: async () => {
    return apiRequest('/cart');
  },

  add: async (productId: string, quantity: number = 1) => {
    return apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  update: async (productId: string, quantity: number) => {
    return apiRequest(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  remove: async (productId: string) => {
    return apiRequest(`/cart/${productId}`, {
      method: 'DELETE',
    });
  },

  clear: async () => {
    return apiRequest('/cart', {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData: any) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getUserOrders: async () => {
    return apiRequest('/orders/my');
  },

  getAllOrders: async () => {
    return apiRequest('/orders');
  },

  getById: async (id: string) => {
    return apiRequest(`/orders/${id}`);
  },

  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};
