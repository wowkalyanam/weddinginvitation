import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Sparkles,
  Calendar,
  SlidersHorizontal,
  Eye,
  EyeOff,
  LayoutGrid,
  Lock,
  ArrowRight,
  ShieldCheck,
  Plus,
  Trash2,
  MapPin,
  Clock,
  Users,
  Image as ImageIcon,
  Upload,
  UploadCloud,
  RotateCcw,
  Loader2
} from 'lucide-react';

export interface WeddingEventItem {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  address?: string;
  mapUrl: string;
  desc?: string;
}

export interface TemplateFormData {
  bride: string;
  groom: string;
  brideParents: string;
  groomParents: string;
  date: string;
  time: string;
  functionName: string;
  venue: string;
  address: string;
  mapUrl: string;
  events: WeddingEventItem[];
  photos: string[];
}

interface TemplateItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  demoUrl: string;
  defaultData: TemplateFormData;
}

const DEFAULT_PHOTOS = [
  '/images/gallery/couple_1.webp',
  '/images/gallery/couple_2.webp',
  '/images/gallery/couple_3.webp',
  '/images/gallery/couple_4.webp',
  '/images/gallery/demo_1.webp',
  '/images/gallery/demo_2.webp'
];

const DEFAULT_EVENTS_PICHWAI: WeddingEventItem[] = [
  {
    id: 'evt-1',
    name: 'Wedding Ceremony & Reception',
    date: '',
    time: '07:00 PM',
    venue: 'The Grand Ballroom & Palace Grounds',
    address: 'Bengaluru, Karnataka',
    mapUrl: 'https://maps.google.com/?q=Bangalore',
    desc: 'An evening of celebration, musical feast, and dinner.'
  },
  {
    id: 'evt-2',
    name: 'Muhurtham & Kalyanam',
    date: '',
    time: '09:15 AM - 10:15 AM',
    venue: 'The Grand Ballroom & Palace Grounds',
    address: 'Bengaluru, Karnataka',
    mapUrl: 'https://maps.google.com/?q=Bangalore',
    desc: 'Between 9:15 AM & 10:15 AM (Dhanus Lagna) — Seven sacred steps into forever.'
  }
];

const DEFAULT_EVENTS_KASAVU: WeddingEventItem[] = [
  {
    id: 'evt-1',
    name: 'Reception',
    date: '13 December 2026',
    time: '07:00 PM',
    venue: 'The Grand Ballroom & Palace Grounds',
    address: 'Bengaluru, Karnataka',
    mapUrl: 'https://maps.google.com/?q=Bangalore',
    desc: 'An evening of celebration, musical feast, and dinner.'
  },
  {
    id: 'evt-2',
    name: 'Muhurtham & Kalyanam',
    date: '14 December 2026',
    time: '09:15 AM',
    venue: 'The Grand Ballroom & Palace Grounds',
    address: 'Bengaluru, Karnataka',
    mapUrl: 'https://maps.google.com/?q=Bangalore',
    desc: 'Sacred thali tying and blessings from elders.'
  }
];

