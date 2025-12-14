import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_URL = '/api';

// Create axios instance
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, logout user
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

// Auth API
export interface RegisterData {
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: 'user' | 'admin';
    };
}

export const authAPI = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
};

// Sweets API
export interface Sweet {
    _id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    description?: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSweetData {
    name: string;
    category: string;
    price: number;
    quantity: number;
    description?: string;
    imageUrl?: string;
}

export interface UpdateSweetData {
    name?: string;
    category?: string;
    price?: number;
    quantity?: number;
    description?: string;
    imageUrl?: string;
}

export interface SearchParams {
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
}

export const sweetsAPI = {
    getAll: async (): Promise<Sweet[]> => {
        const response = await api.get('/sweets');
        return response.data.sweets;
    },

    getById: async (id: string): Promise<Sweet> => {
        const response = await api.get(`/sweets/${id}`);
        return response.data.sweet;
    },

    search: async (params: SearchParams): Promise<Sweet[]> => {
        const response = await api.get('/sweets/search', { params });
        return response.data.sweets;
    },

    create: async (data: CreateSweetData): Promise<Sweet> => {
        const response = await api.post('/sweets', data);
        return response.data.sweet;
    },

    update: async (id: string, data: UpdateSweetData): Promise<Sweet> => {
        const response = await api.put(`/sweets/${id}`, data);
        return response.data.sweet;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/sweets/${id}`);
    },

    purchase: async (id: string, quantity: number): Promise<Sweet> => {
        const response = await api.post(`/sweets/${id}/purchase`, { quantity });
        return response.data.sweet;
    },

    restock: async (id: string, quantity: number): Promise<Sweet> => {
        const response = await api.post(`/sweets/${id}/restock`, { quantity });
        return response.data.sweet;
    },
};
