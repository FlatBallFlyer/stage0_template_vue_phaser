<template>
  <div ref="gameContainer" class="game-page" data-automation-id="game-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { createGame } from '@/game/bootstrap'
import type Phaser from 'phaser'

const gameContainer = ref<HTMLElement | null>(null)
let game: Phaser.Game | null = null

onMounted(() => {
  if (!gameContainer.value) return
  game = createGame(gameContainer.value)
})

onUnmounted(() => {
  if (game) {
    game.destroy(true)
    game = null
  }
})
</script>

<style scoped>
.game-page {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2d2d2d;
}
</style>
