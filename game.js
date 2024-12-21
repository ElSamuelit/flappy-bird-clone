const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird = { x: 50, y: 150, width: 20, height: 20, gravity: 1, lift: -15, velocity: 0 };
let pipes = [];
let pipeWidth = 50;
let gap = 150;
let frame = 0;
let score = 0;
let gameRunning = true;

function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + gap, pipeWidth, canvas.height - pipe.top - gap);
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameRunning = false; // Hráč prehral
    }
}

function updatePipes() {
    if (frame % 100 === 0) {
        let topHeight = Math.random() * (canvas.height - gap - 50);
        pipes.push({ x: canvas.width, top: topHeight });
    }
    pipes.forEach(pipe => {
        pipe.x -= 2; // Pohyb potrubia doľava
        if (pipe.x + pipeWidth < 0) {
            pipes.shift(); // Odstránenie prečítaných potrubí
            score++;
        }
        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.top + gap)
        ) {
            gameRunning = false; // Kolízia
        }
    });
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function gameLoop() {
    if (!gameRunning) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 70, canvas.height / 2);
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawPipes();
    drawScore();

    updateBird();
    updatePipes();

    frame++;
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", () => {
    bird.velocity = bird.lift; // Vták "skáče"
});

gameLoop();
