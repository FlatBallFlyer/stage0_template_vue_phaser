{% set control = service.data_domains.controls[0] %}
{% set create = service.data_domains.creates[0] %}
{% set consume = service.data_domains.consumes[0] %}
import type { {{ control }}, {{ control }}Update, {{ consume }}, {{ create }}Input } from '@/api/types'

export interface ControlApiContext {
  controlId: string
  consumeId: string
  consume: {{ consume }} | null
  control: {{ control }} | null
  recordCreate: (payload: {{ create }}Input) => Promise<void>
  updateControlProgress: (patch: {{ control }}Update) => Promise<void>
}
