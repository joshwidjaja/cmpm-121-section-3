import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;

  rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond
  isFiring = false;
  moveSpeed = 1;

  startY = 400;
  thresholdY = 50;

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

    this.spinner = this.add.rectangle(100, this.startY, 50, 50, 0xc686b5);
  }

  update(_timeMs: number, delta: number) {
    this.starfield!.tilePositionX -= 4;

    if (!this.isFiring) {
      if (this.left!.isDown) {
        this.spinner!.x -= delta * this.moveSpeed;
      } else if (this.right!.isDown) {
        this.spinner!.x += delta * this.moveSpeed;
      }
    }

    if (this.fire!.isDown) {
      this.isFiring = true;
    }

    if (this.isFiring && this.spinner!.y >= this.thresholdY) {
      this.spinner!.y -= delta * this.moveSpeed;
    }

    if (this.spinner!.y <= this.thresholdY) {
      this.reset();
    }
  }

  reset() {
    this.isFiring = false;
    this.spinner!.y = this.startY;
  }
}
