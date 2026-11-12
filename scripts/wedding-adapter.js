/**
 * Wow Kalyanam Universal Wedding Adapter
 * Dynamically injects customized Couple Names, Parents' Names, Dynamic Events (with Google Maps),
 * and 6 Gallery Photos across all templates:
 * - Royal Pichwai Palace (template2.html)
 * - Royal Pichwai Lotus Courtyard (template09.html)
 * - Champagne Celebration & Vellum Luxury (template10.html)
 * - Kerala Kasavu Backwaters (kasavu.html)
 * - Meenaya Traditional Temple & Baroque Heritage (meenaya2.html)
 */

(function () {
  'use strict';

  var DB_NAME = 'wow_wedding_db';
  var DB_VERSION = 1;
  var STORE_NAME = 'photos';

  function safeStr(val, fallback) {
    if (val === undefined || val === null) return fallback || '';
    var s = String(val).trim();
    return s.length > 0 ? s : (fallback || '');
  }

  // Open IndexedDB safely
  function openDB() {
    return new Promise(function (resolve) {
      if (typeof indexedDB === 'undefined') return resolve(null);
      try {
        var req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = function (e) {
          var db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        req.onsuccess = function (e) { resolve(e.target.result); };
        req.onerror = function () { resolve(null); };
      } catch (_) {
        resolve(null);
      }
    });
  }

  // Detect current template ID
  function detectTemplateId() {
    var path = window.location.pathname.toLowerCase();
    if (path.indexOf('template09') !== -1) return 'pichwai-lotus-courtyard';
    if (path.indexOf('template10') !== -1) return 'champagne-luxury';
    if (path.indexOf('kasavu') !== -1) return 'kasavu-kerala';
    if (path.indexOf('meenaya') !== -1) return 'meenaya-temple-baroque';
    if (path.indexOf('template2') !== -1) return 'pichwai-palace';
    return 'pichwai-palace';
  }

  var currentTemplateId = detectTemplateId();

  // Parse config from URL params or localStorage
  function loadCustomConfig() {
    var params = new URLSearchParams(window.location.search);
    var custom = null;

    // 1. Check for encoded 'cfg' query param
    var cfgParam = params.get('cfg');
    if (cfgParam) {
      try {
        var jsonStr = decodeURIComponent(cfgParam);
        custom = JSON.parse(jsonStr);
      } catch (e) {
        try {
          var decoded = atob(cfgParam);
          custom = JSON.parse(decodeURIComponent(escape(decoded)));
        } catch (e2) {
          console.warn('Could not parse cfg URL parameter', e2);
        }
      }
    }

    // 2. Check localStorage / sessionStorage for this template
    var localCustom = null;
    try {
      var localStr = localStorage.getItem('wow_custom_wedding_' + currentTemplateId) || 
                     sessionStorage.getItem('wow_active_custom_wedding');
      if (localStr) {
        var parsed = JSON.parse(localStr);
        localCustom = {
          b: parsed.bride,
          g: parsed.groom,
          bp: parsed.brideParents,
          gp: parsed.groomParents,
          d: parsed.date,
          t: parsed.time,
          v: parsed.venue,
          a: parsed.address,
          m: parsed.mapUrl,
          ev: parsed.events ? parsed.events.map(function(e) {
            return {
              id: e.id,
              n: e.name,
              d: e.date,
              t: e.time,
              v: e.venue,
              a: e.address,
              m: e.mapUrl,
              s: e.desc
            };
          }) : null,
          ph: parsed.photos
        };
      }
    } catch (err) {
      console.warn('LocalStorage wedding data read error', err);
    }

    if (!custom) {
      custom = localCustom;
    } else if (localCustom && (!custom.ph || custom.ph.length === 0)) {
      // Merge photos from local storage if URL payload didn't carry full photos
      custom.ph = localCustom.ph;
    }

    // 3. Fallback to individual URL query params if present
    var paramBride = params.get('b') || params.get('bride');
    var paramGroom = params.get('g') || params.get('groom');
    var paramBrideParents = params.get('bp') || params.get('brideParents');
    var paramGroomParents = params.get('gp') || params.get('groomParents');
    var paramDate = params.get('d') || params.get('date');
    var paramTime = params.get('t') || params.get('time');
    var paramVenue = params.get('v') || params.get('venue');
    var paramAddress = params.get('a') || params.get('address');
    var paramMap = params.get('m') || params.get('map') || params.get('mapUrl');

    if (paramBride || paramGroom || paramBrideParents || paramGroomParents || paramDate || paramVenue) {
      custom = custom || {};
      if (paramBride) custom.b = paramBride;
      if (paramGroom) custom.g = paramGroom;
      if (paramBrideParents) custom.bp = paramBrideParents;
      if (paramGroomParents) custom.gp = paramGroomParents;
      if (paramDate) custom.d = paramDate;
      if (paramTime) custom.t = paramTime;
      if (paramVenue) custom.v = paramVenue;
      if (paramAddress) custom.a = paramAddress;
      if (paramMap) custom.m = paramMap;
    }

    return custom;
  }

  var customData = loadCustomConfig() || {};

  // Normalize data structure
  var bride = safeStr(customData.b, 'Dharani');
  var groom = safeStr(customData.g, 'Manu');
  var brideParents = safeStr(customData.bp, 'Sri. K. Ramesh & Smt. Radha');
  var groomParents = safeStr(customData.gp, 'Sri. M. Suresh & Smt. Shanthi');
  var weddingDate = safeStr(customData.d, '19 November 2026');
  var weddingTime = safeStr(customData.t, '07:00 PM');
  var venueName = safeStr(customData.v, 'BWSSB Rajatha Bhavan');
  var venueAddress = safeStr(customData.a, '18th Cross, Malleshwaram, Bengaluru');
  var fullVenue = [venueName, venueAddress].filter(Boolean).join(', ');
  var defaultMapUrl = safeStr(customData.m, 'https://maps.google.com/?q=BWSSB+Rajatha+Bhavan+Malleshwaram+Bangalore');

  var rawEvents = Array.isArray(customData.ev) ? customData.ev : null;
  var events = [];
  if (rawEvents && rawEvents.length > 0) {
    events = rawEvents.map(function (e, idx) {
      return {
        id: e.id || ('event-' + (idx + 1)),
        name: safeStr(e.n || e.name, 'Wedding Function ' + (idx + 1)),
        date: safeStr(e.d || e.date, weddingDate),
        time: safeStr(e.t || e.time, weddingTime),
        venue: safeStr(e.v || e.venue, venueName),
        address: safeStr(e.a || e.address, venueAddress),
        mapUrl: safeStr(e.m || e.mapUrl || e.map, defaultMapUrl),
        desc: safeStr(e.s || e.desc, 'An auspicious celebration of family, sacred vows, and love.')
      };
    });
  } else {
    // Default 2 events
    events = [
      {
        id: 'reception',
        name: 'Wedding Ceremony & Reception',
        date: weddingDate,
        time: weddingTime,
        venue: venueName,
        address: venueAddress,
        mapUrl: defaultMapUrl,
        desc: 'An evening of celebration, musical feast, and blessings as we begin our new journey together.'
      },
      {
        id: 'muhurtham',
        name: 'Muhurtham & Kalyanam',
        date: '20 November 2026',
        time: '09:15 AM - 10:15 AM',
        venue: venueName,
        address: venueAddress,
        mapUrl: defaultMapUrl,
        desc: 'Sacred thali tying, seven holy steps, and auspicious wedding rituals in presence of elders.'
      }
    ];
  }

  // 6 Photos list
  var defaultPhotos = [
    '/images/gallery/couple_1.webp',
    '/images/gallery/couple_2.webp',
    '/images/gallery/couple_3.webp',
    '/images/gallery/couple_4.webp',
    '/images/gallery/demo_1.webp',
    '/images/gallery/demo_2.webp'
  ];

  // Try synchronous photos first (from customData or direct photo storage)
  var initialPhotos = Array.isArray(customData.ph) && customData.ph.length > 0 ? customData.ph : null;

  if (!initialPhotos) {
    try {
      var syncS = sessionStorage.getItem('wow_photos_' + currentTemplateId) || sessionStorage.getItem('wow_photos_latest');
      if (syncS) {
        var parsedS = JSON.parse(syncS);
        if (Array.isArray(parsedS) && parsedS.length > 0) initialPhotos = parsedS;
      }
    } catch (_) {}
  }

  if (!initialPhotos) {
    try {
      var syncL = localStorage.getItem('wow_photos_' + currentTemplateId) || localStorage.getItem('wow_photos_latest');
      if (syncL) {
        var parsedL = JSON.parse(syncL);
        if (Array.isArray(parsedL) && parsedL.length > 0) initialPhotos = parsedL;
      }
    } catch (_) {}
  }

  var photos = (initialPhotos && initialPhotos.length > 0) ? initialPhotos.slice(0, 6) : defaultPhotos.slice(0, 6);
  while (photos.length < 6) {
    photos.push(defaultPhotos[photos.length] || defaultPhotos[0]);
  }

  // Expose global clean object
  window.__CUSTOM_WEDDING_DATA__ = {
    bride: bride,
    groom: groom,
    brideParents: brideParents,
    groomParents: groomParents,
    date: weddingDate,
    time: weddingTime,
    venue: venueName,
    address: venueAddress,
    fullVenue: fullVenue,
    mapUrl: defaultMapUrl,
    events: events,
    photos: photos
  };

  // Sync with window.__WEDDING_CONFIG__ if existing
  function syncWeddingConfig() {
    if (typeof window.__WEDDING_CONFIG__ !== 'undefined' && window.__WEDDING_CONFIG__) {
      var wc = window.__WEDDING_CONFIG__;
      if (wc.couple) {
        wc.couple.bride = bride;
        wc.couple.groom = groom;
        wc.couple.date = weddingDate;
        wc.couple.venue = fullVenue;
        wc.couple.hashtag = '#' + bride.replace(/\s+/g, '') + 'Weds' + groom.replace(/\s+/g, '');
      }
      if (wc.invite) {
        wc.invite.brideFather = brideParents;
        wc.invite.groomFather = groomParents;
        wc.invite.brideParents = brideParents;
        wc.invite.groomParents = groomParents;
      }
      if (wc.gallery) {
        wc.gallery.photos = photos;
      }
      if (wc.events) {
        wc.events = events.map(function (e) {
          return {
            id: e.id,
            name: e.name,
            date: e.date,
            time: e.time,
            venue: e.venue + (e.address ? ', ' + e.address : ''),
            desc: e.desc,
            mapsLink: e.mapUrl,
            map: e.mapUrl
          };
        });
      }
    }
  }
  syncWeddingConfig();

  // Apply customizations to DOM on ready
  function applyCustomizations() {
    syncWeddingConfig();

    // 1. Page Title
    if (bride && groom) {
      document.title = bride + ' & ' + groom + ' — Wedding Invitation | Wow Kalyanam';
    }

    // 2. Generic Name Placeholders
    document.querySelectorAll('.hc-bride, .pl-n1, .i-bride, #heroBride, #ftBride, #inviteBrideName').forEach(function (el) {
      el.textContent = bride;
    });
    document.querySelectorAll('.hc-groom, .pl-n2, .i-groom, #heroGroom, #ftGroom, #inviteGroomName').forEach(function (el) {
      el.textContent = groom;
    });

    // Template 09 Hero Intro Names (Opening Front Page)
    var introNames = document.getElementById('introNames') || document.querySelector('.intro-reveal .names');
    if (introNames && bride && groom) {
      introNames.innerHTML = '<span class="word">' + bride + '</span> <span class="word amp-wrap"><span class="amp">&amp;</span></span><br><span class="word">' + groom + '</span>';
    }
    var introDate = document.getElementById('introDate');
    if (introDate && weddingDate) {
      introDate.textContent = weddingDate;
    }
    var introVenue = document.getElementById('introVenue');
    if (introVenue && (venueName || venueAddress)) {
      introVenue.textContent = [venueName, venueAddress].filter(Boolean).join(', ');
    }

    // Template 09 & Universal Invite & Closing Names
    var inviteTitle = document.getElementById('inviteTitle') || document.querySelector('.inv-names');
    if (inviteTitle && bride && groom) {
      inviteTitle.innerHTML = bride + ' <span class="inv-amp">&amp;</span> ' + groom;
    }
    var closingTitle = document.getElementById('closingTitle') || document.querySelector('.closing-names');
    if (closingTitle && bride && groom) {
      closingTitle.textContent = bride + ' & ' + groom;
    }

    // Story body names update
    var storyBody = document.querySelector('.cpl-story-body');
    if (storyBody && bride && groom) {
      storyBody.innerHTML = 'Two souls, one sacred journey. From shared smiles to endless conversations, our bond grew deeper each day. Guided by tradition, love, and the blessings of our families, ' + bride + ' &amp; ' + groom + ' are ready to begin their most beautiful chapter yet.';
    }

    // RSVP WhatsApp link
    var rsvpPrimary = document.querySelector('.rsvp-btn-primary');
    if (rsvpPrimary && bride && groom) {
      var rsvpMsg = encodeURIComponent("Yes, I'll be there — " + bride + " & " + groom + "'s celebration!");
      rsvpPrimary.href = 'https://wa.me/919999999999?text=' + rsvpMsg;
    }

    // 3. Parents' Names
    var bParentsEls = document.querySelectorAll('#invBrideParents, #iBrideParents, .inv-bride-parents');
    bParentsEls.forEach(function (el) {
      el.textContent = brideParents;
    });
    var gParentsEls = document.querySelectorAll('#invGroomParents, #iGroomParents, .inv-groom-parents');
    gParentsEls.forEach(function (el) {
      el.textContent = groomParents;
    });

    // Template 09 inv-parents
    var t09Parents = document.querySelector('.inv-parents');
    if (t09Parents) {
      t09Parents.innerHTML = '<p>D/O ' + brideParents + '</p><p>S/O ' + groomParents + '</p>';
    }

    // Template 2 invite-parent
    var t2BrideParent = document.querySelector('#inviteNames .invite-person:first-child .invite-parent');
    if (t2BrideParent) {
      t2BrideParent.textContent = '(D/o ' + brideParents + ')';
    }
    var t2GroomParent = document.querySelector('#inviteNames .invite-person:last-child .invite-parent');
    if (t2GroomParent) {
      t2GroomParent.textContent = '(S/o ' + groomParents + ')';
    }

    // Meenaya 2 parents-info
    var meenayaParents = document.querySelector('.parents-info');
    if (meenayaParents) {
      meenayaParents.innerHTML = '<p><strong>Daughter of</strong> ' + brideParents + '</p><p style="margin-top: 4px;"><strong>Son of</strong> ' + groomParents + '</p>';
    }

    // 4. Primary Date & Venue
    document.querySelectorAll('.hero-date, .pl-date, .i-date, .inv-date, #inviteDate').forEach(function (el) {
      el.textContent = weddingDate;
    });
    document.querySelectorAll('.inv-venue, #inviteVenue').forEach(function (el) {
      el.innerHTML = venueName + (venueAddress ? '<br>' + venueAddress : '');
    });

    // 5. Template-Specific Dynamic Events & Photos Handlers
    if (currentTemplateId === 'pichwai-palace') {
      applyTemplate2EventsAndGallery();
    } else if (currentTemplateId === 'champagne-luxury') {
      applyTemplate10EventsAndGallery();
    } else if (currentTemplateId === 'kasavu-kerala') {
      applyKasavuEventsAndGallery();
    } else if (currentTemplateId === 'meenaya-temple-baroque') {
      applyMeenayaEventsAndGallery();
    } else if (currentTemplateId === 'pichwai-lotus-courtyard') {
      applyTemplate09EventsAndGallery();
    }
  }

  // ── TEMPLATE 2 (Royal Pichwai Palace) ──
  function applyTemplate2EventsAndGallery() {
    var eventsList = document.getElementById('eventsList');
    if (eventsList && events && events.length > 0) {
      eventsList.innerHTML = '';

      var illustrations = [
        'reception.webp',
        'shaadi.webp',
        'sangeet.webp',
        'haldi.webp',
        'mehendi.webp',
        'bidai.webp'
      ];

      function getPichwaiIllustration(name, idx) {
        var lower = (name || '').toLowerCase();
        if (lower.indexOf('haldi') !== -1) return 'images/events/haldi.webp';
        if (lower.indexOf('mehendi') !== -1) return 'images/events/mehendi.webp';
        if (lower.indexOf('sangeet') !== -1) return 'images/events/sangeet.webp';
        if (lower.indexOf('reception') !== -1 || lower.indexOf('dinner') !== -1) return 'images/events/reception.webp';
        if (lower.indexOf('muhurtham') !== -1 || lower.indexOf('shaadi') !== -1 || lower.indexOf('kalyanam') !== -1) return 'images/events/shaadi.webp';
        if (lower.indexOf('bidai') !== -1 || lower.indexOf('farewell') !== -1) return 'images/events/bidai.webp';
        return 'images/events/' + (illustrations[idx % illustrations.length] || 'reception.webp');
      }

      events.forEach(function (ev, idx) {
        var isLeft = idx % 2 === 0;
        var frameImg = isLeft ? 'images/events/Event_Card_left.webp' : 'images/events/Event_Card_right.webp';
        var cardClass = isLeft ? 'event-card event-card--left' : 'event-card event-card--right';
        var illus = getPichwaiIllustration(ev.name, idx);

        var article = document.createElement('article');
        article.className = cardClass + ' is-open';
        article.setAttribute('role', 'listitem');
        article.setAttribute('aria-label', (idx + 1) + ' of ' + events.length + ': ' + ev.name);

        var mapBtnHtml = ev.mapUrl ? `
          <a href="${ev.mapUrl}" target="_blank" rel="noopener" class="event-map-btn" style="display:inline-flex;align-items:center;gap:6px;margin-top:12px;padding:7px 16px;background:linear-gradient(135deg,#d4af37,#b8860b);color:#1b1406;border-radius:24px;font-size:11px;font-weight:700;text-decoration:none;box-shadow:0 4px 12px rgba(0,0,0,0.18);letter-spacing:0.5px;text-transform:uppercase;transition:transform 0.2s ease;">
            <svg width="12" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <span>Get Directions</span>
          </a>` : '';

        article.innerHTML = `
          <div class="event-card-inner">
            <div class="event-card-panel" style="opacity:1;transform:none;">
              <img class="event-card-frame" src="${frameImg}" alt="" aria-hidden="true" decoding="async" draggable="false">
              <div class="event-card-body">
                <img class="event-illustration" src="${illus}" alt="${ev.name}" decoding="async" draggable="false">
                <h3 class="event-name">${ev.name}</h3>
                <div class="event-rule" aria-hidden="true"></div>
                <p class="event-datetime">
                  <span class="event-date">${ev.date}</span>
                  <span class="event-time">${ev.time}</span>
                </p>
                <p class="event-venue">${ev.venue}${ev.address ? '<br>' + ev.address : ''}</p>
                ${mapBtnHtml}
              </div>
            </div>
          </div>
        `;

        eventsList.appendChild(article);
      });
    }

    // Call dynamic template2 gallery hook if ready
    if (typeof window.__updateTemplate2Gallery === 'function') {
      window.__updateTemplate2Gallery(photos);
    } else {
      var featuredImg = document.getElementById('galleryFeaturedPhoto') || document.getElementById('galleryMainPhoto');
      if (featuredImg && photos[0]) {
        featuredImg.src = photos[0];
      }
      var dotsContainer = document.getElementById('galleryDots');
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        photos.forEach(function (_, i) {
          var dot = document.createElement('button');
          dot.className = 'gallery-dot' + (i === 0 ? ' is-active' : '');
          dot.setAttribute('role', 'tab');
          dot.setAttribute('aria-label', 'Photo ' + (i + 1));
          dotsContainer.appendChild(dot);
        });
      }
      var thumbsContainer = document.getElementById('galleryThumbs');
      if (thumbsContainer) {
        thumbsContainer.innerHTML = '';
        photos.forEach(function (src, i) {
          var thumb = document.createElement('div');
          thumb.className = 'gallery-thumb' + (i === 0 ? ' is-active' : '');
          thumb.setAttribute('role', 'listitem');
          thumb.setAttribute('aria-label', 'Show photo ' + (i + 1));
          thumb.innerHTML = '<img class="gallery-thumb-photo" src="' + src + '" alt="Thumbnail ' + (i + 1) + '" decoding="async" loading="lazy">';
          thumbsContainer.appendChild(thumb);
        });
      }
    }
  }

  // ── TEMPLATE 10 (Champagne Celebration & Vellum Luxury) ──
  function applyTemplate10EventsAndGallery() {
    var evGrid = document.getElementById('evGrid');
    if (evGrid && events && events.length > 0) {
      evGrid.innerHTML = '';

      var t10Illus = [
        'Welcome_Dinner.webp',
        'Wedding_Ceremony.webp',
        'Reception.webp',
        'Cocktail.webp',
        'Engagement.webp',
        'Farewell_Brunch.webp'
      ];

      function getT10Illus(name, idx) {
        var lower = (name || '').toLowerCase();
        if (lower.indexOf('dinner') !== -1 || lower.indexOf('welcome') !== -1) return '/templates/template10/assets/Events/Welcome_Dinner.webp';
        if (lower.indexOf('ceremony') !== -1 || lower.indexOf('shaadi') !== -1 || lower.indexOf('muhurtham') !== -1) return '/templates/template10/assets/Events/Wedding_Ceremony.webp';
        if (lower.indexOf('reception') !== -1) return '/templates/template10/assets/Events/Reception.webp';
        if (lower.indexOf('cocktail') !== -1 || lower.indexOf('sangeet') !== -1) return '/templates/template10/assets/Events/Cocktail.webp';
        if (lower.indexOf('engagement') !== -1) return '/templates/template10/assets/Events/Engagement.webp';
        return '/templates/template10/assets/Events/' + (t10Illus[idx % t10Illus.length] || 'Reception.webp');
      }

      events.forEach(function (ev, idx) {
        var wrap = document.createElement('div');
        wrap.className = 'ev-card-wrap ev-reveal is-in';
        wrap.setAttribute('data-delay', String(idx * 80));

        var hasCupid = idx % 2 === 0;
        var cupidHtml = hasCupid ? `
          <div class="ev-card-cupid" aria-hidden="true">
            <div class="ev-cupid-clip">
              <img src="/templates/template10/assets/Events/Cupid.webp" alt="" draggable="false" decoding="async" loading="lazy">
            </div>
          </div>` : '';

        var mapHtml = ev.mapUrl ? `
          <a class="ev-card-maps" href="${ev.mapUrl}" target="_blank" rel="noopener" style="margin-top:10px;">
            <svg width="12" height="15" viewBox="0 0 9 11" fill="none" aria-hidden="true"><path d="M4.5 0C2.57 0 1 1.57 1 3.5C1 6.125 4.5 10.5 4.5 10.5S8 6.125 8 3.5C8 1.57 6.43 0 4.5 0ZM4.5 4.75C3.81 4.75 3.25 4.19 3.25 3.5C3.25 2.81 3.81 2.25 4.5 2.25C5.19 2.25 5.75 2.81 5.75 3.5C5.75 4.19 5.19 4.75 4.5 4.75Z" fill="currentColor"/></svg>
            <span>View on Map</span>
          </a>` : '';

        wrap.innerHTML = `
          ${cupidHtml}
          <div class="ev-card">
            <img class="ev-card-img" src="/templates/template10/assets/Events/Event_Card.webp" alt="" decoding="async" loading="lazy" draggable="false">
            <div class="ev-card-body">
              <div class="ev-card-illus">
                <img src="${getT10Illus(ev.name, idx)}" alt="${ev.name}" decoding="async" loading="lazy" draggable="false">
              </div>
              <p class="ev-card-label">${ev.name}</p>
              <p class="ev-card-date">${ev.date}</p>
              <div class="ev-card-rule" aria-hidden="true"></div>
              <p class="ev-card-time">${ev.time}</p>
              ${ev.desc ? `<p class="ev-card-desc" style="font-size:1.05rem;line-height:1.5;margin:4px 0;">${ev.desc}</p>` : ''}
              <p class="ev-card-venue">${ev.venue}</p>
              ${ev.address ? `<p class="ev-card-addr">${ev.address}</p>` : ''}
              ${mapHtml}
            </div>
          </div>
        `;
        evGrid.appendChild(wrap);
      });
    }

    // Gallery Photos in Template 10
    var frameIds = ['glHero', 'glLeft', 'glRight', 'glBottom'];
    frameIds.forEach(function (fid, idx) {
      var frame = document.getElementById(fid);
      if (frame && photos[idx]) {
        var img = frame.querySelector('img');
        if (img) img.src = photos[idx];
      }
    });
  }

  // ── TEMPLATE KASAVU (Kerala Kasavu Backwaters) ──
  function applyKasavuEventsAndGallery() {
    var evStage = document.getElementById('evStage');
    if (evStage && events && events.length > 0) {
      evStage.innerHTML = '';
      evStage.setAttribute('data-ev-count', String(events.length));

      var kasavuIcons = [
        '/templates/kasavu/assets/icons/icon-reception.webp',
        '/templates/kasavu/assets/icons/icon-shaadi.webp',
        '/templates/kasavu/assets/icons/icon-mehendi.webp',
        '/templates/kasavu/assets/icons/icon-haldi.webp',
        '/templates/kasavu/assets/icons/icon-cocktail.webp'
      ];

      function getKasavuIcon(name, idx) {
        var lower = (name || '').toLowerCase();
        if (lower.indexOf('haldi') !== -1) return '/templates/kasavu/assets/icons/icon-haldi.webp';
        if (lower.indexOf('mehendi') !== -1) return '/templates/kasavu/assets/icons/icon-mehendi.webp';
        if (lower.indexOf('cocktail') !== -1 || lower.indexOf('sangeet') !== -1) return '/templates/kasavu/assets/icons/icon-cocktail.webp';
        if (lower.indexOf('reception') !== -1) return '/templates/kasavu/assets/icons/icon-reception.webp';
        if (lower.indexOf('muhurtham') !== -1 || lower.indexOf('shaadi') !== -1 || lower.indexOf('kalyanam') !== -1) return '/templates/kasavu/assets/icons/icon-shaadi.webp';
        return kasavuIcons[idx % kasavuIcons.length] || kasavuIcons[0];
      }

      events.forEach(function (ev, idx) {
        var article = document.createElement('article');
        article.className = 'ev-node ev-row1 scroll-in in';
        article.style.setProperty('--sd', idx * 0.1 + 's');

        var mapHtml = ev.mapUrl ? `
          <a href="${ev.mapUrl}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:5px;margin-top:6px;font-size:11px;font-weight:700;color:#2e6b4a;text-decoration:none;">
            <svg width="11" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <span>Get Directions</span>
          </a>` : '';

        article.innerHTML = `
          <div class="ev-icon-wrap">
            <img src="${getKasavuIcon(ev.name, idx)}" alt="${ev.name}" class="ev-icon" loading="lazy">
            <div class="ev-glow"></div>
          </div>
          <div class="ev-label">
            <span class="ev-name">${ev.name}</span>
            <span class="ev-date">${ev.date} &middot; ${ev.time}</span>
          </div>
          <div class="ev-detail">
            <p class="ev-desc">${ev.venue}${ev.address ? ', ' + ev.address : ''}${ev.desc ? ' — ' + ev.desc : ''}</p>
            ${mapHtml}
          </div>
        `;
        evStage.appendChild(article);
      });
    }

    // Kasavu Gallery Photos
    window.__kasavuPhotos = photos;
    var galGrid = document.querySelector('.gal-grid');
    if (galGrid) {
      galGrid.innerHTML = '';
      photos.forEach(function (src, idx) {
        var item = document.createElement('div');
        item.className = 'gal-item' + (idx === 0 ? ' gal-tall' : '') + ' scroll-in in';
        item.style.setProperty('--sd', idx * 0.08 + 's');
        item.style.cursor = 'pointer';
        item.onclick = function () {
          if (window.__openKasavuLightbox) window.__openKasavuLightbox(idx);
        };
        item.innerHTML = `
          <div class="gal-ph" style="background-image:url('${src}');background-size:cover;background-position:center;">
          </div>
          <img class="gal-frame" src="/templates/kasavu/assets/frames/kasavu-frame.png" alt="" aria-hidden="true" onerror="this.style.display='none'">
        `;
        galGrid.appendChild(item);
      });
    }
  }

  // ── TEMPLATE MEENAYA (Meenaya Traditional Temple & Baroque Heritage) ──
  function applyMeenayaEventsAndGallery() {
    var container = document.getElementById('eventsContainer');
    if (container && events && events.length > 0) {
      container.innerHTML = '';

      var meenayaPaintings = [
        '/templates/meenaya2/assets/event_reception.png',
        '/templates/meenaya2/assets/event_muhurtham.png',
        '/templates/meenaya2/assets/event_sangeet.png',
        '/templates/meenaya2/assets/event_haldi.png',
        '/templates/meenaya2/assets/event_mehendi.png',
        '/templates/meenaya2/assets/event_engagement.png'
      ];

      function getMeenayaPainting(name, idx) {
        var lower = (name || '').toLowerCase();
        if (lower.indexOf('haldi') !== -1) return '/templates/meenaya2/assets/event_haldi.png';
        if (lower.indexOf('mehendi') !== -1) return '/templates/meenaya2/assets/event_mehendi.png';
        if (lower.indexOf('sangeet') !== -1) return '/templates/meenaya2/assets/event_sangeet.png';
        if (lower.indexOf('engagement') !== -1) return '/templates/meenaya2/assets/event_engagement.png';
        if (lower.indexOf('reception') !== -1) return '/templates/meenaya2/assets/event_reception.png';
        if (lower.indexOf('muhurtham') !== -1 || lower.indexOf('shaadi') !== -1 || lower.indexOf('kalyanam') !== -1) return '/templates/meenaya2/assets/event_muhurtham.png';
        return meenayaPaintings[idx % meenayaPaintings.length] || meenayaPaintings[0];
      }

      events.forEach(function (ev, idx) {
        var card = document.createElement('div');
        card.className = 'event-card';

        var mapHtml = ev.mapUrl ? `
          <a href="${ev.mapUrl}" target="_blank" rel="noopener" class="route-link">
            <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <span>View Route / Map</span>
          </a>` : '';

        card.innerHTML = `
          <div class="frame-container">
            <img src="/templates/meenaya2/assets/frame_gold_baroque.png" alt="Baroque Frame" class="baroque-frame-img">
            <div class="painting-mask">
              <img src="${getMeenayaPainting(ev.name, idx)}" alt="${ev.name}" class="painting-img">
            </div>
          </div>
          <div class="event-info">
            <h3 class="event-name">${ev.name}</h3>
            <div class="event-date-time">${ev.date} · ${ev.time}</div>
            <div class="event-venue">${ev.venue}${ev.address ? ', ' + ev.address : ''}</div>
            ${ev.desc ? `<p class="event-desc">${ev.desc}</p>` : ''}
            ${mapHtml}
          </div>
        `;
        container.appendChild(card);
      });
    }

    // Meenaya Gallery Aperture
    var aperture = document.getElementById('galleryAperture');
    if (aperture) {
      aperture.innerHTML = '';
      photos.forEach(function (src, idx) {
        var img = document.createElement('img');
        img.src = src;
        img.alt = 'Couple Photo ' + (idx + 1);
        img.className = 'gallery-slide' + (idx === 0 ? ' active' : '');
        aperture.appendChild(img);
      });
    }

    // Meenaya Gallery Dots
    var dotsWrap = document.getElementById('galleryDots');
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      photos.forEach(function (_, idx) {
        var dot = document.createElement('span');
        dot.className = 'gallery-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('data-index', String(idx));
        dot.onclick = function() {
          var slides = aperture.querySelectorAll('.gallery-slide');
          var dots = dotsWrap.querySelectorAll('.gallery-dot');
          slides.forEach(function(s, i) { s.classList.toggle('active', i === idx); });
          dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
        };
        dotsWrap.appendChild(dot);
      });
    }
  }

  // ── TEMPLATE 09 (Royal Pichwai Lotus Courtyard) ──
  function applyTemplate09EventsAndGallery() {
    // 1. Try native template09 event update hook
    if (typeof window.__updateTemplate09Events === 'function' && events && events.length > 0) {
      window.__updateTemplate09Events(events);
    } else {
      var evtStops = document.getElementById('evtStops');
      if (evtStops && events && events.length > 0) {
        evtStops.innerHTML = '';

        var icons = [
          'pn-evt-ico-reception-x-v01.webp',
          'pn-evt-ico-shaadi-x-v01.webp',
          'pn-evt-ico-sangeet-x-v01.webp',
          'pn-evt-ico-haldi-x-v01.webp',
          'pn-evt-ico-mehendi-x-v01.webp',
          'pn-evt-ico-vidaai-x-v01.webp'
        ];

        function getT09Icon(name, idx) {
          var lower = (name || '').toLowerCase();
          if (lower.indexOf('haldi') !== -1) return '/templates/template09/assets/event/pn-evt-ico-haldi-x-v01.webp';
          if (lower.indexOf('mehendi') !== -1) return '/templates/template09/assets/event/pn-evt-ico-mehendi-x-v01.webp';
          if (lower.indexOf('sangeet') !== -1) return '/templates/template09/assets/event/pn-evt-ico-sangeet-x-v01.webp';
          if (lower.indexOf('reception') !== -1) return '/templates/template09/assets/event/pn-evt-ico-reception-x-v01.webp';
          if (lower.indexOf('muhurtham') !== -1 || lower.indexOf('shaadi') !== -1 || lower.indexOf('kalyanam') !== -1) return '/templates/template09/assets/event/pn-evt-ico-shaadi-x-v01.webp';
          if (lower.indexOf('vidaai') !== -1 || lower.indexOf('farewell') !== -1) return '/templates/template09/assets/event/pn-evt-ico-vidaai-x-v01.webp';
          return '/templates/template09/assets/event/' + (icons[idx % icons.length] || 'pn-evt-ico-reception-x-v01.webp');
        }

        var mapPinSvg = `<svg width="11" height="14" viewBox="0 0 11 14" fill="none"
           xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:inline-block;vertical-align:middle;margin-right:4px">
        <path d="M5.5 0C2.46 0 0 2.46 0 5.5c0 4.12 5.5 8.5 5.5 8.5S11 9.62 11 5.5C11 2.46 8.54 0 5.5 0Z"
              fill="currentColor" opacity=".72"/>
        <circle cx="5.5" cy="5.5" r="2" fill="#fff" opacity=".88"/>
      </svg>`;

        events.forEach(function (ev, idx) {
          var isLeft = idx % 2 === 0;
          var p = isLeft ? 'farman-left' : 'farman-right';
          var u = document.createElement('article');
          u.className = 'farman-stop ' + p + ' is-open is-unrolling';
          u.setAttribute('role', 'listitem');
          u.setAttribute('data-event', ev.id);
          u.setAttribute('data-farman-index', String(idx));

          var mapHtml = ev.mapUrl ? `
            <a class="farman-map" href="${ev.mapUrl}" target="_blank" rel="noopener noreferrer" aria-label="Open ${ev.venue} on Google Maps" style="opacity:1!important;pointer-events:auto!important;">
               ${mapPinSvg}Open in Maps
            </a>` : '';

          u.innerHTML = `
            <div class="farman-rolled-wrap" aria-hidden="true" style="opacity:0;display:none;">
              <img class="farman-rolled-img" src="/templates/template09/assets/event/pn-evt-farman-rolled-x-v01.webp" alt="" draggable="false" decoding="async">
            </div>
            <div class="farman-open-wrap" style="clip-path:inset(0 0 0% 0 round 2px)!important;">
              <img class="farman-parchment-img" src="/templates/template09/assets/event/pn-evt-farman-open-x-v01.webp" alt="" aria-hidden="true" draggable="false" decoding="async">
              <div class="farman-dust-layer" aria-hidden="true"></div>
              <div class="farman-content" aria-label="${ev.name} ceremony details" style="visibility:visible!important;opacity:1!important;pointer-events:auto!important;">
                <div class="ev-fit" style="width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                  <img class="farman-motif" src="${getT09Icon(ev.name, idx)}" alt="${ev.name} motif" decoding="async" style="opacity:1!important;">
                  <h3 class="farman-name" style="opacity:1!important;">${ev.name}</h3>
                  <div class="farman-rule" aria-hidden="true" style="opacity:1!important;"></div>
                  <p class="farman-datetime" style="opacity:1!important;">
                    <span class="farman-date">${ev.date}</span>
                    <span class="farman-dot">·</span>
                    <span class="farman-time">${ev.time}</span>
                  </p>
                  <p class="farman-venue" style="opacity:1!important;">${ev.venue}${ev.address ? ', ' + ev.address : ''}</p>
                  ${ev.desc ? `<p class="farman-note" style="opacity:1!important;">${ev.desc}</p>` : ''}
                  ${mapHtml}
                </div>
              </div>
            </div>
          `;
          evtStops.appendChild(u);
        });
      }
    }

    // 2. Try native template09 gallery hook or fallback
    if (typeof window.__updateTemplate09Gallery === 'function' && photos && photos.length > 0) {
      window.__updateTemplate09Gallery(photos);
    } else {
      var galWall = document.getElementById('galWall');
      if (galWall && photos && photos.length > 0) {
        galWall.innerHTML = '';
        var orients = ['hero', 'portrait', 'landscape', 'portrait', 'landscape', 'portrait'];
        photos.slice(0, 6).forEach(function (src, idx) {
          var orient = orients[idx % orients.length];
          var slot = document.createElement('div');
          slot.className = 'gal-frame-slot gal-slot-' + orient;
          slot.setAttribute('role', 'listitem');
          slot.style.cursor = 'pointer';

          var frameAsset = orient === 'hero' ? '/templates/template09/assets/gallery/pn-gal-fr-hanging-hero-arch-x-v01.webp' :
            (orient === 'landscape' ? '/templates/template09/assets/gallery/pn-gal-fr-hanging-landscape-x-v01.webp' :
            '/templates/template09/assets/gallery/pn-gal-fr-hanging-portrait-x-v01.webp');

          slot.innerHTML = `
            <div class="gal-frame-inner">
              <div class="gal-photo-wrap">
                <img class="gal-photo" src="${src}" alt="Couple photo ${idx + 1}" decoding="async" loading="lazy">
              </div>
              <img class="gal-frame-art" src="${frameAsset}" alt="" aria-hidden="true" decoding="async" loading="lazy">
            </div>
          `;
          galWall.appendChild(slot);
        });
      }
    }
  }

  // Asynchronously retrieve photos from IndexedDB if not found yet or to ensure newest
  function fetchAndApplyStoredPhotos() {
    openDB().then(function (db) {
      if (!db) return;
      try {
        var tx = db.transaction(STORE_NAME, 'readonly');
        var store = tx.objectStore(STORE_NAME);
        var req1 = store.get('template_' + currentTemplateId);
        req1.onsuccess = function () {
          var result = (req1.result && Array.isArray(req1.result) && req1.result.length > 0) ? req1.result : null;
          if (!result) {
            var req2 = store.get('latest');
            req2.onsuccess = function () {
              if (req2.result && Array.isArray(req2.result) && req2.result.length > 0) {
                applyNewPhotos(req2.result);
              }
            };
          } else {
            applyNewPhotos(result);
          }
        };
      } catch (_) {}
    });
  }

  function applyNewPhotos(newPhotos) {
    if (!newPhotos || !newPhotos.length) return;
    photos = newPhotos.slice(0, 6);
    while (photos.length < 6) {
      photos.push(defaultPhotos[photos.length] || defaultPhotos[0]);
    }
    window.__CUSTOM_WEDDING_DATA__.photos = photos;
    if (typeof window.__WEDDING_CONFIG__ !== 'undefined' && window.__WEDDING_CONFIG__ && window.__WEDDING_CONFIG__.gallery) {
      window.__WEDDING_CONFIG__.gallery.photos = photos;
    }

    if (currentTemplateId === 'pichwai-palace') {
      if (typeof window.__updateTemplate2Gallery === 'function') {
        window.__updateTemplate2Gallery(photos);
      } else {
        var featuredImg = document.getElementById('galleryFeaturedPhoto') || document.getElementById('galleryMainPhoto');
        if (featuredImg && photos[0]) featuredImg.src = photos[0];
        var thumbsContainer = document.getElementById('galleryThumbs');
        if (thumbsContainer) {
          var thumbImgs = thumbsContainer.querySelectorAll('.gallery-thumb-photo');
          thumbImgs.forEach(function (img, i) {
            if (photos[i]) img.src = photos[i];
          });
        }
      }
    } else if (currentTemplateId === 'pichwai-lotus-courtyard') {
      if (typeof window.__updateTemplate09Gallery === 'function') {
        window.__updateTemplate09Gallery(photos);
      } else {
        var galWall = document.getElementById('galWall');
        if (galWall) {
          var galPhotos = galWall.querySelectorAll('.gal-photo');
          galPhotos.forEach(function(img, i) {
            if (photos[i]) img.src = photos[i];
          });
        }
      }
    } else if (currentTemplateId === 'champagne-luxury') {
      var frameIds = ['glHero', 'glLeft', 'glRight', 'glBottom'];
      frameIds.forEach(function (fid, idx) {
        var frame = document.getElementById(fid);
        if (frame && photos[idx]) {
          var img = frame.querySelector('img');
          if (img) img.src = photos[idx];
        }
      });
    } else if (currentTemplateId === 'kasavu-kerala') {
      applyKasavuEventsAndGallery();
    } else if (currentTemplateId === 'meenaya-temple-baroque') {
      applyMeenayaEventsAndGallery();
    }
  }

  // Trigger on DOMContentLoaded or immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      applyCustomizations();
      fetchAndApplyStoredPhotos();
    });
  } else {
    applyCustomizations();
    fetchAndApplyStoredPhotos();
  }

  // Re-run safely after window load to catch delayed template hydration
  window.addEventListener('load', function () {
    setTimeout(function() {
      applyCustomizations();
      fetchAndApplyStoredPhotos();
    }, 150);
    setTimeout(function() {
      applyCustomizations();
      fetchAndApplyStoredPhotos();
    }, 500);
  });
})();
