import "phaser";
import { PreloadScene } from "./Scripts/Scenes/preloadScene";
import { WelcomeScene } from "./Scripts/Scenes/welcomeScene";
import { MainScene } from "./Scripts/Scenes/mainScene";
type GameConfig = Phaser.Types.Core.GameConfig;

const config: GameConfig = 
{
  title: "Endless Run",
  width: 1280,
  height: 720,
  parent: "game",
  scene : [PreloadScene, WelcomeScene, MainScene],
  physics : {
      default : "arcade",
      arcade : {
          debug : false
      }
  },
  backgroundColor: "#000000"
};

export class EndlessRunGame extends Phaser.Game 
{
  constructor(config: GameConfig) 
  {
    super(config);
  }
}

window.onload = () => 
{
  var game = new EndlessRunGame(config);
};