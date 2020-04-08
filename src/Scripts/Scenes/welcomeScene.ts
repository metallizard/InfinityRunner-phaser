import "phaser";
export class WelcomeScene extends Phaser.Scene 
{
  title: Phaser.GameObjects.Text;
  hint: Phaser.GameObjects.Text;
  constructor() 
  {
      super({
        key: "WelcomeScene"
      });
  }

  create(): void 
  {
      var titleText: string = "Endless \nrun";
      this.title = this.add.text((this.game.config.width as number) / 2, 50, titleText,
        { font: '96px Arial Bold', fill: '#FBFBAC' });
      this.title.setOrigin(0.5, 0);
      this.title.setAlign("center");
      
      var hintText: string = "Click to start";
      this.hint = this.add.text((this.game.config.width as number) / 2, (this.game.config.height as number) / 1.25, hintText,
        { font: '24px Arial Bold', fill: '#FBFBAC' });
      this.hint.setOrigin(0.5, 0);
      this.hint.setAlign("center");
      
      this.input.on('pointerdown', function () 
      {
        this.scene.start("MainScene");
      }, this);
    }
  };