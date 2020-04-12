
import * as Phaser from "phaser";

export class ScoreUI
{
    private scoreText: Phaser.GameObjects.Text;

    constructor(scene:Phaser.Scene, x:number, y:number, colorHex:string)
    {   
        this.scoreText = scene.add.text(x, y, "GO", 
            {
                align: "center",
                fontFamily: 'Arial',
                fontSize: '60px',
                fontStyle: 'Bold',
                color: colorHex
            });

        this.scoreText.setOrigin(0.5, 0);
        scene.add.existing(this.scoreText);
    }

    SetScoreText(score: string): void
    {
        this.scoreText.text = score;
    }
}