import { motion, AnimatePresence } from "motion/react";
import { 
  Github, 
  Linkedin, 
  Mail, 
  Globe, 
  Terminal, 
  Cpu, 
  Palette, 
  Code2, 
  Server, 
  ShieldCheck, 
  Video, 
  Layers,
  ExternalLink,
  ChevronRight,
  Quote,
  Zap,
  Star,
  Sparkles,
  Phone,
  X
} from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCldUrl } from "../lib/cloudinary";
import { db } from "../lib/firebase";
import SEO from "../components/SEO";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const Section = ({ children, className = "", id = "" }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`min-h-screen flex flex-col justify-center px-6 md:px-24 py-20 ${className}`}>
    {children}
  </section>
);

const Nav = () => (
  <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 text-2xl font-display font-black tracking-tighter dark:text-white text-brand-dark"
    >
      <Zap className="text-brand-accent fill-brand-accent" size={24} />
      TECH BEAST<span className="text-brand-accent">.</span>
    </motion.div>
    <div className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-[0.2em] dark:text-white/70 text-brand-dark/70">
      {['About', 'Services', 'Projects', 'Skills', 'Experience', 'Contact'].map((item) => (
        <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-brand-accent transition-all hover:tracking-[0.3em]">
          {item}
        </a>
      ))}
    </div>
    <div className="flex items-center gap-6">
      <motion.a 
        href="#contact"
        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 0, 122, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-3 bg-brand-accent text-white font-black rounded-full text-xs uppercase tracking-widest shadow-lg shadow-brand-accent/20"
      >
        LET'S TALK
      </motion.a>
    </div>
  </nav>
);

