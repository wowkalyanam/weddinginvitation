function initApp() {
  const introSection = document.getElementById('introSection');
  const introVideo = document.getElementById('introVideo');
  const introHint = document.getElementById('introHint');
  const screenBloom = document.getElementById('screenBloom');
  const heroVideo = document.getElementById('heroVideo');
  const heroContent = document.getElementById('heroContent');
  const fabCluster = document.getElementById('fabCluster');
  const musicToggle = document.getElementById('musicToggle');
  const navToggle = document.getElementById('navToggle');
  const navPanel = document.getElementById('navPanel');
  const navLinks = document.querySelectorAll('.nav-link');
  const bgMusic = document.getElementById('bgMusic');
  const appContainer = document.querySelector('.app-container') || document.getElementById('appContainer');

  let hasStarted = false;
  let hasTransitioned = false;

  // Prevent scrolling on intro overlay while active
  if (introSection) {
    introSection.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
    introSection.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }

  // Ensure scroll is at top on initial load
  if (appContainer) {
    appContainer.scrollTop = 0;
  }
  window.scrollTo(0, 0);

  // Dynamic URL parameters support (Dharani & Manu default base data)
  // Supports both compact (b, g, d, v, a, cfg, fid) and verbose (bride, groom, date, venue, address) keys
  const urlParams = new URLSearchParams(window.location.search);
  let customCfg = null;
  const rawCfg = urlParams.get('cfg');
  if (rawCfg) {
    try {
      customCfg = JSON.parse(decodeURIComponent(rawCfg));
    } catch (_) {
      try { customCfg = JSON.parse(atob(rawCfg)); } catch (_) {}
    }
  }
  const fid = urlParams.get('fid');
  if (fid && typeof window !== 'undefined') {
    try {
      const sForm = localStorage.getItem('wow_form_' + fid);
      if (sForm) customCfg = JSON.parse(sForm);
    } catch (_) {}
  }
  if (!customCfg && !fid && !rawCfg && !urlParams.get('b') && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('wow_custom_wedding_pichwai-palace');
      if (saved) {
        const pSaved = JSON.parse(saved);
        if (pSaved.bride === 'Deepthi' && pSaved.groom === 'Murali') {
          localStorage.removeItem('wow_custom_wedding_pichwai-palace');
        } else {
          customCfg = pSaved;
        }
      }
    } catch (_) {}
  }

  const paramBride = (customCfg && (customCfg.b || customCfg.bride)) || urlParams.get('b') || urlParams.get('bride');
  const paramGroom = (customCfg && (customCfg.g || customCfg.groom)) || urlParams.get('g') || urlParams.get('groom');
  const paramDate = (customCfg && (customCfg.d || customCfg.date)) || urlParams.get('d') || urlParams.get('date');
  const paramVenue = (customCfg && (customCfg.v || customCfg.venue)) || urlParams.get('v') || urlParams.get('venue');
  const paramAddress = (customCfg && (customCfg.a || customCfg.address)) || urlParams.get('a') || urlParams.get('address');

  if (paramBride) {
    const el = document.getElementById('heroBride');
    if (el) el.textContent = paramBride;
    const ftEl = document.getElementById('ftBride');
    if (ftEl) ftEl.textContent = paramBride;
    const invEl = document.querySelector('#inviteNames .invite-person:first-child .invite-name');
    if (invEl) invEl.textContent = paramBride;
  }

  if (paramGroom) {
    const el = document.getElementById('heroGroom');
    if (el) el.textContent = paramGroom;
    const ftEl = document.getElementById('ftGroom');
    if (ftEl) ftEl.textContent = paramGroom;
    const invEl = document.querySelector('#inviteNames .invite-person:last-child .invite-name');
    if (invEl) invEl.textContent = paramGroom;
  }

  if (paramDate) {
    const el = document.querySelector('.hero-date');
    if (el) el.textContent = paramDate;
    const ftDate = document.getElementById('ftDate');
    if (ftDate) ftDate.textContent = paramDate;
    const invDate = document.querySelector('.invite-date');
    if (invDate) invDate.textContent = paramDate;
  }

  if (paramVenue || paramAddress) {
    const invVenue = document.querySelector('.invite-venue');
    if (invVenue) {
      invVenue.textContent = [paramVenue, paramAddress].filter(Boolean).join(', ');
    }
    const evtVName = document.getElementById('evtVenueName');
    if (evtVName && paramVenue) evtVName.textContent = paramVenue;
    const evtVAddr = document.getElementById('evtVenueAddress');
    if (evtVAddr && paramAddress) evtVAddr.textContent = paramAddress;
    const evtVMap = document.getElementById('evtVenueMap');
    const vMapCard = document.getElementById('venueMapCard');
    if (paramVenue || paramAddress) {
      const q = [paramVenue, paramAddress].filter(Boolean).join(' ');
      const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
      if (evtVMap) evtVMap.href = mapUrl;
      if (vMapCard) vMapCard.href = mapUrl;
    }
  }

  if (paramBride && paramGroom) {
    document.title = `${paramBride} & ${paramGroom} — Wedding Invitation`;
    const tag = document.getElementById('coupleHashtag');
    if (tag) tag.textContent = `#${paramBride.replace(/\s+/g, '')}Weds${paramGroom.replace(/\s+/g, '')}`;
    const rsvpBtn = document.getElementById('rsvpBtn');
    if (rsvpBtn) {
      rsvpBtn.href = `https://wa.me/?text=${encodeURIComponent(`Hi, I'll be attending ${paramBride} & ${paramGroom}'s Wedding!`)}`;
    }
  }

  // Initialize intro video frozen on first frame
  if (introVideo) {
    introVideo.pause();
    introVideo.currentTime = 0;
  }

  // Pre-load hero video
  if (heroVideo) {
    heroVideo.pause();
    heroVideo.currentTime = 0;
  }

  // Step 1: User taps screen to begin intro video
  function startIntro() {
    if (hasStarted) {
      // If tapped again while intro is playing, advance to hero section immediately
      transitionToHero();
      return;
    }
    hasStarted = true;

    // Fade out floating animated text prompt
    if (introHint) {
      introHint.classList.add('is-gone');
    }

    // Play intro video with unmuted audio
    if (introVideo) {
      introVideo.muted = false;
      introVideo.currentTime = 0;
      const playPromise = introVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Unmuted playback policy fallback, playing muted:', err);
          introVideo.muted = true;
          introVideo.play();
        });
      }
    }
  }

  // Step 2: Transition from intro video -> screen bloom color -> hero video & wedding typography
  function transitionToHero() {
    if (hasTransitioned) return;
    hasTransitioned = true;

    // 1. Show the screen bloom color (exact screen color from screenshot)
    if (screenBloom) {
      screenBloom.classList.add('is-blooming');
    }

    // 2. Pause intro video after slight overlap
    setTimeout(() => {
      try {
        if (introVideo) introVideo.pause();
      } catch (e) {}

      // Fade out intro section
      if (introSection) {
        introSection.classList.add('is-fading');
        setTimeout(() => {
          introSection.classList.add('is-gone');
        }, 800);
        introSection.addEventListener('transitionend', () => {
          introSection.classList.add('is-gone');
        }, { once: true });
      }

      // Unlock scroll and remove intro-active from body
      document.body.classList.remove('intro-active');
      if (appContainer) {
        appContainer.scrollTop = 0;
      }

      // Start playing the hero video (courtyard fountain with flying birds)
      if (heroVideo) {
        heroVideo.currentTime = 0;
        heroVideo.muted = true; // looping ambient background video
        heroVideo.play().catch((err) => {
          console.warn('Hero video play:', err);
        });
      }

      // Start background wedding music
      if (bgMusic) {
        bgMusic.play().then(() => {
          if (musicToggle) musicToggle.classList.add('is-playing');
        }).catch((err) => {
          console.warn('Background music autoplay:', err);
        });
      }
    }, 600);

    // 3. Reveal royal wedding typography ("Dharani & Manu", 19th Nov 2026)
    setTimeout(() => {
      if (heroContent) {
        heroContent.classList.add('is-visible');
      }
      if (fabCluster) {
        fabCluster.classList.add('is-ready');
      }
    }, 1000);

    // 4. Retreat the bloom color, smoothly revealing the playing fountain video & typography
    setTimeout(() => {
      if (screenBloom) {
        screenBloom.classList.remove('is-blooming');
        screenBloom.classList.add('is-retreating');
      }
    }, 1200);

    // 5. Clean up bloom from DOM display
    setTimeout(() => {
      if (screenBloom) {
        screenBloom.classList.add('is-gone');
      }
    }, 2800);
  }

  // Tap anywhere on intro section to play
  if (introSection) {
    introSection.addEventListener('click', (e) => {
      e.stopPropagation();
      startIntro();
    });
  }

  // Automatically transition when intro video ends
  if (introVideo) {
    introVideo.addEventListener('ended', () => {
      transitionToHero();
    });

    // Also trigger transition near the end (duration is ~3.69s)
    introVideo.addEventListener('timeupdate', () => {
      if (introVideo.duration && introVideo.currentTime >= (introVideo.duration - 0.4)) {
        transitionToHero();
      }
    });
  }

  // Music toggle button interaction
  if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.classList.add('is-playing');
      } else {
        bgMusic.pause();
        musicToggle.classList.remove('is-playing');
      }
    });
  }

  // Navigation Popup Menu Interaction
  function openNav() {
    if (!fabCluster) return;
    fabCluster.classList.add('nav-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'true');
    }
    if (navPanel) {
      navPanel.setAttribute('aria-hidden', 'false');
    }
  }

  function closeNav() {
    if (!fabCluster) return;
    fabCluster.classList.remove('nav-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
    }
    if (navPanel) {
      navPanel.setAttribute('aria-hidden', 'true');
    }
  }

  function toggleNav() {
    if (fabCluster && fabCluster.classList.contains('nav-open')) {
      closeNav();
    } else {
      openNav();
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNav();
    });
  }

  // Close popup if user clicks anywhere outside of fabCluster
  document.addEventListener('click', (e) => {
    if (fabCluster && fabCluster.classList.contains('nav-open')) {
      if (!fabCluster.contains(e.target)) {
        closeNav();
      }
    }
  });

  // Close popup if Escape key is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fabCluster && fabCluster.classList.contains('nav-open')) {
      closeNav();
    }
  });

  // Smooth scroll to sections when a nav link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      closeNav();

      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        }
      }
    });
  });

  // Smooth scroll from hero to invitation card section
  const heroScroll = document.getElementById('heroScroll');
  const inviteSection = document.getElementById('invite');

  if (heroScroll && inviteSection) {
    heroScroll.addEventListener('click', (e) => {
      e.preventDefault();
      inviteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Scroll-reveal IntersectionObserver for invite card text entrance
  const revealItems = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
        }
      });
    }, {
      root: appContainer || null,
      threshold: 0.15
    });

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => {
      item.classList.add('is-in');
    });
  }

  // Scroll-reveal IntersectionObserver for event cards 3D fan unfolding
  const eventCards = document.querySelectorAll('.event-card');
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-open', entry.isIntersecting);
      });
    }, {
      root: appContainer || null,
      threshold: 0.15,
      rootMargin: '0px 0px -5% 0px'
    });

    eventCards.forEach((card) => {
      cardObserver.observe(card);
    });
  } else {
    eventCards.forEach((card) => {
      card.classList.add('is-open');
    });
  }

  // Scroll-reveal IntersectionObserver for Couple Story Section
  const coupleSection = document.getElementById('couple');
  if (coupleSection) {
    const aliveElements = [];
    const eyebrow = coupleSection.querySelector('.couple-eyebrow');
    const title = coupleSection.querySelector('.couple-title');
    const hashtag = coupleSection.querySelector('.couple-hashtag');
    if (eyebrow) { eyebrow.classList.add('cpl-alive'); aliveElements.push(eyebrow); }
    if (title) { title.classList.add('cpl-alive'); aliveElements.push(title); }

    const storyContainer = document.getElementById('coupleStory');
    if (storyContainer) {
      const paragraphs = Array.from(storyContainer.querySelectorAll('.couple-story-p'));
      paragraphs.forEach((p) => {
        p.classList.add('cpl-alive');
        aliveElements.push(p);
      });
    }
    if (hashtag) { hashtag.classList.add('cpl-alive'); aliveElements.push(hashtag); }

    aliveElements.forEach((el, idx) => {
      el.dataset.stagger = String(idx * 160);
    });

    if ('IntersectionObserver' in window) {
      const coupleObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const target = entry.target;
          if (entry.isIntersecting) {
            const delay = parseInt(target.dataset.stagger || '0', 10);
            target._aliveT = setTimeout(() => {
              target.classList.add('is-in');
            }, delay);
          } else {
            clearTimeout(target._aliveT);
            target.classList.remove('is-in');
          }
        });
      }, {
        root: appContainer || null,
        threshold: 0.2,
        rootMargin: '0px 0px -40px 0px'
      });

      aliveElements.forEach((el) => coupleObserver.observe(el));
    } else {
      aliveElements.forEach((el) => el.classList.add('is-in'));
    }
  }

  // Initialize Gallery Section Carousel & Lightbox
  const gallerySection = document.getElementById('gallery');
  if (gallerySection) {
    let photos = (window.__CUSTOM_WEDDING_DATA__ && window.__CUSTOM_WEDDING_DATA__.photos && window.__CUSTOM_WEDDING_DATA__.photos.length > 0)
      ? window.__CUSTOM_WEDDING_DATA__.photos.filter(Boolean).map(p => ({ src: typeof p === 'string' ? p : p.src, caption: 'Moments we love' }))
      : [];

    const galNav = document.querySelector('a[href="#gallery"]');
    if (photos.length === 0) {
      gallerySection.style.display = 'none';
      if (galNav && galNav.closest('li')) galNav.closest('li').style.display = 'none';
    } else {
      gallerySection.style.display = '';
      if (galNav && galNav.closest('li')) galNav.closest('li').style.display = '';
    }

    const featured = document.getElementById('galleryFeatured');
    const featuredPhoto = document.getElementById('galleryMainPhoto') || document.getElementById('galleryFeaturedPhoto');
    const dotsContainer = document.getElementById('galleryDots');
    const thumbsContainer = document.getElementById('galleryThumbs');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const lightbox = document.getElementById('galleryLightbox');
    const lbImg = document.getElementById('galleryLbImg');
    const lbCaption = document.getElementById('galleryLbCaption');
    const lbClose = document.getElementById('galleryLbClose');
    const lbPrev = document.getElementById('galleryLbPrev');
    const lbNext = document.getElementById('galleryLbNext');

    let currentIndex = 0;
    let lbIndex = 0;

    function rebuildDotsAndThumbs() {
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        photos.forEach((_, idx) => {
          const dot = document.createElement('button');
          dot.className = 'gallery-dot' + (idx === currentIndex ? ' is-active' : '');
          dot.setAttribute('role', 'tab');
          dot.setAttribute('aria-label', 'Photo ' + (idx + 1));
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            setPhoto(idx);
          });
          dotsContainer.appendChild(dot);
        });
      }
      if (thumbsContainer) {
        thumbsContainer.innerHTML = '';
        photos.forEach((p, idx) => {
          const thumb = document.createElement('div');
          thumb.className = 'gallery-thumb' + (idx === currentIndex ? ' is-active' : '');
          thumb.setAttribute('role', 'listitem');
          thumb.setAttribute('aria-label', 'Show photo ' + (idx + 1));
          thumb.innerHTML = '<img class="gallery-thumb-photo" src="' + p.src + '" alt="Thumbnail ' + (idx + 1) + '" decoding="async" loading="lazy">';
          thumb.addEventListener('click', (e) => {
            e.stopPropagation();
            setPhoto(idx);
          });
          thumbsContainer.appendChild(thumb);
        });
      }
    }

    window.__updateTemplate2Gallery = function(newPhotos) {
      const cleanPhotos = (newPhotos || []).filter(Boolean);
      if (!cleanPhotos.length) {
        gallerySection.style.display = 'none';
        if (galNav && galNav.closest('li')) galNav.closest('li').style.display = 'none';
        return;
      }
      gallerySection.style.display = '';
      if (galNav && galNav.closest('li')) galNav.closest('li').style.display = '';
      photos = cleanPhotos.map(p => ({ src: typeof p === 'string' ? p : p.src, caption: 'Moments we love' }));
      currentIndex = 0;
      rebuildDotsAndThumbs();
      setPhoto(0, true);
    };

    if (photos.length > 0) {
      rebuildDotsAndThumbs();
      setPhoto(0, true);
    }

    function setPhoto(index, immediate = false) {
      index = (index + photos.length) % photos.length;
      currentIndex = index;

      const updateImg = () => {
        if (featuredPhoto) {
          featuredPhoto.src = photos[index].src;
          featuredPhoto.alt = photos[index].caption;
        }
        if (featured) {
          featured.classList.remove('is-fading');
        }
      };

      if (immediate || !featured) {
        updateImg();
      } else {
        featured.classList.add('is-fading');
        setTimeout(updateImg, 180);
      }

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.gallery-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('is-active', idx === index);
        });
      }

      if (thumbsContainer) {
        const thumbs = thumbsContainer.querySelectorAll('.gallery-thumb');
        thumbs.forEach((thumb, idx) => {
          const isActive = idx === index;
          thumb.classList.toggle('is-active', isActive);
          if (isActive && !immediate) {
            thumb.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
          }
        });
      }
    }

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.gallery-dot');
      dots.forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          setPhoto(idx);
        });
      });
    }

    if (thumbsContainer) {
      const thumbs = thumbsContainer.querySelectorAll('.gallery-thumb');
      thumbs.forEach((thumb, idx) => {
        thumb.addEventListener('click', (e) => {
          e.stopPropagation();
          setPhoto(idx);
        });
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setPhoto(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setPhoto(currentIndex + 1);
      });
    }

    // Touch swipe support for mobile
    if (featured) {
      let touchStartX = 0;
      let touchStartY = 0;
      featured.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      featured.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) {
            setPhoto(currentIndex + 1);
          } else {
            setPhoto(currentIndex - 1);
          }
        }
      }, { passive: true });
    }

    // Lightbox modal functionality
    function openLightbox(index) {
      if (!lightbox || !lbImg) return;
      lbIndex = index;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      updateLightboxPhoto(lbIndex);
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.hidden = true;
      document.body.style.overflow = '';
    }

    function updateLightboxPhoto(index) {
      if (!lbImg || !photos[index]) return;
      lbImg.style.opacity = '0';
      lbImg.style.transform = 'scale(0.96)';
      lbImg.src = photos[index].src;
      lbImg.alt = photos[index].caption;
      if (lbCaption) lbCaption.textContent = photos[index].caption;
      lbImg.onload = () => {
        lbImg.style.transition = 'opacity 0.3s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)';
        lbImg.style.opacity = '1';
        lbImg.style.transform = 'scale(1)';
      };
    }

    if (featured) {
      featured.addEventListener('click', () => openLightbox(currentIndex));
      featured.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(currentIndex);
        }
      });
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) {
      lbPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        lbIndex = (lbIndex - 1 + photos.length) % photos.length;
        updateLightboxPhoto(lbIndex);
      });
    }
    if (lbNext) {
      lbNext.addEventListener('click', (e) => {
        e.stopPropagation();
        lbIndex = (lbIndex + 1) % photos.length;
        updateLightboxPhoto(lbIndex);
      });
    }
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (lightbox && !lightbox.hidden) {
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') {
          lbIndex = (lbIndex - 1 + photos.length) % photos.length;
          updateLightboxPhoto(lbIndex);
        } else if (e.key === 'ArrowRight') {
          lbIndex = (lbIndex + 1) % photos.length;
          updateLightboxPhoto(lbIndex);
        }
      }
    });

    setPhoto(0, true);
  }

  // Initialize RSVP Section (Scroll Reveal, Calendar URLs, Canvas Fireworks)
  const rsvpSection = document.getElementById('rsvp');
  if (rsvpSection) {
    if ('IntersectionObserver' in window) {
      const rsvpObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            rsvpSection.classList.add('rsvp-alive');
            rsvpObserver.unobserve(rsvpSection);
          }
        });
      }, {
        root: appContainer || null,
        threshold: 0.12
      });
      rsvpObserver.observe(rsvpSection);
    } else {
      rsvpSection.classList.add('rsvp-alive');
    }

    // Google Calendar & Apple Calendar Links
    const weddingTitle = `${paramBride || 'Dharani'} & ${paramGroom || 'Manu'}'s Wedding`;
    const weddingLoc = paramVenue ? [paramVenue, paramAddress].filter(Boolean).join(', ') : "BWSSB Rajatha Bhavan, 8th, 19th Cross Rd, Malleshwaram, Bengaluru, Karnataka 560012";
    const weddingDesc = `Join us to celebrate the wedding of ${paramBride || 'Dharani'} & ${paramGroom || 'Manu'}.`;
    const gcalBtn = document.getElementById('rsvpGcalBtn');
    const icalBtn = document.getElementById('rsvpIcalBtn');
    if (gcalBtn) {
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(weddingTitle)}&dates=20261119T133000Z/20261120T063000Z&location=${encodeURIComponent(weddingLoc)}&details=${encodeURIComponent(weddingDesc)}`;
      gcalBtn.href = gcalUrl;
    }
    if (icalBtn) {
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Wow Kalyanam//Wedding Invitation//EN',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'DTSTART:20261119T133000Z',
        'DTEND:20261120T063000Z',
        `SUMMARY:${weddingTitle}`,
        `DESCRIPTION:${weddingDesc}`,
        `LOCATION:${weddingLoc}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');
      icalBtn.href = 'data:text/calendar;charset=utf8,' + encodeURIComponent(icsData);
      icalBtn.setAttribute('download', 'wedding-invitation.ics');
    }

    // Canvas Fireworks Animation
    const canvas = document.getElementById('rsvpFireworks');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let w = 0, h = 0, animId = 0, isRunning = false, lastLaunch = 0;
      const rockets = [];
      const particles = [];
      const colors = ['#d8a957', '#f5d9a0', '#c4748c', '#fdf6e6', '#8fb4e0', '#c4985a'];

      const rand = (min, max) => min + Math.random() * (max - min);
      const scale = () => h / 700;

      function resizeCanvas() {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
      }

      function launchRocket() {
        const sc = scale();
        rockets.push({
          x: rand(w * 0.16, w * 0.84),
          y: rand(h * 0.58, h * 0.66),
          vx: rand(-0.4, 0.4) * sc,
          vy: rand(-8.5, -6.5) * sc,
          targetY: rand(h * 0.12, h * 0.38),
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      function explodeRocket(x, y, color) {
        const count = Math.round(rand(44, 68));
        const sc = scale();
        for (let i = 0; i < count; i++) {
          const angle = Math.PI * 2 * i / count + rand(-0.08, 0.08);
          const spd = rand(1.4, 4.8) * sc;
          particles.push({
            x, y,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            life: 1,
            decay: rand(0.01, 0.018),
            size: rand(1.2, 2.5),
            color
          });
        }
      }

      function loop(timestamp) {
        if (!isRunning) return;
        const sc = scale();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';

        if (timestamp - lastLaunch > rand(650, 1200)) {
          launchRocket();
          lastLaunch = timestamp;
        }

        for (let i = rockets.length - 1; i >= 0; i--) {
          const r = rockets[i];
          r.x += r.vx;
          r.y += r.vy;
          r.vy += 0.12 * sc;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = r.color;
          ctx.fill();
          if (r.vy >= 0 || r.y <= r.targetY) {
            explodeRocket(r.x, r.y, r.color);
            rockets.splice(i, 1);
          }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.045 * sc;
          p.vx *= 0.985;
          p.vy *= 0.985;
          p.life -= p.decay;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        animId = requestAnimationFrame(loop);
      }

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas, { passive: true });

      if ('IntersectionObserver' in window) {
        const fireObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!isRunning) {
                isRunning = true;
                lastLaunch = 0;
                animId = requestAnimationFrame(loop);
              }
            } else {
              isRunning = false;
              cancelAnimationFrame(animId);
            }
          });
        }, {
          root: appContainer || null,
          threshold: 0.05
        });
        fireObserver.observe(rsvpSection);
      } else {
        isRunning = true;
        animId = requestAnimationFrame(loop);
      }
    }
  }

  // Initialize Countdown Section Timer
  const countdownSection = document.getElementById('countdown');
  if (countdownSection) {
    const targetDate = new Date('2026-11-19T19:00:00+05:30').getTime();
    const cdCells = {
      d: document.getElementById('cdDays'),
      h: document.getElementById('cdHours'),
      m: document.getElementById('cdMins'),
      s: document.getElementById('cdSecs')
    };

    if (cdCells.d) {
      const prevVals = {};
      const pad = (n) => (n < 10 ? '0' + n : '' + n);

      function updateCell(el, key, val) {
        if (!el) return;
        const formatted = pad(val < 0 ? 0 : Math.floor(val));
        if (el.textContent === formatted) return;
        el.textContent = formatted;
        if (prevVals[key] !== undefined) {
          el.classList.remove('is-tick');
          void el.offsetWidth;
          el.classList.add('is-tick');
        }
        prevVals[key] = formatted;
      }

      function tick() {
        const now = Date.now();
        const diff = Math.max(0, targetDate - now);
        const totalSecs = Math.floor(diff / 1000);
        const days = Math.floor(totalSecs / 86400);
        const hours = Math.floor((totalSecs % 86400) / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;

        updateCell(cdCells.d, 'd', days);
        updateCell(cdCells.h, 'h', hours);
        updateCell(cdCells.m, 'm', mins);
        updateCell(cdCells.s, 's', secs);
      }

      tick();
      setInterval(tick, 1000);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
