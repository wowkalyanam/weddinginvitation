// ==========================================================================
// MEENAYA TEMPLATE INTERACTIVE SCRIPT
// Temple sticker ascension & downward lamps drift on scroll
// ==========================================================================

function initMeenaya() {
  const hero = document.getElementById('hero');
  const stage = document.getElementById('heroStage');
  const audio = document.getElementById('weddingAudio');
  const audioToggle = document.getElementById('audioToggle');
  const scrollCue = document.getElementById('heroScrollCue');

  let isMobile = window.innerWidth <= 600;
  let isTablet = window.innerWidth > 600 && window.innerWidth <= 1024;
  let heroTravel = isMobile ? 800 : (isTablet ? 1100 : 1400);
  let vh = window.innerHeight;

  function handleResize() {
    isMobile = window.innerWidth <= 600;
    isTablet = window.innerWidth > 600 && window.innerWidth <= 1024;
    heroTravel = isMobile ? 800 : (isTablet ? 1100 : 1400);
    vh = window.innerHeight;
    updateScroll();
  }

  window.addEventListener('resize', handleResize, { passive: true });

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  let lastProgress = -1;

  function updateScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const progress = clamp(scrollY / heroTravel, 0, 1);

    if (progress !== lastProgress) {
      lastProgress = progress;

      // 1. Full Temple Sticker: Starts showing top spires and ascends all the way to base
      const templeStart = isMobile ? 74.0 : 70.0;
      const templeEnd = isMobile ? 0.0 : -2.0;
      const templeY = templeStart - progress * (templeStart - templeEnd);
      const templeScale = 1.0 + progress * 0.05;

      // 2. Sky Lamps: Moves DOWN as user scrolls (downward parallax)
      const lampsY = progress * (isMobile ? 180.0 : 220.0);

      // 3. Title: Moves up and fades out
      const titleY = -progress * vh * 0.28;
      const titleScale = 1.0 - progress * 0.08;
      const titleOpacity = clamp(1.0 - progress * 2.6, 0, 1);
      const cueOpacity = clamp(1.0 - progress * 3.0, 0, 1);

      if (stage) {
        stage.style.setProperty('--hero-temple-y', `${templeY.toFixed(1)}%`);
        stage.style.setProperty('--hero-temple-scale', templeScale.toFixed(3));
        stage.style.setProperty('--hero-lamps-y', `${lampsY.toFixed(1)}px`);
        stage.style.setProperty('--hero-title-y', `${titleY.toFixed(1)}px`);
        stage.style.setProperty('--hero-title-scale', titleScale.toFixed(3));
        stage.style.setProperty('--hero-title-opacity', titleOpacity.toFixed(3));
        stage.style.setProperty('--hero-cue-opacity', cueOpacity.toFixed(3));
      }
    }
  }

  // Smooth scroll listener
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial calculation
  updateScroll();

  // Audio Toggle Handling
  if (audioToggle && audio) {
    let isPlaying = false;

    async function toggleMusic() {
      try {
        if (isPlaying) {
          audio.pause();
          isPlaying = false;
          audioToggle.classList.remove('playing');
        } else {
          await audio.play();
          isPlaying = true;
          audioToggle.classList.add('playing');
        }
      } catch (e) {
        console.warn('Audio play prevented:', e);
      }
    }

    audioToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });

    if (scrollCue) {
      scrollCue.addEventListener('click', () => {
        if (!isPlaying) toggleMusic();
        window.scrollBy({ top: 300, behavior: 'smooth' });
      });
    }

    const handleFirstGesture = () => {
      if (!isPlaying) {
        audio.play().then(() => {
          isPlaying = true;
          audioToggle.classList.add('playing');
        }).catch(() => {});
      }
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMeenaya);
} else {
  initMeenaya();
}
