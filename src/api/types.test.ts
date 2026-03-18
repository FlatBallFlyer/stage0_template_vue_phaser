import { describe, it, expect } from 'vitest'
import type {
  Error,
  Breadcrumb,
  Game,
  GameInput,
  GameUpdate,
  Event,
  EventInput,
  Player,
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

  describe('Game', () => {
    it('should match Game interface', () => {
      const game: Game = {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-game',
        description: 'Test',
        status: 'active',
        created: breadcrumb,
        saved: breadcrumb
      }
      expect(game._id).toBe('507f1f77bcf86cd799439011')
      expect(game.name).toBe('test-game')
      expect(game.status).toBe('active')
    })

    it('should accept archived status', () => {
      const game: Game = {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-game',
        status: 'archived',
        created: breadcrumb,
        saved: breadcrumb
      }
      expect(game.status).toBe('archived')
    })
  })

  describe('GameInput', () => {
    it('should match GameInput interface', () => {
      const input: GameInput = { name: 'test-game', description: 'Test', status: 'active' }
      expect(input.name).toBe('test-game')
    })

    it('should allow optional fields', () => {
      const input: GameInput = { name: 'test-game' }
      expect(input.description).toBeUndefined()
    })
  })

  describe('GameUpdate', () => {
    it('should match GameUpdate interface with partial fields', () => {
      const update: GameUpdate = { name: 'updated-name' }
      expect(update.name).toBe('updated-name')
    })

    it('should allow all fields to be optional', () => {
      const update: GameUpdate = {}
      expect(update.name).toBeUndefined()
    })
  })

  describe('Event', () => {
    it('should match Event interface', () => {
      const event: Event = {
        _id: '507f1f77bcf86cd799439011',
        name: 'move',
        created: breadcrumb
      }
      expect(event._id).toBe('507f1f77bcf86cd799439011')
      expect(event.name).toBe('move')
    })
  })

  describe('EventInput', () => {
    it('should match EventInput interface (player_id + name slug)', () => {
      const input: EventInput = { player_id: 'player-123', name: 'move' }
      expect(input.player_id).toBe('player-123')
      expect(input.name).toBe('move')
    })
  })

  describe('Player', () => {
    it('should match Player interface', () => {
      const player: Player = {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-player',
        description: 'Test',
        status: 'active'
      }
      expect(player._id).toBe('507f1f77bcf86cd799439011')
      expect(player.name).toBe('test-player')
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
      const response: InfiniteScrollResponse<Game> = {
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
      const response: InfiniteScrollResponse<Player> = {
        items: [],
        limit: 20,
        has_more: false,
        next_cursor: null
      }
      expect(response.next_cursor).toBeNull()
    })
  })
})
