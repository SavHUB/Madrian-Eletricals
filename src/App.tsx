import React, { useState, useEffect, useMemo } from "react";
import ChatWidget from "./components/ChatWidget";
import { 
  Zap, 
  Sparkles, 
  BatteryCharging, 
  Sun, 
  Moon,
  Activity, 
  Eye, 
  ArrowRight, 
  Phone, 
  Clock, 
  MapPin, 
  Sliders, 
  Check, 
  X, 
  ChevronRight, 
  Search, 
  Building, 
  Home, 
  Briefcase, 
  Shield, 
  Award, 
  CheckCircle,
  HelpCircle,
  MessageSquare,
  AlertTriangle
} from "lucide-react";

// Types for local interactive elements
interface Engineer {
  id: number;
  name: string;
  district: string;
  postcodePrefix: string;
  status: "Available" | "En Route" | "On Site";
  etaMinutes: number;
  specialty: string;
}

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        ([entry], obs) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (ref.current) obs.unobserve(ref.current);
          }
        },
        { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }
    } catch (e) {
      setIsVisible(true);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal-card ${isVisible ? "is-visible" : ""}`}
    >
      {children}
    </div>
  );
}

function Tilt3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate inside the element
    const y = e.clientY - rect.top;  // y coordinate inside the element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angle based on mouse distance from center
    // Max rotation is 8 degrees
    const rotateX = ((centerY - y) / centerY) * 8; 
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered 
          ? "transform 0.08s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease, background-color 0.3s ease" 
          : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, background-color 0.3s ease",
        transformStyle: "preserve-3d"
      }}
      className={className}
    >
      {children}
    </div>
  );
}

function LottieSuccessAnimation() {
  return (
    <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
      {/* Tiny Spark Particles radiating from center */}
      <span className="absolute w-2 h-2 rounded-full bg-volt animate-spark-1 opacity-0" />
      <span className="absolute w-2.5 h-2.5 rounded-full bg-amber-gold animate-spark-2 opacity-0" />
      <span className="absolute w-2 h-2 rounded-full bg-volt animate-spark-3 opacity-0" />
      <span className="absolute w-2 h-2 rounded-full bg-volt animate-spark-4 opacity-0" />
      <span className="absolute w-2.5 h-2.5 rounded-full bg-amber-gold animate-spark-5 opacity-0" />
      <span className="absolute w-1.5 h-1.5 rounded-full bg-volt animate-spark-6 opacity-0" />

      {/* Main animated checkmark & ring container */}
      <div className="w-20 h-20 rounded-full bg-volt/5 flex items-center justify-center animate-lottie-pop border border-white/5 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
        <svg 
          viewBox="0 0 100 100" 
          className="w-16 h-16 text-volt"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Animated Circle Ring */}
          <circle
            cx="50"
            cy="50"
            r="46"
            className="animate-lottie-circle"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            style={{ transformOrigin: "center" }}
          />

          {/* Animated Checkmark Path */}
          <path
            d="M30 52 L45 67 L70 36"
            className="animate-lottie-check"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}

export default function App() {
  // Site-wide theme toggle state (dark mode by default per luxury instructions)
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("madridian-theme");
        if (saved === "light" || saved === "dark") return saved;
      } catch (e) {
        // Handle sandboxed iframe security restrictions gracefully
      }
    }
    return "dark";
  });

  // London Live Time
  const [londonTime, setLondonTime] = useState("");
  
  // Modals & Interactive Panel States
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  // Postcode search for Live Engineer Locator
  const [postcodeQuery, setPostcodeQuery] = useState("");
  
  // Emergency Form State
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyLocation, setEmergencyLocation] = useState("");
  const [emergencyDescription, setEmergencyDescription] = useState("Complete Power Outage");
  
  // Consultation Form State
  const [consultName, setConsultName] = useState("");
  const [consultEmail, setConsultEmail] = useState("");
  const [consultPhone, setConsultPhone] = useState("");
  const [consultService, setConsultService] = useState("Smart Living Infrastructure");
  const [consultDetails, setConsultDetails] = useState("");

  // Load / Quote Calculator State
  const [propertyType, setPropertyType] = useState<"residential" | "commercial" | "estate">("residential");
  const [includeLutron, setIncludeLutron] = useState(true);
  const [includeEVCharging, setIncludeEVCharging] = useState(false);
  const [includePowerwall, setIncludePowerwall] = useState(false);
  const [includeSolar, setIncludeSolar] = useState(false);
  const [includeEICR, setIncludeEICR] = useState(true);
  const [priorityTier, setPriorityTier] = useState<"standard" | "elite">("standard");
  const [calculatorSubmitted, setCalculatorSubmitted] = useState(false);

  // Active Engineers in London Map/Dashboard
  const initialEngineers: Engineer[] = [
    { id: 1, name: "Lead Engineer Thomas K.", district: "Mayfair & West End", postcodePrefix: "W1", status: "Available", etaMinutes: 12, specialty: "Lutron HomeWorks & Automation" },
    { id: 2, name: "Senior Tech Marcus V.", district: "Kensington & Chelsea", postcodePrefix: "SW3", status: "Available", etaMinutes: 14, specialty: "High-Ticket EV Infrastructure" },
    { id: 3, name: "Engineer Harrison P.", district: "Belgravia & Westminster", postcodePrefix: "SW1", status: "Available", etaMinutes: 18, specialty: "Power Storage & Tesla Powerwalls" },
    { id: 4, name: "Technical Inspector David S.", district: "Richmond & Barnes", postcodePrefix: "TW9", status: "Available", etaMinutes: 22, specialty: "EICR Commercial Diagnostics" },
    { id: 5, name: "Senior Engineer Christian L.", district: "Hampstead & Highgate", postcodePrefix: "NW3", status: "Available", etaMinutes: 25, specialty: "Custom Architectural Lighting" },
    { id: 6, name: "Emergency Engineer Alex J.", district: "City of London", postcodePrefix: "EC2", status: "Available", etaMinutes: 15, specialty: "Fault Diagnosis & Thermal Scanning" },
  ];

  const [engineers] = useState<Engineer[]>(initialEngineers);

  // Live London Time ticker and scroll tracker for parallax
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          timeZone: "Europe/London",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        };
        setLondonTime(new Intl.DateTimeFormat("en-GB", options).format(now));
      } catch (err) {
        // Fallback to local system time if Europe/London zone is not recognized
        const now = new Date();
        const pads = (n: number) => String(n).padStart(2, "0");
        setLondonTime(`${pads(now.getHours())}:${pads(now.getMinutes())}:${pads(now.getSeconds())}`);
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      try {
        const scrollY = window.scrollY !== undefined ? window.scrollY : window.pageYOffset;
        document.documentElement.style.setProperty("--scroll-y", `${scrollY}px`);
      } catch (e) {
        // Catch gracefully
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync theme with DOM documentElement class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    try {
      localStorage.setItem("madridian-theme", theme);
    } catch (e) {
      // Handle sandboxed iframe security restrictions gracefully
    }
  }, [theme]);

  // Filtered engineers based on London postcode prefix query
  const filteredEngineers = useMemo(() => {
    if (!postcodeQuery.trim()) return engineers;
    const cleanQuery = postcodeQuery.trim().toUpperCase();
    return engineers.filter(eng => 
      eng.postcodePrefix.includes(cleanQuery) || 
      eng.district.toUpperCase().includes(cleanQuery) ||
      eng.specialty.toUpperCase().includes(cleanQuery)
    );
  }, [postcodeQuery, engineers]);

  // Quote estimate generator logic
  const calculatedEstimate = useMemo(() => {
    let basePrice = 0;
    
    // Base pricing based on property scale
    if (propertyType === "residential") {
      basePrice = 4500;
    } else if (propertyType === "estate") {
      basePrice = 18500;
    } else {
      basePrice = 12000;
    }

    // Addons
    if (includeLutron) basePrice += propertyType === "estate" ? 15000 : 6500;
    if (includeEVCharging) basePrice += 1850;
    if (includePowerwall) basePrice += 10500;
    if (includeSolar) basePrice += 12500;
    if (includeEICR) basePrice += propertyType === "estate" ? 2200 : 850;

    // Premium tier markup
    if (priorityTier === "elite") {
      basePrice *= 1.35; // 35% premium for white-glove immediate board priority
    }

    // Return range
    const lowRange = Math.round(basePrice * 0.9);
    const highRange = Math.round(basePrice * 1.15);

    return {
      low: lowRange.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }),
      high: highRange.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }),
      lowNum: lowRange,
      highNum: highRange
    };
  }, [propertyType, includeLutron, includeEVCharging, includePowerwall, includeSolar, includeEICR, priorityTier]);

  const handleEmergencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatchModalOpen(false);
    setIsSuccessModalOpen(true);
    // Reset form
    setEmergencyName("");
    setEmergencyPhone("");
    setEmergencyLocation("");
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsultModalOpen(false);
    setIsSuccessModalOpen(true);
    // Reset form
    setConsultName("");
    setConsultEmail("");
    setConsultPhone("");
    setConsultDetails("");
  };

  return (
    <div className="min-h-screen bg-onyx text-theme-text-primary font-sans antialiased bg-mesh-glow relative selection:bg-amber-gold selection:text-onyx">
      
      {/* GLOW DECORATIONS - Luxury Radial Backdrops with Parallax */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-gold/5 rounded-full filter blur-[120px] pointer-events-none parallax-glow-1" />
      <div className="absolute top-[1200px] right-1/4 w-[600px] h-[600px] bg-volt/5 rounded-full filter blur-[150px] pointer-events-none parallax-glow-2" />
      <div className="absolute bottom-[800px] left-10 w-[400px] h-[400px] bg-amber-gold/5 rounded-full filter blur-[100px] pointer-events-none parallax-glow-3" />

      {/* SYSTEM STATUS & TICKER BANNER */}
      <div className="w-full bg-onyx/90 border-b border-theme-border py-2 px-6 sticky top-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-xs">
          <div className="flex items-center gap-2 bg-theme-text-primary/5 px-3 py-1 rounded-full border border-theme-border">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-volt opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-volt"></span>
            </span>
            <span className="font-mono text-[9px] tracking-wider text-volt font-bold uppercase">
              System Status: Active Contractors Available Across London Today
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-theme-text-secondary font-mono text-[10px]">
            <span className="flex items-center gap-1.5 text-theme-text-secondary">
              <Clock className="w-3 h-3 text-amber-gold" />
              LONDON BST: <span className="text-amber-gold font-medium">{londonTime || "10:05:47"}</span>
            </span>
            <span className="hidden sm:inline text-theme-border">|</span>
            <span className="hidden sm:flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-500" />
              HQ: Belgravia, SW1
            </span>
          </div>
        </div>
      </div>

      {/* 1. GLASSMORPHISM NAVIGATION HEADER */}
      <header className="w-full py-5 px-6 border-b border-theme-border relative z-40 bg-onyx/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <a href="#" className="font-display text-2xl md:text-3xl font-black tracking-[-0.04em] text-theme-text-primary flex items-center gap-1.5">
              MADRIDIAN
              <span className="w-1.5 h-1.5 rounded-full bg-amber-gold inline-block animate-pulse"></span>
            </a>
            <span className="text-[9px] uppercase font-mono tracking-[0.35em] text-theme-text-muted -mt-1 pl-0.5">
              LONDON ENGINEERING
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-theme-text-secondary">
            <a href="#services" className="hover:text-theme-text-primary transition-colors">
              Services
            </a>
            <a href="#credentials" className="hover:text-theme-text-primary transition-colors">
              Accreditation
            </a>
            <a href="#load-calculator" className="hover:text-theme-text-primary transition-colors">
              Bespoke Cost Estimator
            </a>
            <a href="#live-dispatch" className="hover:text-theme-text-primary transition-colors">
              Live Engineer Locator
            </a>
          </nav>

          {/* Premium Call Button & Theme Toggle */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-full border border-theme-border text-theme-text-primary hover:text-amber-gold hover:bg-theme-text-primary/5 transition-all cursor-pointer relative group flex items-center justify-center bg-theme-text-primary/2"
              aria-label="Toggle Theme"
              id="theme-toggle-btn"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-gold" />
              ) : (
                <Moon className="w-4 h-4 text-amber-gold" />
              )}
            </button>

            <a 
              href="tel:+442079460921" 
              className="hidden sm:flex items-center gap-2 px-4 py-2 border border-theme-border hover:border-theme-text-muted rounded-lg text-xs font-mono text-theme-text-secondary hover:text-theme-text-primary transition-all bg-theme-text-primary/2"
            >
              <Phone className="w-3.5 h-3.5 text-amber-gold" />
              +44 207 946 0921
            </a>
            <button 
              onClick={() => setIsConsultModalOpen(true)}
              className="px-5 py-2 bg-amber-gold text-black rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-[#D9B25E] transition-all cursor-pointer"
            >
              Consultation
            </button>
          </div>
        </div>
      </header>

      {/* 2. KINETIC HERO SEGMENT */}
      <section className="relative pt-20 pb-28 md:pt-28 md:pb-36 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-gold/5 border border-amber-gold/20 text-amber-gold text-[10px] font-mono tracking-widest uppercase mb-8">
              <Zap className="w-3 h-3 fill-amber-gold/10" />
              London's Elite Commercial & Residential Authority
            </div>

            {/* Massive Heading - Immersive UI elegant weight and pairing */}
            <h1 className="text-4xl sm:text-5xl md:text-[66px] font-light leading-[1.08] tracking-tight text-theme-text-primary mb-8 font-display">
              Engineering <span className="font-medium italic text-amber-gold">Premium</span> <br />
              Electrical Infrastructure.
            </h1>

            {/* Paragraph with extreme spatial integrity */}
            <p className="text-base md:text-lg text-theme-text-secondary font-light leading-relaxed max-w-2xl mb-10">
              Operating at the zenith of British electrical standards. Madridian provides seamless execution for masterwork residential automation, mission-critical commercial compliance, and sustainable energy architecture across London's most distinguished postcodes.
            </p>

            {/* Dynamic Buttons Area */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full sm:w-auto">
              
              {/* Emergency Rapid Dispatch Button with pulsing amber ring */}
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-amber-gold/20 rounded-lg blur-xl animate-pulse"></div>
                <button 
                  onClick={() => setIsDispatchModalOpen(true)}
                  className="relative flex items-center justify-center gap-3 px-8 py-4.5 bg-amber-gold text-black font-bold uppercase text-[11px] tracking-widest rounded-sm hover:bg-[#D9B25E] transition-all duration-300 group cursor-pointer animate-radar font-mono"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  Emergency Rapid Dispatch
                </button>
              </div>

              {/* Initiate Project Consultation Button */}
              <button 
                onClick={() => setIsConsultModalOpen(true)}
                className="px-8 py-4.5 border border-theme-border text-theme-text-primary font-bold uppercase text-[11px] tracking-widest rounded-sm hover:bg-theme-text-primary/5 transition-colors font-mono cursor-pointer"
              >
                Initiate Project Consultation
              </button>
            </div>

            {/* Quick trust bullet points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-12 pt-10 border-t border-theme-border w-full">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-theme-text-muted uppercase">Average Response</span>
                <span className="font-display text-lg font-bold text-theme-text-primary mt-1">45 Minutes Max</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs text-theme-text-muted uppercase">Project Liability</span>
                <span className="font-display text-lg font-bold text-theme-text-primary mt-1">£10M Fully Insured</span>
              </div>
              <div className="flex flex-col col-span-2 sm:col-span-1">
                <span className="font-mono text-xs text-theme-text-muted uppercase">Accredited Engineers</span>
                <span className="font-display text-lg font-bold text-volt mt-1 flex items-center gap-1">
                  100% Certified
                </span>
              </div>
            </div>

          </div>

          {/* Interactive Hero Asset Panel */}
          <div className="lg:col-span-5 relative z-10 w-full">
            <div className="w-full glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden border border-theme-border shadow-2xl">
              
              {/* Background gradient grid flare */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-volt/10 rounded-full filter blur-xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-theme-text-primary">Live Operations Terminal</h3>
                  <p className="text-xs text-theme-text-muted mt-1">Belgravia Control Room & Dispatch Stream</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-volt/10 text-volt font-mono text-[10px] uppercase font-bold tracking-wider animate-volt-pulse">
                  SECURE LIVE LINK
                </span>
              </div>

              {/* Status metrics stack */}
              <div className="space-y-4 mb-6">
                <div className="bg-onyx/60 p-4 rounded-xl border border-theme-border">
                  <div className="flex justify-between text-xs font-mono text-theme-text-muted mb-1">
                    <span>GRID LOAD DIAGNOSTICS</span>
                    <span className="text-volt">OPTIMAL (99.8%)</span>
                  </div>
                  <div className="w-full bg-slate-card h-1.5 rounded-full overflow-hidden">
                    <div className="bg-volt h-full w-[99.8%] rounded-full" />
                  </div>
                </div>

                <div className="bg-onyx/60 p-4 rounded-xl border border-theme-border flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-gold/10 rounded-lg">
                      <Zap className="w-4 h-4 text-amber-gold" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-theme-text-muted">EMERGENCY STANDBY STATUS</p>
                      <p className="text-sm font-semibold text-theme-text-primary mt-0.5">8 Fast-Response Crews Free</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-volt/10 text-volt text-[10px] font-mono">READY</span>
                </div>

                <div className="bg-onyx/60 p-4 rounded-xl border border-theme-border flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-gold/10 rounded-lg">
                      <BatteryCharging className="w-4 h-4 text-amber-gold" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-theme-text-muted">ACTIVE SMART INSTALLS TODAY</p>
                      <p className="text-sm font-semibold text-theme-text-primary mt-0.5">14 High-End Sites Active</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-gold/10 text-amber-gold text-[10px] font-mono">ON TIME</span>
                </div>
              </div>

              {/* Quick dispatch micro-selector */}
              <div className="pt-4 border-t border-theme-border">
                <p className="text-xs font-mono text-theme-text-secondary mb-3 uppercase tracking-wider">Fast-Book Emergency Emergency Crew</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      setEmergencyDescription("Power Failure / Total Outage");
                      setIsDispatchModalOpen(true);
                    }}
                    className="p-3 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-500/50 rounded-xl text-left transition-all group"
                  >
                    <p className="text-xs font-bold text-red-400 group-hover:text-red-300">Total Outage</p>
                    <p className="text-[10px] text-theme-text-muted mt-1">Instant crew dispatch</p>
                  </button>
                  <button 
                    onClick={() => {
                      setEmergencyDescription("Burning Smell or Electrical Fire Hazard");
                      setIsDispatchModalOpen(true);
                    }}
                    className="p-3 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-900/30 hover:border-amber-500/50 rounded-xl text-left transition-all group"
                  >
                    <p className="text-xs font-bold text-amber-gold group-hover:text-amber-400">Burning Smell</p>
                    <p className="text-[10px] text-theme-text-muted mt-1">Thermal imaging team</p>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. ACCREDITATION GRID: UK Trust Signal Badges */}
      <section id="credentials" className="py-12 bg-slate-card/30 border-y border-theme-border px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-theme-text-muted mb-10">
            STRONGLY COMPLIANT WITH ALL LEGAL & GOVERNMENTAL REGULATORY STANDARDS
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* NICEIC Approved Contractor Placeholders - Code Rendered */}
            <div className="glass-panel hover:bg-slate-card/60 rounded-xl p-6 transition-all duration-300 flex flex-col items-center text-center border border-theme-border relative group hover:border-amber-gold/30">
              <div className="w-12 h-12 rounded-lg bg-amber-gold/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <Shield className="w-6 h-6 text-amber-gold" />
              </div>
              <h4 className="font-display font-bold text-theme-text-primary text-sm tracking-wide">NICEIC APPROVED</h4>
              <p className="text-theme-text-secondary text-xs mt-2 font-mono leading-relaxed">
                Contractor ID: D610344<br />
                Full Scope Approved
              </p>
              <div className="absolute top-2 right-2 flex h-1.5 w-1.5">
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-gold"></span>
              </div>
            </div>

            {/* City & Guilds Level 3 */}
            <div className="glass-panel hover:bg-slate-card/60 rounded-xl p-6 transition-all duration-300 flex flex-col items-center text-center border border-theme-border relative group hover:border-theme-text-muted">
              <div className="w-12 h-12 rounded-lg bg-amber-gold/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <Award className="w-6 h-6 text-amber-gold" />
              </div>
              <h4 className="font-display font-bold text-theme-text-primary text-sm tracking-wide">CITY & GUILDS LEVEL 3</h4>
              <p className="text-theme-text-secondary text-xs mt-2 font-mono leading-relaxed">
                Accreditation #2391<br />
                Inspection & Testing Masters
              </p>
              <div className="absolute top-2 right-2 flex h-1.5 w-1.5">
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-gold"></span>
              </div>
            </div>

            {/* Part P Compliant */}
            <div className="glass-panel hover:bg-slate-card/60 rounded-xl p-6 transition-all duration-300 flex flex-col items-center text-center border border-theme-border relative group hover:border-volt/30">
              <div className="w-12 h-12 rounded-lg bg-volt/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <Zap className="w-6 h-6 text-volt" />
              </div>
              <h4 className="font-display font-bold text-theme-text-primary text-sm tracking-wide">PART P COMPLIANT</h4>
              <p className="text-theme-text-secondary text-xs mt-2 font-mono leading-relaxed">
                Building Regulations<br />
                Domestic Safety Standard
              </p>
              <div className="absolute top-2 right-2 flex h-1.5 w-1.5">
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-volt"></span>
              </div>
            </div>

            {/* TrustMark Registered */}
            <div className="glass-panel hover:bg-slate-card/60 rounded-xl p-6 transition-all duration-300 flex flex-col items-center text-center border border-theme-border relative group hover:border-volt/30">
              <div className="w-12 h-12 rounded-lg bg-volt/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 text-volt" />
              </div>
              <h4 className="font-display font-bold text-theme-text-primary text-sm tracking-wide">TRUSTMARK REGISTERED</h4>
              <p className="text-theme-text-secondary text-xs mt-2 font-mono leading-relaxed">
                Government Endorsed<br />
                Vetted Quality & Trust
              </p>
              <div className="absolute top-2 right-2 flex h-1.5 w-1.5">
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-volt"></span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. TRIPARTITE HIGH-TICKET SERVICES */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
        
        {/* Section Header with generous padding */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-amber-gold font-bold">
            MADRIDIAN ENGINEERING CORE
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.03em] font-display text-theme-text-primary mt-4 leading-tight">
            High-Ticket Architectural & Commercial Electrical Solutions
          </h2>
          <div className="w-16 h-1 bg-amber-gold mx-auto mt-6" />
        </div>

        {/* The Tripartite Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Card 1: Smart Living Infrastructure */}
          <ScrollReveal delay={0}>
            <Tilt3D className="glass-panel p-8 md:p-10 flex flex-col justify-between group hover:border-amber-gold/30 hover:bg-theme-text-primary/5 transition-all duration-300 relative h-full rounded-xl">
              <div>
                {/* Card Header & Serial */}
                <div className="flex justify-between items-center mb-8">
                  <div className="w-12 h-12 border border-amber-gold/20 flex items-center justify-center text-amber-gold font-mono text-sm tracking-wider bg-amber-gold/5 rounded-sm">
                    01
                  </div>
                  <span className="text-[10px] font-mono text-theme-text-muted uppercase tracking-[0.2em]">RESIDENTIAL ELITE</span>
                </div>
                
                {/* Title & Body */}
                <h3 className="text-xl font-medium font-display text-theme-text-primary mb-4">
                  Smart Living Infrastructure
                </h3>
                <p className="text-theme-text-secondary font-light text-xs md:text-sm leading-relaxed mb-8">
                  Masterfully tailored automation architectures for custom townhouses, historic country estates, and ultra-prime penthouses. Integrated smart systems operating with peerless responsiveness.
                </p>

                {/* Bullet Points */}
                <ul className="space-y-3 mb-8 text-xs font-mono text-theme-text-secondary">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-amber-gold" />
                    Lutron HomeWorks Certified Programming
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-amber-gold" />
                    Premium Architectural Lighting Schemes
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-amber-gold" />
                    Multi-Room Audio, AV Rack Layouts & Wi-Fi
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-amber-gold" />
                    Intelligent Underfloor Heating Integration
                  </li>
                </ul>
              </div>

              {/* Bottom Interaction Area */}
              <div className="pt-6 border-t border-theme-border flex justify-between items-center mt-auto">
                <span className="text-[11px] text-theme-text-muted font-mono">ESTIMATES FROM £12,500</span>
                <button 
                  onClick={() => {
                    setConsultService("Smart Living Infrastructure");
                    setIsConsultModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-gold uppercase tracking-wider font-mono group-hover:gap-3 transition-all cursor-pointer"
                >
                  Inquire <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Tilt3D>
          </ScrollReveal>

          {/* Card 2: Sustainable Power Systems */}
          <ScrollReveal delay={150}>
            <Tilt3D className="glass-panel p-8 md:p-10 flex flex-col justify-between group hover:border-volt/30 hover:bg-theme-text-primary/5 transition-all duration-300 relative h-full rounded-xl">
              <div>
                {/* Card Header & Serial */}
                <div className="flex justify-between items-center mb-8">
                  <div className="w-12 h-12 border border-volt/20 flex items-center justify-center text-volt font-mono text-sm tracking-wider bg-volt/5 rounded-sm">
                    02
                  </div>
                  <span className="text-[10px] font-mono text-theme-text-muted uppercase tracking-[0.2em]">ECO & SUSTAINABLE</span>
                </div>

                {/* Title & Body */}
                <h3 className="text-xl font-medium font-display text-theme-text-primary mb-4">
                  Sustainable Power Systems
                </h3>
                <p className="text-theme-text-secondary font-light text-xs md:text-sm leading-relaxed mb-8">
                  Power generation and storage systems. As approved OZEV installers and certified storage specialists, we tie intelligent EV charging, Solar arrays, and robust backup battery networks together.
                </p>

                {/* Bullet Points */}
                <ul className="space-y-3 mb-8 text-xs font-mono text-theme-text-secondary">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-volt" />
                    OZEV Approved Commercial & Residential EV Chargers
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-volt" />
                    Tesla Powerwall Integration & Multi-Battery Arrays
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-volt" />
                    High-Yield Micro-Inverter Solar PV Design
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-volt" />
                    Smart Load Shedding & Islanding Backup Panels
                  </li>
                </ul>
              </div>

              {/* Bottom Interaction Area */}
              <div className="pt-6 border-t border-theme-border flex justify-between items-center mt-auto">
                <span className="text-[11px] text-theme-text-muted font-mono">ESTIMATES FROM £4,800</span>
                <button 
                  onClick={() => {
                    setConsultService("Sustainable Power Systems");
                    setIsConsultModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-volt uppercase tracking-wider font-mono group-hover:gap-3 transition-all cursor-pointer"
                >
                  Inquire <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Tilt3D>
          </ScrollReveal>

          {/* Card 3: Corporate Compliance & Diagnostics */}
          <ScrollReveal delay={300}>
            <Tilt3D className="glass-panel p-8 md:p-10 flex flex-col justify-between group hover:border-amber-gold/30 hover:bg-theme-text-primary/5 transition-all duration-300 relative h-full rounded-xl">
              <div>
                {/* Card Header & Serial */}
                <div className="flex justify-between items-center mb-8">
                  <div className="w-12 h-12 border border-amber-gold/20 flex items-center justify-center text-amber-gold font-mono text-sm tracking-wider bg-amber-gold/5 rounded-sm">
                    03
                  </div>
                  <span className="text-[10px] font-mono text-theme-text-muted uppercase tracking-[0.2em]">COMMERCIAL & DEFENSIVE</span>
                </div>

                {/* Title & Body */}
                <h3 className="text-xl font-medium font-display text-theme-text-primary mb-4">
                  Corporate Compliance & Diagnostics
                </h3>
                <p className="text-theme-text-secondary font-light text-xs md:text-sm leading-relaxed mb-8">
                  Protecting asset portfolios through thorough compliance tracking, preventive thermal scanning, high-load testing, and premium EICR certifications across London's financial centers.
                </p>

                {/* Bullet Points */}
                <ul className="space-y-3 mb-8 text-xs font-mono text-theme-text-secondary">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-amber-gold" />
                    FLIR High-Resolution Thermal Imaging Fault-Finding
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-amber-gold" />
                    Comprehensive Commercial EICR Certifications
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-amber-gold" />
                    Landlord Compliance Auditing & Emergency Lighting
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-amber-gold" />
                    Continuous Phase Balance & Power Quality Surveys
                  </li>
                </ul>
              </div>

              {/* Bottom Interaction Area */}
              <div className="pt-6 border-t border-theme-border flex justify-between items-center mt-auto">
                <span className="text-[11px] text-theme-text-muted font-mono">ESTIMATES FROM £1,500</span>
                <button 
                  onClick={() => {
                    setConsultService("Corporate Compliance & Diagnostics");
                    setIsConsultModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-gold uppercase tracking-wider font-mono group-hover:gap-3 transition-all cursor-pointer"
                >
                  Inquire <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Tilt3D>
          </ScrollReveal>

        </div>

        {/* Bottom service banner with phone hook */}
        <div className="mt-16 text-center glass-panel p-6 md:p-8 rounded-2xl max-w-4xl mx-auto border border-theme-border">
          <p className="text-sm text-theme-text-secondary leading-relaxed font-light">
            Need an urgent custom solution or bespoke project integration that isn't listed here? <br />
            Our chief electrical architect is available directly to review executive requirements. 
            <a href="tel:+442079460921" className="text-amber-gold font-bold hover:underline ml-1.5 inline-flex items-center gap-1">
              Call Direct <Phone className="w-3.5 h-3.5 inline" />
            </a>
          </p>
        </div>

      </section>

      {/* 5. INTERACTIVE BESPOKE ESTIMATOR SEGMENT */}
      <section id="load-calculator" className="py-24 bg-slate-card/20 border-y border-theme-border px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 text-left">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-gold font-bold">
                BUDGET TRANSPARENCY
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.03em] font-display text-theme-text-primary mt-3 leading-tight">
                Luxury Cost <br />
                Estimator & Architect Selector
              </h2>
              <p className="text-theme-text-secondary font-light leading-relaxed mt-6 text-base md:text-lg">
                Madridian operates with total structural transparency. Specify your architectural parameters below to receive a high-fidelity estimated cost range and project complexity rating directly from our pricing schema.
              </p>

              {/* Informative side panel points */}
              <div className="space-y-4 mt-8">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-gold/20 flex items-center justify-center text-amber-gold text-xs font-mono shrink-0 mt-0.5">1</div>
                  <p className="text-xs text-theme-text-muted leading-relaxed">
                    Estimates include complete premium materials, NICEIC certification paperwork, and white-glove site clearance.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-gold/20 flex items-center justify-center text-amber-gold text-xs font-mono shrink-0 mt-0.5">2</div>
                  <p className="text-xs text-theme-text-muted leading-relaxed">
                    "Elite Priority" guarantees mobilization of a dedicated project manager and secondary certification signoff within 72 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Calculator Box */}
            <div className="lg:col-span-7 bg-slate-card/50 glass-panel rounded-2xl p-6 md:p-10 border border-theme-border">
              <h3 className="font-display text-xl font-bold text-theme-text-primary mb-6 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-gold" />
                Customize Engineering Brief
              </h3>

              <div className="space-y-6">
                
                {/* 1. Property Scale Selection */}
                <div>
                  <label className="text-xs uppercase font-mono text-theme-text-secondary tracking-wider">1. Property Scale & Classification</label>
                  <div className="grid grid-cols-3 gap-3 mt-2.5">
                    
                    <button 
                      type="button"
                      onClick={() => setPropertyType("residential")}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${propertyType === "residential" ? "border-amber-gold bg-amber-gold/10 text-theme-text-primary" : "border-theme-border hover:border-theme-text-muted bg-onyx/40 text-theme-text-secondary"}`}
                    >
                      <Home className="w-4 h-4 mb-1.5" />
                      <p className="text-xs font-bold text-theme-text-primary">Residential</p>
                      <p className="text-[10px] text-theme-text-muted">Townhouse / Penthouse</p>
                    </button>

                    <button 
                      type="button"
                      onClick={() => setPropertyType("commercial")}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${propertyType === "commercial" ? "border-amber-gold bg-amber-gold/10 text-theme-text-primary" : "border-theme-border hover:border-theme-text-muted bg-onyx/40 text-theme-text-secondary"}`}
                    >
                      <Briefcase className="w-4 h-4 mb-1.5" />
                      <p className="text-xs font-bold text-theme-text-primary">Commercial</p>
                      <p className="text-[10px] text-theme-text-muted">Offices / Retails / Labs</p>
                    </button>

                    <button 
                      type="button"
                      onClick={() => setPropertyType("estate")}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${propertyType === "estate" ? "border-amber-gold bg-amber-gold/10 text-theme-text-primary" : "border-theme-border hover:border-theme-text-muted bg-onyx/40 text-theme-text-secondary"}`}
                    >
                      <Building className="w-4 h-4 mb-1.5" />
                      <p className="text-xs font-bold text-theme-text-primary">Luxury Estate</p>
                      <p className="text-[10px] text-theme-text-muted">Large Historic Estates</p>
                    </button>

                  </div>
                </div>

                {/* 2. Specific System Toggles */}
                <div>
                  <label className="text-xs uppercase font-mono text-theme-text-secondary tracking-wider">2. System Add-ons & Integrations</label>
                  <div className="grid sm:grid-cols-2 gap-3 mt-2.5">
                    
                    <div 
                      onClick={() => setIncludeLutron(!includeLutron)}
                      className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${includeLutron ? "border-amber-gold/50 bg-amber-gold/5 text-theme-text-primary" : "border-theme-border hover:border-theme-text-muted bg-onyx/20 text-theme-text-secondary"}`}
                    >
                      <div>
                        <p className="text-xs font-bold text-theme-text-primary">Lutron HomeWorks Control</p>
                        <p className="text-[10px] text-theme-text-muted">Smart lighting & customized keypads</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-onyx ${includeLutron ? "bg-amber-gold border-amber-gold" : "border-theme-text-primary/20"}`}>
                        {includeLutron && <Check className="w-3 h-3 text-onyx stroke-[3]" />}
                      </div>
                    </div>

                    <div 
                      onClick={() => setIncludeEVCharging(!includeEVCharging)}
                      className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${includeEVCharging ? "border-volt/50 bg-volt/5 text-theme-text-primary" : "border-theme-border hover:border-theme-text-muted bg-onyx/20 text-theme-text-secondary"}`}
                    >
                      <div>
                        <p className="text-xs font-bold text-theme-text-primary">EV Smart Charging Hub</p>
                        <p className="text-[10px] text-theme-text-muted">Certified OZEV installation</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-onyx ${includeEVCharging ? "bg-volt border-volt" : "border-theme-text-primary/20"}`}>
                        {includeEVCharging && <Check className="w-3 h-3 text-onyx stroke-[3]" />}
                      </div>
                    </div>

                    <div 
                      onClick={() => setIncludePowerwall(!includePowerwall)}
                      className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${includePowerwall ? "border-volt/50 bg-volt/5 text-theme-text-primary" : "border-theme-border hover:border-theme-text-muted bg-onyx/20 text-theme-text-secondary"}`}
                    >
                      <div>
                        <p className="text-xs font-bold text-theme-text-primary">Tesla Powerwall Battery</p>
                        <p className="text-[10px] text-theme-text-muted">High capacity smart storage tie-in</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-onyx ${includePowerwall ? "bg-volt border-volt" : "border-theme-text-primary/20"}`}>
                        {includePowerwall && <Check className="w-3 h-3 text-onyx stroke-[3]" />}
                      </div>
                    </div>

                    <div 
                      onClick={() => setIncludeSolar(!includeSolar)}
                      className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${includeSolar ? "border-amber-gold/50 bg-amber-gold/5 text-theme-text-primary" : "border-theme-border hover:border-theme-text-muted bg-onyx/20 text-theme-text-secondary"}`}
                    >
                      <div>
                        <p className="text-xs font-bold text-theme-text-primary">Solar PV Generation</p>
                        <p className="text-[10px] text-theme-text-muted">Certified micro-inverter schemes</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-onyx ${includeSolar ? "bg-amber-gold border-amber-gold" : "border-theme-text-primary/20"}`}>
                        {includeSolar && <Check className="w-3 h-3 text-onyx stroke-[3]" />}
                      </div>
                    </div>

                    <div 
                      onClick={() => setIncludeEICR(!includeEICR)}
                      className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${includeEICR ? "border-amber-gold/50 bg-amber-gold/5 text-theme-text-primary" : "border-theme-border hover:border-theme-text-muted bg-onyx/20 text-theme-text-secondary"}`}
                    >
                      <div>
                        <p className="text-xs font-bold text-theme-text-primary">Diagnostic Testing & EICR</p>
                        <p className="text-[10px] text-theme-text-muted">Continuous testing certification</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-onyx ${includeEICR ? "bg-amber-gold border-amber-gold" : "border-theme-text-primary/20"}`}>
                        {includeEICR && <Check className="w-3 h-3 text-onyx stroke-[3]" />}
                      </div>
                    </div>

                  </div>
                </div>

                {/* 3. Priority Service Tier */}
                <div>
                  <label className="text-xs uppercase font-mono text-theme-text-secondary tracking-wider">3. Executive Dispatch & SLA Tier</label>
                  <div className="grid grid-cols-2 gap-3 mt-2.5">
                    
                    <button 
                      type="button"
                      onClick={() => setPriorityTier("standard")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${priorityTier === "standard" ? "border-theme-text-primary/30 bg-theme-text-primary/5 text-theme-text-primary" : "border-theme-border hover:border-theme-text-muted bg-onyx/40 text-theme-text-secondary"}`}
                    >
                      <p className="text-xs font-bold text-theme-text-primary">Standard Mobilization</p>
                      <p className="text-[10px] text-theme-text-muted mt-0.5">Booking scheduled within 5 business days</p>
                    </button>

                    <button 
                      type="button"
                      onClick={() => setPriorityTier("elite")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${priorityTier === "elite" ? "border-amber-gold bg-amber-gold/10 text-theme-text-primary" : "border-theme-border hover:border-theme-text-muted bg-onyx/40 text-theme-text-secondary"}`}
                    >
                      <p className="text-xs font-bold text-amber-gold flex items-center gap-1">
                        Elite Board Priority
                        <Sparkles className="w-3 h-3" />
                      </p>
                      <p className="text-[10px] text-theme-text-muted mt-0.5">Assigned Chief Engineer within 48 hours</p>
                    </button>

                  </div>
                </div>

                {/* Estimation Output Presentation Area */}
                <div className="mt-8 pt-8 border-t border-theme-border bg-onyx/60 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <span className="text-[10px] font-mono text-theme-text-secondary uppercase tracking-[0.15em] block">Besigned Project Range Estimate</span>
                    <span className="font-display text-2xl md:text-3xl font-extrabold text-theme-text-primary block mt-1.5">
                      {calculatedEstimate.low} — {calculatedEstimate.high}
                    </span>
                    <span className="text-[10px] font-mono text-theme-text-muted block mt-1">
                      Includes full engineering sign-off & NICEIC registration. Excludes VAT.
                    </span>
                  </div>

                  {calculatorSubmitted ? (
                    <div className="w-full md:w-auto p-3 bg-volt/10 border border-volt/20 text-volt text-xs rounded-xl font-mono flex items-center gap-2">
                      <Check className="w-4 h-4" /> Estimate submitted. We will call you back!
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setCalculatorSubmitted(true);
                        setTimeout(() => setCalculatorSubmitted(false), 5000);
                        setIsConsultModalOpen(true);
                        setConsultDetails(`Project Estimate Request: Property classified as ${propertyType}. Options configured: Lutron Works (${includeLutron}), EV charging (${includeEVCharging}), Tesla Powerwall (${includePowerwall}), Solar (${includeSolar}), Diagnostics EICR (${includeEICR}). SLA Priority: ${priorityTier}. Estimated pricing range: ${calculatedEstimate.low} - ${calculatedEstimate.high}.`);
                      }}
                      className="w-full md:w-auto px-6 py-3.5 bg-amber-gold hover:bg-[#D9B25E] text-onyx font-bold font-display rounded-xl text-xs uppercase tracking-wider text-center transition-all cursor-pointer"
                    >
                      Lock In This Estimate & Submit
                    </button>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. LIVE ENGINEER LOCATOR & DISPATCH MAP */}
      <section id="live-dispatch" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 bg-slate-card/40 glass-panel rounded-2xl p-6 md:p-8 border border-theme-border relative animate-in fade-in duration-500">
            
            {/* Pulsing beacon in top right corner */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-theme-text-muted">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-volt opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-volt"></span>
              </span>
              <span className="font-mono text-[10px]">LIVE FEED</span>
            </div>

            <div className="mb-6">
              <h3 className="font-display text-xl font-bold text-theme-text-primary">London Active Contractor Map</h3>
              <p className="text-xs text-theme-text-muted mt-1">Filter by postcode or specialty to locate the closest standby emergency engineer.</p>
            </div>

            {/* Postcode Quick Lookup Bar */}
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-theme-text-muted absolute left-3.5 top-3.5" />
                <input 
                  type="text" 
                  value={postcodeQuery}
                  onChange={(e) => setPostcodeQuery(e.target.value)}
                  placeholder="Enter SW1, W1, NW3, SW3, EC2..." 
                  className="w-full bg-onyx/70 border border-theme-border rounded-xl pl-10 pr-4 py-3 text-xs text-theme-text-primary placeholder-slate-500 focus:outline-none focus:border-amber-gold focus:ring-1 focus:ring-amber-gold font-mono"
                />
                {postcodeQuery && (
                  <button 
                    onClick={() => setPostcodeQuery("")}
                    className="absolute right-3.5 top-3.5 text-theme-text-muted hover:text-theme-text-primary"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              
              <button 
                onClick={() => setPostcodeQuery("")}
                className="px-4 bg-slate-card hover:bg-slate-card/80 text-theme-text-primary rounded-xl text-xs font-mono transition-all border border-theme-border cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Interactive Grid Table of stand-by engineers */}
            <div className="space-y-3 overflow-y-auto max-h-[350px] pr-1">
              {filteredEngineers.length === 0 ? (
                <div className="text-center py-10 text-theme-text-muted text-xs font-mono">
                  No standby crews matching search query inside London. Call dispatch on +44 207 946 0921 for manual allocation.
                </div>
              ) : (
                filteredEngineers.map((eng) => (
                  <div 
                    key={eng.id}
                    className="p-4 bg-onyx/60 hover:bg-slate-card/60 rounded-xl border border-theme-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all group hover:border-amber-gold/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-slate-card border border-theme-border text-amber-gold shrink-0 mt-0.5">
                        <Zap className="w-4 h-4 fill-amber-gold/5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-theme-text-primary">{eng.name}</p>
                          <span className="px-1.5 py-0.5 bg-volt/10 text-volt text-[9px] font-mono rounded">
                            {eng.status}
                          </span>
                        </div>
                        <p className="text-xs text-theme-text-secondary mt-1 flex items-center gap-1 font-mono">
                          <MapPin className="w-3.5 h-3.5 text-red-500" />
                          {eng.district} (Postcode {eng.postcodePrefix})
                        </p>
                        <p className="text-[10px] text-theme-text-muted mt-0.5 font-mono">
                          Specialty: {eng.specialty}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-theme-border flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                      <span className="text-[10px] font-mono text-theme-text-muted uppercase sm:block">ESTIMATED ETA</span>
                      <span className="font-display text-lg font-bold text-theme-text-primary group-hover:text-amber-gold transition-colors flex items-center gap-1 mt-0.5">
                        {eng.etaMinutes} mins
                        <ChevronRight className="w-4 h-4 text-theme-text-muted group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Quick map disclaimer note */}
            <p className="text-[10px] font-mono text-theme-text-muted mt-4 leading-relaxed text-center">
              *Positions are verified every 30 seconds using encrypted contractor GPS streams. Response times are subject to traffic conditions.
            </p>

          </div>

          {/* Locator Sidebar Narrative */}
          <div className="lg:col-span-5 text-left">
            <span className="text-xs uppercase font-mono tracking-wider text-amber-gold font-bold">
              PEERLESS SPEED DEFINED
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.03em] font-display text-theme-text-primary mt-3 leading-tight">
              Rapid Response, <br />
              London Wide Coverage
            </h2>
            <p className="text-theme-text-secondary font-light leading-relaxed mt-6 text-base md:text-lg">
              Madridian operates multiple satellite engineering vehicles positioned strategic to central commuter corridors. By tracking traffic trends and contractor locations in real-time, we maintain an unparalleled response record for both private residential and commercial property assets.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 bg-slate-card/30 border border-theme-border rounded-xl text-left">
                <p className="font-display text-xl font-bold text-theme-text-primary">SW1, W1, SW3</p>
                <p className="text-xs text-theme-text-secondary mt-1">Average Rapid Response: Under 30 Mins</p>
              </div>
              <div className="p-4 bg-slate-card/30 border border-theme-border rounded-xl text-left">
                <p className="font-display text-xl font-bold text-theme-text-primary">EC1, EC2, WC2</p>
                <p className="text-xs text-theme-text-secondary mt-1">Average Commercial Dispatch: 35 Mins</p>
              </div>
            </div>

            <div className="mt-8 flex justify-start">
              <button 
                onClick={() => setIsDispatchModalOpen(true)}
                className="px-6 py-3.5 border border-red-500/20 bg-red-950/10 hover:bg-red-950/20 rounded-xl text-xs text-red-400 font-bold font-mono tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                Trigger Fast Emergency Allocation
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-card/20 border-t border-theme-border py-16 px-6 mt-12 relative z-30">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid md:grid-cols-12 gap-12 mb-12">
            
            <div className="md:col-span-4 flex flex-col items-start">
              <a href="#" className="font-display text-2xl font-extrabold tracking-[-0.04em] text-theme-text-primary flex items-center gap-1.5">
                MADRIDIAN
                <span className="w-1.5 h-1.5 rounded-full bg-amber-gold inline-block"></span>
              </a>
              <span className="text-[9px] uppercase font-mono tracking-[0.35em] text-theme-text-muted -mt-1 pl-0.5">
                LONDON ENGINEERING
              </span>
              <p className="text-theme-text-secondary text-xs font-light leading-relaxed mt-4 max-w-sm">
                Operating with uncompromising high standards to engineer complex, premium residential electrical automation schemes and compliance solutions for fine properties and luxury corporations.
              </p>
            </div>

            <div className="md:col-span-3">
              <h5 className="font-mono text-xs uppercase text-theme-text-primary font-bold tracking-wider mb-4">Core Accreditations</h5>
              <ul className="space-y-2 text-xs font-mono text-theme-text-secondary">
                <li>NICEIC Approved Contractor</li>
                <li>City & Guilds 18th Edition</li>
                <li>OZEV Registered Installer</li>
                <li>TrustMark Quality Endorsed</li>
                <li>Part P Electrical Safety</li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h5 className="font-mono text-xs uppercase text-theme-text-primary font-bold tracking-wider mb-4">Headquarters & Contact</h5>
              <p className="text-xs font-mono text-theme-text-secondary leading-relaxed mb-4">
                Madridian Engineering HQ<br />
                82 Eaton Place, Belgravia<br />
                London, SW1X 8AL
              </p>
              <a href="tel:+442079460921" className="text-xs font-mono text-amber-gold hover:underline block mb-1">
                T: +44 (0) 207 946 0921
              </a>
              <a href="mailto:project.board@madridian.co.uk" className="text-xs font-mono text-theme-text-secondary hover:text-theme-text-primary hover:underline block">
                E: projects@madridian.co.uk
              </a>
            </div>

            <div className="md:col-span-2">
              <h5 className="font-mono text-xs uppercase text-theme-text-primary font-bold tracking-wider mb-4">Live Control</h5>
              <div className="p-3.5 bg-onyx/60 rounded-xl border border-theme-border flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[10px] text-theme-text-secondary font-mono">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-volt opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-volt"></span>
                  </span>
                  <span>ENCRYPTED PORTAL</span>
                </div>
                <button 
                  onClick={() => setIsConsultModalOpen(true)}
                  className="w-full py-1.5 bg-slate-card hover:bg-slate-card/80 text-[10px] font-mono text-theme-text-primary rounded font-medium border border-theme-border cursor-pointer"
                >
                  ENGINEER PORTAL
                </button>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-theme-border flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-theme-text-muted">
            <p>© {new Date().getFullYear()} Madridian London Engineering. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-theme-text-primary">Privacy Statement</a>
              <span>·</span>
              <a href="#" className="hover:text-theme-text-primary">Terms of Engagement</a>
              <span>·</span>
              <a href="#" className="hover:text-theme-text-primary">EICR Compliance</a>
            </div>
          </div>

        </div>
      </footer>

      {/* 6. MOBILE STICKY ACTION ANCHOR - Floating Hotbar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-onyx/85 glass-nav border-t border-white/10 z-40 flex items-center justify-between gap-4 shadow-xl">
        <a 
          href="tel:+442079460921"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-card hover:bg-slate-card/80 rounded-xl border border-white/10 text-xs font-bold text-white font-mono"
        >
          <Phone className="w-4 h-4 text-amber-gold animate-bounce" />
          Call Dispatch
        </a>
        
        <button 
          onClick={() => setIsDispatchModalOpen(true)}
          className="flex-1 py-3 bg-amber-gold text-onyx font-bold rounded-xl text-xs font-display flex items-center justify-center gap-1 shadow-lg shadow-amber-gold/10"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600"></span>
          </span>
          Rapid Dispatch
        </button>
      </div>


      {/* ================= MODALS & DRAWERS ================= */}

      {/* 1. EMERGENCY RAPID DISPATCH MODAL */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-theme-bg glass-panel-heavy rounded-2xl p-6 md:p-8 border border-red-500/20 relative animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => setIsDispatchModalOpen(false)}
              className="absolute top-4 right-4 text-theme-text-muted hover:text-theme-text-primary p-1 rounded-full hover:bg-theme-text-primary/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-theme-text-primary">Emergency Engineering Dispatch</h3>
                <p className="text-xs text-red-400 mt-0.5">Secure Link Priority SLA Mobilization</p>
              </div>
            </div>

            <form onSubmit={handleEmergencySubmit} className="space-y-4">
              
              <div>
                <label className="text-[10px] font-mono text-theme-text-muted uppercase">Emergency Service Classification</label>
                <select 
                  value={emergencyDescription}
                  onChange={(e) => setEmergencyDescription(e.target.value)}
                  className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-xs text-theme-text-primary focus:outline-none focus:border-red-500 mt-1.5 font-mono"
                >
                  <option value="Complete Power Outage">Complete Power Failure / Total Outage</option>
                  <option value="Burning Smell or Electrical Fire Hazard">Burning Smell or Sparking Board Hazard</option>
                  <option value="Water Damage to Fuse Box">Water Ingress / Flooded Main Board</option>
                  <option value="Commercial System Failure">Commercial Machinery Phase Failure</option>
                  <option value="RCD Tripping Repeatedly">RCD Tripping / Continuous Load Failure</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-theme-text-muted uppercase">Your Premium Account Name</label>
                <input 
                  type="text" 
                  required
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="e.g. Lady Sterling / Mayfair Estates" 
                  className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-xs text-theme-text-primary focus:outline-none focus:border-red-500 mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-theme-text-muted uppercase">Direct Secure Telephone</label>
                  <input 
                    type="tel" 
                    required
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="e.g. +44 7700 900077" 
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-xs text-theme-text-primary focus:outline-none focus:border-red-500 mt-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-theme-text-muted uppercase">London Postcode Prefix</label>
                  <input 
                    type="text" 
                    required
                    value={emergencyLocation}
                    onChange={(e) => setEmergencyLocation(e.target.value)}
                    placeholder="e.g. W1, SW1, SW3" 
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-xs text-theme-text-primary focus:outline-none focus:border-red-500 mt-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="bg-red-950/20 p-4 rounded-xl border border-red-900/30 text-[11px] text-red-400 leading-relaxed font-mono">
                <p className="font-bold mb-1 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> GUARANTEED RESPONSE DISPATCH UNDERTAKING
                </p>
                By submitting this emergency dispatch, you request Madridian standby crew mobilization. Priority call-out fee of £250 + VAT applies, covering the initial diagnostic assessment.
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold font-display rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-red-600/10 cursor-pointer"
              >
                Initiate Immediate Engine Mobilization
              </button>

            </form>

          </div>
        </div>
      )}

      {/* 2. PROJECT CONSULTATION MODAL */}
      {isConsultModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-theme-bg glass-panel-heavy rounded-2xl p-6 md:p-8 border border-theme-border relative animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => setIsConsultModalOpen(false)}
              className="absolute top-4 right-4 text-theme-text-muted hover:text-theme-text-primary p-1 rounded-full hover:bg-theme-text-primary/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-gold/10 rounded-lg text-amber-gold">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-theme-text-primary">Project Consultation Office</h3>
                <p className="text-xs text-theme-text-muted mt-0.5">Register a bespoke commercial or domestic inquiry</p>
              </div>
            </div>

            <form onSubmit={handleConsultSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-theme-text-muted uppercase">Your Direct Name</label>
                  <input 
                    type="text" 
                    required
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    placeholder="e.g. Thomas de Madrid" 
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-xs text-theme-text-primary focus:outline-none focus:border-amber-gold mt-1.5"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-theme-text-muted uppercase">Telephone Code</label>
                  <input 
                    type="tel" 
                    required
                    value={consultPhone}
                    onChange={(e) => setConsultPhone(e.target.value)}
                    placeholder="e.g. +44 207 946 0012" 
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-xs text-theme-text-primary focus:outline-none focus:border-amber-gold mt-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-theme-text-muted uppercase">Corporate or Private Email Address</label>
                <input 
                  type="email" 
                  required
                  value={consultEmail}
                  onChange={(e) => setConsultEmail(e.target.value)}
                  placeholder="e.g. executive@estate-belgravia.co.uk" 
                  className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-xs text-theme-text-primary focus:outline-none focus:border-amber-gold mt-1.5 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-theme-text-muted uppercase">Engineering Classification</label>
                <select 
                  value={consultService}
                  onChange={(e) => setConsultService(e.target.value)}
                  className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-xs text-theme-text-primary focus:outline-none focus:border-amber-gold mt-1.5 font-mono"
                >
                  <option value="Smart Living Infrastructure">Smart Living Infrastructure (Lutron / Automation)</option>
                  <option value="Sustainable Power Systems">Sustainable Power Systems (EV / Battery / Solar)</option>
                  <option value="Corporate Compliance & Diagnostics">Corporate Compliance & Diagnostics (EICR / Testing)</option>
                  <option value="Bespoke Architect Design Plan">Bespoke Architect Design Collaboration</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-theme-text-muted uppercase">Brief Specifications & Requirements</label>
                <textarea 
                  value={consultDetails}
                  onChange={(e) => setConsultDetails(e.target.value)}
                  rows={3}
                  placeholder="e.g. Complete Lutron HomeWorks integration with whole-house AV, OZEV-approved double EV fast chargers, and a full power phase compliance assessment." 
                  className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-xs text-theme-text-primary focus:outline-none focus:border-amber-gold mt-1.5 font-sans resize-none leading-relaxed"
                />
              </div>

              <div className="bg-slate-card p-4 rounded-xl border border-theme-border text-[11px] text-theme-text-secondary leading-relaxed font-mono">
                Madridian strictly respects executive confidentiality. We sign comprehensive non-disclosure agreements (NDAs) by default for all smart estate or ultra-prime development projects.
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-amber-gold hover:bg-[#D9B25E] text-onyx font-bold font-display rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-amber-gold/5 cursor-pointer"
              >
                Submit Consultation Request to Lead Engineer
              </button>

            </form>

          </div>
        </div>
      )}

      {/* 3. SUCCESS / CONFIRMATION MODAL */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-theme-bg glass-panel-heavy rounded-2xl p-6 md:p-8 border border-volt/20 text-center relative animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-4 right-4 text-theme-text-muted hover:text-theme-text-primary p-1 rounded-full hover:bg-theme-text-primary/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <LottieSuccessAnimation />

            <h3 className="font-display text-2xl font-extrabold text-theme-text-primary">Transmission Received</h3>
            <p className="text-sm text-volt font-mono mt-1">SECURE DISPATCH CONFIRMED</p>
            
            <p className="text-theme-text-secondary font-light text-xs md:text-sm mt-4 leading-relaxed">
              Your inquiry has been cataloged. Our Belgravia control panel has assigned your brief to the duty senior electrical engineering architect. Expect immediate contact within our SLA target.
            </p>

            <div className="mt-8">
              <button 
                onClick={() => setIsSuccessModalOpen(false)}
                className="px-6 py-3 bg-amber-gold hover:bg-[#D9B25E] text-onyx font-bold font-display text-xs rounded-xl transition-all cursor-pointer"
              >
                Acknowledge & Close
              </button>
            </div>

          </div>
        </div>
      )}

      <ChatWidget />
    </div>
  );
}
