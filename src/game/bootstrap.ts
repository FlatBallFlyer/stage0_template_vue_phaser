import Phaser from 'phaser'
import MainScene from './scenes/MainScene'

export function createGame(parent: string | HTMLElement): Phaser.Game {
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
    scene: [MainScene]
  }

  return new Phaser.Game(config)
}
