import { getAccessToken } from './auth';
import { supabase } from './supabase';

const WEB_APP_URL = 'https://beta.soulworx.ca';

/**
 * Make authenticated API request to Next.js backend
 * Uses JWT token if available, otherwise uses Supabase session
 */
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${WEB_APP_URL}${endpoint}`;
  
  // Try JWT token first (from web signup)
  const jwtToken = await getAccessToken();
  
  // Get Supabase session as fallback
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add auth header
  if (jwtToken) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  } else if (session?.access_token) {
    // Use Supabase session token
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * GET request
 */
export async function apiGet<T = any>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint, { method: 'GET' });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

/**
 * POST request
 */
export async function apiPost<T = any>(endpoint: string, body?: any): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

/**
 * PUT request
 */
export async function apiPut<T = any>(endpoint: string, body?: any): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

/**
 * DELETE request
 */
export async function apiDelete<T = any>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint, { method: 'DELETE' });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}
