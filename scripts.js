// particles.js

// Create canvas element and append to body
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

// Adjust canvas size to window dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle class to handle individual particles
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 2;  // Random size between 2 and 7px
    this.speedX = Math.random() * 0.5 - 0.25;  // Slow horizontal speed
    this.speedY = Math.random() * 0.5 + 0.2;  // Slow vertical speed, drifting down
    this.color = 'rgba(255, 255, 255, 0.7)'; // White color for visibility
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Reset particle to the top when it goes off-screen
    if (this.y > canvas.height) {
      this.y = 0;
      this.x = Math.random() * canvas.width; // Random horizontal position
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

// Array to hold particles
const particlesArray = [];

// Event listener to create particles on page load
window.addEventListener('load', () => {
  for (let i = 0; i < 200; i++) {  // Create a large number of particles
    let particle = new Particle(Math.random() * canvas.width, Math.random() * canvas.height); // Random initial positions
    particlesArray.push(particle);
  }
});

// Animation loop to update and draw particles
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Update and draw each particle
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }

  requestAnimationFrame(animateParticles); // Request next frame
}

// Start the particle animation
animateParticles();

// Resize canvas when the window is resized
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Reposition particles randomly within the new window size after resizing
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].x = Math.random() * canvas.width;
    particlesArray[i].y = Math.random() * canvas.height;
  }
});
