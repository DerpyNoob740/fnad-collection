// Particle canvas script (zero gravity float + mouse repulsion + glow)
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particleCount = 200;
const particles = [];
const mouse = {
  x: null,
  y: null,
  radius: 100
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
  }

update() {
  const dx = mouse.x - this.x;
  const dy = mouse.y - this.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < mouse.radius) {
    const angle = Math.atan2(dy, dx);
    const force = (mouse.radius - dist) / mouse.radius;
    this.vx -= Math.cos(angle) * force * 0.2;
    this.vy -= Math.sin(angle) * force * 0.2;
  }

  // Decay the mouse-influenced velocity
  this.vx *= 0.95;
  this.vy *= 0.95;

  // Apply movement
  this.x += this.baseVX + this.vx;
  this.y += this.baseVY + this.vy;

  // bounce off edges
  if (this.x < 0 || this.x > canvas.width) this.baseVX *= -1;
  if (this.y < 0 || this.y > canvas.height) this.baseVY *= -1;
}

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 204, 0, 0.8)";
    ctx.shadowColor = "#ffcc00";
    ctx.shadowBlur = 10;
    ctx.fill();
  }
}

function initParticles() {
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

initParticles();
animate();
