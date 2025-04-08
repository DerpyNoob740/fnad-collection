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
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5; // Initial random velocity
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
    }

    update() {
      // **Natural Flow**: Adding random changes to velocity for flowing effect
      this.vx += (Math.random() - 0.5) * 0.05; // Slight random horizontal force
      this.vy += (Math.random() - 0.5) * 0.05; // Slight random vertical force

      // **Mouse Repulsion**: Keep the mouse interaction as is
      const mdx = mouse.x - this.x;
      const mdy = mouse.y - this.y;
      const distMouse = Math.sqrt(mdx * mdx + mdy * mdy);
      if (distMouse < mouse.radius) {
        const angle = Math.atan2(mdy, mdx);
        const force = (mouse.radius - distMouse) / mouse.radius;
        this.vx -= Math.cos(angle) * force * 0.2;
        this.vy -= Math.sin(angle) * force * 0.2;
      }

      // **Clumping Behavior**: Keep particles away from each other if too close
      for (let other of particles) {
        if (other === this) continue;
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 75 && dist > 25) {
          this.vx += dx * 0.0005;
          this.vy += dy * 0.0005;
        } else if (dist <= 10) {
          this.vx -= dx * 0.005;
          this.vy -= dy * 0.005;
        }
      }

      // **Decay**: Gradually reduce speed for more fluid movement
      this.vx *= 0.95;
      this.vy *= 0.95;

      // Move particle with updated velocity
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
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5; // Initial random velocity
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
  }

  update() {
    // **Natural Flow**: Adding random changes to velocity for flowing effect
    this.vx += (Math.random() - 0.5) * 0.05; // Slight random horizontal force
    this.vy += (Math.random() - 0.5) * 0.05; // Slight random vertical force

    // **Mouse Repulsion**: Keep the mouse interaction as is
    const mdx = mouse.x - this.x;
    const mdy = mouse.y - this.y;
    const distMouse = Math.sqrt(mdx * mdx + mdy * mdy);
    if (distMouse < mouse.radius) {
      const angle = Math.atan2(mdy, mdx);
      const force = (mouse.radius - distMouse) / mouse.radius;
      this.vx -= Math.cos(angle) * force * 0.2;
      this.vy -= Math.sin(angle) * force * 0.2;
    }

    // **Clumping Behavior**: Keep particles away from each other if too close
    for (let other of particles) {
      if (other === this) continue;
      const dx = other.x - this.x;
      const dy = other.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 75 && dist > 25) {
        this.vx += dx * 0.0005;
        this.vy += dy * 0.0005;
      } else if (dist <= 10) {
        this.vx -= dx * 0.005;
        this.vy -= dy * 0.005;
      }
    }

    // **Decay**: Gradually reduce speed for more fluid movement
    this.vx *= 0.95;
    this.vy *= 0.95;

    // Move particle with updated velocity
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
  const maxConnections = 2;
  for (let i = 0; i < particles.length; i++) {
    let connections = 0;
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 75 && connections < maxConnections) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 75})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        connections++;
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
