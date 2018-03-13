const OFFSCREEN_X = 505;
const OFFSCREEN_Y = 606;

class Character {
    constructor(posX = 0, posY = 0, speed = 100, sprite) {
        this.posX = posX;
        this.posY = posY;
        this.speed = speed;
        this.sprite = sprite;
    }

    update(dt) {
        this.posX += this.speed * dt;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.posX, this.posY);
    }

    getLocation() {
        return [this.posX, this.posY];
    }
}

class Enemy extends Character {
    static get SIZE_X() {
        return 60;
    }

    static get SIZE_Y() {
        return 60;
    }
    constructor(posX, posY, speed, sprite = 'images/enemy-bug.png') {
        super(posX, posY, speed, sprite);
    }

    update(dt) {
        super.update(dt);
        this.checkCollision();
        if (this.posX >= OFFSCREEN_X) {
            this.posX = -100;
        }
    }

    render() {
        super.render();
    }

    checkCollision() {
        const enemyHitbox = { posX: this.posX, posY: this.posY, size_X: Enemy.SIZE_X, size_Y: Enemy.SIZE_Y };
        const playerHitbox = { posX: player.posX, posY: player.posY, size_X: Player.SIZE_X, size_Y: Player.SIZE_Y };

        if (playerHitbox.posX < enemyHitbox.posX + enemyHitbox.size_X &&
            playerHitbox.posX + playerHitbox.size_X > enemyHitbox.posX &&
            playerHitbox.posY < enemyHitbox.posY + enemyHitbox.size_Y &&
            playerHitbox.posY + playerHitbox.size_Y > enemyHitbox.posY) {
            player.collision('enemy');
        }
    }
}

class Player extends Character {
    static get MOVE_POS_X() {
        return 101;
    }

    static get MOVE_POS_Y() {
        return 83;
    }

    static get SIZE_X() {
        return 50;
    }

    static get SIZE_Y() {
        return 22; // minimum value to correct collision detection
    }

    static get START_X() {
        return 202;
    }

    static get START_Y() {
        return 375;
    }
    constructor(posX = 202, posY = 375, speed, sprite = 'images/char-boy.png') {
        super(posX, posY, speed, sprite);
    }

    update() {}

    render() {
        super.render();
    }

    handleInput(keyCode) {
        switch (keyCode) {
            case 'left':
                this.posX -= Player.MOVE_POS_X;
                break;

            case 'right':
                this.posX += Player.MOVE_POS_X;
                break;

            case 'up':
                this.posY -= Player.MOVE_POS_Y;
                break;

            case 'down':
                this.posY += Player.MOVE_POS_Y;
                break;
        }
    }

    collision(target) {
        switch (target) {
            case 'enemy':
                this.reset();
                break;
        }
    }

    reset() {
        this.posX = Player.START_X;
        this.posY = Player.START_Y;
    }
}

const player = new Player();
const allEnemies = new Array();
allEnemies.push(new Enemy(0, 60), new Enemy(202, 145), new Enemy(404,230));

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
