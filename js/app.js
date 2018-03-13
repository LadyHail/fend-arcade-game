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
    constructor(posX, posY, speed, sprite = 'images/enemy-bug.png') {
        super(posX, posY, speed, sprite);
    }

    update(dt) {
        super.update(dt);
        if (this.posX >= OFFSCREEN_X) {
            this.posX = -100;
        }
    }

    render() {
        super.render();
    }
}

class Player extends Character {
    constructor(posX, posY, speed, sprite = 'images/char-boy.png') {
        super(posX, posY, speed, sprite);
        this.MOVE_POS_X = 101;
        this.MOVE_POS_Y = 83;
    }

    update() {}

    render() {
        super.render();
    }

    handleInput(keyCode) {
        switch (keyCode) {
            case 'left':
                this.posX -= this.MOVE_POS_X;
                break;

            case 'right':
                this.posX += this.MOVE_POS_X;
                break;

            case 'up':
                this.posY -= this.MOVE_POS_Y;
                break;

            case 'down':
                this.posY += this.MOVE_POS_Y;
                break;
        }
    }
}

const player = new Player(202, 375);
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
