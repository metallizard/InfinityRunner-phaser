import "phaser";
import { Road } from "../Objects/road"; 
import { GameObjects } from "phaser";

export class MainScene extends Phaser.Scene 
{
    // Game var.
    score: number;
    isGameOver: boolean;
    private _currentHitObject: Phaser.GameObjects.Sprite;

    // In-game Text.
    scoreText: Phaser.GameObjects.Text;
    hintText: Phaser.GameObjects.Text;
    gameOverText: Phaser.GameObjects.Text;

    // In-game SFX.
    jumpSFX: Phaser.Sound.BaseSound;
    dropSFX: Phaser.Sound.BaseSound;
    deadSFX: Phaser.Sound.BaseSound;
    slideSGX: Phaser.Sound.BaseSound;

    // BGM
    bgm: Phaser.Sound.BaseSound;

    // In-game objects.
    road: Road;
    player: Phaser.GameObjects.Sprite;

    // Player inputs var.
    upKey: Phaser.Input.Keyboard.Key;
    downKey: Phaser.Input.Keyboard.Key;
    rKey: Phaser.Input.Keyboard.Key;
    isPressing: boolean;
    ableToAction: boolean = true;

    constructor() 
    {
        super({
            key: "MainScene"
        });
    }

    preload(): void
    {
        // Load non-interactable.
        this.load.image("lowerGround", "src/Assets/Images/Tiles/platformPack_tile004.png");
        this.load.image("upperGround", "src/Assets/Images/Tiles/platformPack_tile001.png");
        this.load.image("bgBack", "src/Assets/Images/Seamless/BG.png");

        // Load interactable.
        this.load.image("lowerObstacle1", "src/Assets/Images/Tiles/platformPack_tile041.png");
        this.load.image("lowerObstacle2", "src/Assets/Images/Tiles/platformPack_tile038.png");
        this.load.image("lowerObstacle3", "src/Assets/Images/Tiles/platformPack_tile047.png");
        this.load.image("upperObstacle1", "src/Assets/Images/Tiles/platformPack_tile012.png");
        this.load.image("upperObstacle2", "src/Assets/Images/Tiles/platformPack_tile044.png");
        this.load.image("upperObstacle3", "src/Assets/Images/Tiles/platformPack_tile024.png");
        this.load.image("coin", "src/Assets/Images/Items/platformPack_item008.png");

        // Load Spritesheet.
        this.load.spritesheet("player", "src/Assets/SpriteSheets/character.png", {frameWidth:96, frameHeight: 96});
    
        // Load SFX.
        this.load.audio("jump", "src/Assets/Audios/SFX/jump.wav");
        this.load.audio("drop", "src/Assets/Audios/SFX/drop.wav");
        this.load.audio("dead", "src/Assets/Audios/SFX/dead.wav");
        this.load.audio("slide", "src/Assets/Audios/SFX/slide.wav");

        // Load BGM.
        this.load.audio("bgm", "src/Assets/Audios/bgm.wav");
    }

    create(): void 
    {
        // Init character and road.
        this.spawnCharacter();
        this.road = new Road(this);
        this.road.x = this.game.config.width as number / 2;

        // Define player inputs.
        this.definePlayerInputs();

        // Prepare text.
        this.prepareTexts();

        // Set default variable value.
        this.score = 0;
        this.isGameOver = false;
        this.ableToAction = true;

        // Define SFX.
        this.jumpSFX = this.game.sound.add("jump");
        this.dropSFX = this.game.sound.add("drop");
        this.slideSGX = this.game.sound.add("slide");
        this.deadSFX = this.game.sound.add("dead");

        // Define BGM.
        this.bgm = this.game.sound.add("bgm");
        this.game.sound.play("bgm", {volume: 0.5, loop: true});

        // Score coroutine.
        this.time.addEvent(
            {
                delay:2000, loop:true,
                callback: () =>
                {
                    if(!this.isGameOver)
                    {
                        this.score += 100;
                        this.scoreText.text = this.score.toString();
                    }
                }
            });
    }

    prepareTexts(): void 
    {   
        this.scoreText = this.add.text((this.game.config.width as number) / 2, 50, "GO",
          { font: '60px Arial Bold', fill: '#000000' });
        this.scoreText.setOrigin(0.5, 0);
        this.scoreText.setAlign("center");

        var hintText = "Up Arrow - Jump\n\nDown Arrow - Duck";
        this.hintText = this.add.text((this.game.config.width as number) * 0.01, 70, hintText,
          { font: '24px Arial', fill: '#000000' });
        this.hintText.setAlign("left");

        var gameOverText = "Game Over\n\nR - Restart"
        this.gameOverText = this.add.text((this.game.config.width as number) / 2, 
        (this.game.config.height as number) / 2, gameOverText, 
        { font: '48px Arial Bold', fill: '#000000' });
        this.gameOverText.setOrigin(0.5, 0.5);
        this.gameOverText.setAlign("center");
        this.gameOverText.alpha = 0;
    }

