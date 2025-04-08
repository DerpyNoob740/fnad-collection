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
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
    this.prevX = this.x; // Store previous x to check if position changed
    this.prevY = this.y; // Store previous y to check if position changed
  }

  update() {
    // Natural Flow: Subtle random changes for lazy effect
    this.vx += (Math.random() - 0.5) * 0.02;
    this.vy += (Math.random() - 0.5) * 0.02;

    // Mouse Repulsion: Slight repulsion if mouse is too close
    const mdx = mouse.x - this.x;
    const mdy = mouse.y - this.y;
    const distMouse = Math.sqrt(mdx * mdx + mdy * mdy);
    if (distMouse < mouse.radius) {
      const angle = Math.atan2(mdy, mdx);
      const force = (mouse.radius - distMouse) / mouse.radius;
      this.vx -= Math.cos(angle) * force * 0.1;
      this.vy -= Math.sin(angle) * force * 0.1;
    }

    // Decay: Slow down for smoother movement
    this.vx *= 0.98;
    this.vy *= 0.98;

    // Move particle
    this.x += this.vx;
    this.y += this.vy;

    // Boundary Check (keep within canvas)
    if (this.x <= 0 || this.x >= canvas.width) {
      this.vx = -this.vx;
    }
    if (this.y <= 0 || this.y >= canvas.height) {
      this.vy = -this.vy;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 10;
    ctx.fill();
  }

  // Check if the particle's position has changed significantly
  hasMoved() {
    const moved =
      Math.abs(this.x - this.prevX) > 0.5 ||
      Math.abs(this.y - this.prevY) > 0.5;
    if (moved) {
      this.prevX = this.x;
      this.prevY = this.y;
    }
    return moved;
  }
}

let connectionCache = []; // Store connections as a cache

function drawConnections() {
  const maxConnections = 2;
  connectionCache = []; // Clear cache on every frame
  for (let i = 0; i < particles.length; i++) {
    let connections = 0;
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // If particles are within range and have moved recently, draw a connection
      if (dist < 75 && connections < maxConnections) {
        // Check if connection needs to be drawn (cached or not)
        const connectionId = `${i}-${j}`; // Unique connection identifier

        // Only draw if this connection hasn't been cached or the particles have moved
        if (
          !connectionCache.includes(connectionId) ||
          particles[i].hasMoved() ||
          particles[j].hasMoved()
        ) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 75})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();

          // Cache this connection
          connectionCache.push(connectionId);
          connections++;
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
  drawConnections(); // Keep the visual connections
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

initParticles();
animate();
