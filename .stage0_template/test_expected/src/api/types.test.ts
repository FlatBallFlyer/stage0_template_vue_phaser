


import { describe, it, expect } from 'vitest'
import type {
  Error,
  Breadcrumb,
  Control,
  ControlInput,
  ControlUpdate,
  Create,
  CreateInput,
  Consume,
  DevLoginRequest,
  DevLoginResponse,
  ConfigResponse,
  InfiniteScrollParams,
  InfiniteScrollResponse
} from './types'

const breadcrumb = {
  from_ip: '192.168.1.1',
  by_user: 'user-123',
  at_time: '2024-01-01T00:00:00Z',
  correlation_id: 'corr-123'
}

describe('API Types', () => {
  describe('Error', () => {
    it('should match Error interface', () => {
      const error: Error = { error: 'Test error message' }
      expect(error.error).toBe('Test error message')
    })
  })

  describe('Breadcrumb', () => {
    it('should match Breadcrumb interface', () => {
      const b: Breadcrumb = breadcrumb
      expect(b.from_ip).toBe('192.168.1.1')
      expect(b.by_user).toBe('user-123')
    })
  })

  describe('Control', () => {
    it('should match Control interface', () => {
      const item: Control = {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-control',
        description: 'Test',
        status: 'active',
        created: breadcrumb,
        saved: breadcrumb
      }
      expect(item._id).toBe('507f1f77bcf86cd799439011')
      expect(item.name).toBe('test-control')
      expect(item.status).toBe('active')
    })

    it('should accept archived status', () => {
      const item: Control = {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-control',
        status: 'archived',
        created: breadcrumb,
        saved: breadcrumb
      }
      expect(item.status).toBe('archived')
    })
  })

  describe('ControlInput', () => {
    it('should match ControlInput interface', () => {
      const input: ControlInput = { name: 'test-control', description: 'Test', status: 'active' }
      expect(input.name).toBe('test-control')
    })

    it('should allow optional fields', () => {
      const input: ControlInput = { name: 'test-control' }
      expect(input.description).toBeUndefined()
    })
  })

  describe('ControlUpdate', () => {
    it('should match ControlUpdate interface with partial fields', () => {
      const update: ControlUpdate = { name: 'updated-name' }
      expect(update.name).toBe('updated-name')
    })

    it('should allow all fields to be optional', () => {
      const update: ControlUpdate = {}
      expect(update.name).toBeUndefined()
    })
  })

  describe('Create', () => {
    it('should match Create interface', () => {
      const item: Create = {
        _id: '507f1f77bcf86cd799439011',
        name: 'move',
        created: breadcrumb
      }
      expect(item._id).toBe('507f1f77bcf86cd799439011')
      expect(item.name).toBe('move')
    })
  })

  describe('CreateInput', () => {
    it('should match CreateInput interface (player_id + name slug)', () => {
      const input: CreateInput = { player_id: 'player-123', name: 'move' }
      expect(input.player_id).toBe('player-123')
      expect(input.name).toBe('move')
    })
  })

  describe('Consume', () => {
    it('should match Consume interface', () => {
      const item: Consume = {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-consume',
        description: 'Test',
        status: 'active'
      }
      expect(item._id).toBe('507f1f77bcf86cd799439011')
      expect(item.name).toBe('test-consume')
    })
  })

  describe('DevLoginRequest', () => {
    it('should match DevLoginRequest interface', () => {
      const request: DevLoginRequest = { subject: 'dev-user-1', roles: ['admin'] }
      expect(request.subject).toBe('dev-user-1')
      expect(request.roles).toEqual(['admin'])
    })

    it('should allow optional fields', () => {
      const request: DevLoginRequest = {}
      expect(request.subject).toBeUndefined()
    })
  })

  describe('DevLoginResponse', () => {
    it('should match DevLoginResponse interface', () => {
      const response: DevLoginResponse = {
        access_token: 'test-token',
        token_type: 'bearer',
        expires_at: '2024-01-01T00:00:00Z',
        subject: 'dev-user-1',
        roles: ['admin']
      }
      expect(response.access_token).toBe('test-token')
      expect(response.subject).toBe('dev-user-1')
    })
  })

  describe('ConfigResponse', () => {
    it('should match ConfigResponse interface', () => {
      const config: ConfigResponse = {
        config_items: [],
        versions: [],
        enumerators: [],
        token: { claims: { user_id: 'user-123', roles: ['admin'] } }
      }
      expect(config.token?.claims).toEqual({ user_id: 'user-123', roles: ['admin'] })
    })

    it('should allow optional token field', () => {
      const config: ConfigResponse = { config_items: [], versions: [], enumerators: [] }
      expect(config.token).toBeUndefined()
    })
  })

  describe('InfiniteScrollParams', () => {
    it('should match InfiniteScrollParams interface', () => {
      const params: InfiniteScrollParams = {
        name: 'test',
        after_id: '507f1f77bcf86cd799439011',
        limit: 20,
        sort_by: 'name',
        order: 'asc'
      }
      expect(params.name).toBe('test')
      expect(params.order).toBe('asc')
    })

    it('should allow optional fields', () => {
      const params: InfiniteScrollParams = {}
      expect(params.name).toBeUndefined()
    })
  })

  describe('InfiniteScrollResponse', () => {
    it('should match InfiniteScrollResponse interface', () => {
      const response: InfiniteScrollResponse<Control> = {
        items: [],
        limit: 20,
        has_more: true,
        next_cursor: '507f1f77bcf86cd799439011'
      }
      expect(response.items).toHaveLength(0)
      expect(response.limit).toBe(20)
      expect(response.has_more).toBe(true)
    })

    it('should allow null next_cursor', () => {
      const response: InfiniteScrollResponse<Consume> = {
        items: [],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      expect(response.next_cursor).toBeNull()
    })
  })
})