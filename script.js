const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

let car = {
    x: 100,
    y: 250,
    width: 50,
    height: 30,
    speed: 0,
    gravity: 0.5,
    fuel: 100,
    rotation: 0
};

let hills = [];
let score = 0;
let gameOver = false;

// Generate Terrain
for (let i = 0; i < 50; i++) {
    hills.push({
        x: i * 50,
        y: 250 + Math.sin(i * 0.5) * 30
    });
}

function drawCar() {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.rotation);
    ctx.fillStyle = "red";
    ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
    ctx.fillStyle = "black";
    ctx.fillRect(-car.width / 2 + 5, car.height / 2, 10, 10);
    ctx.fillRect(car.width / 2 - 15, car.height / 2, 10, 10);
    ctx.restore();
}

function drawHills() {
    ctx.beginPath();
    ctx.moveTo(0, 400);
    ctx.lineTo(0, hills[0].y);
    for (let i = 0; i < hills.length; i++) {
        ctx.lineTo(hills[i].x, hills[i].y);
    }
    ctx.lineTo(canvas.width, 400);
    ctx.closePath();
    ctx.fillStyle = "green";
    ctx.fill();
}

function update() {
    if (gameOver) return;

    car.speed *= 0.98;
    car.y += car.gravity;
    car.fuel -= 0.05;
    
    if (car.fuel <= 0) {
        gameOver = true;
        alert("Game Over! You ran out of fuel.");
        return;
    }

    score += Math.abs(car.speed) * 0.1;

    // Collision with hills
    for (let i = 0; i < hills.length; i++) {
        if (car.x > hills[i].x && car.x < hills[i].x + 50) {
            let groundY = hills[i].y;
            if (car.y >= groundY - car.height / 2) {
                car.y = groundY - car.height / 2;
                car.speed = 0;
            }
        }
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHills();
    drawCar();
    document.getElementById("score").textContent = `Score: ${Math.floor(score)} | Fuel: ${Math.floor(car.fuel)}%`;
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

document.getElementById("accelerate").addEventListener("mousedown", () => {
    if (car.fuel > 0) {
        car.speed += 1.5;
    }
});

document.getElementById("brake").addEventListener("mousedown", () => {
    car.speed -= 1.5;
});

document.getElementById("tilt-forward").addEventListener("mousedown", () => {
    car.rotation -= 0.1;
});

document.getElementById("tilt-backward").addEventListener("mousedown", () => {
    car.rotation += 0.1;
});

gameLoop();
