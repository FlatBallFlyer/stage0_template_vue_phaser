


import type { Control, ControlUpdate, Consume, CreateInput } from '@/api/types'

export interface ControlApiContext {
  controlId: string
  consumeId: string
  consume: Consume | null
  control: Control | null
  recordCreate: (payload: CreateInput) => Promise<void>
  updateControlProgress: (patch: ControlUpdate) => Promise<void>
}