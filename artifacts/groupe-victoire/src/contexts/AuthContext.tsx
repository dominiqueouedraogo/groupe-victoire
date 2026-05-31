import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Profile, UserRole } from "@/types";
import { User } from "@supabase/supabase-js";
import { useLocation } from "wouter";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  isPremium: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  isPremium: false,
  loading: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (data) setProfile(data as Profile);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        } else if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setLocation("/");
  };

  const role = profile?.role ?? null;
  const isPremium = profile?.is_premium ?? false;

  return (
    <AuthContext.Provider value={{ user, profile, role, isPremium, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
