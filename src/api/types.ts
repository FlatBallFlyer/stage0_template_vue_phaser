// Type definitions based on OpenAPI spec (Game / Event / Player)

export interface Error {
  error: string
}

export interface Breadcrumb {
  from_ip: string
  by_user: string
  at_time: string
  correlation_id: string
}

// Game Domain (progress, sessions)
export interface Game {
  _id: string
  name: string
  description?: string
  status?: 'active' | 'archived'
  created: Breadcrumb
  saved: Breadcrumb
}

export interface GameInput {
  name: string
  description?: string
  status?: 'active' | 'archived'
}

export interface GameUpdate {
  name?: string
  description?: string
  status?: 'active' | 'archived'
}

// Event Domain (fine-grained gameplay events; POST body: player_id + name slug)
export interface Event {
  _id: string
  name: string
  description?: string
  status?: string
  created: Breadcrumb
}

/** POST /event body: name is a non-unique one-word slug (e.g. move, jump) */
export interface EventInput {
  player_id: string
  name: string
}

// Player Domain
export interface Player {
  _id: string
  name: string
  description?: string
  status?: string
}

// Authentication
export interface DevLoginRequest {
  subject?: string
  roles?: string[]
}

export interface DevLoginResponse {
  access_token: string
  token_type: string
  expires_at: string
  subject: string
  roles: string[]
}

// Configuration (playerId from config.token.user_id)
export interface ConfigResponse {
  config_items: unknown[]
  versions: unknown[]
  enumerators: unknown[]
  token?: {
    claims?: Record<string, unknown> // user_id for playerId
  }
}

// Infinite Scroll
export interface InfiniteScrollParams {
  name?: string
  after_id?: string
  limit?: number
  sort_by?: string
  order?: 'asc' | 'desc'
}

export interface InfiniteScrollResponse<T> {
  items: T[]
  limit: number
  has_more: boolean
  next_cursor: string | null
}
