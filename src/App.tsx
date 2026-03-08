import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { auth, isFirebaseConfigured } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const SetupRequired = () => (
  <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6">
    <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center">
      <h1 className="text-3xl font-display font-bold text-white mb-4">Setup Required</h1>
      <p className="text-white/60 mb-8 leading-relaxed">
        To get started, you need to configure your Firebase environment variables. 
        Check the <code className="bg-white/10 px-2 py-1 rounded">.env.example</code> file for the required keys.
      </p>
      <div className="space-y-4">
        <div className="p-4 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl text-brand-accent text-sm">
          Missing: VITE_FIREBASE_API_KEY
        </div>
        <p className="text-xs text-white/40">
          Add your Firebase credentials to the Secrets panel in AI Studio.
        </p>
      </div>
    </div>
  </div>
);

// Simple Protected Route
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;
  if (!isFirebaseConfigured) return <SetupRequired />;
  if (!user) return <Navigate to="/admin" />;

  return <>{children}</>;
};

export default function App() {
  if (!isFirebaseConfigured) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<SetupRequired />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
