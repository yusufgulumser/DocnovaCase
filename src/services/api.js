import axios from 'axios';

const BASE_URL = 'https://api-dev.docnova.ai';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('API Error:', error);

    let userMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          userMessage = 'Geçersiz istek. Lütfen bilgilerinizi kontrol edin.';
          break;
        case 401:
          userMessage = 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.';
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          userMessage = 'Bu işlem için yetkiniz bulunmuyor.';
          break;
        case 404:
          userMessage = 'İstenen kaynak bulunamadı.';
          break;
        case 500:
          userMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
          break;
        case 502:
        case 503:
        case 504:
          userMessage = 'Servis geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
          break;
        default:
          userMessage = data?.message || `HTTP ${status} hatası oluştu.`;
      }
    } else if (error.request) {
      if (error.code === 'ECONNABORTED') {
        userMessage = 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.';
      } else {
        userMessage = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.';
      }
    } else {
      userMessage = error.message || 'Beklenmeyen bir hata oluştu.';
    }

    error.userMessage = userMessage;

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login/dev', credentials);
      const data = response.data;
      
      return {
        user: data,
        token: data.jwt,
        userMessage: 'Giriş başarılı'
      };
    } catch (error) {
      throw error;
    }
  }
};

export const invoiceAPI = {
  searchInvoices: async (searchParams, token) => {
    try {
      const response = await api.post('/invoice/search', searchParams, {
        headers: {
          'R-Auth': token,
        },
      });
      
      return {
        ...response.data,
        userMessage: 'Faturalar başarıyla yüklendi'
      };
    } catch (error) {
      throw error;
    }
  }
};

export const loginUser = authAPI.login;
export const searchInvoices = invoiceAPI.searchInvoices;

export default api; 