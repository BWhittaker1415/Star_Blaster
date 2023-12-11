////////////// GLOBAL CONSTANTS ///////////////
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.globalCompositeOperation = "lighter";

const gameOver = document.querySelector(".game-over");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const scoreDisplay = document.querySelector("js-score");
let score = 0;
const speed = 0.09;
const rotationSpeed = 0.05;
const friction = 0.98;
const laserSpeed = 9;
const asteroids = [];
const lasers = [];

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

////////////// INTERVALS ///////////////
const intervalId = window.setInterval(() => {
  const index = Math.floor(Math.random() * 4);
  let x, y;
  let vx, vy;
  let radius = 50 * Math.random() + 10;
  switch (index) {
    case 0: //left side of the screen
      x = 0 - radius;
      y = Math.random() * canvas.height;
      vx = 1 * Math.random() + 1.5;
      vy = 1 + -2 * Math.random();
      break;
    case 1: //bottom side of the screen
      x = Math.random() * canvas.width;
      y = canvas.height + radius;
      vx = 1 + -2 * Math.random();
      vy = 1 * Math.random() - 1.5;
      break;
    case 2: //right side of the screen
      x = canvas.width + radius;
      y = Math.random() * canvas.height;
      vx = -1 * Math.random() - 1.5;
      vy = 1 + -2 * Math.random();
      break;
    case 3: //top side of the screen
      x = Math.random() * canvas.width;
      y = 0 - radius;
      vx = 1 + -2 * Math.random();
      vy = 1 * Math.random() - 1.5;
      break;
  }
  asteroids.push(
    new Asteroid({
      position: {
        x: x,
        y: y,
      },
      velocity: {
        x: vx * 2,
        y: vy * 2,
      },
      radius,
    })
  );
}, 700);

////////////// PLAYER: CREATION / MOVEMENT ///////////////
class Player {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.rotation = 0;
  }

  create() {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    ctx.translate(-this.position.x, -this.position.y);

    ctx.beginPath();
    ctx.moveTo(this.position.x + 30, this.position.y);
    ctx.lineTo(this.position.x - 10, this.position.y - 12);
    ctx.lineTo(this.position.x - 4, this.position.y - 5);
    ctx.lineTo(this.position.x - 4, this.position.y + 5);
    ctx.lineTo(this.position.x - 10, this.position.y + 12);
    ctx.closePath();

    ctx.strokeStyle = "magenta";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    if (this.position.x < 0) this.position.x = canvas.width;

    if (this.position.x > canvas.width) this.position.x = 0;

    if (this.position.y < 0) this.position.y = canvas.height;

    if (this.position.y > canvas.height) this.position.y = 0;
  }
  update() {
    this.create();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  getVertices() {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);

    return [
      {
        x: this.position.x + cos * 30 - sin * 0,
        y: this.position.y + sin * 30 + cos * 0,
      },
      {
        x: this.position.x + cos * -10 - sin * 10,
        y: this.position.y + sin * -10 + cos * 10,
      },
      {
        x: this.position.x + cos * -10 - sin * -10,
        y: this.position.y + sin * -10 + cos * -10,
      },
    ];
  }
}

const player = new Player({
  position: { x: canvas.width / 2, y: canvas.height / 2 },
  velocity: { x: 0, y: 0 },
});

////////////// LASERS: CREATION / MOVEMENT ///////////////
class Laser {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 3;
  }
  create() {
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    ctx.closePath();
    ctx.fillStyle = "yellow";
    ctx.fill();
  }
  update() {
    this.create();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

////////////// ASTEROIDS: CREATION / MOVEMENT ///////////////
class Asteroid {
  constructor({ position, velocity, radius }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    ctx.closePath();
    ctx.shadowColor = "tomato";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = "crimson";
    ctx.lineWidth = 5;
    ctx.stroke();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

////////////// EVENT LISTENERS ///////////////

window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyW":
      console.log("KeyW");
      keys.w.pressed = true;
      break;
    case "KeyA":
      console.log("KeyA");
      keys.a.pressed = true;
      break;
    case "KeyD":
      console.log("KeyD");
      keys.d.pressed = true;
      break;
    case "Space":
      lasers.push(
        new Laser({
          position: {
            x: player.position.x + Math.cos(player.rotation) * 30,
            y: player.position.y + Math.sin(player.rotation) * 30,
          },
          velocity: {
            x: Math.cos(player.rotation) * laserSpeed,
            y: Math.sin(player.rotation) * laserSpeed,
          },
        })
      );
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyW":
      console.log("KeyW");
      keys.w.pressed = false;
      break;
    case "KeyA":
      console.log("KeyA");
      keys.a.pressed = false;
      break;
    case "KeyD":
      console.log("KeyD");
      keys.d.pressed = false;
      break;
  }
});

