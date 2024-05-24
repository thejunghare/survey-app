import { ID } from "react-native-appwrite";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { account } from "./service";
import { toast } from "./toast";

// Define types for User and UserContext
interface User {
  id: string;
  email: string;
}

interface UserContextType {
  current: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  updateProfile: (userDetails: Partial<User>) => void;
  toast: (message: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  async function login(email: string, password: string) {
    // Dummy login implementation
    const loggedIn = { id: ID.unique(), email };
    setUser(loggedIn);
    toast('Welcome back. You are logged in');
  }

  async function logout() {
    // Dummy logout implementation
    setUser(null);
    toast('Logged out');
  }

  async function register(email: string, password: string) {
    // Dummy register implementation
    const newUser = { id: ID.unique(), email };
    setUser(newUser);
    toast('Account created');
  }

  function updateProfile(userDetails: Partial<User>) {
    if (user) {
      const updatedUser = { ...user, ...userDetails };
      setUser(updatedUser);
      toast('Profile updated');
    }
  }

  async function init() {
    try {
      // Dummy init implementation
      const loggedIn = { id: ID.unique(), email: "user@example.com" };
      setUser(loggedIn);
      toast('Welcome back. You are logged in');
    } catch (err) {
      setUser(null);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <UserContext.Provider value={{ current: user, login, logout, register, updateProfile, toast }}>
      {children}
    </UserContext.Provider>
  );
}
