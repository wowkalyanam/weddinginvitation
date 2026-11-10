// Cache DOM nodes once
const hero = document.getElementById('hero');
const stage = document.getElementById('heroStage');
const inviteMandap = document.querySelector('.invite-mandap');
const eventSec = document.getElementById('eventSection');
const tableauSec = document.getElementById('tableau');
const mandapEl = tableauSec ? tableauSec.querySelector('.paper-tableau-mandap') : null;
const coupleEl = tableauSec ? tableauSec.querySelector('.paper-tableau-couple') : null;
const revealSections = document.querySelectorAll('.reveal-section');

const slideImages = document.querySelectorAll('.slideshow > img');
const slideDots = document.querySelectorAll('.slide-dots button');
const eyebrowEl = document.querySelector('.event-eyebrow');
const titleEl = document.querySelector('.event-title');
const metaDateEl = document.querySelector('.meta-date');
const metaTimeEl = document.querySelector('.meta-time');
const metaVenueEl = document.querySelector('.meta-venue');
const descEl = document.querySelector('.event-description');

function clamp(val, min = 0, max = 1) {
  return Math.min(Math.max(val, min), max);
}

// Dynamic Customization from Shareable URL (supports compact & verbose keys)
const urlParams = new URLSearchParams(window.location.search);
const customBride = urlParams.get('b') || urlParams.get('bride');
const customGroom = urlParams.get('g') || urlParams.get('groom');
const customDate = urlParams.get('d') || urlParams.get('date');
const customTime = urlParams.get('t') || urlParams.get('time');
const customVenue = urlParams.get('v') || urlParams.get('venue');
const customAddress = urlParams.get('a') || urlParams.get('address');
const customMapUrl = urlParams.get('m') || urlParams.get('map');

// Event Data (Single Event: Wedding Ceremony)
const eventData = [
  {
    eyebrow: 'THE SACRED UNION',
    title: 'Wedding Ceremony',
    date: customDate || '19 November 2026',
    time: customTime || '07:00 PM',
    venue: customVenue ? `${customVenue}${customAddress ? ', ' + customAddress : ''}` : 'BWSSB Rajatha Bhavan, Malleshwaram, Bangalore',
    description: 'A sacred union under traditional Vedic rituals, holy fire, and the eternal seven steps of love and togetherness.'
  }
];

function applyCustomizations() {
  if (!customBride && !customGroom && !customDate && !customVenue) return;

  // Update Hero Titles
  const heroBride = document.querySelector('.hero-title p:first-of-type');
  const heroGroom = document.querySelector('.hero-title p:last-of-type');
  const heroDate = document.querySelector('.hero-title em');
  if (heroBride && customBride) heroBride.textContent = customBride.toUpperCase();
  if (heroGroom && customGroom) heroGroom.textContent = customGroom.toUpperCase();
  if (heroDate && customDate) heroDate.textContent = customDate;

  // Update Mandap Invite
  const inviteH1s = document.querySelectorAll('.invite-copy h1');
  if (inviteH1s.length >= 2) {
    if (customBride) inviteH1s[0].textContent = customBride.toUpperCase();
    if (customGroom) inviteH1s[1].textContent = customGroom.toUpperCase();
  }
  const inviteVenue = document.querySelector('.invite-venue');
  if (inviteVenue && (customVenue || customAddress)) {
    inviteVenue.innerHTML = `${customVenue || ''}<br>${customAddress || ''}`;
  }

  // Update closing couple link
  const closingLink = document.querySelector('.closing-couple-link');
  if (closingLink && customBride && customGroom) {
    closingLink.innerHTML = `${customBride} <i>&amp;</i> ${customGroom}`;
  }

  // Update story signatures
  const storySpan = document.querySelector('.story-copy span');
  if (storySpan && customBride && customGroom) {
    storySpan.textContent = `${customBride} & ${customGroom}`;
  }

  const rsvpSignature = document.querySelector('.rsvp-signature');
  if (rsvpSignature && customBride && customGroom) {
    rsvpSignature.textContent = `With love, ${customBride} & ${customGroom}`;
  }

  // Update WhatsApp button
  const waBtn = document.querySelector('.whatsapp-button');
  if (waBtn && customBride && customGroom) {
    waBtn.href = `https://wa.me/?text=I%20would%20love%20to%20join%20${encodeURIComponent(customBride)}%20and%20${encodeURIComponent(customGroom)}%27s%20wedding.`;
  }

  // Update map link & labels
  const mapBtn = document.querySelector('.directions-btn');
  if (mapBtn && customMapUrl) {
    mapBtn.href = customMapUrl;
  }
  const venueLabel = document.querySelector('.prewedding-thumb figcaption strong');
  if (venueLabel && customVenue) {
    venueLabel.textContent = customVenue;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyCustomizations);
} else {
  applyCustomizations();
}

