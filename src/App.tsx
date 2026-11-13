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
  Lock,
  ArrowRight,
  Plus,
  Trash2,
  MapPin,
  Clock,
  Users,
  Image as ImageIcon,
  Upload,
  UploadCloud,
  RotateCcw,
  Loader2,
  Layers,
  CopyPlus,
  Heart,
  CheckCircle2
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

export interface SavedInvitationForm {
  id: string;
  templateId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  data: TemplateFormData;
  link: string;
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

const DEFAULT_PHOTOS: string[] = [];

// Clean events without any hardcoded dates
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
      bride: 'Dharani',
      groom: 'Manu',
      brideParents: 'Smt. Jalajakshi V. and Ram Murthy N.',
      groomParents: 'Smt. Narasamma K.S. and Lakshmikanth S.K.',
      date: '19 November 2026',
      time: '07:00 PM',
      functionName: 'Reception & Muhurtham',
      venue: 'BWSSB Rajatha Bhavan',
      address: '8th, 19th Cross Rd, Malleshwaram, Bengaluru, Karnataka 560012',
      mapUrl: 'https://www.google.com/maps/dir//BWSSB+Rajatha+Bhavana,+8th,+19th+Cross+Rd,+Malleshwaram,+Bengaluru,+Karnataka+560012/@13.0279053,77.6405023,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3bae3d7fe2c5046b:0x7dc2af7faf8d611b!2m2!1d77.562176!2d13.0116862?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D',
      events: [
        {
          id: 'reception',
          name: 'Reception',
          date: '19 November 2026',
          time: '07:00 PM',
          venue: 'BWSSB Rajatha Bhavan',
          address: '8th, 19th Cross Rd, Malleshwaram, Bengaluru, Karnataka 560012',
          mapUrl: 'https://www.google.com/maps/dir//BWSSB+Rajatha+Bhavana,+8th,+19th+Cross+Rd,+Malleshwaram,+Bengaluru,+Karnataka+560012/@13.0279053,77.6405023,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3bae3d7fe2c5046b:0x7dc2af7faf8d611b!2m2!1d77.562176!2d13.0116862?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D',
          desc: 'An evening of celebration, musical feast, and dinner.'
        },
        {
          id: 'muhurtham',
          name: 'Muhurtham',
          date: '20 November 2026',
          time: 'Between 9:15 AM - 10:15 AM',
          venue: 'BWSSB Rajatha Bhavan',
          address: '8th, 19th Cross Rd, Malleshwaram, Bengaluru, Karnataka 560012',
          mapUrl: 'https://www.google.com/maps/dir//BWSSB+Rajatha+Bhavana,+8th,+19th+Cross+Rd,+Malleshwaram,+Bengaluru,+Karnataka+560012/@13.0279053,77.6405023,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3bae3d7fe2c5046b:0x7dc2af7faf8d611b!2m2!1d77.562176!2d13.0116862?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D',
          desc: 'Sacred thali tying and auspicious wedding rituals in presence of family and elders.'
        }
      ],
      photos: []
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
      date: '',
      time: '09:15 AM',
      functionName: 'Muhurtham & Kalyanam',
      venue: 'The Grand Ballroom & Palace Grounds',
      address: 'Bengaluru, Karnataka',
      mapUrl: 'https://maps.google.com/?q=Bangalore',
      events: DEFAULT_EVENTS_KASAVU,
      photos: []
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
      photos: []
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
      photos: []
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
      photos: []
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

function savePhotosToStorage(targetKey: string, photos: string[]) {
  if (!Array.isArray(photos) || photos.length === 0) return;

  try {
    sessionStorage.setItem('wow_photos_' + targetKey, JSON.stringify(photos));
    localStorage.setItem('wow_photos_' + targetKey, JSON.stringify(photos));
  } catch (_) {}

  openPhotoDB().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(photos, targetKey);
    } catch (_) {}
  });
}

