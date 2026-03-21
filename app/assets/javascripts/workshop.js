/* ============================================
   SANTA'S WORKSHOP - JavaScript
   ============================================ */

// --- Snow Engine ---
var snowCanvas, snowCtx, snowflakes, isBlizzard;

function initSnow() {
  snowCanvas = document.getElementById('snow-canvas');
  if (!snowCanvas) return;
  snowCtx = snowCanvas.getContext('2d');
  snowflakes = [];
  isBlizzard = false;

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  createSnowflakes(150);
  animateSnow();

  // Random blizzard every 30-90 seconds
  scheduleBlizzard();
}

function resizeCanvas() {
  if (!snowCanvas) return;
  snowCanvas.width = window.innerWidth;
  snowCanvas.height = window.innerHeight;
}

function createSnowflakes(count) {
  for (var i = 0; i < count; i++) {
    snowflakes.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 3 + 1,
      speed: Math.random() * 1.5 + 0.5,
      wind: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.7 + 0.3
    });
  }
}

function animateSnow() {
  if (!snowCtx) return;
  snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

  var windMultiplier = isBlizzard ? 4 : 1;
  var speedMultiplier = isBlizzard ? 3 : 1;

  for (var i = 0; i < snowflakes.length; i++) {
    var sf = snowflakes[i];
    snowCtx.beginPath();
    snowCtx.arc(sf.x, sf.y, sf.radius, 0, Math.PI * 2);
    snowCtx.fillStyle = 'rgba(255, 255, 255, ' + sf.opacity + ')';
    snowCtx.fill();

    sf.y += sf.speed * speedMultiplier;
    sf.x += sf.wind * windMultiplier + (isBlizzard ? 2 : 0);

    if (sf.y > snowCanvas.height) {
      sf.y = -5;
      sf.x = Math.random() * snowCanvas.width;
    }
    if (sf.x > snowCanvas.width) sf.x = 0;
    if (sf.x < 0) sf.x = snowCanvas.width;
  }

  requestAnimationFrame(animateSnow);
}

function scheduleBlizzard() {
  var delay = (Math.random() * 60 + 30) * 1000;
  setTimeout(function() {
    startBlizzard();
  }, delay);
}

function startBlizzard() {
  isBlizzard = true;
  var workshop = document.getElementById('santa-workshop');
  if (workshop) workshop.classList.add('blizzard');

  // Add extra snowflakes during blizzard
  createSnowflakes(200);

  // Blizzard lasts 8-15 seconds
  var duration = (Math.random() * 7 + 8) * 1000;
  setTimeout(function() {
    stopBlizzard();
  }, duration);
}

function stopBlizzard() {
  isBlizzard = false;
  var workshop = document.getElementById('santa-workshop');
  if (workshop) workshop.classList.remove('blizzard');

  // Remove extra snowflakes
  if (snowflakes.length > 150) {
    snowflakes.splice(150);
  }

  scheduleBlizzard();
}

// --- Modal System ---
function openModal(id) {
  var modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Trigger animations inside the modal
    if (id === 'toyshop-modal') animateElfProgress();
    if (id === 'castle-modal') resetNiceMeter();
  }
}

function closeModal(id) {
  var modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on overlay click
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close modal on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var modals = document.querySelectorAll('.modal-overlay.active');
    for (var i = 0; i < modals.length; i++) {
      modals[i].classList.remove('active');
    }
    document.body.style.overflow = '';
  }
});

// --- Smooth scroll to building ---
function scrollToBuilding(id) {
  var el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Flash effect
    el.style.boxShadow = '0 0 40px rgba(255, 215, 0, 0.6)';
    setTimeout(function() {
      el.style.boxShadow = '';
    }, 1500);
  }
}

// --- Castle: Nice List Check ---
function resetNiceMeter() {
  var fill = document.getElementById('nice-fill');
  var score = document.getElementById('nice-score');
  if (fill) fill.style.width = '0%';
  if (score) score.textContent = 'Checking...';
}

