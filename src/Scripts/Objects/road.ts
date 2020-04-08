import "phaser";
import { Align } from "../Utils/align";
import { Collision } from "../Utils/collision";

export class Road extends Phaser.GameObjects.Container
{
    lineGroup: Phaser.GameObjects.Group;
    scrollSpeed: number;
    lineCount: number;
    car: Phaser.GameObjects.Sprite;
    obstacle: Phaser.GameObjects.Sprite;

    isActive: boolean;

    private scrollSpeedMultiplier: number;

    constructor(scene)
    {
        super(scene);
        this.scene = scene;

        this.scrollSpeedMultiplier = 5;

        this.scene.add.existing(this);

        this.lineGroup = this.scene.add.group();
        this.lineCount = 0;

        // set z buffer.
        this.setDepth(3);

        //this.car = this.scene.add.sprite(this.displayWidth/5, 
        //    this.scene.game.config.height as number * 0.86, "cars");
        //Align.scaleToGameWidth(this.car, 0.08, this.scene.game.config);
        //this.add(this.car);

        // Add Click.
        //road.setInteractive();
        //road.on("pointerdown", this.changeLanes, this);
        this.addObject();

        this.makeRoad();
        this.makeParalaxBackground();

        this.isActive = true;
    }

    setRoadActive(isActive: boolean): void
    {
        this.isActive = isActive;
    }

    makeRoad(): void
    {
        var lowerGroundLayerCount = 2;
        var roadLength = 50;
        var groundWidth = 0;
        var groundHeight = 0;

        for(var h = 0; h < lowerGroundLayerCount; h++)
        {
            for(var i = 0; i < roadLength; i++)
            {
                var lowerGround = this.scene.add.image(0, 0, "lowerGround");
                groundWidth = lowerGround.width;
                groundHeight = lowerGround.height;

                lowerGround.setPosition(
                    -(this.scene.game.config.width as number / 2) + (groundWidth / 2) + (groundWidth * i), 
                    this.scene.game.config.height as number - (lowerGround.height / 2) - (groundHeight * h));

                this.add(lowerGround);

                lowerGround.setData("OriginalX", lowerGround.x);
                this.lineGroup.add(lowerGround);
            }
        }

        for(var i = 0; i < roadLength; i++)
        {
            var upperGround = this.scene.add.image(0, 0, "upperGround");
            groundWidth = upperGround.width;

            upperGround.setPosition(
                -(this.scene.game.config.width as number / 2) + (groundWidth / 2) + (groundWidth * i), 
                this.scene.game.config.height as number - (lowerGround.height / 2) - (groundHeight * lowerGroundLayerCount));
            this.add(upperGround);

            upperGround.setData("OriginalX", upperGround.x);
            this.lineGroup.add(upperGround);
        }

        this.scrollSpeed = (groundWidth * this.scrollSpeedMultiplier / this.scene.game.loop.actualFps);
    }

    makeParalaxBackground(): void
    {
        var bg = this.scene.add.tileSprite(0, 0, 
            this.scene.game.config.width as number, 
            this.scene.game.config.height as number, "bgBack");

        bg.setOrigin(0, 0);
        bg.setScrollFactor(0, 0);
        bg.setDepth(0);

        this.scene.time.addEvent(
            {
                delay:0, loop: true,
                callback: () =>
                {
                    if(!this.isActive) return;

                    bg.tilePositionX += 1;
                }
            }
        );
    }

    moveRoad(): void
    {
        if(!this.isActive) return;

        this.lineGroup.children.iterate((roadObject) => 
        {
            (roadObject as Phaser.GameObjects.Image).x -= this.scrollSpeed;
        });

        this.lineCount += (1/ this.scene.game.loop.actualFps);
        if(this.lineCount >= this.scrollSpeedMultiplier)
        {
            this.lineCount = 0;
            this.lineGroup.children.iterate((lineObject) => 
            {
                (lineObject as Phaser.GameObjects.Image).x = lineObject.getData("OriginalX") as number;
            });
        }
    }

    addObject(): void
    {
        var objects = [
            {key:'lowerObstacle1', scale: 4, yPosPer: 70, shouldRotate: false, isBonus: false}, 
            {key:'lowerObstacle2', scale: 4, yPosPer: 70, shouldRotate: false, isBonus: false}, 
            {key:'lowerObstacle3', scale: 4, yPosPer: 70, shouldRotate: false, isBonus: false},
            {key:'upperObstacle1', scale: 4, yPosPer: 62, shouldRotate: true, isBonus: false}, 
            {key:'upperObstacle2', scale: 4, yPosPer: 62, shouldRotate: true, isBonus: false}, 
            {key:'upperObstacle3', scale: 4, yPosPer: 62, shouldRotate: true, isBonus: false },
            {key:'coin', scale: 6, yPosPer: 62, shouldRotate: true, isBonus: true},
        ];

        var index = Math.floor(Math.random() * objects.length);
        var objectName = objects[index].key;
        var scale = objects[index].scale/100;
        var yPosPer = objects[index].yPosPer/100;

        this.obstacle = this.scene.add.sprite(
            this.scene.game.config.width as number, 
            this.scene.game.config.height as number * yPosPer, objectName);
        
        this.obstacle.setData("IsBonus", objects[index].isBonus);

        Align.scaleToGameWidth(this.obstacle, scale, this.scene.game.config);
        this.add(this.obstacle);
    }

    moveObject(): void
    {
        if(!this.isActive) return;

        this.obstacle.x -= this.scrollSpeed;
        // if(Collision.checkCollide(this.car, this.obstacle))
        // {
        //     this.car.alpha = 0.5;
        // }
        // else
        // {   
        //     this.car.alpha = 1;
        // }
        if(this.obstacle.x < -(this.scene.game.config.width as number / 2))
        {
            this.obstacle.destroy();
            this.addObject();
        }
    }
}