let currentCardIndex = -1;

function setEventCard(idx) {
  if (idx < 0 || idx >= eventData.length || currentCardIndex === idx) return;
  currentCardIndex = idx;
  const d = eventData[idx];

  slideImages.forEach((img, i) => img.classList.toggle('active', i === idx));
  slideDots.forEach((dot, i) => dot.classList.toggle('active', i === idx));

  if (eyebrowEl) eyebrowEl.textContent = d.eyebrow;
  if (titleEl) titleEl.textContent = d.title;
  if (metaDateEl) metaDateEl.textContent = d.date;
  if (metaTimeEl) metaTimeEl.textContent = d.time;
  if (metaVenueEl) metaVenueEl.textContent = d.venue;
  if (descEl) descEl.textContent = d.description;
}
setEventCard(0);

// Dot buttons click listener (if present)
slideDots.forEach((btn, i) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    setEventCard(i);
  });
});

// Layout caching - zero forced reflows during scroll
let vh = window.innerHeight;
let vw = window.innerWidth;
let isMobile = vw <= 767;
let isTablet = vw >= 768 && vw <= 1100 && vh > vw;
let isDesktop = vw >= 761;
let heroTravel = isMobile ? 1600 : 2000;
let tableauOffsetTop = 0;
let tableauScrollDist = 1;
let mandapBaseTargetY = 0;
let coupleStartY = 0;

function measureLayout() {
  vh = window.innerHeight;
  vw = window.innerWidth;
  isMobile = vw <= 767;
  isTablet = vw >= 768 && vw <= 1100 && vh > vw;
  isDesktop = vw >= 761;
  heroTravel = hero ? Math.max(1, hero.offsetHeight - vh) : (isMobile ? 500 : 2000);

  if (tableauSec) {
    const r = tableauSec.getBoundingClientRect();
    tableauOffsetTop = r.top + (window.pageYOffset || document.documentElement.scrollTop || 0);
    tableauScrollDist = Math.max(1, tableauSec.offsetHeight - vh);
    const mHeight = mandapEl && mandapEl.offsetHeight > 50 ? mandapEl.offsetHeight : (isDesktop ? vh * 0.45 : vh * 0.38);
    const mTop = mandapEl && mandapEl.offsetTop > 0 ? mandapEl.offsetTop : (isDesktop ? vh * 0.22 : vh * 0.54);
    const mTarget = mTop + mHeight * 0.8;
    const cHeight = coupleEl && coupleEl.offsetHeight > 50 ? coupleEl.offsetHeight : (isDesktop ? 220 : 160);
    mandapBaseTargetY = mTarget - cHeight - 4;
    coupleStartY = isDesktop ? vh * 0.45 : vh * 0.29;
  }
}
measureLayout();

let celebratedOnce = false;
let lastHeroProgress = -1;
let lastTableauProgress = -1;