    definePlayerInputs(): void
    {
        this.upKey = this.input.keyboard.addKey("UP");
        this.downKey = this.input.keyboard.addKey("DOWN");
        this.rKey = this.input.keyboard.addKey("R");
    }

    spawnCharacter(): void
    {
        this.player = this.add.sprite(this.game.config.width as number * 0.1,
            this.game.config.height as number * 0.67, "player");

        this.anims.create(
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
        this.anims.create(
            {
                key: "startJump",
                frames:
                [
                    {key : 'player', frame: 1}
                ],
                frameRate: 0,
                repeat: -1
            });
        this.anims.create(
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
        this.anims.create(
            {
                key: "duck",
                frames:
                [
                    {key : 'player', frame: 6}
                ],
                frameRate: 0,
                repeat: -1
            });
        

        this.player.setDepth(3);

        this.player.play("run");
    }

    update(time:number, delta:number): void
    {
        // Move maps.
        this.road.moveRoad();
        this.road.moveObject();

        // Listen to inputs.
        this.listenForPlayerInputs();

        // Check for collisions.
        this.CheckForCollision();
    }

    CheckForCollision(): void
    {
        var obstacleX = this.road.obstacle.parentContainer.x + this.road.obstacle.x;
        var obstacleY = this.road.obstacle.y;
        var x = Math.abs(this.player.x - obstacleX);
        var y = Math.abs(this.player.y - obstacleY);
        
        if(x < this.player.width / 2)
        {   
            if(y < this.player.height / 2)
            {
                if(this.isGameOver) return;
                if(this.road.obstacle == this._currentHitObject) return;

                this._currentHitObject = this.road.obstacle;

                if(this.road.obstacle.getData("IsBonus") as boolean)
                {
                    console.log(this.score);
                    this.score += 500;
                    this.scoreText.text = this.score.toString();
                    console.log(this.score);
                    this._currentHitObject.alpha = 0;
                }
                else
                {
                    console.log("Kena !");
                    this.game.sound.stopAll();
                    this.game.sound.play("dead");
                    this.GameOver();
                }              
            }
        }
    }

    GameOver(): void
    {
        this.road.setRoadActive(false);
        this.player.play("duck");
        this.isGameOver = true;
        this.gameOverText.alpha = 1;
    }

    listenForPlayerInputs(): void
    {
        if(this.upKey.isDown && !this.isPressing && !this.isGameOver)
        {
            console.log("Up");
            
            this.Jump();
            this.isPressing = true;
        }
        if(this.downKey.isDown && !this.isPressing && !this.isGameOver)
        {
            console.log("Down");
            this.Duck();
            this.isPressing = true;

        }
        if(this.rKey.isDown && !this.isPressing && this.isGameOver)
        {
            console.log("RRR");
            this.isPressing = true;
            this.scene.stop("MainScene");
            this.scene.start("WelcomeScene");
        }


        // Flip flop.
        if(this.upKey.isUp && this.downKey.isUp)
        {
            this.isPressing = false;
        }
    }

    Duck(): void
    {
        if(!this.ableToAction) return;
        
        // Disable duck.
        this.ableToAction = false;

        this.game.sound.play("slide");
        this.player.play("duck");
        var playerOriginalHeight = this.player.height;
        this.player.height = this.player.height/2;

        this.time.addEvent(
            {
                delay: 1000,
                callback: () =>
                {
                    this.player.play("run");
                    this.ableToAction = true;
                    this.player.height = playerOriginalHeight;
                }
            }
        );
    }

    Jump(): void
    {
        if(!this.ableToAction) return;

        // Disable jump.
        this.ableToAction = false;

        var tweenUp = this.tweens.add(
            {
                targets: this.player,
                props: 
                {
                    y: { value: '-=100' }
                },
                ease: 'ExponentialIn',
                duration: 350,
                onStart: () => 
                {
                    this.player.play("startJump");
                    this.game.sound.play("jump", {volume: 0.5});
                },
                onComplete: () =>
                {
                    this.tweens.add(
                        {
                            targets: this.player,
                            props: 
                            {
                                y: { value: '+=100', ease: 'exponentialOut' }
                            },
                            duration: 350,
                            delay: 100,
                            onStart: () => 
                            {
                                if(this.isGameOver) return;
                                this.player.play("endJump");
                            },
                            onComplete: () => 
                            {
                                if(this.isGameOver) return;
                                this.game.sound.play("drop", {volume: 0.3});
                                this.player.play("run");
                                this.ableToAction = true;
                            }
                        })
                }
            }
        );
    }
};