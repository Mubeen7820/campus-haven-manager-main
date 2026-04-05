/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export type UserRole = "admin" | "student" | "mess_staff";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ role?: UserRole; error: Error | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);



  const fetchProfile = React.useCallback(async (userId: string, email: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      }

      // Get updated user metadata from Auth session as backup
      const { data: { user: authUser } } = await supabase.auth.getUser();

      let parsedEmailName = email.split('@')[0].split('.')[0];
      // Capitalize first letter
      parsedEmailName = parsedEmailName.charAt(0).toUpperCase() + parsedEmailName.slice(1);

      const rawName = data?.full_name || authUser?.user_metadata?.full_name;
      
      let displayName = rawName;
      const cleanName = rawName?.trim().toLowerCase() || "";
      // If the stored name is just the role or a placeholder, fallback to parsed email
      if (!rawName || ['mess', 'mess_staff', 'admin', 'kitchen master', 'kitchen', 'mess manager'].includes(cleanName)) {
          displayName = parsedEmailName;
          // Automatically fix the database record so it stops happening!
          supabase.from('profiles').update({ full_name: parsedEmailName }).eq('id', userId).then();
          supabase.auth.updateUser({ data: { full_name: parsedEmailName } }).catch(e => console.log(e));
      }
      const avatarUrl = data?.avatar_url || authUser?.user_metadata?.avatar_url;

      // If it's a student, try to get their name from the students table
      if (data?.role === 'student' || authUser?.user_metadata?.role === 'student') {
        const { data: studentData } = await supabase
          .from('students')
          .select('name')
          .eq('profile_id', userId)
          .maybeSingle();

        if (studentData?.name) {
          displayName = studentData.name;
        }
      }

      setUser({
        id: userId,
        name: displayName,
        email: email,
        role: (data?.role || authUser?.user_metadata?.role || 'student') as UserRole,
        avatar: avatarUrl,
        phone: data?.phone || authUser?.user_metadata?.phone,
        address: data?.address || authUser?.user_metadata?.address
      });

    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Timeout to prevent stuck loading screen
    const timeoutId = setTimeout(() => {
      // Use a local variable or ref if you want to avoid isLoading dependency here, 
      // but initialization should only happen once.
      setIsLoading(false);
    }, 5000);

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeoutId);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setIsLoading(false);
      }
    }).catch((err) => {
      clearTimeout(timeoutId);
      console.error("Auth initialization error:", err);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = async (email: string, password: string): Promise<{ role?: UserRole; error: Error | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase Auth Error:", error.message, error.status);
        if (error.message === "Invalid login credentials") {
          return { error: new Error("Invalid email or password. Please try again.") };
        }
        if (error.message === "Email not confirmed") {
          return {
            error: new Error("Login blocked: Email not confirmed. Admin must disable 'Confirm Email' in Supabase Settings or confirm the email manually.")
          };
        }
        return { error };
      }

      if (data.user) {
        // Fetch profile immediately to get the role for the caller
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          setIsLoading(false);
          return { error: profileError };
        }
        
        // Ensure context state is updated BEFORE returning
        await fetchProfile(data.user.id, data.user.email!);
        
        return { role: profile.role as UserRole, error: null };
      }

      return { error: new Error("No user data returned") };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshProfile: () => fetchProfile(user?.id || "", user?.email || ""), isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
