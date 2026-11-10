import React, { useState } from 'react';
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
  ShieldCheck
} from 'lucide-react';

interface TemplateFormData {
  bride: string;
  groom: string;
  date: string;
  time: string;
  functionName: string;
  venue: string;
  address: string;
  mapUrl: string;
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
      date: '19 November 2026',
      time: '07:00 PM',
      functionName: 'Wedding Ceremony & Reception',
      venue: 'BWSSB Rajatha Bhavan',
      address: 'Malleshwaram, Bangalore',
      mapUrl: 'https://maps.google.com/?q=BWSSB+Rajatha+Bhavan+Malleshwaram+Bangalore',
    },
  },
  {
    id: 'meenaya-pastel',
    title: 'Meenaya Traditional Pastel',
    subtitle: 'Blue Canvas Sky · Sacred Gopuram · Floating Lanterns',
    badge: 'Popular',
    image: '/images/cards/meenaya-cover.webp',
    demoUrl: '/meenaya.html',
    defaultData: {
      bride: 'Kavya',
      groom: 'Vishu',
      date: '19 November 2026',
      time: '07:00 PM',
      functionName: 'Wedding Ceremony & Reception',
      venue: 'Meenakshi Sundareswarar Temple Gardens',
      address: 'Madurai, Tamil Nadu',
      mapUrl: 'https://maps.google.com/?q=Meenakshi+Temple+Madurai',
    },
  },
  {
    id: 'tirupati-vedic',
    title: 'Sacred Vedic Union',
    subtitle: 'Tirupati Mandap · Vedic Rituals · Music & RSVP',
    badge: 'Classic Vedic',
    image: '/images/cards/tirupati-cover.webp',
    demoUrl: '/invite.html',
    defaultData: {
      bride: 'Tanya',
      groom: 'Rohan',
      date: '12 December 2026',
      time: '11:00 AM',
      functionName: 'Vedic Kalyanam & Lunch',
      venue: 'The Oberoi Udaivilas',
      address: 'Udaipur, Rajasthan',
      mapUrl: 'https://maps.google.com/?q=Oberoi+Udaivilas+Udaipur',
    },
  },
];

