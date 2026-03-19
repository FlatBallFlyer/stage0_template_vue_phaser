<template>

  <div class="game-page-wrapper">
    <div ref="gameContainer" class="game-page" data-automation-id="game-container" />
    <div v-if="error" class="game-overlay error">
      <p>{{ error }}</p>
      <v-btn size="small" @click="loadAndStart">Retry</v-btn>
    </div>
    <div v-else-if="loading" class="game-overlay loading">
      <p>Loading...</p>
    </div>
    <div v-else-if="consumeData || controlData" class="game-overlay info">
      <span v-if="consumeData">{{ consumeData.name }}</span>
      <span v-if="controlData?.description">{{ controlData.description }}</span>
    </div>
  </div>

</template>

<script setup lang="ts">



import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { createGame } from '@/game/bootstrap'
import { api } from '@/api/client'
import type Phaser from 'phaser'
import type { Control, Consume } from '@/api/types'
import type { ControlApiContext } from '@/game/apiContext'

const route = useRoute()
const gameContainer = ref<HTMLElement | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const consumeData = ref<Consume | null>(null)
const controlData = ref<Control | null>(null)
const controlIdRef = ref<string | null>(null)

let gameInstance: Phaser.Game | null = null

async function loadInitialData() {
  error.value = null
  loading.value = true
  try {
    const configRes = await api.getConfig()
    const claims = configRes.token?.claims as Record<string, unknown> | undefined
    const pid = (claims?.user_id as string) ?? (claims?.sub as string)
    if (!pid) {
      error.value = 'Missing consume id in config'
      loading.value = false
      return
    }

    let controlRes: Control
    const controlIdFromRoute = route.params.game_id as string | undefined
    if (controlIdFromRoute) {
      controlRes = await api.getControl(controlIdFromRoute)
    } else {
      const list = await api.getControls({
        name: pid,
        limit: 50,
        sort_by: 'created.at_time',
        order: 'desc'
      })
      const latest = list.items?.[0]
      if (!latest) {
        error.value = 'No control found'
        loading.value = false
        return
      }
      controlRes = latest
    }

    controlIdRef.value = controlRes._id
    controlData.value = controlRes

    const consumeRes = await api.getConsume(pid)
    consumeData.value = consumeRes

    loading.value = false
    return { consumeId: pid, controlId: controlRes._id, consume: consumeRes, control: controlRes }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load'
    loading.value = false
  }
}

function buildApiContext(
  consumeId: string,
  controlId: string,
  consumeDataParam: Consume,
  controlDataParam: Control
): ControlApiContext {
  return {
    consumeId,
    controlId,
    consume: consumeDataParam,
    control: controlDataParam,
    recordCreate: async (payload) => {
      await api.createCreate(payload)
    },
    updateControlProgress: async (patch) => {
      await api.updateControl(controlId, patch)
      const updated = await api.getControl(controlId)
      controlData.value = updated
    }
  }
}

async function loadAndStart() {
  const data = await loadInitialData()
  if (!data || !gameContainer.value) return

  const ctx = buildApiContext(
    data.consumeId,
    data.controlId,
    data.consume,
    data.control
  )
  if (gameInstance) {
    gameInstance.destroy(true)
    gameInstance = null
  }
  gameInstance = createGame(gameContainer.value, ctx)
}

onMounted(() => {
  loadAndStart()
})

onUnmounted(() => {
  if (gameInstance) {
    gameInstance.destroy(true)
    gameInstance = null
  }
})
</script>

<style scoped>
.game-page-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  background: #2d2d2d;
}

.game-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-overlay {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  padding: 8px;
  border-radius: 4px;
  z-index: 10;
  pointer-events: none;
}

.game-overlay.info {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 14px;
  display: flex;
  gap: 16px;
}

.game-overlay.loading {
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
}

.game-overlay.error {
  background: rgba(180, 0, 0, 0.8);
  color: #fff;
  pointer-events: auto;
}
</style>