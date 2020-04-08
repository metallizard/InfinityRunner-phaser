import "phaser"
type Scene = Phaser.Scene;

export class InputManager
{
    scene: Scene;

    constructor(scene: Scene)
    {
        this.scene = scene;
    }
}