function updateScrollAnimations() {
  const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

  // 1. HERO SECTION SCROLL ANIMATION
  if (hero) {
    const progress = clamp(scrollY / heroTravel, 0, 1);
    if (progress !== lastHeroProgress && ((progress > 0 && progress < 1) || lastHeroProgress !== progress)) {
      lastHeroProgress = progress;
      const i = isTablet ? 0.62 : 0.54;
      const a = isTablet ? 0.89 : 0.81;
      const o = 0;

      const templeY = isMobile
        ? (64.0 - progress * 40.0)
        : (vh * (i - progress * a) + o);
      const templeScale = isMobile
        ? (1.0 + progress * 0.08)
        : (0.7 + progress * 0.4);

      const treesTravel = isMobile
        ? Math.max(0, 1 - progress / 0.7)
        : Math.max(0, 1 - Math.min(1, (progress - 0.12) / 0.82));
      const treesY = isMobile
        ? (treesTravel * vh * 0.35)
        : (treesTravel * vh * 0.50);
      const treesOpacity = isMobile
        ? clamp((progress - 0.05) * 3.5, 0, 1)
        : clamp((progress - 0.08) * 2.8, 0, 1);

      const titleY = -progress * vh * (isTablet ? 0.38 : (isMobile ? 0.25 : 0.3));
      const titleScale = 1 - progress * 0.12;
      const titleOpacity = clamp(1 - progress * (isTablet ? 3.2 : (isMobile ? 2.8 : 1.8)), 0, 1);
      const cueOpacity = clamp(1 - progress * (isMobile ? 3.0 : 2.4), 0, 1);

      const target = stage || document.documentElement;
      target.style.setProperty('--hero-temple-y', isMobile ? `${templeY.toFixed(1)}%` : `${templeY.toFixed(1)}px`);
      target.style.setProperty('--hero-temple-scale', templeScale.toFixed(3));
      target.style.setProperty('--hero-trees-y', `${treesY.toFixed(1)}px`);
      target.style.setProperty('--hero-trees-opacity', treesOpacity.toFixed(3));
      target.style.setProperty('--hero-title-y', `${titleY.toFixed(1)}px`);
      target.style.setProperty('--hero-title-scale', titleScale.toFixed(3));
      target.style.setProperty('--hero-title-opacity', titleOpacity.toFixed(3));
      target.style.setProperty('--hero-cue-opacity', cueOpacity.toFixed(3));

      if (inviteMandap && !isMobile) {
        const drift = (0.5 - progress) * 20;
        inviteMandap.style.transform = `translate3d(0, ${drift.toFixed(1)}px, 0) scale(1.015)`;
      } else if (inviteMandap && isMobile) {
        inviteMandap.style.transform = 'none';
      }
    }
  }

  // 2. COUPLE TABLEAU SECTION SCROLL ANIMATION
  if (tableauSec) {
    const r = tableauSec.getBoundingClientRect();
    const currentTableauScroll = -r.top;
    const f = clamp(currentTableauScroll / tableauScrollDist, 0, 1);
    if (f !== lastTableauProgress && ((f > 0 && f < 1) || lastTableauProgress !== f)) {
      lastTableauProgress = f;
      const settleProgress = isDesktop ? 0.75 : 0.98;
      const coupleEntryStart = 0.33;

      const artProgress = clamp(f / settleProgress, 0, 1);
      const coupleProgress = clamp((f - coupleEntryStart) / (settleProgress - coupleEntryStart), 0, 1);
      const coupleOpacity = clamp((f - coupleEntryStart) / 0.08, 0, 1);

      const artY = isDesktop ? -artProgress * vh * 1.2 : 0;
      const mandapTargetY = mandapBaseTargetY + (isDesktop ? artY : 0);
      const coupleCurrentY = coupleStartY + coupleProgress * (mandapTargetY - coupleStartY);

      tableauSec.style.setProperty('--tableau-art-progress', artProgress.toFixed(4));
      tableauSec.style.setProperty('--tableau-art-y', `${artY.toFixed(1)}px`);
      tableauSec.style.setProperty('--tableau-couple-progress', coupleProgress.toFixed(4));
      tableauSec.style.setProperty('--tableau-couple-y', `${coupleCurrentY.toFixed(1)}px`);
      tableauSec.style.setProperty('--tableau-couple-opacity', coupleOpacity.toFixed(3));

      const isSettled = f >= settleProgress;
      tableauSec.classList.toggle('is-settled', isSettled);

      if (isSettled && !celebratedOnce) {
        celebratedOnce = true;
        setTimeout(() => tableauSec.classList.add('is-celebrating'), 360);
        setTimeout(() => tableauSec.classList.remove('is-celebrating'), 2200);
      } else if (!isSettled && f < 0.5) {
        celebratedOnce = false;
      }
    }
  }
}

