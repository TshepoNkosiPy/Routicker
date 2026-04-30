// ===== Background Animation =====
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.radius = Math.random() * 2 + 1;
    this.alpha = Math.random() * 0.5 + 0.3;
    this.targetX = x;
    this.targetY = y;
  }

  update() {
    // Smooth movement
    this.x += (this.targetX - this.x) * 0.05;
    this.y += (this.targetY - this.y) * 0.05;
    
    // Add drift
    this.x += this.vx * 0.5;
    this.y += this.vy * 0.5;
    
    // Bounce off edges
    if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
    if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
    
    this.x = Math.max(0, Math.min(window.innerWidth, this.x));
    this.y = Math.max(0, Math.min(window.innerHeight, this.y));
  }

  draw(ctx, isDarkMode) {
    ctx.fillStyle = isDarkMode 
      ? `rgba(86, 179, 232, ${this.alpha * 0.25})` 
      : `rgba(55, 138, 221, ${this.alpha * 0.35})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  magnetTo(x, y, strength = 0.8) {
    const dx = x - this.x;
    const dy = y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 300) {
      const pullStrength = strength * (1 - distance / 300);
      this.targetX += (dx / distance) * pullStrength;
      this.targetY += (dy / distance) * pullStrength;
    }
  }
}

let particles = [];
const canvas = document.getElementById('bg-animation');
const ctx = canvas ? canvas.getContext('2d') : null;
let mouseX = 0;
let mouseY = 0;

function initBgAnimation() {
  if (!canvas) return;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  particles = [];
  const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(
      Math.random() * canvas.width,
      Math.random() * canvas.height
    ));
  }
}

function animateBg() {
  if (!canvas || !ctx) return;
  
  const isDarkMode = document.body.classList.contains('dark-mode');
  ctx.fillStyle = isDarkMode ? '#0f1419' : '#f6fafd';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(particle => {
    particle.magnetTo(mouseX, mouseY);
    particle.update();
    particle.draw(ctx, isDarkMode);
  });
  
  // Draw cursor glow effect
  const glowRadius = 150;
  const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRadius);
  gradient.addColorStop(0, isDarkMode ? 'rgba(86, 179, 232, 0.04)' : 'rgba(55, 138, 221, 0.08)');
  gradient.addColorStop(1, isDarkMode ? 'rgba(86, 179, 232, 0)' : 'rgba(55, 138, 221, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(mouseX - glowRadius, mouseY - glowRadius, glowRadius * 2, glowRadius * 2);
  
  // Draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        ctx.strokeStyle = isDarkMode
          ? `rgba(86, 179, 232, ${0.04 * (1 - distance / 100)})`
          : `rgba(55, 138, 221, ${0.08 * (1 - distance / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  
  requestAnimationFrame(animateBg);
}

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

window.addEventListener('resize', () => {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

initBgAnimation();
animateBg();

// ===== Habit Tracker =====
let habits = [];
let nid = 1;
const DAYS = 7;

// Sample data to match the design
habits = [
  {id: 1, name: 'Morning run', done: false, log: [1, 1, 0, 1, 0, 1, 0]},
  {id: 2, name: 'Read 20 pages', done: false, log: [0, 1, 0, 0, 1, 0, 0]},
];
nid = 3;

function getStatus(habit) {
  const completed = habit.log.reduce((a,b) => a+b, 0);
  const pct = (completed / DAYS) * 100;
  return pct >= 50 ? 'on-track' : 'focus';
}

function updateMotivationalMessage() {
  const motText = document.getElementById('mot-text');
  if (habits.length === 0) {
    motText.innerHTML = '<b>Start your journey.</b> Add your first habit and begin building consistency.';
  } else if (habits.length === 1) {
    motText.innerHTML = `<b>Focus on ${habits[0].name}.</b> One step at a time builds lasting change.`;
  } else {
    // Find the habit that needs focus (lowest completion)
    const needsFocus = habits.reduce((prev, curr) => {
      const prevCompleted = prev.log.reduce((a,b) => a+b, 0);
      const currCompleted = curr.log.reduce((a,b) => a+b, 0);
      return currCompleted < prevCompleted ? curr : prev;
    });
    motText.innerHTML = `<b>${needsFocus.name} needs your focus today.</b> Discipline compounds — every streak matters.`;
  }
}

function render() {
  const grid = document.getElementById('cards-grid');
  grid.innerHTML = '';
  updateMotivationalMessage();
  
  if (habits.length === 0) {
    grid.innerHTML = '<div class="empty-state">No habits yet. Add one!</div>';
    document.getElementById('srule').style.display = 'none';
    document.getElementById('summary-panel').style.display = 'none';
    document.getElementById('add-section').style.display = '';
    document.getElementById('full-notice').style.display = 'none';
    return;
  }
  document.getElementById('srule').style.display = '';
  document.getElementById('summary-panel').style.display = '';
  
  // Hide add-section and show full-notice when at capacity
  if (habits.length >= 2) {
    document.getElementById('add-section').style.display = 'none';
    document.getElementById('full-notice').style.display = '';
  } else {
    document.getElementById('add-section').style.display = '';
    document.getElementById('full-notice').style.display = 'none';
  }
  
  habits.forEach((h, i) => {
    const completed = h.log.reduce((a,b) => a+b, 0);
    const pct = Math.round((completed / DAYS) * 100);
    const status = getStatus(h);
    const card = document.createElement('div');
    card.className = 'h-card';
    card.innerHTML = `
      <div class="status-badge ${status}">
        ${status === 'on-track' ? 'ON TRACK' : 'FOCUS HERE'}
      </div>
      <div class="h-name">${h.name}</div>
      <div class="pct-row">
        <span class="pct-big">${completed}<sub>days</sub></span>
        <span class="pct-label">${pct}%</span>
      </div>
      <div style="font-size:0.85rem;color:#8aabcc;margin-bottom:0.5rem">${completed} of ${DAYS} days this week</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(completed/DAYS)*100}%"></div></div>
      <div class="dots-row">${h.log.map((d,j)=>`<span class="dot${d ? ' done' : ''}${j===DAYS-1 && h.done ? ' today-done' : ''}${j===DAYS-1 && !h.done ? ' today-open' : ''}"></span>`).join('')}</div>
      <span class="dots-label">Last 7 days</span>
      <div class="h-card-bottom">
        <label class="cb-wrap">
          <input type="checkbox" ${h.done ? 'checked' : ''} onchange="toggleDone(${h.id},this.checked)" aria-label="Mark as done today">
          <span class="cb-ui"><svg viewBox="0 0 16 16"><polyline points="3.5 8.5 7 12 12.5 5.5"/></svg></span>
        </label>
        <span style="color:#0a0a0a">Daily complete</span>
      </div>
      <button class="remove-btn" onclick="removeHabit(${h.id})" aria-label="Remove habit">×</button>
    `;
    grid.appendChild(card);
  });
  updateUI();
}

function updateUI() {
  // Update summary panel
  const sp = document.getElementById('summary-panel');
  const cr = document.getElementById('cmp-rows');
  if (habits.length === 0) {
    sp.style.display = 'none';
    return;
  }
  cr.innerHTML = habits.map(h => {
    const p = Math.round((h.log.reduce((a,b)=>a+b,0)/DAYS)*100);
    const status = getStatus(h);
    const tag = status === 'on-track' ? 'tag-easy' : 'tag-hard';
    const tagText = status === 'on-track' ? 'EASIER' : 'HARDER';
    return `<div class="cmp-row">
      <span class="cmp-name" title="${h.name}">${h.name}</span>
      <div class="cmp-track"><div class="cmp-fill-hi" style="width:${p}%"></div></div>
      <span class="cmp-pct">${p}%</span>
      <span class="cmp-tag ${tag}">${tagText}</span>
    </div>`;
  }).join('');
}

function toggleDone(id, c) {
  const h = habits.find(x => x.id === id);
  if (h) {
    h.done = c;
    h.log[DAYS-1] = c ? 1 : 0;
    render();
  }
}

function removeHabit(id) {
  habits = habits.filter(x => x.id !== id);
  render();
}

function addHabit() {
  const inp = document.getElementById('habit-input'), val = inp.value.trim();
  if (!val || habits.length >= 2) return;
  habits.push({id: nid++, name: val, done: false, log: [0,0,0,0,0,0,0]});
  inp.value = '';
  render();
}

document.getElementById('habit-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addHabit();
});

// Theme Toggle
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
}

document.getElementById('theme-toggle').addEventListener('click', () => {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  const theme = isDarkMode ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
});

initTheme();
render();