export default function App() {
  // Password Protection for Home Page: 'WOW@89'
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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'WOW@89') {
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
  const [templateForms, setTemplateForms] = useState<Record<string, TemplateFormData>>({
    'pichwai-palace': { ...TEMPLATES[0].defaultData },
    'meenaya-pastel': { ...TEMPLATES[1].defaultData },
    'tirupati-vedic': { ...TEMPLATES[2].defaultData },
  });

  const activeTemplate = TEMPLATES.find((t) => t.id === activeModalTemplateId) || TEMPLATES[0];
  const activeFormData = templateForms[activeTemplate.id] || activeTemplate.defaultData;

  const updateFormData = (templateId: string, updates: Partial<TemplateFormData>) => {
    setTemplateForms((prev) => ({
      ...prev,
      [templateId]: {
        ...(prev[templateId] || TEMPLATES.find((t) => t.id === templateId)!.defaultData),
        ...updates,
      },
    }));
  };

  const generateInviteLink = (template: TemplateItem) => {
    const data = templateForms[template.id] || template.defaultData;
    const def = template.defaultData;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    // Compact URL Generator: Only include parameters that differ from the template default
    const params = new URLSearchParams();
    if (data.bride && data.bride.trim() !== def.bride.trim()) params.set('b', data.bride.trim());
    if (data.groom && data.groom.trim() !== def.groom.trim()) params.set('g', data.groom.trim());
    if (data.date && data.date.trim() !== def.date.trim()) params.set('d', data.date.trim());
    if (data.time && data.time.trim() !== def.time.trim()) params.set('t', data.time.trim());
    if (data.venue && data.venue.trim() !== def.venue.trim()) params.set('v', data.venue.trim());
    if (data.address && data.address.trim() !== def.address.trim()) params.set('a', data.address.trim());
    if (data.mapUrl && data.mapUrl.trim() !== def.mapUrl.trim()) params.set('m', data.mapUrl.trim());

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

  // ── PASSWORD GATE (Passcode: WOW@89) ──
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
              <span>3 Exclusive Wedding Templates</span>
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
            <span>All Templates (3)</span>
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
            const cardInviteLink = generateInviteLink(template);

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
                    src={template.image}
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
                    className="flex-1 bg-black hover:bg-neutral-800 text-white font-medium text-xs py-2.5 px-3 rounded-full transition-all active:scale-95 shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Customize</span>
                  </button>

                  <a
                    href={template.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 font-medium text-xs py-2.5 px-3.5 rounded-full transition-all flex items-center justify-center gap-1.5 shrink-0"
                    title="Preview Invitation in New Tab"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveModalTemplateId(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 sm:p-7 border-b border-neutral-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3.5">
                <img 
                  src={activeTemplate.image} 
                  alt={activeTemplate.title} 
                  className="w-10 h-14 object-cover rounded-lg border border-neutral-200 shadow-sm"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    {activeTemplate.title}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mt-0.5">
                    Customize Wedding Details
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveModalTemplateId(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 sm:p-7 space-y-5">
              
              {/* Couple Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Bride's Name
                  </label>
                  <input
                    type="text"
                    value={activeFormData.bride}
                    onChange={(e) => updateFormData(activeTemplate.id, { bride: e.target.value })}
                    placeholder="e.g. Dharani"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
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
                    placeholder="e.g. Manu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Wedding Date
                  </label>
                  <input
                    type="text"
                    value={activeFormData.date}
                    onChange={(e) => updateFormData(activeTemplate.id, { date: e.target.value })}
                    placeholder="e.g. 19 November 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Ceremony Time
                  </label>
                  <input
                    type="text"
                    value={activeFormData.time}
                    onChange={(e) => updateFormData(activeTemplate.id, { time: e.target.value })}
                    placeholder="e.g. 07:00 PM onwards"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  />
                </div>
              </div>

              {/* Function Title */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Function / Ceremony Title
                </label>
                <input
                  type="text"
                  value={activeFormData.functionName}
                  onChange={(e) => updateFormData(activeTemplate.id, { functionName: e.target.value })}
                  placeholder="e.g. Wedding Ceremony & Reception"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                />
              </div>

              {/* Venue Name & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={activeFormData.venue}
                    onChange={(e) => updateFormData(activeTemplate.id, { venue: e.target.value })}
                    placeholder="e.g. BWSSB Rajatha Bhavan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Venue City / Address
                  </label>
                  <input
                    type="text"
                    value={activeFormData.address}
                    onChange={(e) => updateFormData(activeTemplate.id, { address: e.target.value })}
                    placeholder="e.g. Malleshwaram, Bangalore"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  />
                </div>
              </div>

              {/* Google Maps Link */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Google Maps Directions Link
                </label>
                <input
                  type="text"
                  value={activeFormData.mapUrl}
                  onChange={(e) => updateFormData(activeTemplate.id, { mapUrl: e.target.value })}
                  placeholder="Paste Google Maps URL"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-xs font-mono"
                />
              </div>

              {/* Generated Shareable Link Box */}
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
                    className="flex-1 bg-white px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-600 font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(generateInviteLink(activeTemplate))}
                    className="bg-black hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
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
                  Guests opening this link land <strong>directly on the full-screen invitation</strong> ({activeTemplate.title}) with these details.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={generateInviteLink(activeTemplate)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-black hover:bg-neutral-800 text-white font-semibold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all text-center"
                >
                  <span>Open &amp; Test Guest View</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setActiveModalTemplateId(null)}
                  className="px-5 py-3 rounded-xl border border-neutral-300 hover:border-black text-sm font-semibold text-neutral-700 transition-colors"
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
