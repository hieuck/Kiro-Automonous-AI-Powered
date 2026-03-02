# Refactoring Spec: API Client Architecture

**Type:** Refactoring
**Priority:** Medium
**Estimated Effort:** 5 story points
**Sprint:** Sprint 3
**Status:** Example

---

## 📋 Overview

Refactor the API client layer to improve maintainability, testability, and error handling. Current implementation has code duplication, inconsistent error handling, and tight coupling.

## 🎯 Goals

- Eliminate code duplication across API calls
- Standardize error handling
- Improve testability with dependency injection
- Add request/response interceptors
- Implement retry logic
- Better TypeScript types

## 🔍 Current Problems

### Problem 1: Code Duplication
```typescript
// user-api.ts
async getUser(id: string) {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// product-api.ts
async getProduct(id: string) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
// ... 20+ more files with same pattern
```

### Problem 2: Inconsistent Error Handling
- Some files throw errors, others return null
- Error messages not standardized
- No error codes
- No retry logic

### Problem 3: Hard to Test
- Direct fetch calls
- No dependency injection
- Hard to mock
- No request/response interceptors

### Problem 4: No Type Safety
```typescript
// Current: any types
async getUser(id: string): Promise<any> { ... }

// Desired: proper types
async getUser(id: string): Promise<User> { ... }
```

## 💡 Proposed Solution

### New Architecture

```
┌─────────────────────────────────┐
│     API Client (Base)           │
│  - Request interceptors         │
│  - Response interceptors        │
│  - Error handling               │
│  - Retry logic                  │
│  - Type safety                  │
└────────────┬────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌────▼─────┐
│ User   │      │ Product  │
│ API    │      │ API      │
└────────┘      └──────────┘
```

### Implementation

**File:** `src/api/base-client.ts`
```typescript
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    version: string;
  };
  errors?: ApiError[];
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: string;
}

export class ApiClient {
  private config: ApiClientConfig;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 30000,
      retries: 3,
      ...config
    };
  }

  // Request methods
  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, options);
  }

  async post<T>(path: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, { ...options, body: data });
  }

  async put<T>(path: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, { ...options, body: data });
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, options);
  }

  // Core request method
  private async request<T>(
    method: string,
    path: string,
    options?: RequestOptions
  ): Promise<T> {
    const url = `${this.config.baseURL}${path}`;
    let attempt = 0;

    while (attempt < this.config.retries!) {
      try {
        // Apply request interceptors
        let request = this.buildRequest(method, url, options);
        for (const interceptor of this.requestInterceptors) {
          request = await interceptor(request);
        }

        // Make request
        const response = await this.fetchWithTimeout(request);

        // Apply response interceptors
        let processedResponse = response;
        for (const interceptor of this.responseInterceptors) {
          processedResponse = await interceptor(processedResponse);
        }

        // Handle response
        if (!processedResponse.ok) {
          throw await this.handleErrorResponse(processedResponse);
        }

        const data: ApiResponse<T> = await processedResponse.json();
        return data.data;

      } catch (error) {
        attempt++;
        if (attempt >= this.config.retries!) {
          throw this.normalizeError(error);
        }
        await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
      }
    }

    throw new Error('Max retries exceeded');
  }

  // Interceptors
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // Helper methods
  private buildRequest(method: string, url: string, options?: RequestOptions): Request {
    return new Request(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...options?.headers
      },
      body: options?.body ? JSON.stringify(options.body) : undefined
    });
  }

  private async fetchWithTimeout(request: Request): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      return await fetch(request, { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }

  private async handleErrorResponse(response: Response): Promise<ApiError> {
    const data = await response.json().catch(() => ({}));
    return {
      code: data.code || `HTTP_${response.status}`,
      message: data.message || response.statusText,
      field: data.field,
      details: data.details
    };
  }

  private normalizeError(error: any): ApiError {
    if (error.code && error.message) return error;
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred'
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

**File:** `src/api/user-api.ts`
```typescript
import { ApiClient } from './base-client';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export class UserApi {
  constructor(private client: ApiClient) {}

  async getUser(id: string): Promise<User> {
    return this.client.get<User>(`/users/${id}`);
  }

  async listUsers(params?: { page?: number; limit?: number }): Promise<User[]> {
    return this.client.get<User[]>('/users', { params });
  }

  async createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return this.client.post<User>('/users', data);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.client.put<User>(`/users/${id}`, data);
  }

  async deleteUser(id: string): Promise<void> {
    return this.client.delete<void>(`/users/${id}`);
  }
}
```

**File:** `src/api/index.ts`
```typescript
import { ApiClient } from './base-client';
import { UserApi } from './user-api';
import { ProductApi } from './product-api';

// Create client instance
const apiClient = new ApiClient({
  baseURL: process.env.API_BASE_URL || 'https://api.example.com',
  timeout: 30000,
  retries: 3
});

// Add auth interceptor
apiClient.addRequestInterceptor(async (request) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
  return request;
});

// Add logging interceptor
apiClient.addResponseInterceptor(async (response) => {
  console.log(`[API] ${response.status} ${response.url}`);
  return response;
});

// Export API instances
export const userApi = new UserApi(apiClient);
export const productApi = new ProductApi(apiClient);
```

## 📊 Benefits

### Before vs After

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Code duplication | 20+ files | 1 base class | 95% reduction |
| Lines of code | ~2000 | ~500 | 75% reduction |
| Test coverage | 40% | 85% | +45% |
| Type safety | Partial | Full | 100% |
| Error handling | Inconsistent | Standardized | ✅ |
| Retry logic | None | Exponential backoff | ✅ |

## ✅ Testing Strategy

### Unit Tests
```typescript
describe('ApiClient', () => {
  describe('get', () => {
    it('should make GET request with correct URL', async () => {
      // Test implementation
    });

    it('should retry on failure', async () => {
      // Test retry logic
    });

    it('should apply request interceptors', async () => {
      // Test interceptors
    });
  });
});
```

### Integration Tests
- Test with real API endpoints (staging)
- Test error scenarios
- Test timeout handling
- Test retry logic

## 🔄 Migration Plan

### Phase 1: Create New Architecture (Week 1)
- [ ] Implement ApiClient base class
- [ ] Add tests
- [ ] Document usage

### Phase 2: Migrate APIs (Week 2)
- [ ] Migrate UserApi
- [ ] Migrate ProductApi
- [ ] Migrate OrderApi
- [ ] ... (one by one)

### Phase 3: Cleanup (Week 3)
- [ ] Remove old code
- [ ] Update documentation
- [ ] Team training

### Rollout Strategy
- Feature flag: `use_new_api_client`
- Gradual migration: 10% → 50% → 100%
- Monitor error rates
- Rollback if issues

## 📝 Documentation

- [ ] API client usage guide
- [ ] Migration guide for developers
- [ ] Interceptor examples
- [ ] Error handling guide
- [ ] Testing guide

## 🎯 Success Criteria

- [ ] All API calls use new client
- [ ] Test coverage > 80%
- [ ] Zero regression bugs
- [ ] Code duplication < 5%
- [ ] Team trained on new architecture

---

**Proposed by:** Tech Lead
**Reviewed by:** Senior Developers
**Approved by:** Engineering Manager
**Status:** Ready for Implementation
