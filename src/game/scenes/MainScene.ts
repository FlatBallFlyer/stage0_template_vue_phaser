import { Scene } from 'phaser'

export default class MainScene extends Scene {
  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'Game', {
        fontSize: '48px',
        color: '#ffffff'
      })
      .setOrigin(0.5)
  }
}