function checkNiceList() {
  var fill = document.getElementById('nice-fill');
  var score = document.getElementById('nice-score');
  var nicePercent = Math.floor(Math.random() * 30) + 70; // 70-100

  var messages = [
    "You're on the NICE list! Santa is very pleased!",
    "Wonderful! You've been extra nice this year!",
    "Ho ho ho! You're one of Santa's favorites!",
    "Very nice indeed! A big present is coming your way!",
    "Outstanding! You're at the top of the Nice list!"
  ];

  if (fill) {
    fill.style.width = '0%';
    setTimeout(function() {
      fill.style.width = nicePercent + '%';
    }, 100);
  }

  if (score) {
    score.textContent = 'Scanning...';
    setTimeout(function() {
      score.textContent = nicePercent + '% Nice! ' + messages[Math.floor(Math.random() * messages.length)];
    }, 1600);
  }
}

// --- Toy Workshop: Elf Progress ---
var toyCount = 0;

function animateElfProgress() {
  var fills = document.querySelectorAll('#toyshop-modal .progress-fill');
  for (var i = 0; i < fills.length; i++) {
    var target = fills[i].getAttribute('data-target');
    fills[i].style.width = '0%';
    (function(fill, t) {
      setTimeout(function() {
        fill.style.width = t + '%';
      }, 200);
    })(fills[i], target);
  }
  updateToyCount();
}

function updateToyCount() {
  toyCount += Math.floor(Math.random() * 50) + 100;
  var el = document.getElementById('toy-count');
  if (el) animateNumber(el, toyCount);
}

function animateNumber(el, target) {
  var current = parseInt(el.textContent) || 0;
  var step = Math.ceil((target - current) / 30);
  var timer = setInterval(function() {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current.toLocaleString();
  }, 30);
}

function speedUpElves() {
  var fills = document.querySelectorAll('#toyshop-modal .progress-fill');
  for (var i = 0; i < fills.length; i++) {
    var current = parseInt(fills[i].style.width) || 0;
    var boost = Math.min(current + 15, 100);
    fills[i].style.width = boost + '%';
    fills[i].setAttribute('data-target', boost);
  }
  toyCount += Math.floor(Math.random() * 200) + 50;
  var el = document.getElementById('toy-count');
  if (el) animateNumber(el, toyCount);
}

// --- Post Office: Letters to Santa ---
var santaReplies = [
  "Ho ho ho! What a wonderful letter! I've added your wish to my special list. My elves are already getting to work! Remember to leave out some cookies and milk on Christmas Eve!",
  "Thank you for your lovely letter! Mrs. Claus read it to me over hot cocoa this morning. We're so happy to hear from you! Keep being good and your wishes will come true!",
  "What a delightful letter! Rudolph and I were just talking about you. You've been SO good this year! I'll do my very best to make your Christmas magical!",
  "Oh my! This is one of the best letters I've received all season! The elves in the workshop are buzzing with excitement. Get ready for a very special Christmas!",
  "Jingle bells! Your letter made my belly shake like a bowl full of jelly from laughing with joy! You are truly special. Christmas is going to be AMAZING this year!"
];

function sendLetter() {
  var letterText = document.getElementById('santa-letter');
  var nameInput = document.getElementById('letter-name');
  var name = (nameInput && nameInput.value.trim()) || 'Friend';

  if (!letterText || !letterText.value.trim()) {
    alert("Don't forget to write something to Santa!");
    return;
  }

  var form = document.getElementById('letter-form');
  var reply = document.getElementById('santa-reply');
  var replyText = document.getElementById('reply-text');

  if (form) form.style.display = 'none';

  var randomReply = santaReplies[Math.floor(Math.random() * santaReplies.length)];
  var personalReply = "Dear " + name + ",\n\n" + randomReply;

  if (replyText) replyText.textContent = personalReply;
  if (reply) reply.style.display = 'block';
}

function writAnother() {
  var form = document.getElementById('letter-form');
  var reply = document.getElementById('santa-reply');
  var letterText = document.getElementById('santa-letter');

  if (letterText) letterText.value = '';
  if (form) form.style.display = 'block';
  if (reply) reply.style.display = 'none';
}

// --- Sled Races ---
var raceInProgress = false;

