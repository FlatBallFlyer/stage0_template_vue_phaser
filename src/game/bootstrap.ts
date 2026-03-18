import Phaser from 'phaser'
import MainScene from './scenes/MainScene'
import type { GameApiContext } from './apiContext'

export function createGame(parent: string | HTMLElement, apiContext?: GameApiContext): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent,
    backgroundColor: '#2d2d2d',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [MainScene],
    callbacks: {
      postBoot: (game: Phaser.Game) => {
        if (apiContext) game.registry.set('apiContext', apiContext)
      }
    }
  }

  return new Phaser.Game(config)
}