// 4. Reveal Sections via IntersectionObserver & Dual Scroll Check
function checkAllReveals() {
  if (isMobile) {
    revealSections.forEach((sec) => sec.classList.add('is-visible'));
    return;
  }
  const currentVh = window.innerHeight;
  revealSections.forEach((sec) => {
    const rect = sec.getBoundingClientRect();
    if (rect.top < currentVh * 1.3 && rect.bottom > -200) {
      sec.classList.add('is-visible');
    }
  });
}

if (isMobile) {
  // Mobile: Immediately show all sections for fast and fluid scrolling
  revealSections.forEach((sec) => sec.classList.add('is-visible'));
} else if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    rootMargin: '180px 0px 180px 0px',
    threshold: 0
  });
  revealSections.forEach((sec) => revealObserver.observe(sec));
} else {
  revealSections.forEach((sec) => sec.classList.add('is-visible'));
}

// Initial check on load
checkAllReveals();

let ticking = false;
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollAnimations();
      checkAllReveals();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

let lastWindowWidth = window.innerWidth;
let resizeTimer = null;
window.addEventListener('resize', () => {
  if (Math.abs(window.innerWidth - lastWindowWidth) > 30) {
    lastWindowWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      measureLayout();
      lastHeroProgress = -1;
      lastTableauProgress = -1;
      updateScrollAnimations();
    }, 120);
  }
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
  measureLayout();
  updateScrollAnimations();
  checkAllReveals();
});
window.addEventListener('load', () => {
  measureLayout();
  updateScrollAnimations();
  checkAllReveals();
});
updateScrollAnimations();
checkAllReveals();

// 3D Pointer Parallax on Desktop (Throttled with rAF)
if (tableauSec) {
  let parallaxActive = false;
  let pX = 0, pY = 0;

  const updateTableauParallax = () => {
    tableauSec.style.setProperty('--tableau-temple-x', `${pX * -25}px`);
    tableauSec.style.setProperty('--tableau-temple-pointer-y', `${pY * -15}px`);
    tableauSec.style.setProperty('--tableau-mandap-x', `${pX * -10}px`);
    tableauSec.style.setProperty('--tableau-mandap-pointer-y', `${pY * -6}px`);
    tableauSec.style.setProperty('--tableau-couple-x', `${pX * 20}px`);
    tableauSec.style.setProperty('--tableau-foreground-x', `${pX * 35}px`);
    tableauSec.style.setProperty('--tableau-foreground-pointer-y', `${pY * 20}px`);
    parallaxActive = false;
  };

  tableauSec.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const r = tableauSec.getBoundingClientRect();
    if (e.clientY < r.top || e.clientY > r.bottom) return;
    pX = clamp((e.clientX - r.left) / r.width, 0, 1) - 0.5;
    pY = clamp(e.clientY / window.innerHeight, 0, 1) - 0.5;

    if (!parallaxActive) {
      requestAnimationFrame(updateTableauParallax);
      parallaxActive = true;
    }
  }, { passive: true });
}

// Venue Map Card click interaction: opens Google Maps directions
const preweddingThumb = document.querySelector('.prewedding-thumb');
if (preweddingThumb) {
  const directionsUrl = 'https://www.google.com/maps/dir/13.0338842,77.6891819/BWSSB+Rajatha+Bhavana,+8th,+19th+Cross+Rd,+Malleshwaram,+Bengaluru,+Karnataka+560012/@12.8905254,77.6621388,10.1z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3bae3d7fe2c5046b:0x7dc2af7faf8d611b!2m2!1d77.562176!2d13.0116862?entry=ttu';
  const openDirections = () => {
    window.open(directionsUrl, '_blank', 'noopener,noreferrer');
  };
  preweddingThumb.addEventListener('click', openDirections);
  preweddingThumb.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDirections();
    }
  });
}

// ==========================================================================
// CLOSING SECTION: LIVE COUNTDOWN, MAGIC FLOWER SHOWER, TRAIL & RETURN-TO-TOP
// ==========================================================================
// 1. Live Wedding Countdown Timer (Target: 19 November 2026, 07:00 PM)
const weddingDate = new Date('2026-11-19T19:00:00+05:30').getTime();
const countDays = document.getElementById('countDays');
const countHours = document.getElementById('countHours');
const countMinutes = document.getElementById('countMinutes');
const countSeconds = document.getElementById('countSeconds');

