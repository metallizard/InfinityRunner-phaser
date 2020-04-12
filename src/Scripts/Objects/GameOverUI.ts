
import * as Phaser from "phaser";

export class GameOverUI
{
    private gameOverText: Phaser.GameObjects.Text;

    constructor(scene:Phaser.Scene, x:number, y:number, gameOverText:string, colorHex:string)
    {   
        this.gameOverText = scene.add.text(x, y, gameOverText, 
            {
                align: "center",
                fontFamily: 'Arial',
                fontSize: '48px',
                fontStyle: 'Bold',
                color: colorHex
            });

        this.gameOverText.setOrigin(0.5, 0.5);
        this.gameOverText.alpha = 0;
        scene.add.existing(this.gameOverText);
    }

    Show(): void
    {
        this.gameOverText.alpha = 1;
    }
}