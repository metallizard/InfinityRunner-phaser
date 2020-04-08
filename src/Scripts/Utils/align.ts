type Image = Phaser.GameObjects.Image;
type Config = Phaser.Core.Config;

export class Align
{
    static scaleToGameWidth(targetImage: Image, percentage: number, config: Config)
    {
        targetImage.displayWidth = config.width as number * percentage;
        targetImage.scaleY = targetImage.scaleX;
    }

    static center(targetImage: Image, config: Config)
    {
        targetImage.x = config.width as number / 2;
        targetImage.y = config.height as number / 2;
    }

    static centerHorizontal(targetImage: Image, config: Config)
    {
        targetImage.x = config.width as number / 2;
    }

    static centerVertical(targetImage: Image, config: Config)
    {
        targetImage.y = config.height as number / 2;
    }
}