function updateCountdown() {
  const diff = Math.max(0, weddingDate - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (countDays) countDays.textContent = String(days).padStart(2, '0');
  if (countHours) countHours.textContent = String(hours).padStart(2, '0');
  if (countMinutes) countMinutes.textContent = String(minutes).padStart(2, '0');
  if (countSeconds) countSeconds.textContent = String(seconds).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// 2. Magic Button Petal Shower Toggle
const magicButton = document.querySelector('.magic-button');
const closingSection = document.getElementById('closing');

if (magicButton && closingSection) {
  const petalColors = [
    '#e53935', // red rose
    '#f58220', // vibrant marigold
    '#ff9933', // orange saffron
    '#e5b045', // warm gold
    '#ffb300', // yellow marigold
    '#d81b60', // deep pink rose
    '#fff0d4'  // cream jasmine
  ];

  const trailImages = [
    'images/event-engagement-illustration.webp',
    'images/event-haldi-illustration.webp',
    'images/event-mehendi-illustration.webp',
    'images/story-1.webp',
    'images/prewedding-beach-thumbnail-v1.webp'
  ];

  let magicTimeout = null;

  const triggerMagicShower = () => {
    closingSection.classList.add('magic');
    magicButton.classList.add('is-active');

    let petalsWrap = closingSection.querySelector('.petals');
    if (!petalsWrap) {
      petalsWrap = document.createElement('div');
      petalsWrap.className = 'petals';
      petalsWrap.setAttribute('aria-hidden', 'true');
      closingSection.appendChild(petalsWrap);
    }
    petalsWrap.innerHTML = '';

    const sectionRect = closingSection.getBoundingClientRect();
    const viewportOffsetTop = Math.max(0, -sectionRect.top);

    const count = 48;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('i');
      const color = petalColors[i % petalColors.length];
      const left = Math.random() * 94 + 3;
      const duration = 3.2 + Math.random() * 2.6;
      const delay = Math.random() * 1.5;
      const sizeW = 10 + Math.random() * 10;
      const sizeH = sizeW * (1.3 + Math.random() * 0.7);
      const sway = (Math.random() - 0.5) * 160;
      const rotMid = (Math.random() - 0.5) * 360;
      const rotEnd = (Math.random() > 0.5 ? 1 : -1) * (400 + Math.random() * 600);
      const startY = Math.max(0, viewportOffsetTop - 50) + (Math.random() * 90);

      petal.style.cssText = `
        left: ${left}%;
        top: ${startY}px;
        width: ${sizeW}px;
        height: ${sizeH}px;
        background: ${color};
        --fall-duration: ${duration}s;
        --fall-delay: ${delay}s;
        --sway-x: ${sway}px;
        --rot-mid: ${rotMid}deg;
        --rot-end: ${rotEnd}deg;
      `;
      fragment.appendChild(petal);
    }
    petalsWrap.appendChild(fragment);

    // Spawn 3 floating memory photo cards around the button
    const btnRect = magicButton.getBoundingClientRect();
    const btnCenterX = btnRect.left - sectionRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top - sectionRect.top + btnRect.height / 2;

    const trailWrap = closingSection.querySelector('.finale-image-trail') || closingSection;
    for (let j = 0; j < 3; j++) {
      const card = document.createElement('span');
      card.className = 'finale-image-trail-item';
      const offsetX = (j - 1) * 95 + (Math.random() - 0.5) * 35;
      const offsetY = (Math.random() - 0.5) * 55;
      card.style.left = `${btnCenterX + offsetX}px`;
      card.style.top = `${btnCenterY + offsetY}px`;
      card.style.setProperty('--trail-image', `url('${trailImages[(j + Math.floor(Math.random() * 5)) % trailImages.length]}')`);
      card.style.setProperty('--trail-rotation', `${(Math.random() - 0.5) * 26}deg`);
      card.style.animationDelay = `${j * 0.16}s`;
      card.addEventListener('animationend', () => card.remove(), { once: true });
      trailWrap.appendChild(card);
    }

    clearTimeout(magicTimeout);
    magicTimeout = setTimeout(() => {
      closingSection.classList.remove('magic');
      magicButton.classList.remove('is-active');
    }, 7000);
  };

  let lastTouchTime = 0;
  magicButton.addEventListener('touchstart', (e) => {
    lastTouchTime = Date.now();
    triggerMagicShower();
  }, { passive: true });

  magicButton.addEventListener('click', (e) => {
    if (Date.now() - lastTouchTime < 450) return;
    triggerMagicShower();
  });
}

// 3. Smooth Return to Top
const closingCoupleLink = document.querySelector('.closing-couple-link');
if (closingCoupleLink) {
  closingCoupleLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 4. Memory Photo Trail on Pointer Move
const finaleTrailContainer = document.querySelector('.finale-image-trail');
if (finaleTrailContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const trailImages = [
    'images/event-engagement-illustration.webp',
    'images/event-haldi-illustration.webp',
    'images/event-mehendi-illustration.webp',
    'images/story-1.webp',
    'images/prewedding-beach-thumbnail-v1.webp'
  ];
  let lastPos = null;
  let lastTime = 0;
  let trailIndex = 0;

  const onPointerMoveTrail = (e) => {
    const isTouch = e.pointerType === 'touch';
    const rect = finaleTrailContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    const now = performance.now();
    const minTime = isTouch ? 220 : 105;
    const minDist = isTouch ? 65 : 48;
    const dist = lastPos ? Math.hypot(x - lastPos.x, y - lastPos.y) : 99;
    if (dist < minDist || (now - lastTime) < minTime) return;

    lastPos = { x, y };
    lastTime = now;

    const item = document.createElement('span');
    item.className = 'finale-image-trail-item';
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    item.style.setProperty('--trail-image', `url('${trailImages[trailIndex % trailImages.length]}')`);
    item.style.setProperty('--trail-rotation', `${(Math.random() - 0.5) * 18}deg`);
    trailIndex++;

    item.addEventListener('animationend', () => item.remove(), { once: true });
    finaleTrailContainer.appendChild(item);
  };

  window.addEventListener('pointermove', onPointerMoveTrail, { passive: true });
}

// ==========================================================================
// BACKGROUND WEDDING AUDIO (AUTOPLAY ON OPEN)
// ==========================================================================
const weddingAudio = document.getElementById('weddingAudio');
let isAudioActive = false;

function playWeddingAudio() {
  if (isAudioActive || !weddingAudio) return;
  weddingAudio.muted = false;
  weddingAudio.volume = 0.85;
  const p = weddingAudio.play();
  if (p !== undefined) {
    p.then(() => {
      isAudioActive = true;
      removeUnlockListeners();
    }).catch(() => {
      // Browser autoplay policy requires user gesture; global listeners will catch first touch/scroll
    });
  }
}

const unlockEvents = ['click', 'touchend', 'touchstart', 'pointerup', 'pointerdown', 'mousedown', 'keydown', 'scroll', 'wheel'];

function onUserGesture() {
  playWeddingAudio();
}

function addUnlockListeners() {
  unlockEvents.forEach((evt) => {
    window.addEventListener(evt, onUserGesture, { capture: true, passive: true });
    document.addEventListener(evt, onUserGesture, { capture: true, passive: true });
  });
}

function removeUnlockListeners() {
  unlockEvents.forEach((evt) => {
    window.removeEventListener(evt, onUserGesture, { capture: true });
    document.removeEventListener(evt, onUserGesture, { capture: true });
  });
}

addUnlockListeners();

// Attempt immediate playback on open / DOM ready / load
playWeddingAudio();
document.addEventListener('DOMContentLoaded', playWeddingAudio);
window.addEventListener('load', playWeddingAudio);
window.addEventListener('pageshow', playWeddingAudio);

// Interactive Scroll Cue & Hero Stage activation
const heroScrollCue = document.getElementById('heroScrollCue');
const heroStage = document.getElementById('heroStage');

function enterWeddingInvitation() {
  playWeddingAudio();
  window.scrollTo({ top: Math.min(1600, window.innerHeight * 1.5), behavior: 'smooth' });
}

if (heroScrollCue) {
  heroScrollCue.addEventListener('click', (e) => {
    e.stopPropagation();
    enterWeddingInvitation();
  });
  heroScrollCue.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      enterWeddingInvitation();
    }
  });
}

if (heroStage) {
  heroStage.addEventListener('click', () => {
    playWeddingAudio();
  }, { passive: true });
}


