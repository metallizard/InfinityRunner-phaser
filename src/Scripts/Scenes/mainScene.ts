import "phaser";
import { Road } from "../Objects/road"; 
import { Player } from "../Objects/Player";
import { GameOverUI } from "../Objects/GameOverUI";
import { ScoreUI } from "../Objects/ScoreUI";
import { HintUI } from "../Objects/HintUI";

export class MainScene extends Phaser.Scene 
{
    // Game var.
    score: number;
    isGameOver: boolean;
    private _currentHitObject: Phaser.GameObjects.Sprite;

    // In-game Text.
    hintUI: HintUI;
    gameOverUI: GameOverUI;
    scoreUI: ScoreUI;

    // In-game SFX.
    jumpSFX: Phaser.Sound.BaseSound;
    dropSFX: Phaser.Sound.BaseSound;
    deadSFX: Phaser.Sound.BaseSound;
    slideSGX: Phaser.Sound.BaseSound;

    // BGM
    bgm: Phaser.Sound.BaseSound;

    // In-game objects.
    road: Road;
    player: Player;

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
                        this.scoreUI.SetScoreText(this.score.toString());
                    }
                }
            });
    }

    prepareTexts(): void 
    {   
        this.scoreUI = new ScoreUI(this, 
            (this.game.config.width as number) / 2, 
            50, "#0000000");

        var hintText = "Up Arrow - Jump\n\nDown Arrow - Duck";
        this.hintUI = new HintUI(this, 
            (this.game.config.width as number) * 0.01, 70, 
            hintText, "#0000000");

        var gameOverText = "Game Over\n\nR - Restart"
        this.gameOverUI = new GameOverUI(this, 
            (this.game.config.width as number) / 2, 
            (this.game.config.height as number) / 2, 
            gameOverText, "#0000000");
    }

    definePlayerInputs(): void
    {
        this.upKey = this.input.keyboard.addKey("UP");
        this.downKey = this.input.keyboard.addKey("DOWN");
        this.rKey = this.input.keyboard.addKey("R");
    }

    spawnCharacter(): void
    {
        this.player = new Player(this, 
            this.game.config.width as number * 0.1,
            this.game.config.height as number * 0.67);

        this.player.Run();
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
                    this.scoreUI.SetScoreText(this.score.toString());
                    console.log(this.score);
                    this._currentHitObject.alpha = 0;
                }
                else
                {
                    this.game.sound.stopAll();
                    this.game.sound.play("dead");
                    this.GameOver();
                }              
            }
        }
    }

    GameOver(): void
    {
        this.isGameOver = true;

        this.road.setRoadActive(false);
        this.player.Lose();
        this.gameOverUI.Show();
    }

    listenForPlayerInputs(): void
    {
        if(this.upKey.isDown && !this.isPressing && !this.isGameOver)
        {            
            this.Jump();
            this.isPressing = true;
        }
        if(this.downKey.isDown && !this.isPressing && !this.isGameOver)
        {
            this.Duck();
            this.isPressing = true;

        }
        if(this.rKey.isDown && !this.isPressing && this.isGameOver)
        {
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
        
        // Disable user action.
        this.ableToAction = false;

        // Play SFX.
        this.game.sound.play("slide");

        this.player.Duck(1000, () =>
        {
            // Run again after ducking.
            if(!this.isGameOver)
                this.player.Run();
            else
                this.player.Lose(); 

            // Enable user action again.
            this.ableToAction = true;
        });
    }

    Jump(): void
    {
        if(!this.ableToAction) return;

        // Disable user action.
        this.ableToAction = false;

        // Play SFX.
        this.game.sound.play("jump", {volume: 0.5});

        this.player.Jump(350, () =>
        {
            // Run again after jumping.
            if(!this.isGameOver)
                this.player.Run();
            else
                this.player.Lose();

            // Play SFX.
            this.game.sound.play("drop", {volume: 0.3});

            // Enable user action again.
            this.ableToAction = true;
        });
    }
};