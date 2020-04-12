import * as Phaser from "phaser";

export class HintUI
{
    private hintText: Phaser.GameObjects.Text;

    constructor(scene:Phaser.Scene, x:number, y:number, text:string, colorHex:string)
    {   
        this.hintText = scene.add.text(x, y, text, 
            {
                align: "left",
                fontFamily: 'Arial',
                fontSize: '24px',
                color: colorHex
            });

        this.hintText.alpha = 1;
    }
}