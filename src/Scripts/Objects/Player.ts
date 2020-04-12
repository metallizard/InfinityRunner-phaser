import * as Phaser from "phaser";

export class Player extends Phaser.GameObjects.Sprite 
{
    private myScene: Phaser.Scene;

    constructor(scene: Phaser.Scene, x: number, y: number) 
    {
        super(scene, x, y, "player", 0);

        this.myScene = scene;

        scene.anims.create(
            {
                key: "run",
                frames:
                [
                    {key : 'player', frame: 2},
                    {key : 'player', frame: 3}
                ],
                frameRate: 6,
                repeat: -1
            });

        scene.anims.create(
            {
                key: "startJump",
                frames:
                [
                    {key : 'player', frame: 1}
                ],
                frameRate: 0,
                repeat: -1
            });

        scene.anims.create(
            {
                key: "endJump",
                frames:
                [
                    {key : 'player', frame: 4},
                    {key : 'player', frame: 5}
                ],
                frameRate: 10,
                repeat: -1
            });

        scene.anims.create(
            {
                key: "duck",
                frames:
                [
                    {key : 'player', frame: 6}
                ],
                frameRate: 0,
                repeat: -1
            });
        

        this.setDepth(3);

        scene.add.existing(this);

        this.anims.load("run");
        this.anims.load("startJump");
        this.anims.load("endJump");
        this.anims.load("duck");

    }

    Run(): void
    {
        this.play("run");
    }

    Duck(duration: number, onFinished:()=> void): void
    {
        this.play("duck");
        var playerOriginalHeight = this.height;
        this.height = this.height/2;

        this.myScene.time.addEvent(
            {
                delay: duration,
                callback: () =>
                {
                    this.height = playerOriginalHeight;
                    onFinished();
                }
            }
        );
    }

    Jump(duration: number, onFinished:()=> void): void
    {

        var tweenUp = this.myScene.tweens.add(
            {
                targets: this,
                props: 
                {
                    y: { value: '-=100' }
                },
                ease: 'ExponentialIn',
                duration: duration,
                onStart: () => 
                {
                    this.play("startJump");
                },
                onComplete: () =>
                {
                    this.myScene.tweens.add(
                        {
                            targets: this,
                            props: 
                            {
                                y: { value: '+=100', ease: 'exponentialOut' }
                            },
                            duration: duration,
                            delay: 100,
                            onStart: () => 
                            {
                                // if(this.isGameOver) return;
                                this.play("endJump");
                            },
                            onComplete: () => 
                            {
                                onFinished();
                            }
                        })
                }
            }
        );
    }

    public Lose()
    {
        this.play("duck");
    }
}
