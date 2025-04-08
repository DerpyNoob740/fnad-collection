// Particle canvas script (tethered float + mouse repulsion + glow + lines)
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particleCount = 150;
const particles = [];
const mouse = {
  x: null,
  y: null,
  radius: 100,
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
    this.homeX = Math.random() * canvas.width;
    this.homeY = Math.random() * canvas.height;
    this.x = this.homeX;
    this.y = this.homeY;
    this.vx = 0;
    this.vy = 0;
    this.size = Math.random() * 2 + 1;
  }

  update() {
    const dx = this.homeX - this.x;
    const dy = this.homeY - this.y;
    this.vx += dx * 0.0025; // spring pull
    this.vy += dy * 0.0025;

    const mdx = mouse.x - this.x;
    const mdy = mouse.y - this.y;
    const dist = Math.sqrt(mdx * mdx + mdy * mdy);
    if (dist < mouse.radius) {
      const angle = Math.atan2(mdy, mdx);
      const force = (mouse.radius - dist) / mouse.radius;
      this.vx -= Math.cos(angle) * force * 0.5;
      this.vy -= Math.sin(angle) * force * 0.5;
    }

    this.vx *= 0.92; // decay
    this.vy *= 0.92;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 10;
    ctx.fill();
  }
}

function drawConnections() {
  const cellSize = 100;
  const grid = {};

  // Organize particles into grid cells
  for (let p of particles) {
    const gx = Math.floor(p.x / cellSize);
    const gy = Math.floor(p.y / cellSize);
    const key = `${gx},${gy}`;
    if (!grid[key]) grid[key] = [];
    grid[key].push(p);
  }

  for (let key in grid) {
    const [gx, gy] = key.split(',').map(Number);
    const cellA = grid[key];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const neighborKey = `${gx + dx},${gy + dy}`;
        const cellB = grid[neighborKey];
        if (!cellB) continue;

        for (let i = 0; i < cellA.length; i++) {
          let connections = 0;
          for (let j = 0; j < cellB.length; j++) {
            const p1 = cellA[i];
            const p2 = cellB[j];
            if (p1 === p2) continue;

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 1) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 100})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
              connections++;
              if (connections >= 3) break;
            }
          }
        }
      }
    }
  }
}


function initParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

initParticles();
animate();
