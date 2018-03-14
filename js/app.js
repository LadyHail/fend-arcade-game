const OFFSCREEN_X = 505;
const OFFSCREEN_Y = 606;
const COLLIDER = 60;
let playerHitbox = new Object();

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
}

class Enemy extends Character {
    constructor(tag, posX, posY, speed, sprite = 'images/enemy-bug.png') {
        super(posX, posY, speed, sprite);
        this.tag = tag;
    }

    update(dt) {
        super.update(dt);
        player.checkCollision(this);
        if (this.posX >= OFFSCREEN_X) {
            this.posX = -100;
        }
    }

    render() {
        super.render();
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

    update() {
        playerHitbox = { posX: player.posX, posY: player.posY, size_X: Player.SIZE_X, size_Y: Player.SIZE_Y };
    }

    render() {
        super.render();
    }

    handleInput(keyCode) {
        switch (keyCode) {
            case 'left':
                this.posX -= this.posX > 0 ? Player.MOVE_POS_X : 0;
                break;

            case 'right':
                this.posX += this.posX < 404 ? Player.MOVE_POS_X : 0;
                break;

            case 'up':
                this.posY -= Player.MOVE_POS_Y;
                this.win();
                break;

            case 'down':
                this.posY += this.posY < 375 ? Player.MOVE_POS_Y : 0;
                break;
        }
    }

    checkCollision(obj) {
        const objectHitbox = { posX: obj.posX, posY: obj.posY, collider: COLLIDER };

        if (playerHitbox.posX < objectHitbox.posX + objectHitbox.collider &&
            playerHitbox.posX + playerHitbox.size_X > objectHitbox.posX &&
            playerHitbox.posY < objectHitbox.posY + objectHitbox.collider &&
            playerHitbox.posY + playerHitbox.size_Y > objectHitbox.posY) {
            player.collision(obj);
        }
    }

    collision(obj) {
        switch (obj.tag) {
            case 'enemy':
                this.reset();
                ui.removeLive();
                break;
            case 'heart':
                obj.posX = -200;
                ui.addLive();
                break;
            case 'star':
                obj.posX = -200;
                break;
        }
    }

    reset() {
        this.posX = Player.START_X;
        this.posY = Player.START_Y;
    }

    win() {
        if (player.posY < 0) {
            this.reset();
        }
    }
}

class GameObject {
    constructor(tag, posX, posY, sprite) {
        this.tag = tag;
        this.posX = posX;
        this.posY = posY;
        this.sprite = sprite;
    }

    update() {
        player.checkCollision(this);
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.posX, this.posY);
    }

    
}

class UI {
    constructor() {
        this.lives = 3;
    }
    render() {
        ctx.fillRect(0, OFFSCREEN_Y - 50, OFFSCREEN_X, 50);
        ctx.fillStyle = 'orange';
        this.drawLives();
    }

    update() {
        
    }

    drawLives() {
        let posX = 0;
        for (var i = 1; i <= this.lives; i++) {
            ctx.drawImage(Resources.get('images/Heart.png'), posX, OFFSCREEN_Y - 65, 50, 75);
            posX += 45;
        }
    }

    addLive() {
        if (this.lives < 3) {
            this.lives++;
            this.drawLives();
        }
    }

    removeLive() {
        this.lives--;
        this.drawLives();
        if (this.lives === 0) {
            this.gameOver();
        }
    }
}

function randomPosition() {
    const posX = 101 * Math.floor(Math.random() * 4);
    const posY = 60 + (85 * Math.floor(Math.random() * 3));
    return [posX, posY];
}

const player = new Player();
const allEnemies = new Array();
allEnemies.push(new Enemy('enemy', 0, 60), new Enemy('enemy', 202, 145), new Enemy('enemy', 404, 230));

const heart = new GameObject('heart', randomPosition()[0], randomPosition()[1], 'images/Heart.png');
const star = new GameObject('star', randomPosition()[0], randomPosition()[1], 'images/Star.png');
const gameObjects = new Array();
gameObjects.push(heart, star);

const ui = new UI();

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
