import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api, ApiError } from './client'
import type { {{ item }}Input, {{ item }}Update } from './types'

const mockFetch = vi.fn()
global.fetch = mockFetch

const breadcrumb = {
  from_ip: '127.0.0.1',
  by_user: 'user1',
  at_time: '2024-01-01T00:00:00Z',
  correlation_id: 'corr-123'
}

describe('API Client - {{ item }} Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all {{ item | lower }}s', async () => {
    const mockItems = [
      { _id: '507f1f77bcf86cd799439011', name: 'test-{{ item | lower }}', status: 'active' as const, created: breadcrumb, saved: breadcrumb }
    ]
    const mockResponse = { items: mockItems, limit: 20, has_more: false, next_cursor: null }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    const result = await api.get{{ item }}s()
    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledWith('/api/{{ item | lower }}', expect.any(Object))
  })

  it('should get {{ item | lower }}s with name query (placeholder "my {{ item | lower }}" uses name=user_id)', async () => {
    const mockResponse = { items: [], limit: 50, has_more: false, next_cursor: null }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    await api.get{{ item }}s({ name: 'user-123', limit: 50, sort_by: 'created.at_time', order: 'desc' })
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/{{ item | lower }}?name=user-123&limit=50&sort_by=created.at_time&order=desc',
      expect.any(Object)
    )
  })

  it('should get a single {{ item | lower }} by id', async () => {
    const mockItem = { _id: '507f1f77bcf86cd799439011', name: 'test-{{ item | lower }}', status: 'active' as const, created: breadcrumb, saved: breadcrumb }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockItem
    })

    const result = await api.get{{ item }}('507f1f77bcf86cd799439011')
    expect(result).toEqual(mockItem)
    expect(mockFetch).toHaveBeenCalledWith('/api/{{ item | lower }}/507f1f77bcf86cd799439011', expect.any(Object))
  })

  it('should create a {{ item | lower }}', async () => {
    const input: {{ item }}Input = { name: 'new-{{ item | lower }}', description: 'New', status: 'active' }
    const mockResponse = { _id: '507f1f77bcf86cd799439011' }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    const result = await api.create{{ item }}(input)
    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/{{ item | lower }}',
      expect.objectContaining({ method: 'POST', body: JSON.stringify(input) })
    )
  })

  it('should update a {{ item | lower }}', async () => {
    const update: {{ item }}Update = { name: 'updated-name' }
    const mockItem = { _id: '507f1f77bcf86cd799439011', name: 'updated-name', status: 'active' as const, created: breadcrumb, saved: breadcrumb }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockItem
    })

    const result = await api.update{{ item }}('507f1f77bcf86cd799439011', update)
    expect(result).toEqual(mockItem)
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/{{ item | lower }}/507f1f77bcf86cd799439011',
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify(update) })
    )
  })

  it('should handle 404', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ error: 'Resource not found' })
    })
    await expect(api.get{{ item }}('invalid-id')).rejects.toThrow(ApiError)
  })

  it('should handle 401', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ error: 'Unauthorized' })
    })
    await expect(api.get{{ item }}s()).rejects.toThrow('Unauthorized')
  })
})
