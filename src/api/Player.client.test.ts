import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from './client'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client - Player Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all players', async () => {
    const mockPlayers = [
      { _id: '507f1f77bcf86cd799439011', name: 'test-player', description: 'Test', status: 'active' }
    ]
    const mockResponse = { items: mockPlayers, limit: 20, has_more: false, next_cursor: null }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    const result = await api.getPlayers()
    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledWith('/api/player', expect.any(Object))
  })

  it('should get players with name query', async () => {
    const mockResponse = { items: [], limit: 20, has_more: false, next_cursor: null }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    await api.getPlayers({ name: 'test' })
    expect(mockFetch).toHaveBeenCalledWith('/api/player?name=test', expect.any(Object))
  })

  it('should get a single player', async () => {
    const mockPlayer = { _id: '507f1f77bcf86cd799439011', name: 'test-player' }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockPlayer
    })

    const result = await api.getPlayer('507f1f77bcf86cd799439011')
    expect(result).toEqual(mockPlayer)
  })
})
