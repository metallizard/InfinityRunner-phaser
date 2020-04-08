type Config = Phaser.Core.Config;
type Sprite = Phaser.GameObjects.Sprite;

export class Collision
{
    static checkCollide(targetSprite1: Sprite, targetSprite2: Sprite): boolean
    {
        var distanceX = Math.abs(targetSprite1.x - targetSprite2.x);
        var distanceY = Math.abs(targetSprite1.y - targetSprite2.y);

        if(distanceX < targetSprite1.width / 2)
        {   
            if(distanceY < targetSprite1.height / 2)
            {
                return true;
            }
        }
        return false;
    }
}