// All Templates Catalog — Maintained in Separate, Independent Boxes
const TEMPLATES: TemplateItem[] = [
  {
    id: 'pichwai-palace',
    title: 'Royal Pichwai Palace',
    subtitle: 'Elephant Bell Intro · Courtyard Fountain · 3D Fan Events',
    badge: 'New Template',
    image: '/images/cards/pichwai-cover.webp',
    demoUrl: '/template2.html',
    defaultData: {
      bride: 'Deepthi',
      groom: 'Murali',
      brideParents: 'Shri. S. Ravi & Smt. R. Jyothilakshmi',
      groomParents: 'Shri. K. Muralidharan & Smt. M. Geetha',
      date: '',
      time: '07:00 PM',
      functionName: 'Wedding Ceremony & Reception',
      venue: 'The Grand Ballroom & Palace Grounds',
      address: 'Bengaluru, Karnataka',
      mapUrl: 'https://maps.google.com/?q=Bangalore',
      events: DEFAULT_EVENTS_PICHWAI,
      photos: DEFAULT_PHOTOS
    },
  },
  {
    id: 'kasavu-kerala',
    title: 'Kerala Kasavu Backwaters',
    subtitle: "God's Own Country · 3-Layer Parallax · Nilavilakku Ceremony",
    badge: 'Exclusive',
    image: '/images/cards/kasavu-cover.webp',
    demoUrl: '/kasavu.html',
    defaultData: {
      bride: 'Deepthi',
      groom: 'Murali',
      brideParents: 'Shri. S. Ravi & Smt. R. Jyothilakshmi',
      groomParents: 'Shri. K. Muralidharan & Smt. M. Geetha',
      date: '14 December 2026',
      time: '09:15 AM',
      functionName: 'Muhurtham & Kalyanam',
      venue: 'The Grand Ballroom & Palace Grounds',
      address: 'Bengaluru, Karnataka',
      mapUrl: 'https://maps.google.com/?q=Bangalore',
      events: DEFAULT_EVENTS_KASAVU,
      photos: DEFAULT_PHOTOS
    },
  },
  {
    id: 'champagne-luxury',
    title: 'Champagne Celebration & Vellum Luxury',
    subtitle: 'Interactive Champagne Pop · 3D Vellum Envelope · Floating Cupids & Love Letter',
    badge: 'Trending',
    image: '/templates/template10/assets/Hero/hero_poster.webp',
    demoUrl: '/template10.html',
    defaultData: {
      bride: 'Deepthi',
      groom: 'Murali',
      brideParents: 'Shri. S. Ravi & Smt. R. Jyothilakshmi',
      groomParents: 'Shri. K. Muralidharan & Smt. M. Geetha',
      date: '',
      time: '07:00 PM',
      functionName: 'Reception & Muhurtham',
      venue: 'The Grand Ballroom & Palace Grounds',
      address: 'Bengaluru, Karnataka',
      mapUrl: 'https://maps.google.com/?q=Bangalore',
      events: DEFAULT_EVENTS_PICHWAI,
      photos: DEFAULT_PHOTOS
    },
  },
  {
    id: 'meenaya-temple-baroque',
    title: 'Meenaya Traditional Temple & Baroque Heritage',
    subtitle: 'Meenakshi Gopuram · Classical Tanjore Ceremony Frames · Vintage Route Ship',
    badge: 'Royal Heritage',
    image: '/templates/meenaya2/assets/temple_gopuram_garden.png',
    demoUrl: '/meenaya2.html',
    defaultData: {
      bride: 'Deepthi',
      groom: 'Murali',
      brideParents: 'Shri. S. Ravi & Smt. R. Jyothilakshmi',
      groomParents: 'Shri. K. Muralidharan & Smt. M. Geetha',
      date: '',
      time: '07:00 PM',
      functionName: 'Reception & Muhurtham',
      venue: 'The Grand Ballroom & Palace Grounds',
      address: 'Bengaluru, Karnataka',
      mapUrl: 'https://maps.google.com/?q=Bangalore',
      events: DEFAULT_EVENTS_PICHWAI,
      photos: DEFAULT_PHOTOS
    },
  },
  {
    id: 'pichwai-lotus-courtyard',
    title: 'Royal Pichwai Lotus Courtyard',
    subtitle: 'Interactive Diya Rope Pull · Unrolling Farman Scrolls · Secret Garden & Fireworks',
    badge: 'New Template',
    image: '/templates/template09/assets/hero/pn-hro-bg-courtyard-lit-m-v03.webp',
    demoUrl: '/template09.html',
    defaultData: {
      bride: 'Deepthi',
      groom: 'Murali',
      brideParents: 'Shri. S. Ravi & Smt. R. Jyothilakshmi',
      groomParents: 'Shri. K. Muralidharan & Smt. M. Geetha',
      date: '',
      time: '07:00 PM',
      functionName: 'Reception & Muhurtham',
      venue: 'The Grand Ballroom & Palace Grounds',
      address: 'Bengaluru, Karnataka',
      mapUrl: 'https://maps.google.com/?q=Bangalore',
      events: DEFAULT_EVENTS_PICHWAI,
      photos: DEFAULT_PHOTOS
    },
  },
];

const DB_NAME = 'wow_wedding_db';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

function openPhotoDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve(null);
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = (e: any) => resolve(e.target.result);
      req.onerror = () => resolve(null);
    } catch (_) {
      resolve(null);
    }
  });
}

function savePhotosToStorage(templateId: string, photos: string[]) {
  if (!Array.isArray(photos) || photos.length === 0) return;

  // 1. SessionStorage
  try {
    sessionStorage.setItem('wow_photos_' + templateId, JSON.stringify(photos));
    sessionStorage.setItem('wow_photos_latest', JSON.stringify(photos));
  } catch (_) {}

  // 2. LocalStorage
  try {
    localStorage.setItem('wow_photos_' + templateId, JSON.stringify(photos));
    localStorage.setItem('wow_photos_latest', JSON.stringify(photos));
  } catch (_) {}

  // 3. IndexedDB (unlimited quota)
  openPhotoDB().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(photos, 'template_' + templateId);
      store.put(photos, 'latest');
    } catch (_) {}
  });
}