function drawScore() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(`Score: ${score}`, 8, 30);
}

////////////// ANIMATIONS & FUNCTIONS ///////////////
function objectHit(object1, object2) {
  const xDifference = object2.position.x - object1.position.x;
  const yDifference = object2.position.y - object1.position.y;

  const distance = Math.sqrt(
    xDifference * xDifference + yDifference * yDifference
  );

  if (distance <= object1.radius + object2.radius) {
    if (object1.radius > 30) score += 100;
    if (object1.radius > 20 && object1.radius < 30) score += 500;
    if (object1.radius > 10 && object1.radius < 20) score += 1000;
    console.log(object1.radius, object2.radius);

    return true;
  }
  return false;
}

function shipAsteroidCollision(circle, triangle) {
  for (let i = 0; i < 3; i++) {
    let start = triangle[i];
    let end = triangle[(i + 1) % 3];

    let dx = end.x - start.x;
    let dy = end.y - start.y;
    let length = Math.sqrt(dx * dx + dy * dy);

    let dot =
      ((circle.position.x - start.x) * dx +
        (circle.position.y - start.y) * dy) /
      Math.pow(length, 2);

    let closestX = start.x + dot * dx;
    let closestY = start.y + dot * dy;

    if (!isPointOnLineSegment(closestX, closestY, start, end)) {
      closestX = closestX < start.x ? start.x : end.x;
      closestY = closestY < start.y ? start.y : end.y;
    }

    dx = closestX - circle.position.x;
    dy = closestY - circle.position.y;

    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= circle.radius) {
      console.log("collision");
      return true;
    }
  }

  return false;
}

function isPointOnLineSegment(x, y, start, end) {
  return (
    x >= Math.min(start.x, end.x) &&
    x <= Math.max(start.x, end.x) &&
    y >= Math.min(start.y, end.y) &&
    y <= Math.max(start.y, end.y)
  );
}

function animate() {
  const animationId = window.requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect("/assets/Background-img.png", 0, canvas.width, canvas.height);

  drawScore();

  player.update();

  for (let i = lasers.length - 1; i >= 0; i--) {
    const laser = lasers[i];
    laser.update();

    if (
      laser.position.x + laser.radius < 0 ||
      laser.position.x - laser.radius > canvas.width ||
      laser.position.y + laser.radius < 0 ||
      laser.position.y - laser.radius > canvas.height
    ) {
      lasers.splice(i, 1);
    }
  }

  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i];
    asteroid.update();

    if (shipAsteroidCollision(asteroid, player.getVertices())) {
      gameOver.style.display = "block";
      console.log("GAME OVER");
      window.cancelAnimationFrame(animationId);
      clearInterval(intervalId);
    }

    if (
      asteroid.position.x + asteroid.radius < 0 ||
      asteroid.position.x - asteroid.radius > canvas.width ||
      asteroid.position.y + asteroid.radius < 0 ||
      asteroid.position.y - asteroid.radius > canvas.height
    ) {
      asteroids.splice(i, 1);
    }

    for (let m = lasers.length - 1; m >= 0; m--) {
      const laser = lasers[m];

      if (objectHit(asteroid, laser)) {
        asteroids.splice(i, 1);
        lasers.splice(m, 1);
      }
    }
  }

  if (keys.w.pressed) {
    player.velocity.x += Math.cos(player.rotation) * speed;
    player.velocity.y += Math.sin(player.rotation) * speed;
  } else if (!keys.w.pressed) {
    player.velocity.x *= friction;
    player.velocity.y *= friction;
  }
  if (keys.d.pressed) player.rotation += rotationSpeed;
  else if (keys.a.pressed) player.rotation -= rotationSpeed;
}

animate();
