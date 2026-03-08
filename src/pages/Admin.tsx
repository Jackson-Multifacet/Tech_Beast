import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  LogOut, 
  LayoutDashboard, 
  Code2, 
  Palette, 
  FileText, 
  MessageSquare,
  Save,
  X,
  Loader2,
  Video,
  Github,
  Linkedin,
  Image as ImageIcon
} from "lucide-react";
import { auth, db } from "../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";

type Tab = 'software' | 'graphics' | 'articles' | 'testimonials';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>('software');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Data State
  const [data, setData] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user || !db) return;

    const collectionName = activeTab === 'software' ? 'software_projects' 
                         : activeTab === 'graphics' ? 'graphic_projects'
                         : activeTab === 'articles' ? 'articles'
                         : 'testimonials';

    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [user, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogout = () => auth && signOut(auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setIsSubmitting(true);
    
    const collectionName = activeTab === 'software' ? 'software_projects' 
                         : activeTab === 'graphics' ? 'graphic_projects'
                         : activeTab === 'articles' ? 'articles'
                         : 'testimonials';

    try {
      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, collectionName), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    if (!db) return;
    
    const collectionName = activeTab === 'software' ? 'software_projects' 
                         : activeTab === 'graphics' ? 'graphic_projects'
                         : activeTab === 'articles' ? 'articles'
                         : 'testimonials';

    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const openModal = (item?: any) => {
    if (item) {
      setFormData(item);
      setEditingId(item.id);
    } else {
      setFormData({});
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <Loader2 className="text-brand-accent animate-spin" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-display font-black text-white mb-2">ADMIN PORTAL</h1>
            <p className="text-white/40 text-sm uppercase tracking-widest font-bold">Authorized Access Only</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-accent transition-all"
                placeholder="admin@techbeast.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-accent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button className="w-full py-5 bg-brand-accent text-white font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-accent/30 tracking-[0.2em] uppercase text-xs">
              LOGIN TO DASHBOARD
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* Sidebar */}
      <aside className="w-80 border-r border-white/5 p-8 flex flex-col">
        <div className="mb-12">
          <h2 className="text-2xl font-display font-black text-white">TECH BEAST<span className="text-brand-accent">.</span></h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold mt-2">Admin Dashboard</p>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'software', label: 'Software', icon: <Code2 size={20} /> },
            { id: 'graphics', label: 'Graphics', icon: <Palette size={20} /> },
            { id: 'articles', label: 'Articles', icon: <FileText size={20} /> },
            { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare size={20} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === item.id 
                ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' 
                : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-4 px-6 py-4 text-white/40 hover:text-red-500 transition-colors font-bold text-sm"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-display font-black text-white uppercase tracking-tight">Manage {activeTab}</h1>
            <p className="text-white/40 text-sm font-bold mt-2 uppercase tracking-widest">Update your portfolio content in real-time</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-3 px-8 py-4 bg-brand-accent text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-brand-accent/30 text-xs uppercase tracking-widest"
          >
            <Plus size={20} />
            Add New {activeTab.slice(0, -1)}
          </button>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {data.map((item) => (
            <motion.div 
              layout
              key={item.id}
              className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex items-center justify-between group hover:border-brand-accent/50 transition-all"
            >
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden">
                  {activeTab === 'software' ? <Code2 className="text-brand-accent" /> 
                   : activeTab === 'graphics' ? <Palette className="text-brand-accent" />
                   : activeTab === 'articles' ? <FileText className="text-brand-accent" />
                   : <MessageSquare className="text-brand-accent" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{item.title || item.name}</h3>
                  <p className="text-white/40 text-sm line-clamp-1 max-w-md">{item.desc || item.text}</p>
                </div>
              </div>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openModal(item)}
                  className="p-4 bg-white/5 hover:bg-brand-accent text-white rounded-xl transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-4 bg-white/5 hover:bg-red-500 text-white rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
          {data.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
              <p className="text-white/20 font-bold uppercase tracking-widest">No items found in this category</p>
            </div>
          )}
        </div>
      </main>

      {/* Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-2xl bg-brand-dark border border-white/10 p-12 rounded-[3.5rem] shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-full transition-colors text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-display font-black text-white mb-10 uppercase tracking-tight">
                {editingId ? 'Edit' : 'Add New'} {activeTab}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'testimonials' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Client Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name || ""}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-accent transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Role</label>
                        <input 
                          type="text" 
                          required
                          value={formData.role || ""}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-accent transition-all"
                          placeholder="CEO"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Company</label>
                        <input 
                          type="text" 
                          required
                          value={formData.company || ""}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-accent transition-all"
                          placeholder="Tech Corp"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Testimonial Text</label>
                      <textarea 
                        rows={4}
                        required
                        value={formData.text || ""}
                        onChange={(e) => setFormData({...formData, text: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-brand-accent transition-all resize-none"
                        placeholder="Faith is amazing..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Client Image URL</label>
                      <input 
                        type="text" 
                        required
                        value={formData.image || ""}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-accent transition-all"
                        placeholder="https://..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Title</label>
                      <input 
                        type="text" 
                        required
                        value={formData.title || ""}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-accent transition-all"
                        placeholder="Project Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Description</label>
                      <textarea 
                        rows={3}
                        required
                        value={formData.desc || ""}
                        onChange={(e) => setFormData({...formData, desc: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-brand-accent transition-all resize-none"
                        placeholder="Brief description..."
                      />
                    </div>
                    
                    {activeTab === 'software' && (
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Tech Stack (comma separated)</label>
                        <input 
                          type="text" 
                          value={formData.tech?.join(', ') || ""}
                          onChange={(e) => setFormData({...formData, tech: e.target.value.split(',').map((s: string) => s.trim())})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-accent transition-all"
                          placeholder="React, Node, Firebase"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">
                          {activeTab === 'articles' ? 'Image ID' : 'Video URL'}
                        </label>
                        <input 
                          type="text" 
                          value={activeTab === 'articles' ? formData.image || "" : formData.video || ""}
                          onChange={(e) => setFormData({...formData, [activeTab === 'articles' ? 'image' : 'video']: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-accent transition-all"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">
                          {activeTab === 'articles' ? 'Date' : 'LinkedIn URL'}
                        </label>
                        <input 
                          type="text" 
                          value={activeTab === 'articles' ? formData.date || "" : formData.linkedin || ""}
                          onChange={(e) => setFormData({...formData, [activeTab === 'articles' ? 'date' : 'linkedin']: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-accent transition-all"
                          placeholder={activeTab === 'articles' ? 'March 2026' : 'https://linkedin.com/...'}
                        />
                      </div>
                    </div>

                    {activeTab === 'software' && (
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">GitHub URL</label>
                        <input 
                          type="text" 
                          value={formData.github || ""}
                          onChange={(e) => setFormData({...formData, github: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-accent transition-all"
                          placeholder="https://github.com/..."
                        />
                      </div>
                    )}

                    {activeTab === 'graphics' && (
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Image ID (Cloudinary)</label>
                        <input 
                          type="text" 
                          value={formData.image || ""}
                          onChange={(e) => setFormData({...formData, image: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-accent transition-all"
                          placeholder="brand-identity"
                        />
                      </div>
                    )}
                  </>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-brand-accent text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-accent/30 tracking-[0.2em] uppercase text-xs disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {editingId ? 'UPDATE CONTENT' : 'PUBLISH CONTENT'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
