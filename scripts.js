const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particleCount = 150;
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
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5; // Initial random velocity
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
  }

  update() {
    // Natural Flow: Subtle random changes for a lazy effect
    this.vx += (Math.random() - 0.5) * 0.02; // Slight random horizontal force
    this.vy += (Math.random() - 0.5) * 0.02; // Slight random vertical force

    // Mouse Repulsion: Slight repulsion if the mouse is too close
    const mdx = mouse.x - this.x;
    const mdy = mouse.y - this.y;
    const distMouse = Math.sqrt(mdx * mdx + mdy * mdy);
    if (distMouse < mouse.radius) {
      const angle = Math.atan2(mdy, mdx);
      const force = (mouse.radius - distMouse) / mouse.radius;
      this.vx -= Math.cos(angle) * force * 0.1;
      this.vy -= Math.sin(angle) * force * 0.1;
    }

    // Decay: Slow down velocity for smoother, lazier movement
    this.vx *= 0.98;
    this.vy *= 0.98;

    // Move particle with updated velocity
    this.x += this.vx;
    this.y += this.vy;

    // Boundary Check (keep within canvas)
    if (this.x <= 0 || this.x >= canvas.width) {
      this.vx = -this.vx; // Reverse velocity (bounce effect)
    }
    if (this.y <= 0 || this.y >= canvas.height) {
      this.vy = -this.vy; // Reverse velocity (bounce effect)
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
}

function initParticles() {
  particles.length = 0;
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