const MarqueeSkills = () => {
  const skills = ["FULL-STACK DEV", "IT INFRASTRUCTURE", "VIDEO EDITING", "BRANDING", "UI/UX DESIGN", "SYSTEMS ADMIN", "MOTION GRAPHICS", "API DESIGN"];
  return (
    <div className="py-10 bg-brand-accent/5 overflow-hidden whitespace-nowrap border-y border-brand-accent/10">
      <div className="flex animate-marquee">
        {[...skills, ...skills].map((skill, i) => (
          <div key={i} className="flex items-center mx-10">
            <Star className="text-brand-accent mr-4" size={20} />
            <span className="text-4xl md:text-6xl font-display font-black text-transparent stroke-1 stroke-brand-dark dark:stroke-white opacity-20 hover:opacity-100 transition-opacity cursor-default">
              {skill}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Software');
  
  // Data State
  const [softwareProjects, setSoftwareProjects] = useState<any[]>([]);
  const [graphicProjects, setGraphicProjects] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  // Keyboard Shortcut for Admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ type: 'idle' });

  // Registration State
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", company: "", message: "" });
  const [registerStatus, setRegisterStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ type: 'idle' });

  useEffect(() => {
    document.documentElement.classList.add('dark');

    if (!db) return;

    // Fetch Software Projects
    const qSoftware = query(collection(db, "software_projects"), orderBy("createdAt", "desc"));
    const unsubSoftware = onSnapshot(qSoftware, (snapshot) => {
      setSoftwareProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch Graphic Projects
    const qGraphics = query(collection(db, "graphic_projects"), orderBy("createdAt", "desc"));
    const unsubGraphics = onSnapshot(qGraphics, (snapshot) => {
      setGraphicProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch Articles
    const qArticles = query(collection(db, "articles"), orderBy("createdAt", "desc"));
    const unsubArticles = onSnapshot(qArticles, (snapshot) => {
      setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch Testimonials
    const qTestimonials = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
    const unsubTestimonials = onSnapshot(qTestimonials, (snapshot) => {
      setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubSoftware();
      unsubGraphics();
      unsubArticles();
      unsubTestimonials();
    };
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus({ type: 'loading' });
    // For demo, we just show success. In real app, save to Firestore
    setTimeout(() => {
      setNewsletterStatus({ type: 'success', message: "Thanks for subscribing!" });
      setNewsletterEmail("");
    }, 1000);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email) return;
    setRegisterStatus({ type: 'loading' });
    // For demo, we just show success. In real app, save to Firestore
    setTimeout(() => {
      setRegisterStatus({ type: 'success', message: "Registration successful!" });
      setRegisterForm({ name: "", email: "", company: "", message: "" });
      setTimeout(() => {
        setIsRegisterOpen(false);
        setRegisterStatus({ type: 'idle' });
      }, 2000);
    }, 1000);
  };

  return (
    <div ref={containerRef} className="bg-brand-light dark:bg-brand-dark transition-colors duration-700">
      <SEO />
      <Nav />

      {/* Floating Contact Toggle */}
      <div className="fixed bottom-10 right-10 z-[100]">
        <AnimatePresence>
          {isContactOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: "bottom right" }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-20 right-0 w-[90vw] md:w-[450px] bg-white dark:bg-brand-dark p-8 rounded-[2.5rem] border border-black/10 dark:border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-display font-black dark:text-white text-brand-dark">GET IN TOUCH</h3>
                <button 
                  onClick={() => setIsContactOpen(false)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                  <Zap size={20} className="text-brand-accent rotate-45" />
                </button>
              </div>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black dark:text-white/40 text-brand-dark/40">Name</label>
                  <input type="text" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 focus:border-brand-accent outline-none transition-all dark:text-white text-brand-dark font-bold text-sm" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black dark:text-white/40 text-brand-dark/40">Email</label>
                  <input type="email" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 focus:border-brand-accent outline-none transition-all dark:text-white text-brand-dark font-bold text-sm" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black dark:text-white/40 text-brand-dark/40">Message</label>
                  <textarea rows={4} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 focus:border-brand-accent outline-none transition-all resize-none dark:text-white text-brand-dark font-bold text-sm" placeholder="Tell me about your project..." />
                </div>
                <button className="w-full py-5 bg-brand-accent text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-accent/30 tracking-[0.2em] uppercase text-xs">
                  SEND MESSAGE
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsContactOpen(!isContactOpen)}
          className="w-16 h-16 bg-brand-accent text-white rounded-full flex items-center justify-center shadow-2xl shadow-brand-accent/40 group relative"
        >
          <Mail size={28} className={`transition-transform duration-500 ${isContactOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
          <Zap size={28} className={`absolute transition-transform duration-500 ${isContactOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
        </motion.button>
      </div>
      
      {/* Hero Section */}
      <Section id="hero" className="relative overflow-hidden pt-32">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[120px]"
        />

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <div className="order-1 lg:order-1 flex flex-col items-start z-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent rounded-full mb-8"
            >
              <Zap size={16} className="text-white" />
              <span className="text-xs font-black tracking-widest text-white uppercase">AVAILABLE FOR NEW PROJECTS</span>
            </motion.div>
            
            <div className="relative mb-10 group w-full">
              <motion.h1 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="text-7xl md:text-8xl lg:text-[10rem] font-display font-black leading-[0.8] dark:text-white text-brand-dark tracking-tight"
              >
                TECH
              </motion.h1>
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-24 md:h-40 w-full max-w-[600px] bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent mt-2 rounded-xl flex items-center px-8"
              >
                <span className="text-white font-display font-black text-6xl md:text-8xl tracking-tighter">BEAST</span>
              </motion.div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-4xl dark:text-white text-brand-dark max-w-xl mb-12 font-bold leading-tight"
            >
              I bridge the gap between <span className="text-brand-primary">Systems</span>, <span className="text-brand-secondary">Code</span>, and <span className="text-brand-accent">Creative Media</span>.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-6"
            >
              <a href="#projects" className="px-10 py-5 bg-white text-brand-dark font-black rounded-2xl hover:scale-105 transition-all flex items-center gap-3 group shadow-2xl">
                EXPLORE PROJECTS <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </a>
              <button 
                onClick={() => setIsRegisterOpen(true)}
                className="px-10 py-5 bg-brand-accent text-white font-black rounded-2xl hover:scale-105 transition-all flex items-center gap-3 group shadow-2xl shadow-brand-accent/30"
              >
                REGISTER AS CLIENT <Zap className="group-hover:rotate-12 transition-transform" />
              </button>
              <div className="flex items-center gap-4">
                <a href="https://github.com/Jackson-Multifacet" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-2xl hover:bg-brand-accent hover:text-white transition-all dark:text-white text-brand-dark border border-white/10"><Github size={24} /></a>
                <a href="https://www.linkedin.com/in/faith-jackson-3a3758160/" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-2xl hover:bg-brand-accent hover:text-white transition-all dark:text-white text-brand-dark border border-white/10"><Linkedin size={24} /></a>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 1, type: "spring" }}
            className="order-2 lg:order-2 relative group flex justify-center items-center"
          >
            <div className="relative z-10 w-full max-w-[500px] aspect-[4/5] rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
              <img 
                src="input_file_3.png" 
                alt="Faith John Jackson" 
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800";
                }}
              />
            </div>
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[-20px] left-1/2 -translate-x-1/2 px-8 py-4 bg-brand-primary text-brand-dark rounded-full font-black shadow-2xl z-20 text-sm"
            >
              DEV
            </motion.div>
            <motion.div 
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 -right-10 -translate-y-1/2 px-8 py-4 bg-brand-accent text-white rounded-full font-black shadow-2xl z-20 text-sm"
            >
              IT
            </motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 px-8 py-4 bg-brand-secondary text-white rounded-full font-black shadow-2xl z-20 text-sm"
            >
              DESIGN
            </motion.div>
          </motion.div>
        </div>
      </Section>

      <MarqueeSkills />

      {/* Projects Section */}
      <Section id="projects" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <h2 className="text-6xl md:text-9xl font-display font-black dark:text-white text-brand-dark leading-none">
              SELECTED <br /> <span className="text-gradient">PROJECTS.</span>
            </h2>
            <div className="max-w-md text-right">
              <p className="text-xl dark:text-white/40 text-brand-dark/40 font-bold uppercase tracking-widest mb-4">
                A curated selection of projects spanning infrastructure, development, and design.
              </p>
              <p className="text-[10px] dark:text-brand-accent/60 text-brand-accent/60 font-black uppercase tracking-[0.2em] leading-relaxed italic">
                * Note: Only sample projects are posted here as clients often do not grant permission for their private projects and repositories to be shared publicly.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-16 border-b border-black/5 dark:border-white/5 pb-8">
            {['Software', 'Graphics', 'Articles'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                  activeTab === tab 
                  ? 'bg-brand-accent text-white shadow-xl shadow-brand-accent/20' 
                  : 'bg-black/5 dark:bg-white/5 dark:text-white/40 text-brand-dark/40 hover:bg-brand-accent/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {activeTab === 'Software' && softwareProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white dark:bg-white/5 rounded-[3rem] overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl"
              >
                <div className="aspect-video relative overflow-hidden bg-black">
                  <video 
                    src={project.video} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    muted
                    loop
                    onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Video className="text-white/20 group-hover:scale-150 transition-transform" size={64} />
                  </div>
                </div>
                <div className="p-10">
                  <h3 className="text-3xl font-display font-black dark:text-white text-brand-dark mb-4">{project.title}</h3>
                  <p className="dark:text-white/60 text-brand-dark/60 mb-8 font-medium leading-relaxed">{project.desc}</p>
                  <div className="flex flex-wrap gap-3 mb-8">
                    {project.tech?.map((t: string) => (
                      <span key={t} className="px-4 py-1.5 bg-brand-accent/10 text-brand-accent rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl hover:bg-brand-accent hover:text-white transition-all dark:text-white text-brand-dark border border-black/10 dark:border-white/10">
                      <Github size={20} />
                    </a>
                    <a href={project.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl hover:bg-brand-accent hover:text-white transition-all dark:text-white text-brand-dark border border-black/10 dark:border-white/10">
                      <Linkedin size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}

            {activeTab === 'Graphics' && graphicProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white dark:bg-white/5 rounded-[3rem] overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl"
              >
                <div className="aspect-video relative overflow-hidden">
                  {project.video ? (
                    <video 
                      src={project.video} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      muted
                      loop
                      onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                    />
                  ) : (
                    <img 
                      src={getCldUrl(project.image)} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  )}
                </div>
                <div className="p-10">
                  <h3 className="text-3xl font-display font-black dark:text-white text-brand-dark mb-4">{project.title}</h3>
                  <p className="dark:text-white/60 text-brand-dark/60 mb-8 font-medium leading-relaxed">{project.desc}</p>
                  <div className="flex gap-4">
                    <a href={project.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl hover:bg-brand-accent hover:text-white transition-all dark:text-white text-brand-dark border border-black/10 dark:border-white/10">
                      <Linkedin size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}

            {activeTab === 'Articles' && articles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white dark:bg-white/5 rounded-[3rem] overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img 
                    src={getCldUrl(article.image)} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-10">
                  <span className="text-brand-accent font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">{article.date}</span>
                  <h3 className="text-3xl font-display font-black dark:text-white text-brand-dark mb-4">{article.title}</h3>
                  <p className="dark:text-white/60 text-brand-dark/60 mb-8 font-medium leading-relaxed">{article.desc}</p>
                  <button className="flex items-center gap-2 text-brand-accent font-black tracking-widest text-xs uppercase">
                    Read Article <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* About Section */}
      <Section id="about" className="bg-black/2 dark:bg-white/2">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white/10">
              <img 
                src="input_file_3.png" 
                alt="Faith John Jackson" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-12 -right-12 p-12 bg-brand-secondary text-white rounded-[3rem] font-display font-black text-4xl shadow-2xl">
              3+ <br /> YEARS
            </div>
          </motion.div>
          
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 100 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-8xl font-display font-black mb-10 dark:text-white text-brand-dark leading-none">
              BEYOND THE <br /> <span className="text-brand-primary">CODE.</span>
            </h2>
            <p className="text-2xl dark:text-white/70 text-brand-dark/70 mb-8 leading-relaxed font-medium">
              I am a multifaceted Tech Professional navigating the intersection of Systems Administration, 
              Software Development, and Digital Media.
            </p>
            <p className="text-lg dark:text-white/50 text-brand-dark/50 mb-12 leading-relaxed">
              With a B.A. in History & International Studies, I bring a high level of critical thinking 
              and documentation skills to technical environments. I don't just build software; I manage 
              the ecosystems it runs on and design the media that sells it.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              {[
                { title: "Education", items: ["ALX Software Engineering", "Ritman B.A. History"] },
                { title: "Certifications", items: ["FreeCodeCamp Web Dev", "Google IT Support"] }
              ].map((box, i) => (
                <div key={i} className="p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-xl">
                  <h3 className="text-brand-accent font-black mb-4 uppercase tracking-widest text-sm">{box.title}</h3>
                  {box.items.map((item, j) => (
                    <p key={j} className="text-sm dark:text-white/60 text-brand-dark/60 font-bold mb-1">{item}</p>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Services Section */}
      <Section id="services">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <h2 className="text-6xl md:text-9xl font-display font-black dark:text-white text-brand-dark leading-none">
            TRIPLE <br /> <span className="text-gradient">THREAT.</span>
          </h2>
          <p className="max-w-md text-xl dark:text-white/40 text-brand-dark/40 font-bold uppercase tracking-widest text-right">
            The unique intersection of infrastructure, development, and creative design.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "IT & Infrastructure",
              icon: <Server className="text-brand-primary" size={48} />,
              desc: "Systems management, network security, and hardware maintenance to ensure 99.9% uptime.",
              color: "brand-primary"
            },
            {
              title: "Software Engineering",
              icon: <Code2 className="text-brand-secondary" size={48} />,
              desc: "Full-stack development using modern frameworks like React and Next.js for scalable solutions.",
              color: "brand-secondary"
            },
            {
              title: "Media & Design",
              icon: <Palette className="text-brand-accent" size={48} />,
              desc: "Transforming abstract concepts into professional graphics, brand assets, and high-end video content.",
              color: "brand-accent"
            }
          ].map((service, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -20, scale: 1.02 }}
              className="p-12 bg-white dark:bg-white/5 rounded-[3.5rem] border border-black/5 dark:border-white/5 shadow-2xl group transition-all"
            >
              <div className={`mb-10 p-6 bg-black/5 dark:bg-white/5 w-fit rounded-3xl group-hover:bg-brand-accent group-hover:text-white transition-all`}>
                {service.icon}
              </div>
              <h3 className="text-3xl font-display font-black mb-6 dark:text-white text-brand-dark">{service.title}</h3>
              <p className="dark:text-white/60 text-brand-dark/60 mb-10 leading-relaxed text-lg font-medium">{service.desc}</p>
              <div className="flex items-center gap-2 text-brand-accent font-black tracking-widest text-xs">
                LEARN MORE <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Skills Matrix */}
      <Section id="skills" className="bg-brand-accent/5">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-8xl font-display font-black mb-6 dark:text-white text-brand-dark">SKILLS <span className="text-gradient">MATRIX</span></h2>
            <div className="w-24 h-2 bg-brand-accent mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                category: "IT & INFRASTRUCTURE",
                items: ["System Troubleshooting", "Network Config & Security", "Hardware Maintenance", "Tech Support & Training", "Software Installation", "System Configuration"]
              },
              {
                category: "SOFTWARE DEV",
                items: ["Full-Stack Web Dev", "API Design & Integration", "Database Management", "Version Control (Git)", "Python, JS, Node, SQL", "Related Frameworks"]
              },
              {
                category: "DIGITAL CREATIVE",
                items: ["Graphic Design", "Video Editing", "Branding", "Motion Graphics", "Content Creation", "PS, CDR, AI, AF, FCP"]
              }
            ].map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <h3 className="text-brand-accent font-mono mb-10 tracking-[0.3em] font-black text-sm">{cat.category}</h3>
                <div className="space-y-6">
                  {cat.items.map((item, j) => (
                    <motion.div 
                      key={j}
                      whileHover={{ x: 15 }}
                      className="flex items-center gap-4 dark:text-white/80 text-brand-dark/80 group cursor-default font-bold text-lg"
                    >
                      <div className="w-3 h-3 bg-brand-primary rounded-full group-hover:bg-brand-accent group-hover:scale-150 transition-all shadow-lg shadow-brand-primary/50" />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Experience Section */}
      <Section id="experience">
        <h2 className="text-6xl md:text-9xl font-display font-black mb-32 dark:text-white text-brand-dark leading-none">
          THE <br /> <span className="text-white/20">JOURNEY.</span>
        </h2>
        
        <div className="space-y-24">
          {[
            {
              role: "Lead Developer",
              company: "Jackson Multifacet",
              period: "2025 - Present",
              desc: "Directed the development of high-performance web applications using Node.js and Next.js, ensuring SEO optimization and fast load times.",
              color: "brand-primary"
            },
            {
              role: "IT Consultant",
              company: "Our Haven Limited",
              period: "2024 - 2025",
              desc: "Evaluated existing business processes and recommended software and hardware upgrades that increased operational efficiency.",
              color: "brand-accent"
            },
            {
              role: "Head of IT Unit",
              company: "Real Value & Stakes Limited",
              period: "2021 - 2024",
              desc: "Spearheaded the digital transformation of the organization, managing all hardware, networking, and software systems.",
              color: "brand-secondary"
            }
          ].map((exp, i) => (
            <motion.div 
              key={i}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -100 }}
              viewport={{ once: true }}
              className="relative pl-20 md:pl-32 border-l-4 dark:border-white/5 border-black/5"
            >
              <div className={`absolute left-[-14px] top-0 w-6 h-6 rounded-full bg-brand-accent shadow-[0_0_30px_rgba(255,0,122,0.5)]`} />
              <div className="mb-6 flex flex-wrap items-center gap-6">
                <span className="dark:text-white/30 text-brand-dark/30 font-mono font-black text-lg uppercase tracking-widest">{exp.period}</span>
                <span className={`px-6 py-2 bg-brand-accent/10 text-brand-accent text-xs font-black uppercase rounded-2xl tracking-widest border border-brand-accent/20`}>
                  {exp.role}
                </span>
              </div>
              <h3 className="text-4xl md:text-6xl font-display font-black mb-6 dark:text-white text-brand-dark">{exp.company}</h3>
              <p className="dark:text-white/60 text-brand-dark/60 max-w-4xl leading-relaxed text-xl font-medium">{exp.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Newsletter Section */}
      <section className="py-32 px-6 md:px-24 bg-brand-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-8 leading-none">
                STAY <span className="text-brand-accent">AHEAD</span> OF THE CURVE.
              </h2>
              <p className="text-xl text-white/60 font-medium max-w-md">
                Subscribe to my newsletter for exclusive tech insights, project updates, and industry trends.
              </p>
            </div>
            
            <form onSubmit={handleNewsletterSubmit} className="relative">
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white font-bold outline-none focus:border-brand-accent transition-all"
                  required
                />
                <button 
                  type="submit"
                  disabled={newsletterStatus.type === 'loading'}
                  className="px-12 py-6 bg-brand-accent text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-accent/30 disabled:opacity-50"
                >
                  {newsletterStatus.type === 'loading' ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
                </button>
              </div>
              {newsletterStatus.message && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 font-bold text-sm tracking-widest uppercase ${newsletterStatus.type === 'success' ? 'text-brand-primary' : 'text-red-500'}`}
                >
                  {newsletterStatus.message}
                </motion.p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Section id="testimonials" className="bg-brand-secondary/5 relative overflow-hidden">
        <Sparkles className="absolute top-20 right-20 text-brand-accent opacity-20 animate-pulse-glow" size={100} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <Quote className="mx-auto text-brand-accent mb-8 opacity-30" size={60} />
            <h2 className="text-5xl md:text-8xl font-display font-black dark:text-white text-brand-dark leading-none">
              CLIENT <br /> <span className="text-gradient">TRUST.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 bg-white dark:bg-white/5 rounded-[3.5rem] border border-black/5 dark:border-white/5 shadow-2xl relative group"
              >
                <div className="absolute -top-6 -left-6">
                  <div className="w-16 h-16 bg-brand-accent rounded-2xl flex items-center justify-center shadow-xl shadow-brand-accent/30 rotate-12 group-hover:rotate-0 transition-transform">
                    <Quote className="text-white" size={24} />
                  </div>
                </div>
                
                <p className="text-xl dark:text-white/80 text-brand-dark/80 mb-10 leading-relaxed font-medium italic">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-brand-accent/20">
                    <img 
                      src={t.image} 
                      alt={t.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-black dark:text-white text-brand-dark uppercase tracking-wider">{t.name}</p>
                    <p className="text-[10px] dark:text-white/40 text-brand-dark/40 uppercase tracking-[0.2em] font-bold mt-1">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section id="contact" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div>
            <h2 className="text-7xl md:text-[10rem] font-display font-black mb-12 dark:text-white text-brand-dark leading-[0.8] tracking-tighter">
              LET'S <br /> <span className="text-gradient">BUILD.</span>
            </h2>
            <p className="text-2xl dark:text-white/60 text-brand-dark/60 mb-16 font-medium max-w-md">
              Ready to take your infrastructure, code, or creative assets to the next level?
            </p>
            
            <div className="grid md:grid-cols-2 gap-10">
              {[
                { icon: <Mail size={28} />, label: "Email", value: "undisputedfaith@gmail.com", link: "mailto:undisputedfaith@gmail.com" },
                { icon: <Phone size={28} />, label: "Phone", value: "+234 902 1353 191", link: "tel:+2349021353191" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-8 group">
                  <a 
                    href={item.link}
                    className="p-6 bg-black/5 dark:bg-white/5 rounded-3xl group-hover:bg-brand-accent group-hover:text-white transition-all dark:text-white text-brand-dark shadow-lg"
                  >
                    {item.icon}
                  </a>
                  <div>
                    <p className="dark:text-white/40 text-brand-dark/40 text-xs uppercase tracking-[0.3em] font-black mb-2">{item.label}</p>
                    <a href={item.link} className="text-2xl font-bold dark:text-white text-brand-dark hover:text-brand-accent transition-colors">{item.value}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <footer className="mt-40 pt-16 border-t dark:border-white/5 border-black/5 flex flex-col md:flex-row justify-between items-center gap-12 dark:text-white/40 text-brand-dark/40 text-xs font-black tracking-[0.4em] uppercase">
          <p>© 2026 TECH BEAST.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-brand-accent transition-all">GITHUB</a>
            <a href="#" className="hover:text-brand-accent transition-all">LINKEDIN</a>
            <a href="#" className="hover:text-brand-accent transition-all">INSTAGRAM</a>
            <button onClick={() => navigate('/admin')} className="hover:text-brand-accent transition-all opacity-20 hover:opacity-100">ADMIN</button>
          </div>
        </footer>
      </Section>

      {/* Registration Modal */}
      <AnimatePresence>
        {isRegisterOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRegisterOpen(false)}
              className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-brand-dark p-12 rounded-[3rem] border border-black/10 dark:border-white/10 shadow-2xl"
            >
              <button 
                onClick={() => setIsRegisterOpen(false)}
                className="absolute top-8 right-8 p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors dark:text-white text-brand-dark"
              >
                <X size={24} />
              </button>
              
              <div className="mb-10">
                <h3 className="text-4xl font-display font-black dark:text-white text-brand-dark mb-4">CLIENT REGISTRATION</h3>
                <p className="dark:text-white/60 text-brand-dark/60 font-medium">Register to start a professional collaboration with the TECH BEAST.</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black dark:text-white/40 text-brand-dark/40">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 focus:border-brand-accent outline-none transition-all dark:text-white text-brand-dark font-bold text-sm" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black dark:text-white/40 text-brand-dark/40">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 focus:border-brand-accent outline-none transition-all dark:text-white text-brand-dark font-bold text-sm" 
                      placeholder="john@company.com" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black dark:text-white/40 text-brand-dark/40">Company (Optional)</label>
                  <input 
                    type="text" 
                    value={registerForm.company}
                    onChange={(e) => setRegisterForm({...registerForm, company: e.target.value})}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 focus:border-brand-accent outline-none transition-all dark:text-white text-brand-dark font-bold text-sm" 
                    placeholder="Tech Corp" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black dark:text-white/40 text-brand-dark/40">Project Brief</label>
                  <textarea 
                    rows={4} 
                    value={registerForm.message}
                    onChange={(e) => setRegisterForm({...registerForm, message: e.target.value})}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 focus:border-brand-accent outline-none transition-all resize-none dark:text-white text-brand-dark font-bold text-sm" 
                    placeholder="Briefly describe your project requirements..." 
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={registerStatus.type === 'loading'}
                  className="w-full py-5 bg-brand-accent text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-accent/30 tracking-[0.2em] uppercase text-xs disabled:opacity-50"
                >
                  {registerStatus.type === 'loading' ? 'REGISTERING...' : 'COMPLETE REGISTRATION'}
                </button>

                {registerStatus.message && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center font-bold text-sm tracking-widest uppercase ${registerStatus.type === 'success' ? 'text-brand-primary' : 'text-red-500'}`}
                  >
                    {registerStatus.message}
                  </motion.p>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
