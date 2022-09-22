let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext("2d");

let gravity = 0.5;

const playerimg = new Image();
playerimg.src = 'Cyborg_run.png';

const bgimg = new Image();
bgimg.src = 'image.png';

canvas.width = bgimg.width;
canvas.height = bgimg.height;

const floor = canvas.height - 80;

class Player {
    constructor() {
        this.width = 40;
        this.height = 80;
        this.score = 0;
        this.hScore = 0;
        this.hit = false;
        this.jumpcounter = 0;
        this.position = {
            x: 20,
            y: floor - this.height
        }
        this.velocity = {
            x: 2,
            y: 1
        }
    }

    draw(frame) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.drawImage(playerimg, 80 * frame, 0, 58, 80, this.position.x, this.position.y, 58, 80);
    }


    update(frame) {
        this.draw(frame);
        this.score += 1;
        ctx.font = "17px Arial";
        ctx.fillStyle = 'white';
        ctx.fillText(`SCORE: ${this.score}`, 20, 20);
        ctx.fillText(`HIGHEST SCORE: ${this.hScore}`, 20, 40);
        if (this.position.y + this.height + this.velocity.y <= floor) {
            this.position.y += this.velocity.y;
            this.velocity.y += gravity;

        } else {
            this.velocity.y = 0;
        }
    }


    setHighestScore() {
        if (localStorage.getItem("hScore") == null) {
            localStorage.setItem("hScore", this.score);
        } else {
            this.hScore = parseInt(localStorage.getItem("hScore"));
            if (this.score > this.hScore) {
                localStorage.setItem("hScore", this.score);
            }
        }

    }
}

class Obstacle {
    constructor(x, height) {
        this.width = 40;
        this.height = height;
        this.position = {
            x: x,
            y: floor - this.height
        }
        this.velocity = -10;
    }

    draw() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.position.x += this.velocity;
        this.score += 1;
    }

}

let obstacle = new Array(10);
function start(){
    for (let i = 0; i <= 9; i++) {
        let distvar = 0;
        let height = 0;
        let selectheight = Math.floor(Math.random() * 3);
        switch (selectheight) {
            case 0:
                height = 40;
                break;
            case 1:
                height = 50;
                break;
            case 2:
                height = 60;
                break;
        }
        let select = parseInt(Math.random() * 5);
        switch (select) {
            case 1:
                distvar = 100;
                break;
            case 2:
                distvar = 120;
                break;
            case 3:
                distvar = 140;
                break;
            case 4:
                distvar = 160;
                break;
            case 5:
                distvar = 300;
                break;
        }
        let dist = ((1000 + i * 500) + distvar);
        obstacle[i] = new Obstacle(dist, height);
    }
}
start();

const player = new Player();
player.setHighestScore();
let frame = 0, j = 0;

function animate() {
    let id = requestAnimationFrame(animate);
    ctx.drawImage(bgimg, 0, 0);
    j++;
    if (j == 5) {
        j = 0;
        frame = (frame + 1) % 6;
    }
    if(obstacle[9].position.x+obstacle[9].width==0){
        start();
    }
    player.update(frame);
    obstacle.forEach(function (obs) {
        obs.update();
        if ((player.position.x + player.width >= obs.position.x) && player.position.y + player.height >= obs.position.y && (obs.position.x >= player.position.x || obs.position.x + obs.width >= player.position.x)) {
            player.hit = true;
            ctx.drawImage(bgimg, 0, 0);
            obs.update();
            player.update(frame);
            cancelAnimationFrame(id);
            player.setHighestScore();
            ctx.font = "30px Arial"
            ctx.fillStyle = "white";
            ctx.fillText("PRESS ENTER TO PLAY AGAIN", canvas.width * 0.2, canvas.height * 0.4);
        }
    })
}
animate();




window.addEventListener('keydown', (e) => {
    if (e.code == 'Space' && player.position.y + player.height == floor) {
        player.velocity.y = -10;
    }

})

window.addEventListener('keydown', function (e) {
    if (e.key == 'Enter' && player.hit == true) {
        document.location.reload(true);
    }
});