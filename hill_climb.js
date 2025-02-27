const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;

// Car properties
let car = { x: 100, y: 300, width: 50, height: 30, speed: 0, gravity: 0.5, fuel: 100, score: 0 };

// Terrain generation
let terrain = [];
for (let i = 0; i < canvas.width; i += 20) {
    terrain.push({ x: i, y: Math.random() * 100 + 250 });
}

// Controls
let keys = { left: false, right: false };
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "ArrowRight") keys.right = true;
});
window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRight") keys.right = false;
});

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move car
    if (keys.right) car.speed += 0.2;
    if (keys.left) car.speed -= 0.1;
    car.x += car.speed;
    car.y += car.gravity;

    // Terrain collision
    let groundLevel = terrain.find(t => t.x >= car.x)?.y || 300;
    if (car.y > groundLevel - car.height) {
        car.y = groundLevel - car.height;
        car.speed *= 0.9;
    }

    // Draw terrain
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    terrain.forEach(t => ctx.lineTo(t.x, t.y));
    ctx.lineTo(canvas.width, canvas.height);
    ctx.fill();

    // Draw car
    ctx.fillStyle = "red";
    ctx.fillRect(car.x, car.y, car.width, car.height);

    // Fuel system
    car.fuel -= 0.1;
    if (car.fuel <= 0) car.speed = 0;

    // Score tracking
    car.score += Math.abs(car.speed) / 10;
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${Math.floor(car.score)}`, 20, 30);
    ctx.fillText(`Fuel: ${Math.floor(car.fuel)}`, 20, 50);

    // Fuel refill
    if (car.x % 300 < 2) car.fuel = Math.min(car.fuel + 30, 100);

    requestAnimationFrame(gameLoop);
}

// Restart function
function restartGame() {
    car.x = 100;
    car.y = 300;
    car.speed = 0;
    car.fuel = 100;
    car.score = 0;
}

gameLoop();
