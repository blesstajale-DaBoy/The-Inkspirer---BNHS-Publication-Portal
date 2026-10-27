import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export type UserRole = 'adviser' | 'editor' | 'contributor' | 'reader';

export interface AuthUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  designation?: string;
  department?: string;
  photoURL?: string | null;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: AuthUserProfile | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, role?: UserRole) => Promise<void>;
  loginAsAdviserDemo: () => void;
  loginAsEditorDemo: () => void;
  logout: () => Promise<void>;
  isAuthorizedStaff: boolean;
  isAdviser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_STORAGE_KEY = 'the_inkspirer_demo_auth_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AuthUserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userDocRef);

          if (snap.exists()) {
            const data = snap.data();
            const profile: AuthUserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: data.displayName || firebaseUser.displayName || 'Authorized Editor',
              role: (data.role as UserRole) || 'editor',
              designation: data.designation || 'Campus Editor',
              department: data.department || 'The Inkspirer Editorial Board',
              photoURL: firebaseUser.photoURL || null,
            };
            setUserProfile(profile);
            localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(profile));
          } else {
            // First time registration / Google Sign-in: default to editor for BNHS staff
            const isAdviserEmail = firebaseUser.email?.toLowerCase().includes('adviser') ||
              firebaseUser.email?.toLowerCase().includes('reyes');
            const defaultRole: UserRole = isAdviserEmail ? 'adviser' : 'editor';
            const newProfile: AuthUserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Staff Editor'),
              role: defaultRole,
              designation: isAdviserEmail ? 'Publication Adviser' : 'Associate Editor',
              department: 'The Inkspirer Publication Staff',
              photoURL: firebaseUser.photoURL || null,
            };

            await setDoc(userDocRef, {
              ...newProfile,
              createdAt: serverTimestamp(),
            });

            setUserProfile(newProfile);
            localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(newProfile));
          }
        } catch (e) {
          console.warn('Error fetching user profile:', e);
          // Fallback user profile if offline
          const fallbackProfile: AuthUserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Authenticated Editor',
            role: 'editor',
            photoURL: firebaseUser.photoURL || null,
          };
          setUserProfile(fallbackProfile);
        }
      } else {
        // If no Firebase user, check if demo session active
        const demoStored = localStorage.getItem(DEMO_STORAGE_KEY);
        if (!demoStored) {
          setUserProfile(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    name: string,
    role: UserRole = 'contributor'
  ) => {
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const userDocRef = doc(db, 'users', cred.user.uid);
      const newProfile: AuthUserProfile = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name,
        role,
        designation: role === 'adviser' ? 'School Publication Adviser' : 'Student Editor',
        department: 'The Inkspirer',
      };
      await setDoc(userDocRef, {
        ...newProfile,
        createdAt: serverTimestamp(),
      });
      setUserProfile(newProfile);
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(newProfile));
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-Click login for Publication Adviser
  const loginAsAdviserDemo = () => {
    const adviserProfile: AuthUserProfile = {
      uid: 'adviser-maria-reyes-bnhs',
      email: 'm.reyes@bnhs.deped.edu.ph',
      displayName: 'Mrs. Maria Elena V. Delos Reyes',
      role: 'adviser',
      designation: 'School Publication Adviser · Master Teacher II',
      department: 'English Dept. & Editorial Consultant',
      photoURL: null,
    };
    setUserProfile(adviserProfile);
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(adviserProfile));
  };

  // Quick 1-Click login for Student Editor-in-Chief
  const loginAsEditorDemo = () => {
    const editorProfile: AuthUserProfile = {
      uid: 'editor-john-cedric-morales',
      email: 'jc.morales@bnhs.deped.edu.ph',
      displayName: 'John Cedric Morales',
      role: 'editor',
      designation: 'Editor-in-Chief · Grade 12 HUMSS',
      department: 'The Inkspirer Editorial Board',
      photoURL: null,
    };
    setUserProfile(editorProfile);
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(editorProfile));
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setUserProfile(null);
    setCurrentUser(null);
    localStorage.removeItem(DEMO_STORAGE_KEY);
  };

  const isAuthorizedStaff =
    userProfile?.role === 'adviser' ||
    userProfile?.role === 'editor';

  const isAdviser = userProfile?.role === 'adviser';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        loginAsAdviserDemo,
        loginAsEditorDemo,
        logout,
        isAuthorizedStaff,
        isAdviser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