async function loadSavedPhotos(templateId: string): Promise<string[] | null> {
  // 1. SessionStorage
  try {
    const s = sessionStorage.getItem('wow_photos_' + templateId) || sessionStorage.getItem('wow_photos_latest');
    if (s) {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}

  // 2. LocalStorage
  try {
    const l = localStorage.getItem('wow_photos_' + templateId) || localStorage.getItem('wow_photos_latest');
    if (l) {
      const parsed = JSON.parse(l);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}

  // 3. IndexedDB
  const db = await openPhotoDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get('template_' + templateId);
      req.onsuccess = () => {
        if (req.result && Array.isArray(req.result) && req.result.length > 0) {
          resolve(req.result);
        } else {
          const reqLatest = store.get('latest');
          reqLatest.onsuccess = () => {
            resolve(reqLatest.result && Array.isArray(reqLatest.result) ? reqLatest.result : null);
          };
          reqLatest.onerror = () => resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch (_) {
      resolve(null);
    }
  });
}

function processImageFile(file: File, maxDim = 960, quality = 0.76): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function App() {
  // Password Protection for Home Page: 'WOW@775'
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('wow_home_authenticated') === 'true';
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [filterId, setFilterId] = useState<string>('all');
  const [activeModalTemplateId, setActiveModalTemplateId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessingPhotos, setIsProcessingPhotos] = useState<boolean>(false);
  const [photoMsg, setPhotoMsg] = useState<string>('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'WOW@775') {
      sessionStorage.setItem('wow_home_authenticated', 'true');
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please enter the valid access code.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem('wow_home_authenticated');
    setIsAuthenticated(false);
    setPasswordInput('');
    setPasswordError('');
  };

  // Separate, independent form state per template — ensuring data never mixes
  const [templateForms, setTemplateForms] = useState<Record<string, TemplateFormData>>(() => {
    const initial: Record<string, TemplateFormData> = {};
    if (typeof window !== 'undefined') {
      try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k && k.startsWith('wow_')) {
            const val = localStorage.getItem(k);
            if (val && (val.includes('Dharani') || val.includes('BWSSB') || val.includes('19 November') || val.includes('Malleshwaram'))) {
              localStorage.removeItem(k);
            }
          }
        }
        const activeS = sessionStorage.getItem('wow_active_custom_wedding');
        if (activeS && (activeS.includes('Dharani') || activeS.includes('BWSSB') || activeS.includes('19 November') || activeS.includes('Malleshwaram'))) {
          sessionStorage.removeItem('wow_active_custom_wedding');
        }
      } catch (_) {}
    }
    TEMPLATES.forEach((t) => {
      initial[t.id] = { ...t.defaultData };
      if (typeof window !== 'undefined') {
        try {
          const savedStr = localStorage.getItem('wow_custom_wedding_' + t.id);
          if (savedStr) {
            const parsed = JSON.parse(savedStr);
            // Check if this was the previous client's demo data (Dharani, Manu, BWSSB, 19 November)
            const isStale = (
              parsed.bride === 'Dharani' || 
              parsed.groom === 'Manu' || 
              (parsed.venue && parsed.venue.includes('BWSSB')) ||
              (parsed.date && parsed.date.includes('19 November')) ||
              (parsed.address && parsed.address.includes('Malleshwaram'))
            );
            if (!isStale) {
              initial[t.id] = { ...t.defaultData, ...parsed };
            } else {
              localStorage.removeItem('wow_custom_wedding_' + t.id);
            }
          }
        } catch (_) {}
      }
    });
    return initial;
  });

  const handleResetToDefaults = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    try {
      localStorage.removeItem('wow_custom_wedding_' + templateId);
      sessionStorage.removeItem('wow_active_custom_wedding');
    } catch (_) {}
    setTemplateForms((prev) => ({
      ...prev,
      [templateId]: { ...template.defaultData }
    }));
  };

  // Restore saved photos from IndexedDB / Storage on mount
  useEffect(() => {
    TEMPLATES.forEach(async (t) => {
      try {
        const savedPhotos = await loadSavedPhotos(t.id);
        if (savedPhotos && savedPhotos.length > 0) {
          setTemplateForms((prev) => {
            const cur = prev[t.id] || t.defaultData;
            return {
              ...prev,
              [t.id]: {
                ...cur,
                photos: savedPhotos
              }
            };
          });
        }
      } catch (_) {}
    });
  }, []);

  const activeTemplate = TEMPLATES.find((t) => t.id === activeModalTemplateId) || TEMPLATES[0];
  const activeFormData = templateForms[activeTemplate.id] || activeTemplate.defaultData;

  const updateFormData = (templateId: string, updates: Partial<TemplateFormData>) => {
    setTemplateForms((prev) => {
      const cur = prev[templateId] || TEMPLATES.find((t) => t.id === templateId)!.defaultData;
      const updated = { ...cur, ...updates };
      try {
        localStorage.setItem('wow_custom_wedding_' + templateId, JSON.stringify(updated));
        sessionStorage.setItem('wow_active_custom_wedding', JSON.stringify(updated));
      } catch (_) {}
      if (updates.photos) {
        savePhotosToStorage(templateId, updates.photos);
      }
      return {
        ...prev,
        [templateId]: updated,
      };
    });
  };

  const addEvent = (templateId: string) => {
    const cur = templateForms[templateId] || TEMPLATES.find((t) => t.id === templateId)!.defaultData;
    const count = (cur.events || []).length + 1;
    const newEvt: WeddingEventItem = {
      id: 'evt-' + Date.now(),
      name: count === 3 ? 'Sangeet & Cocktail' : (count === 4 ? 'Haldi Ceremony' : (count === 5 ? 'Mehendi Celebration' : 'Wedding Function ' + count)),
      date: cur.date || '13 December 2026',
      time: '06:30 PM onwards',
      venue: cur.venue || 'The Grand Ballroom & Palace Grounds',
      address: cur.address || 'Bengaluru, Karnataka',
      mapUrl: cur.mapUrl || 'https://maps.google.com/?q=The Grand Ballroom+Rajatha+Bhavan+Malleshwaram+Bangalore',
      desc: 'Music, joy, and heartfelt celebrations in presence of family.'
    };
    updateFormData(templateId, {
      events: [...(cur.events || []), newEvt]
    });
  };

  const updateEvent = (templateId: string, eventId: string, updates: Partial<WeddingEventItem>) => {
    const cur = templateForms[templateId] || TEMPLATES.find((t) => t.id === templateId)!.defaultData;
    const nextEvents = (cur.events || []).map((e) => (e.id === eventId ? { ...e, ...updates } : e));
    const extraUpdates: Partial<TemplateFormData> = { events: nextEvents };
    if (nextEvents[0] && nextEvents[0].id === eventId) {
      if (updates.date) extraUpdates.date = updates.date;
      if (updates.venue) extraUpdates.venue = updates.venue;
      if (updates.address !== undefined) extraUpdates.address = updates.address;
      if (updates.time) extraUpdates.time = updates.time;
      if (updates.mapUrl) extraUpdates.mapUrl = updates.mapUrl;
    }
    updateFormData(templateId, extraUpdates);
  };

  const removeEvent = (templateId: string, eventId: string) => {
    const cur = templateForms[templateId] || TEMPLATES.find((t) => t.id === templateId)!.defaultData;
    if ((cur.events || []).length <= 1) return;
    const nextEvents = (cur.events || []).filter((e) => e.id !== eventId);
    updateFormData(templateId, { events: nextEvents });
  };

  // Bulk Multi-File Upload: Pick up to 6 photos at once
  const handleBulkPhotosUpload = async (templateId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingPhotos(true);
    setPhotoMsg('Compressing photos...');
    try {
      const cur = templateForms[templateId] || TEMPLATES.find((t) => t.id === templateId)!.defaultData;
      const nextPhotos = [...(cur.photos || DEFAULT_PHOTOS)];
      const count = Math.min(files.length, 6);
      for (let i = 0; i < count; i++) {
        const file = files[i];
        if (file) {
          setPhotoMsg(`Processing photo ${i + 1} of ${count}...`);
          const dataUrl = await processImageFile(file);
          nextPhotos[i] = dataUrl;
        }
      }
      while (nextPhotos.length < 6) {
        nextPhotos.push(DEFAULT_PHOTOS[nextPhotos.length] || DEFAULT_PHOTOS[0]);
      }
      updateFormData(templateId, { photos: nextPhotos });
      savePhotosToStorage(templateId, nextPhotos);
      setPhotoMsg(`✓ ${count} photos uploaded and saved!`);
      setTimeout(() => setPhotoMsg(''), 3500);
    } catch (err) {
      console.error(err);
      setPhotoMsg('Error uploading photos. Please try again.');
      setTimeout(() => setPhotoMsg(''), 3500);
    } finally {
      setIsProcessingPhotos(false);
    }
  };

  // Single Slot Upload / Replace
  const handlePhotoUpload = async (templateId: string, index: number, file: File) => {
    if (!file) return;
    setIsProcessingPhotos(true);
    setPhotoMsg(`Processing photo #${index + 1}...`);
    try {
      const dataUrl = await processImageFile(file);
      const cur = templateForms[templateId] || TEMPLATES.find((t) => t.id === templateId)!.defaultData;
      const nextPhotos = [...(cur.photos || DEFAULT_PHOTOS)];
      nextPhotos[index] = dataUrl;
      while (nextPhotos.length < 6) {
        nextPhotos.push(DEFAULT_PHOTOS[nextPhotos.length] || DEFAULT_PHOTOS[0]);
      }
      updateFormData(templateId, { photos: nextPhotos });
      savePhotosToStorage(templateId, nextPhotos);
      setPhotoMsg(`✓ Photo #${index + 1} updated!`);
      setTimeout(() => setPhotoMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setPhotoMsg('Error processing photo.');
      setTimeout(() => setPhotoMsg(''), 3000);
    } finally {
      setIsProcessingPhotos(false);
    }
  };

  const handlePhotoUrlChange = (templateId: string, index: number, url: string) => {
    const cur = templateForms[templateId] || TEMPLATES.find((t) => t.id === templateId)!.defaultData;
    const nextPhotos = [...(cur.photos || DEFAULT_PHOTOS)];
    nextPhotos[index] = url;
    updateFormData(templateId, { photos: nextPhotos });
  };

  const handleResetPhoto = (templateId: string, index: number) => {
    const cur = templateForms[templateId] || TEMPLATES.find((t) => t.id === templateId)!.defaultData;
    const nextPhotos = [...(cur.photos || DEFAULT_PHOTOS)];
    nextPhotos[index] = DEFAULT_PHOTOS[index] || DEFAULT_PHOTOS[0];
    updateFormData(templateId, { photos: nextPhotos });
    savePhotosToStorage(templateId, nextPhotos);
    setPhotoMsg(`Reset Photo #${index + 1} to default`);
    setTimeout(() => setPhotoMsg(''), 2500);
  };

  const handleResetAllPhotos = (templateId: string) => {
    const reset = [...DEFAULT_PHOTOS];
    updateFormData(templateId, { photos: reset });
    savePhotosToStorage(templateId, reset);
    setPhotoMsg('All 6 photos reset to default');
    setTimeout(() => setPhotoMsg(''), 3000);
  };

  const generateInviteLink = (template: TemplateItem) => {
    const data = templateForms[template.id] || template.defaultData;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    try {
      localStorage.setItem('wow_custom_wedding_' + template.id, JSON.stringify(data));
      sessionStorage.setItem('wow_active_custom_wedding', JSON.stringify(data));
    } catch (_) {}

    const params = new URLSearchParams();
    if (data.bride) params.set('b', data.bride.trim());
    if (data.groom) params.set('g', data.groom.trim());
    if (data.brideParents) params.set('bp', data.brideParents.trim());
    if (data.groomParents) params.set('gp', data.groomParents.trim());
    if (data.date && data.date.trim()) params.set('d', data.date.trim());
    if (data.time) params.set('t', data.time.trim());
    if (data.venue) params.set('v', data.venue.trim());
    if (data.address) params.set('a', data.address.trim());
    if (data.mapUrl) params.set('m', data.mapUrl.trim());

    // Only serialize clean web URLs for photos to keep URL compact
    const webPhotos = (data.photos || []).filter((p) => !p.startsWith('data:'));
    const cfgPayload = {
      b: data.bride,
      g: data.groom,
      bp: data.brideParents,
      gp: data.groomParents,
      d: data.date,
      t: data.time,
      v: data.venue,
      a: data.address,
      m: data.mapUrl,
      ev: (data.events || []).map((e) => ({
        id: e.id,
        n: e.name,
        d: e.date,
        t: e.time,
        v: e.venue,
        a: e.address,
        m: e.mapUrl,
        s: e.desc
      })),
      ph: webPhotos.length > 0 ? webPhotos : undefined
    };

    params.set('cfg', encodeURIComponent(JSON.stringify(cfgPayload)));
    const queryString = params.toString();
    return queryString ? `${baseUrl}${template.demoUrl}?${queryString}` : `${baseUrl}${template.demoUrl}`;
  };

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const filteredTemplates = filterId === 'all' 
    ? TEMPLATES 
    : TEMPLATES.filter((t) => t.id === filterId);

  // ── PASSWORD GATE (Passcode: WOW@775) ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf9f6] text-neutral-900 font-sans flex flex-col justify-between selection:bg-neutral-900 selection:text-white relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[500px] h-[500px] bg-amber-100/50 rounded-full blur-3xl -translate-y-12"></div>
        </div>

        {/* Minimal Header */}
        <header className="w-full pt-8 pb-4 relative z-10">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 flex items-center justify-center">
            <img 
              src="/images/wow-kalyanam-logo.png" 
              alt="Wow Kalyanam" 
              className="h-14 sm:h-16 w-auto object-contain"
            />
          </div>
        </header>

        {/* Password Card */}
        <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
          <div className={`w-full max-w-md bg-white rounded-[28px] border border-neutral-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 sm:p-10 transition-transform ${isShaking ? 'animate-shake' : ''}`}>
            
            {/* Lock Badge */}
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-center mx-auto mb-6 text-amber-700 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center mb-7">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full inline-block mb-2.5">
                Protected Access
              </span>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Enter Password
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                Please enter the security password to view the Wow Kalyanam wedding invitation collection.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="Enter password"
                  autoFocus
                  className="w-full px-4 py-3.5 pr-11 text-sm bg-neutral-50/80 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 transition-all font-medium text-neutral-900 placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passwordError && (
                <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200/70 px-3.5 py-2 rounded-lg flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0"></span>
                  <span>{passwordError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
              >
                <span>Unlock Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
              <p className="text-[11px] text-neutral-400">
                Wow Kalyanam · Luxury Digital Wedding Invitations
              </p>
            </div>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="w-full pb-6 text-center text-xs text-neutral-400 relative z-10">
          © {new Date().getFullYear()} Wow Kalyanam. All rights reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900 font-sans flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      
      {/* ── HEADER ── */}
      <header className="w-full bg-[#faf9f6] pt-6 pb-4">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          
          {/* Wow Kalyanam Brand Logo */}
          <div className="flex items-center cursor-pointer hover:opacity-90 transition-opacity">
            <img 
              src="/images/wow-kalyanam-logo.png" 
              alt="Wow Kalyanam" 
              className="h-12 sm:h-16 w-auto object-contain"
            />
          </div>

          {/* Quick Header Badge & Lock Control */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-neutral-100 border border-neutral-200/80 px-4 py-2 rounded-full text-xs font-medium text-neutral-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{TEMPLATES.length} Exclusive Wedding Templates</span>
            </div>
            <button
              onClick={handleLock}
              title="Lock page session"
              className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200/80 px-3 py-2 rounded-full transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>

        {/* Notched Architectural Line */}
        <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-3">
          <div className="relative h-[10px] border-t border-neutral-300">
            <div className="absolute left-0 top-0 h-2.5 w-[1.5px] bg-neutral-400"></div>
            <div className="absolute right-0 top-0 h-2.5 w-[1.5px] bg-neutral-400"></div>
          </div>
        </div>
      </header>

      {/* ── MAIN CATALOG: SEPARATE BOXES FOR EACH TEMPLATE ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10">
        
        {/* Section Heading */}
        <div className="text-center mb-8 max-w-xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-200/60 px-3.5 py-1 rounded-full inline-block mb-2.5">
            Wedding Invitation Templates
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
            Curated Digital Wedding Cards
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
            Each template has its own separate design box. Click to preview or customize details to generate your guest link.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-neutral-200/60 p-1.5 rounded-full max-w-full">
          <button
            onClick={() => setFilterId('all')}
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              filterId === 'all'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Templates ({TEMPLATES.length})</span>
          </button>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterId(t.id)}
              className={`text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                filterId === t.id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* ── TEMPLATE BOXES GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-6xl w-full px-4 justify-items-center">
          {filteredTemplates.map((template) => {
            const data = templateForms[template.id] || template.defaultData;
            const isCustomPhoto = data.photos && data.photos.length > 0 && !DEFAULT_PHOTOS.includes(data.photos[0]);
            const cardCoverImage = isCustomPhoto ? data.photos[0] : template.image;

            return (
              <div 
                key={template.id} 
                className="flex flex-col items-center w-full max-w-[340px] bg-white p-4 pb-5 rounded-[32px] border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* ── CARD BOX ── */}
                <div
                  onClick={() => setActiveModalTemplateId(template.id)}
                  className="group relative cursor-pointer w-full aspect-[1/1.48] rounded-[24px] overflow-hidden bg-neutral-900 shadow-[0_16px_40px_rgba(0,0,0,0.16)] group-hover:shadow-[0_24px_55px_rgba(0,0,0,0.22)] transition-all duration-300 group-hover:scale-[1.01] border border-neutral-200 select-none"
                >
                  {/* Card Image */}
                  <img
                    src={cardCoverImage}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Subtle Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

                  {/* Card Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="bg-white/95 backdrop-blur-md text-neutral-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>{template.badge}</span>
                    </span>
                  </div>

                  {/* Custom Photo Indicator */}
                  {isCustomPhoto && (
                    <div className="absolute top-3.5 right-3.5 z-10">
                      <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Check className="w-3 h-3 text-white" />
                        <span>Photo Set</span>
                      </span>
                    </div>
                  )}

                  {/* Hover overlay hint */}
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform">
                      Click to Customize
                    </span>
                  </div>

                  {/* Bottom Card Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white z-10 pointer-events-none">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 block mb-0.5">
                      {template.title}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold leading-tight drop-shadow-sm">
                      {data.bride} &amp; {data.groom}
                    </h3>
                    <p className="text-[11px] text-neutral-200 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-amber-300 shrink-0" />
                      <span>{data.date}</span>
                    </p>
                  </div>
                </div>

                {/* Subtitle / Theme description */}
                <p className="text-[11px] text-neutral-500 text-center mt-3 px-1 line-clamp-1">
                  {template.subtitle}
                </p>

                {/* Separate Action Buttons Below Each Card Box */}
                <div className="flex items-center gap-2 mt-4 w-full">
                  <button
                    onClick={() => setActiveModalTemplateId(template.id)}
                    className="flex-1 bg-black hover:bg-neutral-800 text-white font-medium text-xs py-2.5 px-3 rounded-full transition-all active:scale-95 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Customize</span>
                  </button>

                  <a
                    href={generateInviteLink(template)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => savePhotosToStorage(template.id, data.photos)}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 font-medium text-xs py-2.5 px-3.5 rounded-full transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                    title="Preview Customized Invitation in New Tab"
                  >
                    <Eye className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Preview</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* ── MINIMAL FOOTER ── */}
      <footer className="w-full py-5 text-center text-xs text-neutral-400 border-t border-neutral-200/60 mt-10">
        <p>© {new Date().getFullYear()} Wow Kalyanam · Digital Wedding Invitations</p>
      </footer>

      {/* ── MODAL: CUSTOMIZE & GENERATE SHAREABLE LINK ── */}
      {activeModalTemplateId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveModalTemplateId(null)}
        >
          <div 
            className="bg-white rounded-[28px] max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-neutral-100 sticky top-0 bg-white/95 backdrop-blur-md z-20">
              <div className="flex items-center gap-3.5">
                <img 
                  src={activeTemplate.image} 
                  alt={activeTemplate.title} 
                  className="w-11 h-14 object-cover rounded-xl border border-neutral-200 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                      {activeTemplate.title}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mt-1">
                    Customize Wedding Details
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleResetToDefaults(activeTemplate.id)}
                  className="text-xs font-semibold text-neutral-600 hover:text-red-600 px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-red-200 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Reset this template's fields back to clean defaults"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-neutral-500 hover:text-red-600" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>
                <button
                  onClick={() => setActiveModalTemplateId(null)}
                  className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 space-y-7">
              
              {/* ── SECTION 1: COUPLE & PARENTS' NAMES ── */}
              <div className="space-y-4 bg-neutral-50/70 p-4 sm:p-5 rounded-2xl border border-neutral-200/80">
                <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm border-b border-neutral-200/70 pb-2.5">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>1. Couple &amp; Parents' Names</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Bride's Name
                    </label>
                    <input
                      type="text"
                      value={activeFormData.bride}
                      onChange={(e) => updateFormData(activeTemplate.id, { bride: e.target.value })}
                      placeholder="e.g. Deepthi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Groom's Name
                    </label>
                    <input
                      type="text"
                      value={activeFormData.groom}
                      onChange={(e) => updateFormData(activeTemplate.id, { groom: e.target.value })}
                      placeholder="e.g. Murali"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Bride's Parents (Father &amp; Mother)
                    </label>
                    <input
                      type="text"
                      value={activeFormData.brideParents}
                      onChange={(e) => updateFormData(activeTemplate.id, { brideParents: e.target.value })}
                      placeholder="e.g. Shri. S. Ravi & Smt. R. Jyothilakshmi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white font-medium"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">Appears on the ceremonial invitation card</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Groom's Parents (Father &amp; Mother)
                    </label>
                    <input
                      type="text"
                      value={activeFormData.groomParents}
                      onChange={(e) => updateFormData(activeTemplate.id, { groomParents: e.target.value })}
                      placeholder="e.g. Shri. K. Muralidharan & Smt. M. Geetha"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white font-medium"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">Appears on the ceremonial invitation card</p>
                  </div>
                </div>

                {/* Primary Wedding Date & Main Venue (Shown on Cover / Intro Screen) */}
                <div className="pt-2 border-t border-neutral-200/70 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Main Wedding Date &amp; Primary Venue (Front Cover / Opening Screen)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                        Primary Wedding Date
                      </label>
                      <input
                        type="text"
                        value={activeFormData.date}
                        onChange={(e) => {
                          const val = e.target.value;
                          const nextEvts = [...(activeFormData.events || [])];
                          if (nextEvts[0]) nextEvts[0] = { ...nextEvts[0], date: val };
                          updateFormData(activeTemplate.id, { date: val, events: nextEvts });
                        }}
                        placeholder="e.g. 13 December 2026"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                        Ceremony Time
                      </label>
                      <input
                        type="text"
                        value={activeFormData.time}
                        onChange={(e) => {
                          const val = e.target.value;
                          const nextEvts = [...(activeFormData.events || [])];
                          if (nextEvts[0]) nextEvts[0] = { ...nextEvts[0], time: val };
                          updateFormData(activeTemplate.id, { time: val, events: nextEvts });
                        }}
                        placeholder="e.g. 07:00 PM"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                        Main Venue Name
                      </label>
                      <input
                        type="text"
                        value={activeFormData.venue}
                        onChange={(e) => {
                          const val = e.target.value;
                          const nextEvts = [...(activeFormData.events || [])];
                          if (nextEvts[0]) nextEvts[0] = { ...nextEvts[0], venue: val };
                          updateFormData(activeTemplate.id, { venue: val, events: nextEvts });
                        }}
                        placeholder="e.g. The Grand Palace"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                        Venue City / Address
                      </label>
                      <input
                        type="text"
                        value={activeFormData.address}
                        onChange={(e) => {
                          const val = e.target.value;
                          const nextEvts = [...(activeFormData.events || [])];
                          if (nextEvts[0]) nextEvts[0] = { ...nextEvts[0], address: val };
                          updateFormData(activeTemplate.id, { address: val, events: nextEvts });
                        }}
                        placeholder="e.g. Palace Grounds, Bengaluru"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      <span>Main Venue Google Maps Link</span>
                    </label>
                    <input
                      type="text"
                      value={activeFormData.mapUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        const nextEvts = [...(activeFormData.events || [])];
                        if (nextEvts[0]) nextEvts[0] = { ...nextEvts[0], mapUrl: val };
                        updateFormData(activeTemplate.id, { mapUrl: val, events: nextEvts });
                      }}
                      placeholder="e.g. https://maps.google.com/?q=..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-xs font-mono bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* ── SECTION 2: WEDDING FUNCTIONS & EVENTS (DYNAMIC) ── */}
              <div className="space-y-4 bg-neutral-50/70 p-4 sm:p-5 rounded-2xl border border-neutral-200/80">
                <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2.5">
                  <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>2. Wedding Functions &amp; Ceremonies ({activeFormData.events?.length || 0})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => addEvent(activeTemplate.id)}
                    className="flex items-center gap-1.5 text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Function</span>
                  </button>
                </div>

                <p className="text-xs text-neutral-500 -mt-1">
                  Add all the wedding events you want (Reception, Muhurtham, Sangeet, Haldi, Mehendi, etc.). New event cards with timings and Google Map links will be dynamically generated on the invitation page.
                </p>

                {/* Event Cards List */}
                <div className="space-y-4 pt-1">
                  {activeFormData.events?.map((evt, idx) => (
                    <div 
                      key={evt.id}
                      className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-sm relative space-y-3"
                    >
                      {/* Event Card Header */}
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 flex items-center gap-1.5">
                          <span>Function #{idx + 1}:</span>
                          <span className="font-semibold text-neutral-800">{evt.name || 'Ceremony'}</span>
                        </span>

                        {activeFormData.events.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEvent(activeTemplate.id, evt.id)}
                            className="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Delete this function"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      {/* Function Name */}
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                          Function / Ceremony Name
                        </label>
                        <input
                          type="text"
                          value={evt.name}
                          onChange={(e) => updateEvent(activeTemplate.id, evt.id, { name: e.target.value })}
                          placeholder="e.g. Wedding Ceremony & Reception, Sangeet, Haldi, Mehendi"
                          className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                        />
                      </div>

                      {/* Date & Time */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-neutral-400" />
                            <span>Date</span>
                          </label>
                          <input
                            type="text"
                            value={evt.date}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateEvent(activeTemplate.id, evt.id, { date: val });
                              const lower = (evt.name || '').toLowerCase();
                              if (idx === 0 || lower.includes('reception')) {
                                updateFormData(activeTemplate.id, { date: val });
                              }
                            }}
                            placeholder="e.g. 13 December 2026"
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            <span>Timing</span>
                          </label>
                          <input
                            type="text"
                            value={evt.time}
                            onChange={(e) => updateEvent(activeTemplate.id, evt.id, { time: e.target.value })}
                            placeholder="e.g. 07:00 PM onwards"
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                          />
                        </div>
                      </div>

                      {/* Venue Name & Address */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                            Venue Name
                          </label>
                          <input
                            type="text"
                            value={evt.venue}
                            onChange={(e) => updateEvent(activeTemplate.id, evt.id, { venue: e.target.value })}
                            placeholder="e.g. The Grand Ballroom & Palace Grounds"
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                            Venue Address / City
                          </label>
                          <input
                            type="text"
                            value={evt.address || ''}
                            onChange={(e) => updateEvent(activeTemplate.id, evt.id, { address: e.target.value })}
                            placeholder="e.g. Bengaluru, Karnataka"
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                          />
                        </div>
                      </div>

                      {/* Google Maps Directions Link */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-600" />
                            <span>Google Maps Link for this function</span>
                          </label>
                          {evt.mapUrl && (
                            <a
                              href={evt.mapUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-amber-700 hover:text-amber-800 font-semibold underline flex items-center gap-0.5"
                            >
                              <span>Test Map Link</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                        <input
                          type="text"
                          value={evt.mapUrl}
                          onChange={(e) => updateEvent(activeTemplate.id, evt.id, { mapUrl: e.target.value })}
                          placeholder="Paste Google Maps directions link (e.g. https://maps.google.com/?q=...)"
                          className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-xs font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── SECTION 3: COUPLE PHOTO GALLERY (6 PHOTOS) ── */}
              <div className="space-y-4 bg-neutral-50/70 p-4 sm:p-5 rounded-2xl border border-neutral-200/80">
                <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2.5">
                  <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>3. Couple Photo Gallery (6 Photos)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {photoMsg && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 animate-in fade-in">
                        {isProcessingPhotos && <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />}
                        <span>{photoMsg}</span>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleResetAllPhotos(activeTemplate.id)}
                      className="text-[11px] text-neutral-500 hover:text-neutral-800 underline transition-colors cursor-pointer"
                      title="Reset all 6 photos to template defaults"
                    >
                      Reset All
                    </button>
                  </div>
                </div>

                {/* Prominent Multi-Photo Upload Banner */}
                <div className="bg-gradient-to-r from-amber-50/70 to-orange-50/70 p-4 rounded-xl border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-900">
                      <UploadCloud className="w-4 h-4 text-amber-700" />
                      <span>Upload All 6 Photos at Once</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 leading-tight">
                      Select up to 6 photos together from your device. They will automatically fill all 6 slots and appear on your invitation website immediately.
                    </p>
                  </div>

                  <label className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm shrink-0 active:scale-95">
                    {isProcessingPhotos ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Select 6 Photos</span>
                      </>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      disabled={isProcessingPhotos}
                      onClick={(e) => {
                        (e.target as HTMLInputElement).value = '';
                      }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleBulkPhotosUpload(activeTemplate.id, e.target.files);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* 6 Photo Slots Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 pt-1">
                  {(activeFormData.photos || DEFAULT_PHOTOS).slice(0, 6).map((photoSrc, idx) => {
                    const isCustom = !DEFAULT_PHOTOS.includes(photoSrc);
                    return (
                      <div 
                        key={idx}
                        className="bg-white p-3 rounded-xl border border-neutral-200 shadow-sm flex flex-col items-center space-y-2.5 relative group/card"
                      >
                        {/* Photo Thumbnail */}
                        <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 group">
                          <img 
                            src={photoSrc} 
                            alt={`Couple Photo ${idx + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                            <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Photo #{idx + 1}
                            </span>
                            {isCustom && (
                              <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" />
                                <span>Custom</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Upload / Replace Controls */}
                        <div className="w-full space-y-2">
                          <label className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-semibold py-1.5 px-2.5 rounded-lg border border-neutral-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-center active:scale-95">
                            <Upload className="w-3 h-3 text-neutral-600" />
                            <span>{isCustom ? 'Replace Photo' : 'Upload File'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isProcessingPhotos}
                              onClick={(e) => {
                                (e.target as HTMLInputElement).value = '';
                              }}
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handlePhotoUpload(activeTemplate.id, idx, f);
                              }}
                            />
                          </label>

                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={photoSrc.startsWith('data:') ? 'Custom uploaded photo' : photoSrc}
                              onChange={(e) => handlePhotoUrlChange(activeTemplate.id, idx, e.target.value)}
                              placeholder="Or paste URL"
                              className="w-full px-2 py-1 text-[10px] rounded-md border border-neutral-200 text-neutral-600 font-mono truncate focus:outline-none focus:ring-1 focus:ring-black"
                            />
                            <button
                              type="button"
                              onClick={() => handleResetPhoto(activeTemplate.id, idx)}
                              title="Reset to default photo"
                              className="p-1 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors shrink-0 cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-neutral-500 leading-tight">
                  💡 <strong>Tip:</strong> Photos you upload are saved locally on this browser and immediately appear across all template preview pages and galleries.
                </p>
              </div>

              {/* ── SECTION 4: GENERATED SHAREABLE LINK BOX ── */}
              <div className="bg-[#f5f5f4] p-4 sm:p-5 rounded-2xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-black" />
                    <span>Your Shareable Guest Link</span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Ready to send
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generateInviteLink(activeTemplate)}
                    className="flex-1 bg-white px-3 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-600 font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(generateInviteLink(activeTemplate))}
                    className="bg-black hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shrink-0 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-neutral-500">
                  Guests opening this link land <strong>directly on the full-screen invitation</strong> ({activeTemplate.title}) with customized parents' names, dynamic event cards, and photo gallery.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={generateInviteLink(activeTemplate)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-black hover:bg-neutral-800 text-white font-semibold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all text-center cursor-pointer"
                >
                  <span>Open &amp; Test Guest View</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setActiveModalTemplateId(null)}
                  className="px-6 py-3.5 rounded-xl border border-neutral-300 hover:border-black text-sm font-semibold text-neutral-700 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