function startRace() {
  if (raceInProgress) return;
  raceInProgress = true;

  var btn = document.getElementById('race-btn');
  var result = document.getElementById('race-result');
  if (btn) btn.textContent = 'Racing...';
  if (result) result.textContent = '';

  // Reset racers
  for (var i = 1; i <= 5; i++) {
    var racer = document.getElementById('racer-' + i);
    if (racer) racer.style.left = '5px';
  }

  var speeds = [];
  for (var j = 0; j < 5; j++) {
    speeds.push(Math.random() * 2 + 1);
  }

  var positions = [5, 5, 5, 5, 5];
  var names = ['Jingle the Elf', 'Frosty Fox', 'Blitzen Jr.', 'Polar Pete', 'Penny Penguin'];
  var finished = false;

  var raceInterval = setInterval(function() {
    for (var k = 0; k < 5; k++) {
      // Add randomness each tick
      var burst = Math.random() * 3;
      positions[k] += speeds[k] + burst;

      var racer = document.getElementById('racer-' + (k + 1));
      var track = racer ? racer.parentElement : null;
      var maxPos = track ? (track.offsetWidth - 40) : 300;

      if (positions[k] >= maxPos) {
        positions[k] = maxPos;
        if (!finished) {
          finished = true;
          clearInterval(raceInterval);
          if (result) {
            result.innerHTML = '&#127942; ' + names[k] + ' WINS! &#127942;';
          }
          if (btn) btn.textContent = '\uD83C\uDFC1 Race Again!';
          raceInProgress = false;
        }
      }

      if (racer) racer.style.left = positions[k] + 'px';
    }
  }, 50);
}

// --- Reindeer Barn ---
function feedReindeer(card, name) {
  var energyFill = card.querySelector('.energy-fill');
  if (energyFill) {
    var current = parseInt(energyFill.style.width) || 50;
    var newEnergy = Math.min(current + 15, 100);
    energyFill.style.width = newEnergy + '%';
  }

  // Bounce animation
  card.style.transform = 'scale(1.15)';
  setTimeout(function() {
    card.style.transform = '';
  }, 300);
}

// --- Gingerbread Bakery ---
var decorationCount = 0;

function addDecoration(type) {
  var container = document.getElementById('gb-decorations');
  if (!container) return;

  decorationCount++;

  if (type === 'button') {
    var btn = document.createElement('div');
    btn.className = 'gb-button-dec';
    btn.style.top = (55 + decorationCount * 12) + 'px';
    container.appendChild(btn);
  } else if (type === 'icing') {
    var icing = document.createElement('div');
    icing.className = 'gb-icing';
    icing.style.width = (20 + Math.random() * 40) + 'px';
    icing.style.top = (30 + Math.random() * 80) + 'px';
    icing.style.left = (10 + Math.random() * 60) + 'px';
    container.appendChild(icing);
  } else if (type === 'sprinkle') {
    for (var i = 0; i < 8; i++) {
      var sprinkle = document.createElement('div');
      sprinkle.className = 'gb-sprinkle';
      var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff69b4', '#ff8c00'];
      sprinkle.style.background = colors[Math.floor(Math.random() * colors.length)];
      sprinkle.style.top = (20 + Math.random() * 100) + 'px';
      sprinkle.style.left = (10 + Math.random() * 80) + 'px';
      container.appendChild(sprinkle);
    }
  } else if (type === 'eyes') {
    var leftEye = document.createElement('div');
    leftEye.className = 'gb-eyes left-eye';
    var rightEye = document.createElement('div');
    rightEye.className = 'gb-eyes right-eye';
    container.appendChild(leftEye);
    container.appendChild(rightEye);
  }
}

function resetCookie() {
  var container = document.getElementById('gb-decorations');
  if (container) container.innerHTML = '';
  decorationCount = 0;
}

// --- Christmas Countdown ---
function updateCountdown() {
  var now = new Date();
  var xmas = new Date(now.getFullYear(), 11, 25);
  if (now > xmas) xmas.setFullYear(xmas.getFullYear() + 1);

  var diff = xmas - now;
  var days = Math.floor(diff / (1000 * 60 * 60 * 24));
  var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((diff % (1000 * 60)) / 1000);

  var el = document.getElementById('xmas-countdown');
  if (el) {
    el.textContent = days + ' days, ' + hours + 'h ' + minutes + 'm ' + seconds + 's until Christmas!';
  }
}

// --- Init ---
document.addEventListener('DOMContentLoaded', function() {
  initSnow();
  updateCountdown();
  setInterval(updateCountdown, 1000);
});

// Also init on turbolinks
if (typeof Turbolinks !== 'undefined') {
  document.addEventListener('page:load', function() {
    initSnow();
    updateCountdown();
    setInterval(updateCountdown, 1000);
  });
}
