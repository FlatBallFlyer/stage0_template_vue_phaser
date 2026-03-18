import { Scene } from 'phaser'
import type { GameApiContext } from '../apiContext'

const PROGRESS_THROTTLE_CLICKS = 3

export default class MainScene extends Scene {
  private apiContext!: GameApiContext
  private playerSprite!: Phaser.GameObjects.Rectangle
  private clickCount = 0

  init() {
    this.apiContext = this.registry.get('apiContext') as GameApiContext
  }

  create() {
    const cx = this.scale.width / 2
    const cy = this.scale.height / 2

    this.playerSprite = this.add.rectangle(cx, cy, 40, 40, 0x4caf50)
    this.playerSprite.setInteractive({ useHandCursor: true })

    this.playerSprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.playerSprite.x = pointer.x
      this.playerSprite.y = pointer.y
      this.clickCount += 1
      this.recordMoveEvent()
      if (this.clickCount % PROGRESS_THROTTLE_CLICKS === 0) {
        this.updateProgress()
      }
    })

    if (this.apiContext?.player?.name) {
      this.add
        .text(16, 16, `Player: ${this.apiContext.player.name}`, {
          fontSize: '14px',
          color: '#ffffff'
        })
        .setScrollFactor(0)
    }
  }

  private async recordMoveEvent() {
    if (!this.apiContext?.playerId) return
    try {
      await this.apiContext.recordEvent({
        player_id: this.apiContext.playerId,
        name: 'move'
      })
    } catch (e) {
      console.warn('recordEvent failed', e)
    }
  }

  private async updateProgress() {
    if (!this.apiContext?.gameId) return
    try {
      await this.apiContext.updateGameProgress({
        description: `Clicks: ${this.clickCount}`
      })
    } catch (e) {
      console.warn('updateGameProgress failed', e)
    }
  }
}
