import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  player?: Phaser.GameObjects.Shape;
  enemy?: Phaser.GameObjects.Shape;

  rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond
  isFiring = false;
  moveSpeed = 1;

  startY = 400;
  thresholdY = 50;

  enemyStartX = 500;

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);

    this.player = this.add.rectangle(100, this.startY, 50, 50, 0xc686b5);
    this.enemy = this.add.rectangle(
      this.enemyStartX,
      this.thresholdY,
      50,
      50,
      0xff0000,
    );
  }

  update(_timeMs: number, delta: number) {
    this.starfield!.tilePositionX -= 4;

    if (!this.isFiring) {
      if (this.left!.isDown) {
        this.player!.x -= delta * this.moveSpeed;
      } else if (this.right!.isDown) {
        this.player!.x += delta * this.moveSpeed;
      }
    }

    if (this.fire!.isDown) {
      this.isFiring = true;
    }

    if (this.isFiring && this.player!.y >= this.thresholdY) {
      this.player!.y -= delta * this.moveSpeed;
    }

    if (this.player!.y <= this.thresholdY) {
      this.resetPlayer();
    }
  }

  resetPlayer() {
    this.isFiring = false;
    this.player!.y = this.startY;
  }
}
