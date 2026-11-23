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

  function cleanVenueName(venue, address) {
    if (!venue) return '';
    var v = String(venue).trim();
    if (address && address.trim()) {
      var a = String(address).trim();
      var escapedA = a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      v = v.replace(new RegExp(',?\\s*' + escapedA + '$', 'i'), '').trim();
      var aFirst = a.split(',')[0].trim();
      if (aFirst && aFirst.length > 3) {
        var escapedFirst = aFirst.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        v = v.replace(new RegExp(',?\\s*' + escapedFirst + '.*$', 'i'), '').trim();
      }
    }
    if (v.indexOf(',') !== -1) {
      if (/\b\d{6}\b/.test(v) || /\b(road|rd|cross|main|street|st|nagar|post|layout|opp|near|behind|floor|door|halasuru|indiranagar|koramangala|whitefield|bengaluru|bangalore)\b/i.test(v)) {
        var parts = v.split(',');
        v = parts[0].trim();
      }
    }
    return v;
  }

  function getDirectionsUrl(venue, address, customMapUrl) {
    var v = cleanVenueName(venue, address);
    var a = address ? String(address).trim() : '';
    var searchTarget = [v, a].filter(Boolean).join(', ');
    if (!searchTarget && venue) searchTarget = String(venue).trim();

    if (customMapUrl && String(customMapUrl).trim().indexOf('http') === 0) {
      var trimmed = String(customMapUrl).trim();
      var isGeneric = /maps\.google\.com\/\?q=(Bangalore|Bengaluru)$/i.test(trimmed) ||
                      /maps\.google\.com\/\?q=.*(Grand(\+|\s)Ballroom|Palace(\+|\s)Grounds|Rajatha(\+|\s)Bhavan|Malleshwaram)/i.test(trimmed);
      if (!isGeneric || !searchTarget || (searchTarget.indexOf('Ballroom') !== -1 && searchTarget.indexOf('Palace Grounds') !== -1)) {
        return trimmed;
      }
    }

    if (!searchTarget) searchTarget = 'Bengaluru';
    return 'https://maps.google.com/?q=' + encodeURIComponent(searchTarget);
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

  function getQueryParam(key) {
    try {
      var p = new URLSearchParams(window.location.search);
      return p.get(key) || '';
    } catch (_) {
      return '';
    }
  }

  // Detect current template ID
  function detectTemplateId() {
    var path = window.location.pathname.toLowerCase();
    if (path.indexOf('template09') !== -1) return 'pichwai-lotus-courtyard';
    if (path.indexOf('template10') !== -1) return 'champagne-luxury';
    if (path.indexOf('kasavu') !== -1) return 'kasavu-kerala';
    if (path.indexOf('meenaya') !== -1) return 'meenaya-temple-baroque';
    if (path.indexOf('deepthi-murali') !== -1 || path.indexOf('deepthi') !== -1) return 'deepthi-murali-pichwai';
    if (path.indexOf('template2') !== -1) return 'pichwai-palace';
    return 'pichwai-palace';
  }

  var currentTemplateId = detectTemplateId();

  // Parse config from URL params or localStorage
  function loadCustomConfig() {
    var params = new URLSearchParams(window.location.search);
    var custom = null;
    var fid = params.get('fid');

    // 1. If fid (Form ID) is present, load specifically for this isolated form from localStorage
    if (fid) {
      try {
        var formJson = localStorage.getItem('wow_form_' + fid);
        if (formJson) {
          var pf = JSON.parse(formJson);
          custom = {
            fid: fid,
            b: pf.bride,
            g: pf.groom,
            bp: pf.brideParents,
            gp: pf.groomParents,
            d: pf.date || '',
            t: pf.time || '',
            v: pf.venue || '',
            a: pf.address || '',
            m: pf.mapUrl || '',
            ev: pf.events ? pf.events.map(function(e) {
              return {
                id: e.id,
                n: e.name,
                d: e.date || '',
                t: e.time || '',
                v: e.venue || '',
                a: e.address || '',
                m: e.mapUrl || '',
                s: e.desc || ''
              };
            }) : null,
            ph: pf.photos
          };
        }
      } catch (err) {
        console.warn('Could not read isolated form data for fid=' + fid, err);
      }
    }

    // 2. Check for encoded 'cfg' query param (self-contained guest payload)
    var cfgParam = params.get('cfg');
    if (!custom && cfgParam) {
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

    // 4. If no URL params and no fid/cfg, keep custom null for pure pristine template demo
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('wow_active_custom_wedding');
        localStorage.removeItem('wow_photos_latest');
        localStorage.removeItem('wow_custom_wedding_' + currentTemplateId);
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('wow_active_custom_wedding');
        sessionStorage.removeItem('wow_photos_latest');
      }
    } catch (_) {}

    return custom;
  }

  var customData = loadCustomConfig() || {};

  var rawEvents = Array.isArray(customData.ev) ? customData.ev : null;
  var firstEvt = (rawEvents && rawEvents.length > 0) ? rawEvents[0] : null;

  // Normalize data structure — template2 defaults to Dharani & Manu, deepthi-murali defaults to Deepthi & Murali
  var isT2 = currentTemplateId === 'pichwai-palace';
  var isDeepthiPichwai = currentTemplateId === 'deepthi-murali-pichwai';

  var defB = isT2 ? 'Dharani' : 'Deepthi';
  var defG = isT2 ? 'Manu' : 'Murali';
  var defBP = isT2 ? 'Smt. Jalajakshi V. and Ram Murthy N.' : 'Shri. S. Ravi & Smt. R. Jyothilakshmi';
  var defGP = isT2 ? 'Smt. Narasamma K.S. and Lakshmikanth S.K.' : 'Shri. K. Muralidharan & Smt. M. Geetha';
  var defDate = isT2 ? '19 November 2026' : (isDeepthiPichwai ? '25 December 2026' : '');
  var defTime = '07:00 PM';
  var defV = (isT2 || isDeepthiPichwai) ? 'BWSSB Rajatha Bhavan' : 'The Grand Ballroom & Palace Grounds';
  var defA = (isT2 || isDeepthiPichwai) ? '8th, 19th Cross Rd, Malleshwaram, Bengaluru, Karnataka 560012' : (customData.v ? '' : 'Bengaluru, Karnataka');
  var defMap = (isT2 || isDeepthiPichwai)
    ? 'https://www.google.com/maps/dir//BWSSB+Rajatha+Bhavana,+8th,+19th+Cross+Rd,+Malleshwaram,+Bengaluru,+Karnataka+560012/@13.0279053,77.6405023,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3bae3d7fe2c5046b:0x7dc2af7faf8d611b!2m2!1d77.562176!2d13.0116862?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D'
    : 'https://maps.google.com/?q=Bangalore';

  var bride = safeStr(customData.b, defB);
  var groom = safeStr(customData.g, defG);
  var brideParents = safeStr(customData.bp, defBP);
  var groomParents = safeStr(customData.gp, defGP);
  var weddingDate = safeStr(customData.d, (firstEvt && (firstEvt.d || firstEvt.date)) || defDate);
  var weddingTime = safeStr(customData.t, (firstEvt && (firstEvt.t || firstEvt.time)) || defTime);
  var venueName = safeStr(customData.v, (firstEvt && (firstEvt.v || firstEvt.venue)) || defV);
  var venueAddress = safeStr(customData.a, (firstEvt && (firstEvt.a || firstEvt.address)) || defA);
  var fullVenue = [venueName, venueAddress].filter(Boolean).join(', ');
  var defaultMapUrl = safeStr(customData.m, (firstEvt && (firstEvt.m || firstEvt.mapUrl)) || defMap);
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
  } else if (isT2) {
    events = [
      {
        id: 'reception',
        name: 'Reception',
        date: 'Thursday, 19th November 2026',
        time: '7:00 PM',
        venue: 'BWSSB Rajatha Bhavan',
        address: '8th, 19th Cross Rd, Malleshwaram, Bengaluru, Karnataka 560012',
        mapUrl: defaultMapUrl,
        desc: 'An evening of celebration, musical feast, and dinner.'
      },
      {
        id: 'muhurtham',
        name: 'Muhurtham',
        date: 'Friday, 20th November 2026',
        time: 'Between 9:15 AM - 10:15 AM',
        venue: '',
        address: '',
        mapUrl: '',
        desc: 'Sacred thali tying and auspicious wedding rituals in presence of family and elders.'
      }
    ];
  } else if (isDeepthiPichwai) {
    events = [
      {
        id: 'reception',
        name: 'Reception',
        date: 'Friday, 25th December 2026',
        time: '7:00 PM',
        venue: 'BWSSB Rajatha Bhavan',
        address: '8th, 19th Cross Rd, Malleshwaram, Bengaluru, Karnataka 560012',
        mapUrl: 'https://www.google.com/maps/dir//BWSSB+Rajatha+Bhavana,+8th,+19th+Cross+Rd,+Malleshwaram,+Bengaluru,+Karnataka+560012/@13.0279053,77.6405023,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3bae3d7fe2c5046b:0x7dc2af7faf8d611b!2m2!1d77.562176!2d13.0116862?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D',
        desc: 'An evening of celebration, musical feast, and dinner.'
      },
      {
        id: 'muhurtham',
        name: 'Muhurtham',
        date: 'Saturday, 26th December 2026',
        time: 'Between 9:15 AM - 10:15 AM',
        venue: 'Prasanna Lakshmi Venkateshwara Temple',
        address: '8th, 19th Cross Rd, Malleshwaram, Bengaluru, Karnataka 560012',
        mapUrl: 'https://maps.google.com/?q=Prasanna+Lakshmi+Venkateshwara+Temple+Malleshwaram',
        desc: 'Sacred thali tying and auspicious wedding rituals in presence of family and elders.'
      }
    ];
  } else {
    // Default 2 events — NO hardcoded dates
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
        date: weddingDate,
        time: '09:15 AM - 10:15 AM',
        venue: venueName,
        address: venueAddress,
        mapUrl: defaultMapUrl,
        desc: 'Sacred thali tying, seven holy steps, and auspicious wedding rituals in presence of elders.'
      }
    ];
  }

  // 4 Photos list — ZERO default stock photos (user enters photos)
  var defaultPhotos = [];

  // Try synchronous photos first (from isolated form, customData, or direct photo storage)
  var initialPhotos = Array.isArray(customData.ph) && customData.ph.length > 0 ? customData.ph : null;
  var currentFid = customData.fid || new URLSearchParams(window.location.search).get('fid');

  // If fid is present, load strictly for this form!
  if (!initialPhotos && currentFid) {
    try {
      var formPh = localStorage.getItem('wow_photos_form_' + currentFid);
      if (formPh) {
        var parsedPh = JSON.parse(formPh);
        if (Array.isArray(parsedPh) && parsedPh.length > 0) initialPhotos = parsedPh;
      }
    } catch (_) {}
  }

  if (!initialPhotos && !currentFid) {
    try {
      var syncS = sessionStorage.getItem('wow_photos_' + currentTemplateId);
      if (syncS) {
        var parsedS = JSON.parse(syncS);
        if (Array.isArray(parsedS) && parsedS.length > 0) initialPhotos = parsedS;
      }
    } catch (_) {}
  }

  if (!initialPhotos && !currentFid) {
    try {
      var syncL = localStorage.getItem('wow_photos_' + currentTemplateId);
      if (syncL) {
        var parsedL = JSON.parse(syncL);
        if (Array.isArray(parsedL) && parsedL.length > 0) initialPhotos = parsedL;
      }
    } catch (_) {}
  }

  var photos = (initialPhotos && initialPhotos.length > 0)
    ? initialPhotos.filter(function (p) { return p && typeof p === 'string' && p.trim().length > 0; }).slice(0, 4)
    : [];

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
          var cleanV = cleanVenueName(e.venue, e.address);
          var dirUrl = getDirectionsUrl(e.venue, e.address, e.mapUrl);
          return {
            id: e.id,
            name: e.name,
            date: e.date,
            time: e.time,
            venue: cleanV,
            address: e.address || '',
            desc: e.desc,
            mapsLink: dirUrl,
            map: dirUrl
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
    var userCustomDate = (customData && (customData.d || customData.date)) || getQueryParam('d') || getQueryParam('date') || '';
    var recEvt = null;
    if (customData && customData.ev && customData.ev.length > 0) {
      recEvt = events.find(function (e) {
        return (e.name || e.n || '').toLowerCase().indexOf('reception') !== -1;
      }) || events[0];
    }
    var userEnteredDate = (recEvt && (recEvt.date || recEvt.d)) || userCustomDate || '';
    userEnteredDate = (userEnteredDate || '').trim();

    document.querySelectorAll('.hero-date, .pl-date, .i-date, #inviteDate').forEach(function (el) {
      if (userEnteredDate) {
        el.textContent = userEnteredDate;
        el.style.display = '';
      } else {
        el.textContent = '';
        el.style.display = 'none';
      }
    });
    // Template 09 invitation card: ONLY show date that user will enter; hide if not entered
    document.querySelectorAll('.inv-date').forEach(function (el) {
      if (userEnteredDate) {
        el.textContent = userEnteredDate;
        el.style.display = '';
      } else {
        el.textContent = '';
        el.style.display = 'none';
      }
    });
    document.querySelectorAll('.inv-venue').forEach(function (el) {
      el.textContent = '';
      el.style.display = 'none';
    });
    document.querySelectorAll('#inviteVenue').forEach(function (el) {
      el.innerHTML = venueName + (venueAddress ? '<br>' + venueAddress : '');
    });

    // Update Venue Card on Template 2 if present
    var t2VCard = document.getElementById('venueMapCard');
    if (t2VCard && defaultMapUrl) t2VCard.href = defaultMapUrl;
    var t2VMap = document.getElementById('evtVenueMap');
    if (t2VMap && defaultMapUrl) t2VMap.href = defaultMapUrl;
    var t2VName = document.getElementById('evtVenueName');
    if (t2VName && venueName) t2VName.textContent = venueName.toUpperCase();
    var t2VAddr = document.getElementById('evtVenueAddress');
    if (t2VAddr && venueAddress) t2VAddr.textContent = venueAddress;

    // 5. Template-Specific Dynamic Events & Photos Handlers
    if (currentTemplateId === 'pichwai-palace' || currentTemplateId === 'deepthi-murali-pichwai') {
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

    // 6. Universal Countdown Timer Handler (Template 2, 10, 13)
    initCountdownTimer();
  }

  // Universal multi-format date parser
  function parseWeddingDateToTimestamp(dateStr, timeStr) {
    if (!dateStr || typeof dateStr !== 'string') return null;
    var raw = dateStr.trim();
    if (!raw) return null;

    var cleaned = raw.replace(/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)[,\s]+/i, '').trim()
                     .replace(/(\d+)(st|nd|rd|th)\b/gi, '$1').trim();

    var defaultHours = 19;
    var defaultMins = 0;

    var effectiveTime = (timeStr && typeof timeStr === 'string' && timeStr.trim()) ? timeStr.trim() : '';
    if (!effectiveTime) {
      var embeddedTimeMatch = cleaned.match(/(\d{1,2}):(\d{2})(?:\s*([ap]m))?/i);
      if (embeddedTimeMatch) effectiveTime = embeddedTimeMatch[0];
    }

    if (effectiveTime) {
      var timeMatch = effectiveTime.match(/(\d{1,2}):(\d{2})(?:\s*([ap]m))?/i);
      if (timeMatch) {
        var hrs = parseInt(timeMatch[1], 10);
        var mins = parseInt(timeMatch[2], 10);
        var ampm = (timeMatch[3] || '').toUpperCase();
        if (ampm === 'PM' && hrs < 12) hrs += 12;
        if (ampm === 'AM' && hrs === 12) hrs = 0;
        defaultHours = hrs;
        defaultMins = mins;
      }
    }

    // 1. ISO YYYY-MM-DD or YYYY/MM/DD
    var isoMatch = cleaned.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (isoMatch) {
      var dt = new Date(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10) - 1, parseInt(isoMatch[3], 10), defaultHours, defaultMins, 0);
      if (!isNaN(dt.getTime())) return dt.getTime();
    }

    // 2. DD Month YYYY
    var dmyMatch = cleaned.match(/^(\d{1,2})[\s\-]+([A-Za-z]+)[\s\-]+(\d{4})/);
    if (dmyMatch) {
      var mNames = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
      var mIdx = mNames.findIndex(function(mn){ return dmyMatch[2].toLowerCase().indexOf(mn) === 0; });
      if (mIdx !== -1) {
        var dt2 = new Date(parseInt(dmyMatch[3], 10), mIdx, parseInt(dmyMatch[1], 10), defaultHours, defaultMins, 0);
        if (!isNaN(dt2.getTime())) return dt2.getTime();
      }
    }

    // 3. Month DD, YYYY
    var mdyMatch = cleaned.match(/^([A-Za-z]+)[\s\-]+(\d{1,2})[,\s\-]+(\d{4})/);
    if (mdyMatch) {
      var mNames2 = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
      var mIdx2 = mNames2.findIndex(function(mn){ return mdyMatch[1].toLowerCase().indexOf(mn) === 0; });
      if (mIdx2 !== -1) {
        var dt3 = new Date(parseInt(mdyMatch[3], 10), mIdx2, parseInt(mdyMatch[2], 10), defaultHours, defaultMins, 0);
        if (!isNaN(dt3.getTime())) return dt3.getTime();
      }
    }

    // 4. DD-MM-YYYY or DD/MM/YYYY
    var numMatch = cleaned.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
    if (numMatch) {
      var p1 = parseInt(numMatch[1], 10);
      var p2 = parseInt(numMatch[2], 10);
      var pYear = parseInt(numMatch[3], 10);
      var day3 = p1;
      var month3 = p2 - 1;
      if (p1 <= 12 && p2 > 12) {
        day3 = p2;
        month3 = p1 - 1;
      }
      var dt4 = new Date(pYear, month3, day3, defaultHours, defaultMins, 0);
      if (!isNaN(dt4.getTime())) return dt4.getTime();
    }

    // 5. Fallback native parse
    try {
      var parsedNative = Date.parse(cleaned);
      if (!isNaN(parsedNative)) {
        var dObj = new Date(parsedNative);
        dObj.setHours(defaultHours, defaultMins, 0, 0);
        return dObj.getTime();
      }
    } catch (_) {}

    return null;
  }

  function resolveCountdownTarget(weddingDateStr, eventsList, preferredTime) {
    var now = Date.now();
    var candidates = [];

    if (weddingDateStr) {
      var ts = parseWeddingDateToTimestamp(weddingDateStr, preferredTime);
      if (ts) candidates.push(ts);
    }

    if (Array.isArray(eventsList)) {
      eventsList.forEach(function (e) {
        var d = e.date || e.d;
        var t = e.time || e.t || preferredTime;
        if (d) {
          var ts2 = parseWeddingDateToTimestamp(d, t);
          if (ts2) candidates.push(ts2);
        }
      });
    }

    // Filter future candidates
    var futureCandidates = candidates.filter(function (ts) { return ts > now; });
    if (futureCandidates.length > 0) {
      futureCandidates.sort(function (a, b) { return a - b; });
      return futureCandidates[0];
    }

    // If candidate dates exist but were in the past (e.g. demo template date or past year entered),
    // advance year into the future so countdown actively ticks
    for (var i = 0; i < candidates.length; i++) {
      var dObj = new Date(candidates[i]);
      while (dObj.getTime() <= now) {
        dObj.setFullYear(dObj.getFullYear() + 1);
      }
      if (dObj.getTime() > now) {
        return dObj.getTime();
      }
    }

    // Default future target (+30 days at 19:00:00) when creating a new form or if no date is set
    var defaultFuture = new Date();
    defaultFuture.setDate(defaultFuture.getDate() + 30);
    defaultFuture.setHours(19, 0, 0, 0);
    return defaultFuture.getTime();
  }

  function splitAddressParts(addressStr, venueName) {
    var raw = safeStr(addressStr, '');
    if (!raw) {
      return {
        street: safeStr(venueName, 'The Grand Ballroom'),
        city: 'Bengaluru, Karnataka'
      };
    }

    var parts = raw.split(',').map(function (p) { return p.trim(); }).filter(Boolean);
    if (parts.length === 1) {
      return {
        street: parts[0],
        city: 'Bengaluru, Karnataka'
      };
    }

    var splitIdx = -1;
    for (var i = 1; i < parts.length; i++) {
      if (/\b(bengaluru|bangalore|karnataka|chennai|hyderabad|mumbai|delhi|kerala|india|\d{6})\b/i.test(parts[i])) {
        splitIdx = i;
        break;
      }
    }

    if (splitIdx === -1) {
      splitIdx = Math.max(1, Math.floor(parts.length / 2));
    }

    var street = parts.slice(0, splitIdx).join(', ');
    var city = parts.slice(splitIdx).join(', ');

    return {
      street: street,
      city: city
    };
  }

  function initCountdownTimer() {
    var cdDays = document.getElementById('cdDays');
    if (!cdDays) return;
    var cdHours = document.getElementById('cdHours');
    var cdMins = document.getElementById('cdMins');
    var cdSecs = document.getElementById('cdSecs');

    var target = resolveCountdownTarget(weddingDate, events, weddingTime);

    // If Template 2 provides its own ticker hook, delegate to it to prevent dual interval fight
    if (typeof window.__updateTemplate2Countdown === 'function') {
      window.__updateTemplate2Countdown(target);
      return;
    }

    var pad = function(n) { return (n < 10 ? '0' : '') + Math.floor(n < 0 ? 0 : n); };

    function update() {
      var diff = Math.max(0, target - Date.now());
      var tot = Math.floor(diff / 1000);
      var d = Math.floor(tot / 86400);
      var h = Math.floor((tot % 86400) / 3600);
      var m = Math.floor((tot % 3600) / 60);
      var s = tot % 60;
      if (cdDays) cdDays.textContent = pad(d);
      if (cdHours) cdHours.textContent = pad(h);
      if (cdMins) cdMins.textContent = pad(m);
      if (cdSecs) cdSecs.textContent = pad(s);
    }
    if (window.__wowCdInterval) {
      clearInterval(window.__wowCdInterval);
    }
    update();
    window.__wowCdInterval = setInterval(update, 1000);
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

        var isMuhurtham = (ev.name || '').toLowerCase().indexOf('muhurtham') !== -1;
        var noteHtml = (isMuhurtham && !ev.desc) ? '<p class="event-note">(Dhanus Lagna)</p>' : '';
        var venueHtml = (ev.venue && ev.venue.trim().length > 0)
          ? `<p class="event-venue">${ev.venue}${ev.address ? '<br>' + ev.address : ''}</p>`
          : '';
        var mapBtnHtml = (ev.mapUrl || (ev.venue && ev.venue.trim().length > 0)) ? `
          <a href="${ev.mapUrl || getDirectionsUrl(ev.venue, ev.address, '')}" target="_blank" rel="noopener noreferrer" class="event-map-btn" style="display:inline-flex;align-items:center;gap:6px;margin-top:12px;padding:7px 16px;background:linear-gradient(135deg,#d4af37,#b8860b);color:#1b1406;border-radius:24px;font-size:11px;font-weight:700;text-decoration:none;box-shadow:0 4px 12px rgba(0,0,0,0.18);letter-spacing:0.5px;text-transform:uppercase;transition:transform 0.2s ease;">
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
                ${noteHtml}
                ${venueHtml}
                ${mapBtnHtml}
              </div>
            </div>
          </div>
        `;

        eventsList.appendChild(article);
      });

      // Synchronize dedicated venue interfaces for all functions
      applyTemplate2Venues();
    }

    var galSec = document.getElementById('gallery');
    var galNav = document.querySelector('a[href="#gallery"]');
    if (galSec) galSec.style.display = '';
    if (galNav && galNav.closest('li')) galNav.closest('li').style.display = '';

    // Call dynamic template2 gallery hook if ready
    if (typeof window.__updateTemplate2Gallery === 'function') {
      window.__updateTemplate2Gallery(photos);
    } else if (photos.length > 0) {
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

  function applyTemplate2Venues() {
    var venueSec = document.getElementById('venue');
    if (!venueSec) return;

    // Clean up any dynamic venue sections from previous runs
    document.querySelectorAll('.venue-section--dynamic').forEach(function(el) {
      el.remove();
    });

    // Gather distinct venue entries from events
    var venueList = [];
    if (Array.isArray(events) && events.length > 0) {
      events.forEach(function (ev, idx) {
        var vName = safeStr(ev.venue, '').trim();
        var vAddr = safeStr(ev.address, '').trim();
        var vMap = safeStr(ev.mapUrl, '').trim();
        if (vName || vAddr || vMap) {
          venueList.push({
            idx: idx,
            name: safeStr(ev.name, 'Function ' + (idx + 1)),
            venue: vName || venueName,
            address: vAddr || venueAddress,
            mapUrl: getDirectionsUrl(vName || venueName, vAddr || venueAddress, vMap)
          });
        }
      });
    }

    if (venueList.length === 0) {
      venueList = [{
        idx: 0,
        name: 'Wedding Ceremony & Reception',
        venue: venueName,
        address: venueAddress,
        mapUrl: defaultMapUrl
      }];
    }

    var isMultiVenue = venueList.length >= 2;

    function renderVenueCardHtml(v, index, total) {
      var addrParts = splitAddressParts(v.address, v.venue);
      var streetCaps = (addrParts.street || '').toUpperCase().replace(/,\s*/g, ' · ');
      var cityScript = addrParts.city || 'Bengaluru, Karnataka';
      var dirUrl = v.mapUrl || getDirectionsUrl(v.venue, v.address, '');

      return `
        <a class="venue-map-card" href="${dirUrl}" target="_blank" rel="noopener noreferrer" role="button" aria-label="Open Google Maps directions to ${v.venue}">
          <img src="images/venue-map.jpg" alt="Map view of ${v.venue}" class="venue-map-img" width="768" height="768" loading="lazy" decoding="async" draggable="false">
          
          <div class="map-pin-badge" aria-hidden="true">
            <div class="map-pin-pulse"></div>
            <div class="map-pin-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <span class="map-pin-label">${v.venue.toUpperCase()}</span>
          </div>

          <div class="map-card-vignette" aria-hidden="true"></div>

          <figcaption class="map-card-caption">
            <small>${streetCaps}</small>
            <strong class="map-card-script">${cityScript}</strong>
          </figcaption>
        </a>

        <div class="venue-address-block">
          <p class="venue-addr-street">${addrParts.street}</p>
          <p class="venue-addr-city">${addrParts.city}</p>
        </div>

        <a class="venue-directions-btn" href="${dirUrl}" target="_blank" rel="noopener noreferrer">
          Get directions <b>↗</b>
        </a>
      `;
    }

    function buildPillsHtml(activeIdx) {
      if (!isMultiVenue) return '';
      var pills = venueList.map(function (v, i) {
        var targetId = i === 0 ? 'venue' : ('venue-' + (i + 1));
        var cls = 'venue-pill' + (i === activeIdx ? ' is-active' : '');
        return `<a href="#${targetId}" class="${cls}" data-venue-target="${targetId}">${i + 1}. ${v.name} Venue</a>`;
      }).join('');
      return `<div class="venue-pills">${pills}</div>`;
    }

    // 1. Update Primary Venue Section (#venue)
    var v1 = venueList[0];
    var v1Eyebrow = venueSec.querySelector('.events-eyebrow') || document.getElementById('venueEyebrow');
    if (v1Eyebrow) {
      v1Eyebrow.textContent = isMultiVenue ? ('Location & Directions · ' + v1.name) : 'Location & Directions';
    }
    var v1Title = document.getElementById('venueTitle');
    if (v1Title) {
      v1Title.textContent = isMultiVenue ? (v1.name + ' Venue') : 'The Venue';
    }

    var v1PillContainer = venueSec.querySelector('.venue-pills-container');
    if (!v1PillContainer) {
      v1PillContainer = document.createElement('div');
      v1PillContainer.className = 'venue-pills-container';
      var header1 = venueSec.querySelector('.events-header');
      if (header1) header1.appendChild(v1PillContainer);
    }
    v1PillContainer.innerHTML = buildPillsHtml(0);

    var v1Card = document.getElementById('venueCard');
    if (v1Card) {
      v1Card.innerHTML = renderVenueCardHtml(v1, 0, venueList.length);
    }

    // 2. If multiple venues, create second (and further) full-screen dedicated venue sections
    var lastVenueEl = venueSec;
    for (var i = 1; i < venueList.length; i++) {
      var vi = venueList[i];
      var secId = 'venue-' + (i + 1);

      var newSec = document.createElement('section');
      newSec.className = 'section venue-section venue-section--dynamic reveal-item is-in';
      newSec.id = secId;
      newSec.setAttribute('aria-labelledby', 'venueTitle-' + (i + 1));

      newSec.innerHTML = `
        <div class="events-decor" aria-hidden="true">
          <img class="evt-decor evt-decor--jhoomer evt-decor--jhoomer-l" src="images/events/event_3.webp" alt="" decoding="async" loading="lazy" draggable="false">
          <img class="evt-decor evt-decor--jhoomer evt-decor--jhoomer-r" src="images/events/event_3.webp" alt="" decoding="async" loading="lazy" draggable="false">
          <img class="evt-decor evt-decor--chandelier evt-decor--chandelier-1" src="images/events/event_1.webp" alt="" decoding="async" loading="lazy" draggable="false">
          <img class="evt-decor evt-decor--chandelier evt-decor--chandelier-2" src="images/events/event_1.webp" alt="" decoding="async" loading="lazy" draggable="false">
          <img class="evt-decor evt-decor--nazar evt-decor--nazar-1" src="images/events/event_6.webp" alt="" decoding="async" loading="lazy" draggable="false">
          <img class="evt-decor evt-decor--nazar evt-decor--nazar-2" src="images/events/event_6.webp" alt="" decoding="async" loading="lazy" draggable="false">
          <img class="evt-decor evt-decor--peacock" src="images/events/event_4.webp" alt="" decoding="async" loading="lazy" draggable="false">
          <img class="evt-decor evt-decor--camel"   src="images/events/event_2.webp" alt="" decoding="async" loading="lazy" draggable="false">
          <img class="evt-decor evt-decor--horse"   src="images/events/event_5.webp" alt="" decoding="async" loading="lazy" draggable="false">
        </div>

        <div class="events-header">
          <p class="events-eyebrow">Location &amp; Directions · ${vi.name}</p>
          <h2 class="events-title" id="venueTitle-${i + 1}">${vi.name} Venue</h2>
          <img class="events-title-rule" src="images/events/border_4.webp" alt="" aria-hidden="true" decoding="async" draggable="false">
          <div class="venue-pills-container">${buildPillsHtml(i)}</div>
        </div>

        <div class="venue-card-wrapper venue-map-wrapper reveal-item is-in" id="venueCard-${i + 1}">
          ${renderVenueCardHtml(vi, i, venueList.length)}
        </div>
      `;

      lastVenueEl.parentNode.insertBefore(newSec, lastVenueEl.nextSibling);
      lastVenueEl = newSec;
    }

    // 3. Smooth scroll handling for all pills
    document.querySelectorAll('.venue-pill').forEach(function (pill) {
      pill.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = this.getAttribute('data-venue-target') || (this.getAttribute('href') || '').replace('#', '');
        var targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // 4. Update Navigation Menu in navPanel
    var navList = document.querySelector('.nav-menu');
    if (navList) {
      document.querySelectorAll('.nav-menu .dynamic-nav-venue').forEach(function (el) { el.remove(); });
      var baseVenueLink = navList.querySelector('a[href="#venue"]');
      if (baseVenueLink) {
        var baseLi = baseVenueLink.closest('li');
        if (isMultiVenue && baseLi) {
          baseVenueLink.querySelector('.nav-link-label').textContent = venueList[0].name + ' Venue';
          var refLi = baseLi;
          for (var j = 1; j < venueList.length; j++) {
            var newLi = document.createElement('li');
            newLi.className = 'dynamic-nav-venue';
            newLi.setAttribute('role', 'none');
            newLi.innerHTML = `<a class="nav-link" href="#venue-${j + 1}" role="menuitem"><span class="nav-link-label">${venueList[j].name} Venue</span></a>`;
            refLi.parentNode.insertBefore(newLi, refLi.nextSibling);
            refLi = newLi;
          }
        } else if (!isMultiVenue && baseVenueLink) {
          baseVenueLink.querySelector('.nav-link-label').textContent = 'Venue';
        }
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
    // Ensure invitation card shows ONLY date that user will enter, and NO venue
    var uDate = userEnteredDate || '';
    document.querySelectorAll('.inv-date').forEach(function(el) {
      if (uDate && uDate.trim()) {
        el.textContent = uDate.trim();
        el.style.display = '';
      } else {
        el.textContent = '';
        el.style.display = 'none';
      }
    });
    document.querySelectorAll('.inv-venue').forEach(function(el) {
      el.textContent = '';
      el.style.display = 'none';
    });

    // 1. Try native template09 event update hook
    var cleanEvents = (events || []).map(function(ev) {
      var vClean = cleanVenueName(ev.venue, ev.address);
      var dirUrl = getDirectionsUrl(ev.venue, ev.address, ev.mapUrl);
      return {
        id: ev.id,
        name: ev.name,
        date: ev.date,
        time: ev.time,
        venue: vClean,
        address: ev.address || '',
        desc: ev.desc || '',
        mapUrl: dirUrl,
        map: dirUrl
      };
    });

    if (typeof window.__updateTemplate09Events === 'function' && cleanEvents && cleanEvents.length > 0) {
      window.__updateTemplate09Events(cleanEvents);
    } else {
      var evtStops = document.getElementById('evtStops');
      if (evtStops && cleanEvents && cleanEvents.length > 0) {
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

        var mapPinSvg = `<svg width="12" height="15" viewBox="0 0 11 14" fill="none"
           xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:inline-block;vertical-align:middle;margin-right:5px;flex-shrink:0;">
        <path d="M5.5 0C2.46 0 0 2.46 0 5.5c0 4.12 5.5 8.5 5.5 8.5S11 9.62 11 5.5C11 2.46 8.54 0 5.5 0Z"
              fill="currentColor" opacity=".85"/>
        <circle cx="5.5" cy="5.5" r="2" fill="#fff" opacity=".95"/>
      </svg>`;

        cleanEvents.forEach(function (ev, idx) {
          var isLeft = idx % 2 === 0;
          var p = isLeft ? 'farman-left' : 'farman-right';
          var u = document.createElement('article');
          u.className = 'farman-stop ' + p + ' is-open is-unrolling';
          u.setAttribute('role', 'listitem');
          u.setAttribute('data-event', ev.id);
          u.setAttribute('data-farman-index', String(idx));

          var dirUrl = ev.mapUrl || getDirectionsUrl(ev.venue, ev.address, '');
          var mapHtml = `
            <a class="farman-map farman-directions-btn" href="${dirUrl}" target="_blank" rel="noopener noreferrer" aria-label="Get directions to ${ev.venue} on Google Maps" style="opacity:1!important;pointer-events:auto!important;">
               ${mapPinSvg}<span>Get Directions</span>
            </a>`;

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
                  <p class="farman-venue" style="opacity:1!important;">${ev.venue}</p>
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
        photos.slice(0, 4).forEach(function (src, idx) {
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
        if (currentFid) {
          var reqFid = store.get('form_' + currentFid);
          reqFid.onsuccess = function () {
            if (reqFid.result && Array.isArray(reqFid.result) && reqFid.result.length > 0) {
              applyNewPhotos(reqFid.result);
            }
          };
          return;
        }
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
    if (!newPhotos) return;
    photos = (newPhotos || []).filter(function (p) { return p && typeof p === 'string' && p.trim().length > 0; }).slice(0, 4);
    window.__CUSTOM_WEDDING_DATA__.photos = photos;
    if (typeof window.__WEDDING_CONFIG__ !== 'undefined' && window.__WEDDING_CONFIG__ && window.__WEDDING_CONFIG__.gallery) {
      window.__WEDDING_CONFIG__.gallery.photos = photos;
    }

    if (currentTemplateId === 'pichwai-palace') {
      var galSec = document.getElementById('gallery');
      var galNav = document.querySelector('a[href="#gallery"]');
      if (galSec) galSec.style.display = '';
      if (galNav && galNav.closest('li')) galNav.closest('li').style.display = '';
      if (typeof window.__updateTemplate2Gallery === 'function') {
        window.__updateTemplate2Gallery(photos);
      } else if (photos.length > 0) {
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
      var t09Gal = document.getElementById('gallery') || document.querySelector('.gallery-section');
      if (photos.length === 0) {
        if (t09Gal) t09Gal.style.display = 'none';
      } else {
        if (t09Gal) t09Gal.style.display = '';
      }
      if (typeof window.__updateTemplate09Gallery === 'function') {
        window.__updateTemplate09Gallery(photos);
      } else if (photos.length > 0) {
        var galWall = document.getElementById('galWall');
        if (galWall) {
          var galPhotos = galWall.querySelectorAll('.gal-photo');
          galPhotos.forEach(function(img, i) {
            if (photos[i]) img.src = photos[i];
          });
        }
      }
    } else if (currentTemplateId === 'champagne-luxury') {
      var t10Gal = document.getElementById('glGallery') || document.querySelector('.gl-section');
      if (photos.length === 0) {
        if (t10Gal) t10Gal.style.display = 'none';
      } else {
        if (t10Gal) t10Gal.style.display = '';
        var frameIds = ['glHero', 'glLeft', 'glRight', 'glBottom'];
        frameIds.forEach(function (fid, idx) {
          var frame = document.getElementById(fid);
          if (frame && photos[idx]) {
            var img = frame.querySelector('img');
            if (img) img.src = photos[idx];
          }
        });
      }
    } else if (currentTemplateId === 'kasavu-kerala') {
      var kasGal = document.getElementById('gallery') || document.querySelector('.gal-section');
      if (photos.length === 0) {
        if (kasGal) kasGal.style.display = 'none';
      } else {
        if (kasGal) kasGal.style.display = '';
        applyKasavuEventsAndGallery();
      }
    } else if (currentTemplateId === 'meenaya-temple-baroque') {
      var meeGal = document.getElementById('gallery') || document.querySelector('.gallery-section');
      if (photos.length === 0) {
        if (meeGal) meeGal.style.display = 'none';
      } else {
        if (meeGal) meeGal.style.display = '';
        applyMeenayaEventsAndGallery();
      }
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