async function loadSavedPhotos(targetKey: string): Promise<string[] | null> {
  try {
    const s = sessionStorage.getItem('wow_photos_' + targetKey);
    if (s) {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}

  try {
    const l = localStorage.getItem('wow_photos_' + targetKey);
    if (l) {
      const parsed = JSON.parse(l);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}

  const db = await openPhotoDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(targetKey);
      req.onsuccess = () => {
        if (req.result && Array.isArray(req.result) && req.result.length > 0) {
          resolve(req.result);
        } else {
          resolve(null);
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

export function generateInviteLink(formId: string, templateId: string, data: TemplateFormData): string {
  const template = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[4];
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const params = new URLSearchParams();
  if (formId) params.set('fid', formId);
  if (data.bride) params.set('b', data.bride.trim());
  if (data.groom) params.set('g', data.groom.trim());
  if (data.brideParents) params.set('bp', data.brideParents.trim());
  if (data.groomParents) params.set('gp', data.groomParents.trim());
  if (data.date && data.date.trim()) params.set('d', data.date.trim());
  if (data.time && data.time.trim()) params.set('t', data.time.trim());
  if (data.venue && data.venue.trim()) params.set('v', data.venue.trim());
  if (data.address && data.address.trim()) params.set('a', data.address.trim());
  if (data.mapUrl && data.mapUrl.trim()) params.set('m', data.mapUrl.trim());

  // Clean web URLs for photos
  const webPhotos = (data.photos || []).filter((p) => !p.startsWith('data:'));
  const cfgPayload = {
    fid: formId,
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
  return `${baseUrl}${template.demoUrl}?${params.toString()}`;
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

  // Filter Catalog
  const [filterId, setFilterId] = useState<string>('all');

  // Multi-Form Storage State
  const [savedForms, setSavedForms] = useState<SavedInvitationForm[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedStr = localStorage.getItem('wow_saved_invitations');
      if (savedStr) {
        const parsed = JSON.parse(savedStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((f) => f && f.data);
        }
      }
    } catch (_) {}

    // Initialize with Dharani & Manu (Royal Pichwai Palace) + 1 template09 form
    const t2 = TEMPLATES[0]; // Royal Pichwai Palace
    const t2Id = 'inv_dharani_manu';
    const t2Data: TemplateFormData = { ...t2.defaultData };
    const t2Link = generateInviteLink(t2Id, t2.id, t2Data);
    const t2Form: SavedInvitationForm = {
      id: t2Id,
      templateId: t2.id,
      title: 'Dharani & Manu',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      data: t2Data,
      link: t2Link
    };

    const defT = TEMPLATES[4]; // Royal Pichwai Lotus Courtyard
    const defId = 'inv_default';
    const defData: TemplateFormData = {
      ...defT.defaultData,
      date: '', // No custom date!
      events: defT.defaultData.events.map((e) => ({ ...e, date: '' }))
    };
    const defLink = generateInviteLink(defId, defT.id, defData);
    const defForm: SavedInvitationForm = {
      id: defId,
      templateId: defT.id,
      title: 'Deepthi & Murali',
      createdAt: Date.now() - 1000,
      updatedAt: Date.now() - 1000,
      data: defData,
      link: defLink
    };

    try {
      localStorage.setItem('wow_form_' + t2Id, JSON.stringify(t2Data));
      localStorage.setItem('wow_form_' + defId, JSON.stringify(defData));
      localStorage.setItem('wow_saved_invitations', JSON.stringify([t2Form, defForm]));
    } catch (_) {}
    return [t2Form, defForm];
  });

  // Modal Editing State
  const [activeModalFormId, setActiveModalFormId] = useState<string | null>(null);
  const [activeFormTemplateId, setActiveFormTemplateId] = useState<string>('pichwai-lotus-courtyard');
  const [activeFormData, setActiveFormData] = useState<TemplateFormData>(() => ({
    ...TEMPLATES[4].defaultData,
    date: '',
    events: TEMPLATES[4].defaultData.events.map((e) => ({ ...e, date: '' }))
  }));

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isProcessingPhotos, setIsProcessingPhotos] = useState<boolean>(false);
  const [photoMsg, setPhotoMsg] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

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

  // Restore photos for active form if stored in IndexedDB
  useEffect(() => {
    if (!activeModalFormId) return;
    loadSavedPhotos('form_' + activeModalFormId).then((photos) => {
      if (photos && photos.length > 0) {
        setActiveFormData((prev) => ({
          ...prev,
          photos
        }));
      }
    });
  }, [activeModalFormId]);

  // Save changes to current form
  const saveFormChanges = (formId: string, templateId: string, data: TemplateFormData) => {
    try {
      localStorage.setItem('wow_form_' + formId, JSON.stringify(data));
      if (data.photos && data.photos.length > 0) {
        localStorage.setItem('wow_photos_form_' + formId, JSON.stringify(data.photos));
        savePhotosToStorage('form_' + formId, data.photos);
      }
    } catch (_) {}

    const link = generateInviteLink(formId, templateId, data);
    const title = (data.bride && data.groom) ? `${data.bride} & ${data.groom}` : (data.bride || data.groom || 'Wedding Invitation');

    setSavedForms((prev) => {
      const idx = prev.findIndex((f) => f.id === formId);
      let next: SavedInvitationForm[];
      if (idx !== -1) {
        next = [...prev];
        next[idx] = {
          ...next[idx],
          templateId,
          title,
          updatedAt: Date.now(),
          data: { ...data },
          link
        };
      } else {
        const newForm: SavedInvitationForm = {
          id: formId,
          templateId,
          title,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          data: { ...data },
          link
        };
        next = [newForm, ...prev];
      }
      try {
        localStorage.setItem('wow_saved_invitations', JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    return link;
  };

  const updateActiveFormData = (updates: Partial<TemplateFormData>) => {
    if (!activeModalFormId) return;
    setActiveFormData((prev) => {
      const updated = { ...prev, ...updates };
      saveFormChanges(activeModalFormId, activeFormTemplateId, updated);
      return updated;
    });
  };

  // 1. Create a brand new form (blank dates, fresh ID)
  const handleCreateNewForm = (preferredTemplateId?: string) => {
    const tId = preferredTemplateId || 'pichwai-lotus-courtyard';
    const template = TEMPLATES.find((t) => t.id === tId) || TEMPLATES[4];
    const newId = 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

    const freshData: TemplateFormData = {
      bride: '',
      groom: '',
      brideParents: '',
      groomParents: '',
      date: '', // NO CUSTOM DATE! User enters it
      time: '07:00 PM',
      functionName: 'Wedding Ceremony & Reception',
      venue: '',
      address: '',
      mapUrl: '',
      events: [
        {
          id: 'evt-1',
          name: 'Wedding Ceremony & Reception',
          date: '', // NO CUSTOM DATE
          time: '07:00 PM',
          venue: '',
          address: '',
          mapUrl: '',
          desc: 'An evening of celebration, musical feast, and dinner.'
        }
      ],
      photos: [...DEFAULT_PHOTOS]
    };

    setActiveModalFormId(newId);
    setActiveFormTemplateId(tId);
    setActiveFormData(freshData);
    saveFormChanges(newId, tId, freshData);
    setSaveSuccessMsg('New blank form created! Fill in your wedding details.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // 2. Edit an existing saved form
  const handleEditSavedForm = (form: SavedInvitationForm) => {
    setActiveModalFormId(form.id);
    setActiveFormTemplateId(form.templateId);
    setActiveFormData(JSON.parse(JSON.stringify(form.data)));
    setSaveSuccessMsg('');
  };

  // 3. Duplicate a form
  const handleDuplicateForm = (form: SavedInvitationForm) => {
    const newId = 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const clonedData: TemplateFormData = JSON.parse(JSON.stringify(form.data));
    const newTitle = form.title + ' (Copy)';
    const link = generateInviteLink(newId, form.templateId, clonedData);

    const newForm: SavedInvitationForm = {
      id: newId,
      templateId: form.templateId,
      title: newTitle,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      data: clonedData,
      link
    };

    try {
      localStorage.setItem('wow_form_' + newId, JSON.stringify(clonedData));
      if (clonedData.photos && clonedData.photos.length > 0) {
        localStorage.setItem('wow_photos_form_' + newId, JSON.stringify(clonedData.photos));
        savePhotosToStorage('form_' + newId, clonedData.photos);
      }
    } catch (_) {}

    setSavedForms((prev) => {
      const next = [newForm, ...prev];
      try {
        localStorage.setItem('wow_saved_invitations', JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    setSaveSuccessMsg(`✓ Duplicated! Created form #${newId}`);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // 4. Delete a form
  const handleDeleteSavedForm = (formId: string) => {
    if (savedForms.length <= 1) {
      if (!window.confirm('This is your last remaining form. Delete it and create a fresh clean form?')) return;
    } else {
      if (!window.confirm('Are you sure you want to delete this invitation form? This cannot be undone.')) return;
    }

    setSavedForms((prev) => {
      const next = prev.filter((f) => f.id !== formId);
      try {
        localStorage.setItem('wow_saved_invitations', JSON.stringify(next));
        localStorage.removeItem('wow_form_' + formId);
        localStorage.removeItem('wow_photos_form_' + formId);
      } catch (_) {}
      return next;
    });

    if (activeModalFormId === formId) {
      setActiveModalFormId(null);
    }
  };

  // Events management
  const addEvent = () => {
    const count = (activeFormData.events || []).length + 1;
    const newEvt: WeddingEventItem = {
      id: 'evt-' + Date.now(),
      name: count === 2 ? 'Muhurtham & Kalyanam' : (count === 3 ? 'Sangeet & Cocktail' : (count === 4 ? 'Haldi Ceremony' : 'Wedding Function ' + count)),
      date: activeFormData.date || '', // NO CUSTOM FALLBACK DATE!
      time: '06:30 PM onwards',
      venue: activeFormData.venue || '',
      address: activeFormData.address || '',
      mapUrl: activeFormData.mapUrl || '',
      desc: 'Music, joy, and heartfelt celebrations in presence of family.'
    };
    updateActiveFormData({
      events: [...(activeFormData.events || []), newEvt]
    });
  };

  const updateEvent = (eventId: string, updates: Partial<WeddingEventItem>) => {
    const nextEvents = (activeFormData.events || []).map((e) => (e.id === eventId ? { ...e, ...updates } : e));
    const extraUpdates: Partial<TemplateFormData> = { events: nextEvents };
    if (nextEvents[0] && nextEvents[0].id === eventId) {
      if (updates.date !== undefined) extraUpdates.date = updates.date;
      if (updates.venue) extraUpdates.venue = updates.venue;
      if (updates.address !== undefined) extraUpdates.address = updates.address;
      if (updates.time) extraUpdates.time = updates.time;
      if (updates.mapUrl) extraUpdates.mapUrl = updates.mapUrl;
    }
    updateActiveFormData(extraUpdates);
  };

  const removeEvent = (eventId: string) => {
    if ((activeFormData.events || []).length <= 1) return;
    const nextEvents = (activeFormData.events || []).filter((e) => e.id !== eventId);
    updateActiveFormData({ events: nextEvents });
  };

  // Bulk Photos Upload for active form
  const handleBulkPhotosUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !activeModalFormId) return;
    setIsProcessingPhotos(true);
    setPhotoMsg('Compressing photos...');
    try {
      const nextPhotos = [...(activeFormData.photos || [])];
      const count = Math.min(files.length, 4);
      for (let i = 0; i < count; i++) {
        const file = files[i];
        if (file) {
          setPhotoMsg(`Processing photo ${i + 1} of ${count}...`);
          const dataUrl = await processImageFile(file);
          nextPhotos[i] = dataUrl;
        }
      }
      const finalPhotos = nextPhotos.slice(0, 4);
      updateActiveFormData({ photos: finalPhotos });
      setPhotoMsg(`✓ ${count} photo${count === 1 ? '' : 's'} saved to this form!`);
      setTimeout(() => setPhotoMsg(''), 3500);
    } catch (err) {
      console.error(err);
      setPhotoMsg('Error uploading photos.');
      setTimeout(() => setPhotoMsg(''), 3500);
    } finally {
      setIsProcessingPhotos(false);
    }
  };

  const handlePhotoUpload = async (index: number, file: File) => {
    if (!file || !activeModalFormId) return;
    setIsProcessingPhotos(true);
    setPhotoMsg(`Processing photo #${index + 1}...`);
    try {
      const dataUrl = await processImageFile(file);
      const nextPhotos = [...(activeFormData.photos || [])];
      nextPhotos[index] = dataUrl;
      const finalPhotos = nextPhotos.slice(0, 4);
      updateActiveFormData({ photos: finalPhotos });
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

  const handlePhotoUrlChange = (index: number, url: string) => {
    const nextPhotos = [...(activeFormData.photos || [])];
    nextPhotos[index] = url;
    updateActiveFormData({ photos: nextPhotos });
  };

  const handleRemovePhoto = (index: number) => {
    const nextPhotos = [...(activeFormData.photos || [])];
    nextPhotos[index] = '';
    updateActiveFormData({ photos: nextPhotos });
    setPhotoMsg(`Removed Photo #${index + 1}`);
    setTimeout(() => setPhotoMsg(''), 2500);
  };

  const handleClearAllPhotos = () => {
    updateActiveFormData({ photos: [] });
    setPhotoMsg('All photos cleared');
    setTimeout(() => setPhotoMsg(''), 2500);
  };

  const handleCopyLink = (linkStr: string, id: string) => {
    navigator.clipboard.writeText(linkStr);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const activeTemplate = TEMPLATES.find((t) => t.id === activeFormTemplateId) || TEMPLATES[4];
  const currentFormLink = activeModalFormId ? generateInviteLink(activeModalFormId, activeFormTemplateId, activeFormData) : '';

  const filteredTemplates = filterId === 'all' 
    ? TEMPLATES 
    : TEMPLATES.filter((t) => t.id === filterId);

  // ── PASSWORD GATE (Passcode: WOW@775) ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf9f6] text-neutral-900 font-sans flex flex-col justify-between selection:bg-neutral-900 selection:text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[500px] h-[500px] bg-amber-100/50 rounded-full blur-3xl -translate-y-12"></div>
        </div>

        <header className="w-full pt-8 pb-4 relative z-10">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 flex items-center justify-center">
            <img 
              src="/images/wow-kalyanam-logo.png" 
              alt="Wow Kalyanam" 
              className="h-14 sm:h-16 w-auto object-contain"
            />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
          <div className={`w-full max-w-md bg-white rounded-[28px] border border-neutral-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 sm:p-10 transition-transform ${isShaking ? 'animate-shake' : ''}`}>
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
                  {showPassword ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4 opacity-50" />}
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

        <footer className="w-full pb-6 text-center text-xs text-neutral-400 relative z-10">
          © {new Date().getFullYear()} Wow Kalyanam. All rights reserved.
        </footer>
      </div>
    );
  }

  // ── MAIN APPLICATION VIEW ──
  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#faf9f6]/90 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/images/wow-kalyanam-logo.png" 
              alt="Wow Kalyanam" 
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleCreateNewForm()}
              className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Create New Form</span>
            </button>

            <button
              onClick={handleLock}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Lock and sign out"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-10">

        {/* ── SECTION 1: CREATED INVITATIONS MANAGER ── */}
        <section className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-800">
                  <Layers className="w-4 h-4" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                  Created Invitations
                </h2>
                <span className="text-xs font-bold bg-amber-100/80 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-full">
                  {savedForms.length} Form{savedForms.length === 1 ? '' : 's'} Created &amp; Saved
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Each invitation is saved independently with its own permanent link. Creating or editing one form <strong>will never alter</strong> your other invitations.
              </p>
            </div>

            <button
              onClick={() => handleCreateNewForm()}
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>+ Create Another Form</span>
            </button>
          </div>

          {/* List of Created Forms */}
          {savedForms.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-neutral-50 border border-dashed border-neutral-300">
              <p className="text-sm font-medium text-neutral-600">No invitations created yet.</p>
              <p className="text-xs text-neutral-400 mt-1">Click "+ Create Another Form" above or choose a template below to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedForms.map((form, index) => {
                const tInfo = TEMPLATES.find((t) => t.id === form.templateId) || TEMPLATES[4];
                const isCopied = copiedId === form.id;
                return (
                  <div 
                    key={form.id}
                    className="bg-[#faf9f6] rounded-2xl border border-neutral-200 p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-neutral-300 transition-all hover:shadow-sm"
                  >
                    <div className="space-y-2.5">
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider">
                          {tInfo.title}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          #{form.id.slice(-6)}
                        </span>
                      </div>

                      {/* Couple Names */}
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-neutral-900 leading-tight">
                          {form.data.bride || form.data.groom 
                            ? `${form.data.bride} & ${form.data.groom}`
                            : 'Untitled Wedding Form'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-neutral-400" />
                            <span>{form.data.date ? form.data.date : 'No date set'}</span>
                          </span>
                          <span className="text-neutral-300">•</span>
                          <span>{form.data.events?.length || 0} event{(form.data.events?.length || 0) === 1 ? '' : 's'}</span>
                        </div>
                      </div>

                      {form.data.venue && (
                        <p className="text-xs text-neutral-600 line-clamp-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span>{form.data.venue}</span>
                        </p>
                      )}
                    </div>

                    {/* Guest Link Box */}
                    <div className="space-y-2 pt-2 border-t border-neutral-200/70">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          readOnly
                          value={form.link}
                          className="flex-1 bg-white px-2.5 py-1.5 rounded-lg border border-neutral-200 text-[11px] text-neutral-600 font-mono select-all focus:outline-none truncate"
                        />
                        <button
                          onClick={() => handleCopyLink(form.link, form.id)}
                          className="bg-neutral-900 hover:bg-neutral-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shrink-0 cursor-pointer"
                          title="Copy Link"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-[10px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span className="text-[10px]">Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between gap-1.5 pt-1">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={form.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-neutral-700 hover:text-black bg-white hover:bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Preview</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleEditSavedForm(form)}
                            className="text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <SlidersHorizontal className="w-3 h-3" />
                            <span>Edit Form</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDuplicateForm(form)}
                            className="p-1 text-neutral-400 hover:text-neutral-700 rounded hover:bg-neutral-200 transition-colors cursor-pointer"
                            title="Duplicate this form"
                          >
                            <CopyPlus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSavedForm(form.id)}
                            className="p-1 text-rose-400 hover:text-rose-700 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete this form"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── SECTION 2: LUXURY TEMPLATES CATALOG ── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                Design Collection
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-0.5">
                Luxury Invitation Templates
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Select any luxury invitation design to create a new form for your client.
              </p>
            </div>

            {/* Template category filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setFilterId('all')}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
                  filterId === 'all'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                All (5)
              </button>
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFilterId(t.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                    filterId === t.id
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {t.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredTemplates.map((template) => {
              return (
                <div 
                  key={template.id}
                  className="group bg-white rounded-[26px] border border-neutral-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-3 sm:p-3.5 flex flex-col justify-between"
                >
                  {/* Card Visual / Thumbnail */}
                  <div 
                    onClick={() => handleCreateNewForm(template.id)}
                    className="aspect-[9/14] w-full rounded-2xl overflow-hidden relative cursor-pointer bg-neutral-100"
                  >
                    <img 
                      src={template.image} 
                      alt={template.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                    {/* Badge */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="bg-white/95 backdrop-blur-md text-neutral-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{template.badge}</span>
                      </span>
                    </div>

                    {/* Overlay info */}
                    <div className="absolute bottom-4 left-4 right-4 text-white z-10 pointer-events-none">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 block mb-0.5">
                        {template.title}
                      </span>
                      <p className="text-xs text-neutral-200 line-clamp-2">
                        {template.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Actions under each template */}
                  <div className="flex items-center gap-2 mt-3.5">
                    <button
                      onClick={() => handleCreateNewForm(template.id)}
                      className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs py-2.5 px-3 rounded-xl transition-all active:scale-95 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Create Form</span>
                    </button>

                    <a
                      href={template.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 font-medium text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                      title="Preview Template Demo"
                    >
                      <Eye className="w-3.5 h-3.5 text-neutral-600" />
                      <span>Demo</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="w-full py-6 text-center text-xs text-neutral-400 border-t border-neutral-200/60 mt-12">
        <p>© {new Date().getFullYear()} Wow Kalyanam · Digital Wedding Invitations</p>
      </footer>

      {/* ── MODAL: CUSTOMIZE WEDDING INVITATION FORM ── */}
      {activeModalFormId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveModalFormId(null)}
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
                    <span className="text-[10px] text-neutral-400 font-mono">
                      Form #{activeModalFormId.slice(-6)}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mt-0.5">
                    {activeFormData.bride && activeFormData.groom
                      ? `${activeFormData.bride} & ${activeFormData.groom}`
                      : 'Customize Wedding Details'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {saveSuccessMsg && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{saveSuccessMsg}</span>
                  </span>
                )}
                <button
                  onClick={() => setActiveModalFormId(null)}
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
                      onChange={(e) => updateActiveFormData({ bride: e.target.value })}
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
                      onChange={(e) => updateActiveFormData({ groom: e.target.value })}
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
                      onChange={(e) => updateActiveFormData({ brideParents: e.target.value })}
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
                      onChange={(e) => updateActiveFormData({ groomParents: e.target.value })}
                      placeholder="e.g. Shri. K. Muralidharan & Smt. M. Geetha"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white font-medium"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">Appears on the ceremonial invitation card</p>
                  </div>
                </div>

                {/* Primary Wedding Date & Main Venue */}
                <div className="pt-2 border-t border-neutral-200/70 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Primary Wedding Date &amp; Main Venue</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                        Primary Wedding Date (User Entered Only)
                      </label>
                      <input
                        type="text"
                        value={activeFormData.date}
                        onChange={(e) => {
                          const val = e.target.value;
                          const nextEvts = [...(activeFormData.events || [])];
                          if (nextEvts[0]) nextEvts[0] = { ...nextEvts[0], date: val };
                          updateActiveFormData({ date: val, events: nextEvts });
                        }}
                        placeholder="e.g. 06 December 2026 (or leave empty)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white font-medium"
                      />
                      <p className="text-[10px] text-neutral-500 mt-1">If left empty, no old or default date will be shown.</p>
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
                          updateActiveFormData({ time: val, events: nextEvts });
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
                          updateActiveFormData({ venue: val, events: nextEvts });
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
                          updateActiveFormData({ address: val, events: nextEvts });
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
                        updateActiveFormData({ mapUrl: val, events: nextEvts });
                      }}
                      placeholder="e.g. https://maps.google.com/?q=..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-xs font-mono bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* ── SECTION 2: WEDDING FUNCTIONS & EVENTS ── */}
              <div className="space-y-4 bg-neutral-50/70 p-4 sm:p-5 rounded-2xl border border-neutral-200/80">
                <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2.5">
                  <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>2. Wedding Functions &amp; Ceremonies ({activeFormData.events?.length || 0})</span>
                  </div>
                  <button
                    type="button"
                    onClick={addEvent}
                    className="flex items-center gap-1.5 text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Function</span>
                  </button>
                </div>

                <div className="space-y-4 pt-1">
                  {activeFormData.events?.map((evt, idx) => (
                    <div 
                      key={evt.id}
                      className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-sm relative space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 flex items-center gap-1.5">
                          <span>Function #{idx + 1}:</span>
                          <span className="font-semibold text-neutral-800">{evt.name || 'Ceremony'}</span>
                        </span>

                        {activeFormData.events.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEvent(evt.id)}
                            className="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Delete this function"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                          Function / Ceremony Name
                        </label>
                        <input
                          type="text"
                          value={evt.name}
                          onChange={(e) => updateEvent(evt.id, { name: e.target.value })}
                          placeholder="e.g. Wedding Ceremony & Reception, Muhurtham, Sangeet"
                          className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                        />
                      </div>

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
                              updateEvent(evt.id, { date: val });
                              const lower = (evt.name || '').toLowerCase();
                              if (idx === 0 || lower.includes('reception')) {
                                updateActiveFormData({ date: val });
                              }
                            }}
                            placeholder="e.g. 06 December 2026 (or leave empty)"
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
                            onChange={(e) => updateEvent(evt.id, { time: e.target.value })}
                            placeholder="e.g. 07:00 PM onwards"
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                            Venue Name
                          </label>
                          <input
                            type="text"
                            value={evt.venue}
                            onChange={(e) => updateEvent(evt.id, { venue: e.target.value })}
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
                            onChange={(e) => updateEvent(evt.id, { address: e.target.value })}
                            placeholder="e.g. Bengaluru, Karnataka"
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-600" />
                            <span>Google Maps Link (for Get Direction button)</span>
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
                          onChange={(e) => updateEvent(evt.id, { mapUrl: e.target.value })}
                          placeholder="Paste Google Maps directions link (e.g. https://maps.google.com/?q=...)"
                          className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-xs font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── SECTION 3: COUPLE PHOTO GALLERY (4 PHOTOS) ── */}
              <div className="space-y-4 bg-neutral-50/70 p-4 sm:p-5 rounded-2xl border border-neutral-200/80">
                <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2.5">
                  <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>3. Couple Photo Gallery (Up to 4 Photos)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {photoMsg && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 animate-in fade-in">
                        {isProcessingPhotos && <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />}
                        <span>{photoMsg}</span>
                      </span>
                    )}
                    {(activeFormData.photos || []).some(Boolean) && (
                      <button
                        type="button"
                        onClick={handleClearAllPhotos}
                        className="text-[11px] text-neutral-500 hover:text-rose-600 underline transition-colors cursor-pointer"
                        title="Clear all photos"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50/70 to-orange-50/70 p-4 rounded-xl border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-900">
                      <UploadCloud className="w-4 h-4 text-amber-700" />
                      <span>Upload All 4 Photos at Once</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 leading-tight">
                      Select up to 4 photos together from your device. Only photos you upload will appear in the invitation.
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
                        <span>Select Photos</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={isProcessingPhotos}
                      onChange={(e) => handleBulkPhotosUpload(e.target.files)}
                    />
                  </label>
                </div>

                {/* 4 Photo Slots Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 pt-1">
                  {[0, 1, 2, 3].map((idx) => {
                    const photoSrc = (activeFormData.photos || [])[idx] || '';
                    const hasPhoto = Boolean(photoSrc && photoSrc.trim());

                    if (hasPhoto) {
                      return (
                        <div 
                          key={idx}
                          className="group/card bg-white rounded-xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                        >
                          <div className="aspect-[3/4] relative bg-neutral-100 overflow-hidden">
                            <img
                              src={photoSrc}
                              alt={`Photo #${idx + 1}`}
                              className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                              #{idx + 1}
                            </span>
                            <span className="absolute top-2 right-2 bg-emerald-600/90 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" />
                              <span>Added</span>
                            </span>
                          </div>

                          <div className="p-2 space-y-1.5 bg-white border-t border-neutral-100 flex-1 flex flex-col justify-between">
                            <div className="flex items-center gap-1.5">
                              <label className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-semibold py-1.5 px-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 text-center">
                                <Upload className="w-3 h-3 text-neutral-600" />
                                <span>Replace</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={isProcessingPhotos}
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handlePhotoUpload(idx, f);
                                  }}
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(idx)}
                                title="Remove photo"
                                className="p-1.5 rounded-lg border border-neutral-200 hover:bg-rose-50 hover:border-rose-200 text-neutral-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            <input
                              type="text"
                              value={photoSrc.startsWith('data:') ? 'Custom uploaded photo' : photoSrc}
                              onChange={(e) => handlePhotoUrlChange(idx, e.target.value)}
                              placeholder="Or paste URL"
                              className="w-full px-2 py-1 text-[10px] rounded-md border border-neutral-200 text-neutral-600 font-mono truncate focus:outline-none focus:ring-1 focus:ring-black"
                            />
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={idx}
                        className="group/card bg-white rounded-xl border border-dashed border-neutral-300 hover:border-amber-500 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                      >
                        <label className="aspect-[3/4] relative bg-neutral-50 hover:bg-amber-50/40 transition-colors cursor-pointer flex flex-col items-center justify-center p-3 text-center">
                          <div className="w-10 h-10 rounded-full bg-neutral-100 group-hover/card:bg-amber-100/80 flex items-center justify-center mb-2 transition-colors">
                            <Upload className="w-5 h-5 text-neutral-400 group-hover/card:text-amber-700 transition-colors" />
                          </div>
                          <span className="text-xs font-bold text-neutral-700 group-hover/card:text-amber-900">
                            Photo #{idx + 1}
                          </span>
                          <span className="text-[10px] text-neutral-400 group-hover/card:text-amber-700/80 mt-0.5">
                            Click to upload
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isProcessingPhotos}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handlePhotoUpload(idx, f);
                            }}
                          />
                        </label>

                        <div className="p-2 bg-white border-t border-neutral-100">
                          <input
                            type="text"
                            value=""
                            onChange={(e) => handlePhotoUrlChange(idx, e.target.value)}
                            placeholder="Or paste URL"
                            className="w-full px-2 py-1 text-[10px] rounded-md border border-neutral-200 text-neutral-600 font-mono truncate focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── SECTION 4: PERMANENT ISOLATED GUEST LINK ── */}
              <div className="bg-[#f5f5f4] p-4 sm:p-5 rounded-2xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-black" />
                    <span>Your Permanent Isolated Guest Link</span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Form #{activeModalFormId.slice(-6)} · Isolated
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentFormLink}
                    className="flex-1 bg-white px-3 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-600 font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopyLink(currentFormLink, 'modal')}
                    className="bg-black hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shrink-0 cursor-pointer"
                  >
                    {copiedId === 'modal' ? (
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
                  This link is tied to <strong>Form #{activeModalFormId.slice(-6)}</strong>. Creating other forms will <strong>never change</strong> this link or its details.
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={currentFormLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-black hover:bg-neutral-800 text-white font-semibold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all text-center cursor-pointer"
                >
                  <span>Open &amp; Test Guest View</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => handleCreateNewForm()}
                  className="px-5 py-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-700" />
                  <span>+ Create Another Form</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalFormId(null)}
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
