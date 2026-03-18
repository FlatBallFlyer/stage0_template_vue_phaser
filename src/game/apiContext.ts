import type { Game, GameUpdate, Player, EventInput } from '@/api/types'

export interface GameApiContext {
  playerId: string
  gameId: string
  player: Player | null
  game: Game | null
  recordEvent: (payload: EventInput) => Promise<void>
  updateGameProgress: (patch: GameUpdate) => Promise<void>
}
