import * as Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }
  
  preload(): void
  {
      // Load non-interactable.
      this.load.image("lowerGround", "src/Assets/Images/Tiles/platformPack_tile004.png");
      this.load.image("upperGround", "src/Assets/Images/Tiles/platformPack_tile001.png");
      this.load.image("bgBack", "src/Assets/Images/Seamless/BG.png");

      // Load interactable.
      this.load.image("lowerObstacle1", "src/Assets/Images/Tiles/platformPack_tile041.png");
      this.load.image("lowerObstacle2", "src/Assets/Images/Tiles/platformPack_tile038.png");
      this.load.image("lowerObstacle3", "src/Assets/Images/Tiles/platformPack_tile047.png");
      this.load.image("upperObstacle1", "src/Assets/Images/Tiles/platformPack_tile012.png");
      this.load.image("upperObstacle2", "src/Assets/Images/Tiles/platformPack_tile044.png");
      this.load.image("upperObstacle3", "src/Assets/Images/Tiles/platformPack_tile024.png");
      this.load.image("coin", "src/Assets/Images/Items/platformPack_item008.png");

      // Load Spritesheet.
      this.load.spritesheet("player", "src/Assets/SpriteSheets/character.png", {frameWidth:96, frameHeight: 96});
  
      // Load SFX.
      this.load.audio("jump", "src/Assets/Audios/SFX/jump.wav");
      this.load.audio("drop", "src/Assets/Audios/SFX/drop.wav");
      this.load.audio("dead", "src/Assets/Audios/SFX/dead.wav");
      this.load.audio("slide", "src/Assets/Audios/SFX/slide.wav");

      // Load BGM.
      this.load.audio("bgm", "src/Assets/Audios/bgm.wav");
  }

  create(): void {
    this.scene.start("WelcomeScene");
  }
}
